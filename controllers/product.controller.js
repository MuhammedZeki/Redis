import { getCache, getCacheWithSWR, setCache } from '../cache/cache.js';
import { publishEvent } from '../events/publishEvent.js';
import { productDetailKey, productListKey } from './../cache/cacheKeys.js';
import { acquireLockWithRetry, releasedLock } from './../cache/lock.js';
import { Product } from './../models/Product.model.js';
import { PRODUCT_EVENT } from './../events/productEvent.js';
import { indexProductsToPages } from '../cache/reverseIndex.js';

export const listProducts = async (req, res) => {

    const page = Number(req.query.page) || 1;
    const key = await productListKey(page) //`v1:products:page:1`;
    const lockKey = `lock:${key}` // lock:v1:products:page:2

    const cache = await getCacheWithSWR({
        key,
        freshMs: 30_000,
        staleMs: 120_000
    })

    if (cache.hit && cache.isFresh) {
        return res.json({ source: "cache:fresh", data: cache.data })
    }

    if (cache.hit && cache.isStaleAllowed) {
        revalidate(page, key, lockKey);
        return res.json({ source: "cache:stale", data: cache.data })
    }

    const token = await acquireLockWithRetry({ key: lockKey });
    if (!token) {
        return res.status(503).json({ message: "Please retry" });
    }

    try {
        const data = await Product.find().limit(20).lean();
        await setCache(key, data, 120);
        await indexProductsToPages(data, page) // ürünü pages bazlı silmek
        return res.json({ source: "database", data });
    } finally {
        await releasedLock(lockKey, token);
    }

}

export const getProductDetail = async (req, res) => {
    const { id } = req.params
    const key = await productDetailKey(id);

    const cached = await getCache(key);
    //Navigate
    if (cached === null) {
        return res.status(404).json({ message: "Product bot found" })
    }
    if (cached) {
        return res.json({ source: "cache", data: cached })
    }

    const product = await Product.findById(id).lean();

    if (!product) {
        await setCache(key, null, 30) //null cache
        res.status(404).json({ message: "Product not found" });
    }

    await setCache(key, product, 120)

    return res.json({ source: "database", data: product })
}

export const createdProduct = async (req, res) => {
    try {

        const newProduct = await Product.create({
            ...req.body,
            owner: req.user.id // requiredAuth middleware'inden gelen ID
        });

        await publishEvent("product-events", {
            type: PRODUCT_EVENT.CREATED,
            productId: product._id.toString(),
            at: Date.now(),
        })

        res.status(201).json({ message: "Product_Created", data: newProduct })
    } catch (error) {
        res.status(500).json({ message: "Ürün oluşturulamadı" });
    }
}

export const updateProduct = async (req, res) => {
    const { name, price } = req.body
    const product = req.product


    Object.assign(product, { name, price })
    await product.save();

    await publishEvent("product-events", {
        type: PRODUCT_EVENT.UPDATED,
        productId: product._id.toString(),
        at: Date.now(),
    });

    return res.status(200).json({ events: PRODUCT_EVENT.UPDATED, data: product });
};

export const deleteProduct = async (req, res) => {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    await publishEvent("product-events", {
        type: PRODUCT_EVENT.DELETED,
        productId: product._id.toString(),
        at: Date.now(),
    });

    res.status(204).json({ events: PRODUCT_EVENT.DELETED, data: product });
};


const revalidate = async (page, key, lockKey) => {
    const locked = await acquireLockWithRetry({ key: lockKey });
    if (!locked) return;

    try {
        const data = await Product.find().limit(20).lean()
        await setCache(key, data, 120)
        await indexProductsToPages(data, page)
    } finally {
        await releasedLock(lockKey)
    }
}