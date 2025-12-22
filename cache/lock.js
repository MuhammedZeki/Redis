import { redisClient } from "../config/redis.js"
import { sleep } from "../utils/sleep.js";
import { metrics } from './../metrics/counters.js';



export const acquireLockWithRetry = async ({
    key,
    ttl = 5000,
    retries = 3,
    backoff = 50
}) => {
    for (let i = 0; i < retries; i++) {
        const ok = await redisClient.set(key, "locked", { NX: true, PX: ttl });
        if (ok) {
            metrics.lockAcquired++
            return true
        }
        const delay = backoff * Math.pow(2, i)
        await sleep(delay)
    }
    metrics.lockFail++
    return false
}

export const releasedLock = async (key) => {
    await redisClient.del(key)
}