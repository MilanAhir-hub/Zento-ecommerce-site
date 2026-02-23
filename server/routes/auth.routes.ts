import express from "express";
import { forgotPassword, loginUser, logout, resetPassword, signupUser, verifyOTP, googleLogin, getProfile } from "../controllers/auth.controller";
import { isAuthenticated } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logout);

// Google OAuth route
router.post("/google", googleLogin);

// Protected route example
router.get("/profile", isAuthenticated, getProfile);

// password reset routes
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

export default router;
