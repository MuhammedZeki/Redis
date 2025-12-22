import { getCacheWithSWR, setCache } from '../cache/cache.js';
import { productListKey } from './../cache/cacheKeys.js';
import { acquireLockWithRetry, releasedLock } from './../cache/lock.js';
import { Product } from './../models/Product.model.js';

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

    const locked = await acquireLockWithRetry({ key: lockKey });
    if (!locked) {
        return res.status(503).json({ message: "Please retry" });
    }

    try {
        const data = await Product.find().limit(20).lean();
        await setCache(key, data, 120);
        return res.json({ source: "database", data });
    } finally {
        await releasedLock(lockKey);
    }

}

const revalidate = async (page, key, lockKey) => {
    const locked = await acquireLockWithRetry({ key: lockKey });
    if (!locked) return;

    try {
        const data = await Product.find().limit(20).lean()
        await setCache(key, data, 120)
    } finally {
        await releasedLock(lockKey)
    }
}