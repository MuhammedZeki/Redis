import express from "express"
import { createdProduct, deleteProduct, listProducts, updateProduct } from "../controllers/product.controller.js";
import { productCreateLimit, productReadLimit } from "../middlewares/rateLimitEvent.js";

const router = express.Router();

router.get("/",
    productReadLimit,
    listProducts
)

router.post("/create",
    productCreateLimit,
    createdProduct
)

router.put("/product-update/:id", updateProduct)

router.delete("/product-delete/:id", deleteProduct)

export default router