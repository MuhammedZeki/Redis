import { RedisStore } from "connect-redis";
import session from "express-session";
import { redisClient } from "../config/redis.js";
import "dotenv/config"

export const sessionMiddleware = session({
    store: new RedisStore({
        client: redisClient,
        prefix: "sess:",
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60
    }
});