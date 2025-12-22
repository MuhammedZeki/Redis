
import { redisClient } from './../config/redis';

export const rateLimit = ({ windowSeconds, maxRequests, keyGenerator }) => {
    return async (req, res, next) => {
        const key = keyGenerator(req);
        const count = await redisClient.incr(key)

        if (count === 1) {
            await redisClient.expire(key, windowSeconds)
        }

        if (count > maxRequests) {
            //metric ratelimited++
            return res.status(429).json({ message: "Too many requests" })
        }
        next();
    }
}