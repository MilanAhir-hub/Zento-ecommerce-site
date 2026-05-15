import express from "express";
import { getProductsByCategory, getProductById, SearchProduct, getProductsByVendor } from "../controllers/product.controller";

const router = express.Router();

// Public routes for fetching products
router.get("/search", SearchProduct);
router.get("/category/:category", getProductsByCategory);
router.get("/vendor/:vendorId", getProductsByVendor);
router.get("/:id", getProductById);

export default router;
