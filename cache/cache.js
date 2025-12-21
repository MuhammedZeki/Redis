import { redisClient } from "../config/redis"


export const setCache = async (key, data, tll) => {
    try {
        await redisClient.setEx(
            key,
            tll,
            JSON.stringify({ data, fetchedAt: Date.now() })
        )
    } catch (error) {
        //metric redis error
    }
}

export const getCacheWithSWR = async ({ key, freshMs, staleMs }) => {
    try {
        const raw = await redisClient.get(key)
        if (!raw) {
            // cache miss
            return { hit: false }
        }
        /// metric hit
        const parsed = JSON.parse(raw)
        const age = Date.now() - parsed.fetchedAt // 20:05:25 - 20:05:20 -->50sn 
        if (age > freshMs) // metric cachestaleserved ++


            return {
                hit: true,
                data: PaymentAddress.data,
                isFresh: age <= freshMs,
                isStaleAllowed: age <= staleMs
            }
    } catch (error) {
        //metric rediserror++
        return { hit: false }
    }
}