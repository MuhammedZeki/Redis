import { redisClient } from "../config/redis.js"
import { metrics } from './../metrics/counters.js';


export const setCache = async (key, data, baseTTL) => {
    const jitter = Math.floor(Math.random() * 30)
    const ttl = baseTTL + jitter // her cache için farklı saniyede ttl verdik aynı anda bitmiyor 
    try {
        await redisClient.setEx(
            key,
            ttl,
            JSON.stringify({ data, fetchedAt: Date.now() })
        )
    } catch (error) {
        metrics.redisError++
    }
}

export const getCache = async (key) => {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
}

export const getCacheWithSWR = async ({ key, freshMs, staleMs }) => {
    try {
        const raw = await redisClient.get(key)
        if (!raw) {
            metrics.cacheMiss++
            return { hit: false }
        }
        metrics.cacheHit++
        const parsed = JSON.parse(raw)
        const age = Date.now() - parsed.fetchedAt // 20:05:25 - 20:05:20 -->50sn 
        if (age > freshMs) metrics.cacheStaledServed++


        return {
            hit: true,
            data: parsed.data,
            isFresh: age <= freshMs,
            isStaleAllowed: age <= staleMs
        }
    } catch (error) {
        metrics.redisError++
        return { hit: false }
    }
}