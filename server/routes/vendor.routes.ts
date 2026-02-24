import express from "express";
import { isAuthenticated, isVendor } from "../middlewares/auth.middleware";
import {
    createVendorProduct,
    updateVendorProduct,
    deleteVendorProduct,
    getVendorProducts,
    getVendorProductById,
    getVendorOrders,
    updateVendorOrderStatus,
    getvendororderbyid,
    getVendorDashboardStats,
    getTopSellingProducts,
    getStoreInfo,
    updateStoreInfo
} from "../controllers/vendor.controller";

const router = express.Router();

// Apply authentication and vendor role checks to all routes in this file
router.use(isAuthenticated, isVendor);

// --- PRODUCT ROUTING ---
router.post("/product", createVendorProduct);
router.put("/product/:id", updateVendorProduct);
router.delete("/product/:id", deleteVendorProduct);
router.get("/products", getVendorProducts);
router.get("/product/:id", getVendorProductById);

// --- ORDER ROUTING ---
router.get("/orders", getVendorOrders);
router.put("/order/:id/status", updateVendorOrderStatus);
router.get("/order/:id", getvendororderbyid);

// --- DASHBOARD ROUTING ---
router.get("/dashboard-stats", getVendorDashboardStats);
router.get("/top-selling-products", getTopSellingProducts);

// --- STORE PROFILE ROUTING ---
router.get("/store", getStoreInfo);
router.put("/store", updateStoreInfo);

export default router;