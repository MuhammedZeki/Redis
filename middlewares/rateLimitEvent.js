import { rateLimit } from "../rateLimit/rateLimit.js";

export const productReadLimit = rateLimit({
    windowSeconds: 60,
    maxRequests: 5,
    keyGenerator: (req) => `rate:products:read:${req.ip}:${req.session?.userId || "guest"}`
})

export const productCreateLimit = rateLimit({
    windowSeconds: 300,
    maxRequests: 3,
    keyGenerator: (req) => `rate:products:create:${req.ip}:${req.session?.userId || "guest"}`
})



//AUTH
export const loginLimit = rateLimit({
    windowSeconds: 300, // 5 Dakika
    maxRequests: 5,     // 5 deneme hakkı
    keyGenerator: (req) => `rate:auth:login:${req.ip}:${req.body.email || "unknown"}`
});

export const registerLimit = rateLimit({
    windowSeconds: 3600, // 1 Saat
    maxRequests: 3,      // Saatte en fazla 3 kayıt
    keyGenerator: (req) => `rate:auth:register:${req.ip}`
});

export const forgotPasswordLimit = rateLimit({
    windowSeconds: 3600, // 1 Saat
    maxRequests: 3,
    keyGenerator: (req) => `rate:auth:forgot:${req.ip}:${req.body.email || "unknown"}`
});

export const getMeLimit = rateLimit({
    windowSeconds: 60,
    maxRequests: 40,
    keyGenerator: (req) => `rate:auth:me:${req.ip}:${req.session?.userId || "guest"}`
});