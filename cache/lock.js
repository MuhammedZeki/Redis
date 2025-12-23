import { randomUUID } from "crypto";
import { redisClient } from "../config/redis.js"
import { sleep } from "../utils/sleep.js";
import { metrics } from './../metrics/counters.js';

const UNLOCK_SCRIPT = `
if redis.call("GET", KEYS[1]) == ARGV[1] then
  return redis.call("DEL", KEYS[1])
else
  return 0
end
`;

export const acquireLockWithRetry = async ({
    key,
    ttl = 5000,
    retries = 3,
    backoff = 50
}) => {
    for (let i = 0; i < retries; i++) {
        // const ok = await redisClient.set(key, "locked", { NX: true, PX: ttl }); //burda lockey herkese ait kim oldugu belli değil
        const token = randomUUID();
        const ok = await redisClient.set(key, token, { NX: true, PX: ttl }); //burda lockey kime ait belli
        if (ok) {
            metrics.lockAcquired++
            return token //true
        }
        const delay = backoff * Math.pow(2, i)
        await sleep(delay)
    }
    metrics.lockFail++
    return false
}

export const releasedLock = async (key, token) => {
    await redisClient.eval(UNLOCK_SCRIPT, { keys: [key], arguments: [token] })
}