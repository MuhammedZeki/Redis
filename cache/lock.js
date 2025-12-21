import { redisClient } from "../config/redis"
import { sleep } from "../utils/sleep.js";



export const acquireLockWithRetry = async ({
    key,
    ttl = 5000,
    retries = 3,
    backoff = 50
}) => {
    for (let i = 0; i < retries; i++) {
        const ok = await redisClient.set(key, "locked", { NX: true, PX: ttl });
        if (ok) {
            //metrick lock++
            return true
        }
        const delay = backoff * Math.pow(2, i)
        await sleep(delay)
    }
    // metriix lockfaild++
    return false
}
export const releasedLock = async (key) => {
    await redisClient.del(key)
}