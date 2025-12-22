import { bumpCacheVersion } from '../cache/cacheVerion.js';
import { invalidateTargeted } from '../cache/invalidateTargeted.js';
import { redisClient } from '../config/redis.js';
import { PRODUCT_EVENT } from '../events/productEvent.js';
export const startProductEventSubscriber = async () => {
    const sub = redisClient.duplicate();
    await sub.connect();

    await sub.subscribe("product-events", async (msg) => {
        const event = JSON.parse(msg);
        switch (event.type) {
            case PRODUCT_EVENT.CREATED:
                await bumpCacheVersion(); // Sıralama bozulur
                break;

            case PRODUCT_EVENT.UPDATED:
            case PRODUCT_EVENT.DELETED:
                await invalidateTargeted(event.productId);
                break;
        }
    })
}