import express from "express"
import { rateLimit } from "../rateLimit/rateLimit.js";
import { listProducts } from "../controllers/product.controller.js";

const router = express.Router();

router.get("/",
    rateLimit({
        windowSeconds: 60,
        maxRequests: 5,
        keyGenerator: (req) => `rate:products:${req.ip}:${req.user?.id || "guest"}`
    }),
    listProducts
)

export default router