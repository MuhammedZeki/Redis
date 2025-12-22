import { redisClient } from "../config/redis.js";

const VERSION_KEY = "product:cache:version";

export const getCacheVersion = async () => {
    const version = await redisClient.get(VERSION_KEY);
    return version ? Number(version) : 1;
};

export const bumpCacheVersion = async () => {
    await redisClient.incr(VERSION_KEY)
}