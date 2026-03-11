import express from "express";
import { isAuthenticated, isAdmin } from "../middlewares/auth.middleware";
import {
    getDashboardStats,
    getAllOrders,
    updateOrderStatus,
    getAllAdminProducts,
    deleteProductAdmin,
    getAllCustomers,
    updateUserRole,
    getAllVendors,
    getVendorRequests,
    handleVendorRequest
} from "../controllers/admin.controller";

const router = express.Router();

// All routes require the user to be authenticated AND have the 'admin' role
router.use(isAuthenticated, isAdmin);

// Overview
router.get("/dashboard-stats", getDashboardStats);

// Orders
router.get("/orders", getAllOrders);
router.put("/orders/:id", updateOrderStatus);

// Products
router.get("/products", getAllAdminProducts);
router.delete("/products/:id", deleteProductAdmin);

// Users / Customers
router.get("/customers", getAllCustomers);
router.put("/users/:id/role", updateUserRole);

// Vendors
router.get("/vendors", getAllVendors);

// Vendor Requests
router.get("/vendor-requests", getVendorRequests);
router.put("/vendor-requests/:id", handleVendorRequest);

export default router;
