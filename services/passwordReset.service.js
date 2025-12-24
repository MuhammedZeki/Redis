import crypto from 'crypto';
import { redisClient } from '../config/redis.js';


const RESET_TTL = 10 * 60; // 10 dakika

export const createResetToken = async (userId) => {
    const token = crypto.randomBytes(32).toString("hex");

    await redisClient.setEx(
        `reset:${token}`,
        RESET_TTL,
        userId.toString()
    );
    // reset:token123456 => "5165s1ds"

    return token;
};

export const consumeResetToken = async (token) => {
    const key = `reset:${token}`;
    const userId = await redisClient.get(key);

    if (!userId) return null;

    await redisClient.del(key);

    return userId; //"5165s1ds" döner
};