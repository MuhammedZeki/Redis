import express from "express"

import productRoutes from "./routes/product.routes.js"
import metricRoutes from "./routes/product.routes.js"

export const app = express();
app.use(express.json());

app.use("/api/products", productRoutes)
app.use("/metrics", metricRoutes)
