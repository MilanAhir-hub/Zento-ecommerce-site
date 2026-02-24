import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    userId?: string;
}

export const isAuthenticated = (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
        const token = req.cookies.token;

        if (!token) {
            res.status(401).json({ message: "Authentication required - No token provided" });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
        req.userId = decoded.userId;

        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
        return;
    }
};

import { User } from "../models/User";

export const isVendor = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.userId) {
            res.status(401).json({ message: "Authentication required" });
            return;
        }

        const user = await User.findById(req.userId);
        if (!user || user.role !== "vendor") {
            res.status(403).json({ message: "Access denied. Vendor resources only." });
            return;
        }

        next();
    } catch (error) {
        res.status(500).json({ message: "Internal server error during authorization" });
        return;
    }
};
