import express from "express";
import { isAuthenticated, isVendor } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload.middleware";
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
    updateStoreInfo,
    getVendorAnalytics
} from "../controllers/vendor.controller";
import {
    createBanner,
    getBanners
} from "../controllers/banner.controller";
import {
    generateAIProductDescription,
    improveAIProductDescription,
    processVendorImage
} from "../controllers/ai.controller";

const router = express.Router();

// Apply authentication and vendor role checks to all routes in this file
router.use((req, res, next) => {
    console.log("➡️ [VENDOR ROUTER HIT]:", req.method, req.url);
    next();
});
router.use(isAuthenticated, isVendor);

// --- PRODUCT ROUTING ---
router.post("/product", upload.array('images', 4), createVendorProduct);
router.put("/product/:id", upload.array('images', 4), updateVendorProduct);
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
router.get("/analytics", getVendorAnalytics);

// --- STORE PROFILE ROUTING ---
router.get("/store", getStoreInfo);
router.put("/store", updateStoreInfo);

// --- BANNER ROUTING ---
router.post("/banner", upload.single('image'), createBanner);
router.get("/banners", getBanners);

// --- AI CONTENT ASSISTANT ROUTING ---
router.post("/ai/generate-description", generateAIProductDescription);
router.post("/ai/improve-description", improveAIProductDescription);
router.post("/ai/enhance-image", upload.single("image"), processVendorImage);

export default router;
