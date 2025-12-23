import { redisClient } from "../config/redis.js";

export const invalidateTargeted = async (productId) => {
    if (!productId) return;

    const pipeline = redisClient.multi();

    pipeline.del(`product:details:${productId}`)

    const pages = await redisClient.sMembers(`product:pages:${productId}`) //Hangi page’lerde var? pro:pages:123ıd = {"1","2"}

    for (const page of pages) {
        pipeline.del(`products:page:${page}`);
    }

    pipeline.del(`product:pages:${productId}`);

    await pipeline.exec();

}