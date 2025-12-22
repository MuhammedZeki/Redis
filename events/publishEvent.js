
import { redisClient } from "../config/redis.js"

/**
* @param {string} channel
* @param {object} payload
*/


export const publishEvent = async (channel, payload) => {
    await redisClient.publish(channel, JSON.stringify(payload))
}