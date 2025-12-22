import { bumpCacheVersion } from '../cache/cacheVerion.js';
import { redisClient } from './../config/redis.js';
export const startProductEventSubscriber = async () => {
    const sub = redisClient.duplicate();
    await sub.connect();

    await sub.subscribe("product-events", async (msg) => {
        const event = JSON.parse(msg);
        if (event.type.startsWith("PRODUCT_")) {
            await bumpCacheVersion();
        }
    })

}