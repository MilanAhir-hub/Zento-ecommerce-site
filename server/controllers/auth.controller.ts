import { Request, Response } from "express";
import { User } from "../models/User";
import { generateToken } from "../utils/generateToken";

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