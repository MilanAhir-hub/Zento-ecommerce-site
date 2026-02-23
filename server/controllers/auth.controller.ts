import { Request, Response } from "express";
import { User } from "../models/User";
import { generateToken } from "../utils/generateToken";
import { generateOTP, hashOTP } from "../utils/generateOTP";
import { sendEmail } from "../config/mail";
import { OAuth2Client } from "google-auth-library";
import { AuthRequest } from "../middlewares/auth.middleware";

// signup user
export const signupUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password } = req.body;

        // Basic validation
        if (!name || !email || !password) {
            res.status(400).json({ message: "Please provide all required fields" });
            return;
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(409).json({ message: "User already exists with this email" });
            return;
        }

        const user = await User.create({ name, email, password });

        // Exclude the password from the final response
        const userResponse = user.toObject();
        delete userResponse.password;

        // Generate token and set cookie
        const token = generateToken(res, userResponse._id.toString());

        res.status(201).json({
            message: "User registered successfully",
            user: userResponse,
            token
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Basic validation
        if (!email || !password) {
            res.status(400).json({ message: "Please provide email and password" });
            return;
        }

        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({ message: "Invalid credentials" });
            return;
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }

        const userResponse = user.toObject();
        delete userResponse.password;

        // Generate token and set cookie
        const token = generateToken(res, userResponse._id.toString());

        res.status(200).json({
            message: "Login successful",
            user: userResponse,
            token
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

export const logout = (req: Request, res: Response) => {
    try {
        const isProduction = process.env.NODE_ENV === "production";

        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            path: "/"
        });

        res.status(200).json({ message: "Logout successful" });
    } catch (error: any) {
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;

        console.log("FORGOT PASSWORD HIT");

        // Basic validation
        if (!email) {
            res.status(400).json({ message: "Please provide email" });
            return;
        }

        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        // Generate 6-digit OTP
        const { otp, hashedOTP } = generateOTP();

        // Set OTP and expiration (15 minutes)
        user.resetPasswordOTP = hashedOTP;
        user.resetPasswordOTPExpires = new Date(Date.now() + 15 * 60 * 1000);
        await user.save();

        // Send Email
        const message = `Your password reset OTP is ${otp}. It will expire in 15 minutes.`;
        await sendEmail(user.email, "Password Reset OTP", message);

        res.status(200).json({
            message: "OTP sent to your email successfully"
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, otp } = req.body;

        // Basic validation
        if (!email || !otp) {
            res.status(400).json({ message: "Please provide email and otp" });
            return;
        }

        const hashedOTP = hashOTP(otp);

        const user = await User.findOne({
            email,
            resetPasswordOTP: hashedOTP,
            resetPasswordOTPExpires: { $gt: new Date() }
        });

        if (!user) {
            res.status(400).json({ message: "Invalid or expired OTP" });
            return;
        }

        res.status(200).json({ message: "OTP verified successfully" });
    } catch (error: any) {
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, otp, password } = req.body;

        // Basic validation
        if (!email || !otp || !password) {
            res.status(400).json({ message: "Please provide email, otp, and new password" });
            return;
        }

        const hashedOTP = hashOTP(otp);

        const user = await User.findOne({
            email,
            resetPasswordOTP: hashedOTP,
            resetPasswordOTPExpires: { $gt: new Date() }
        });

        if (!user) {
            res.status(400).json({ message: "Invalid or expired OTP" });
            return;
        }

        // Update password (pre-save hook will hash it in User.ts)
        user.password = password;

        // Clear OTP fields
        user.resetPasswordOTP = undefined;
        user.resetPasswordOTPExpires = undefined;

        await user.save();

        res.status(200).json({ message: "Password reset successful" });
    } catch (error: any) {
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

import axios from "axios";

export const googleLogin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { googleToken } = req.body; // this is now access_token

        if (!googleToken) {
            res.status(400).json({ message: "Google token is missing" });
            return;
        }

        const googleResponse = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${googleToken}` }
        });

        const payload = googleResponse.data;
        if (!payload) {
            res.status(400).json({ message: "Invalid Google token" });
            return;
        }

        const { sub: googleId, email, name, picture } = payload;

        if (!email || !name) {
            res.status(400).json({ message: "Missing essential data from Google account" });
            return;
        }

        let user = await User.findOne({ email });

        if (!user) {
            // Create user
            user = await User.create({
                name,
                email,
                googleId,
                picture,
            });
        } else if (!user.googleId) {
            // User exists but has no googleId, link them
            user.googleId = googleId;
            user.picture = user.picture || picture;
            await user.save();
        }

        const userResponse = user.toObject();
        delete userResponse.password;

        const token = generateToken(res, userResponse._id.toString());

        res.status(200).json({
            message: "Google login successful",
            user: userResponse,
            token
        });
    } catch (error: any) {
        res.status(500).json({ message: error.response?.data?.error_description || error.message || "Internal server error during Google login" });
    }
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.userId).select("-password -resetPasswordOTP -resetPasswordOTPExpires");
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json({ user });
    } catch (error: any) {
        res.status(500).json({ message: "Server error" });
    }
};

