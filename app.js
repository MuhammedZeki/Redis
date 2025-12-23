import express from "express"

import productRoutes from "./routes/product.routes.js"
import metricRoutes from "./routes/metrics.routes.js"
import authRoutes from "./routes/auth.routes.js"

import { sessionMiddleware } from "./middlewares/session.js";

export const app = express();
app.use(express.json());

app.use(sessionMiddleware)

app.use("/api/products", productRoutes)
app.use("/api/metrics", metricRoutes)
app.use("/api/auth", authRoutes)
