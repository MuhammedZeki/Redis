import express from "express"
import { createdProduct, deleteProduct, getProductDetail, listProducts, updateProduct } from "../controllers/product.controller.js";
import { productCreateLimit, productReadLimit } from "../middlewares/rateLimitEvent.js";
import { requiredAuth } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/requireRole.js";
import { isProductOwner } from "../middlewares/isOwner.js";

const router = express.Router();

router.get("/",
    productReadLimit,
    listProducts
)


router.post("/create",
    requiredAuth,
    productCreateLimit,
    createdProduct
)

router.get("/product-detail/:id", getProductDetail)

router.put("/product-detail-update/:id",
    requiredAuth,
    isProductOwner,
    updateProduct
);

router.delete("/product-detail-delete/:id",
    requiredAuth,
    requireRole("admin"),
    deleteProduct
);

export default router