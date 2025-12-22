import express from "express"
import { createdProduct, deleteProduct, getProductDetail, listProducts, updateProduct } from "../controllers/product.controller.js";
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

router.get("/product-detail/:id", getProductDetail)
router.put("/product-detail-update/:id", updateProduct)
router.delete("/product-detail-delete/:id", deleteProduct)

export default router