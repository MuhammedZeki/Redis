import { redisClient } from "../config/redis.js";

export const invalidateAllSession = async (userId) => {
    const key = `user:sessions:${userId}`; // o kişiyi bul ali 
    const sessionIds = await redisClient.sMembers(key);

    for (const session of sessionIds) {
        await redisClient.del(`sess:${session}`) //baglı olan tüm aygitdaki kimlikleri sil
    }
    await redisClient.del(key)
}