import { Router } from "express";
import {
    profile,
    getAllProducts,
    getProductById,
    searchProducts,
    getProductByCategory,
    getMyCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    createOrder,
    getMyOrders,
    getMyOrderById,
    cancelOrder,
    getMyWishlist,
    addToWishlist,
    clearWishlist,
    addReview,
    updateReview,
    deleteReview,
    getProductReviews,
    removeFromWishlist,
    updateMYProfile,
    deleteMyAccount,
    getMyAddress,
    addAddress,
    updateAddress,
    deleteAddress,
    getMyNotifications,
    markNotificationsAsRead
} from "../controllers/user.controller";
import { isAuthenticated } from "../middlewares/auth.middleware";

const router = Router();

router.get("/me", isAuthenticated, profile);

// --- PRODUCT BROWSING ROUTES ---
router.get("/products", getAllProducts);
router.get("/products/search", searchProducts); // Must be before /:id to prevent matching "search" as an ID
router.get("/products/category/:category", getProductByCategory);
router.get("/products/:id", getProductById);

// --- CART MANAGEMENT ROUTES ---
router.get("/cart", isAuthenticated, getMyCart);
router.post("/cart", isAuthenticated, addToCart);
router.put("/cart/:id", isAuthenticated, updateCartItem);
router.delete("/cart/:id", isAuthenticated, removeFromCart);
router.delete("/cart", isAuthenticated, clearCart);

// --- ORDER MANAGEMENT ROUTES ---
router.post("/order", isAuthenticated, createOrder);
router.get("/orders", isAuthenticated, getMyOrders);
router.get("/order/:id", isAuthenticated, getMyOrderById);
router.put("/order/:id/cancel", isAuthenticated, cancelOrder);

// --- WISHLIST MANAGEMENT ROUTES ---
router.get("/wishlist", isAuthenticated, getMyWishlist);
router.post("/wishlist", isAuthenticated, addToWishlist);
router.delete("/wishlist/:id", isAuthenticated, removeFromWishlist);
router.delete("/wishlist", isAuthenticated, clearWishlist);

// --- REVIEWS AND RATINGS ROUTES ---
router.post("/review", isAuthenticated, addReview);
router.put("/review/:id", isAuthenticated, updateReview);
router.delete("/review/:id", isAuthenticated, deleteReview);
router.get("/reviews/:productId", getProductReviews); // Public, no auth required to *read* them

// --- PROFILE EXTENSIONS ROUTES ---
router.put("/me", isAuthenticated, updateMYProfile);
router.delete("/me", isAuthenticated, deleteMyAccount);

// --- ADDRESS MANAGEMENT ROUTES ---
router.get("/addresses", isAuthenticated, getMyAddress);
router.post("/address", isAuthenticated, addAddress);
router.put("/address/:id", isAuthenticated, updateAddress);
router.delete("/address/:id", isAuthenticated, deleteAddress);

// --- NOTIFICATION ROUTES ---
router.get("/notifications", isAuthenticated, getMyNotifications);
router.put("/notifications/read", isAuthenticated, markNotificationsAsRead);

export default router;
