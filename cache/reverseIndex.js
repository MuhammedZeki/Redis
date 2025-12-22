import { redisClient } from "../config/redis.js"

export const indexProductsToPages = async (products, page) => {
    if (!products.length) return
    const pipeline = redisClient.multi();
    for (const product of products) {
        pipeline.sAdd(`product:pages:${product._id}`, String(page));
    }
    await pipeline.exec()
}