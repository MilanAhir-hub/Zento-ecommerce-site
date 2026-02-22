import { Request, Response } from "express";
import { User } from "../models/User";
import { generateToken } from "../utils/generateToken";
import { generateOTP, hashOTP } from "../utils/generateOTP";
import { sendEmail } from "../config/mail";

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
        res.clearCookie("token");
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
