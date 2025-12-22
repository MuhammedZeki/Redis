import { bumpCacheVersion } from '../cache/cacheVerion.js';
import { redisClient } from '../config/redis.js';
import { PRODUCT_EVENT } from '../events/productEvent.js';
export const startProductEventSubscriber = async () => {
    const sub = redisClient.duplicate();
    await sub.connect();

    await sub.subscribe("product-events", async (msg) => {
        const event = JSON.parse(msg);
        if (
            event.type === PRODUCT_EVENT.CREATED ||
            event.type === PRODUCT_EVENT.DELETED ||
            event.type === PRODUCT_EVENT.UPDATED
        ) {
            await bumpCacheVersion();
        }
    })
}