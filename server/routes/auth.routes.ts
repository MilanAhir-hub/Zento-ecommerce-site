import express from "express";
import { forgotPassword, loginUser, logout, resetPassword, signupUser, verifyOTP } from "../controllers/auth.controller";

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logout);

// password reset routes
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

export default router;
