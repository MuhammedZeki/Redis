import { redisClient } from "../config/redis"



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
        // await sleep(backoff)
    }
    // metriix lockfaild++
    return false
}
export const releasedLock = async (key) => {
    await redisClient.del(key)
}