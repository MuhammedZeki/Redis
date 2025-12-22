import { rateLimit } from "../rateLimit/rateLimit.js";

export const productReadLimit = rateLimit({
    windowSeconds: 60,
    maxRequests: 5,
    keyGenerator: (req) => `rate:products:read:${req.ip}:${req.user?.id || "guest"}`
})

export const productCreateLimit = rateLimit({
    windowSeconds: 300,
    maxRequests: 3,
    keyGenerator: (req) => `rate:products:create:${req.ip}:${req.user?.id || "guest"}`
})