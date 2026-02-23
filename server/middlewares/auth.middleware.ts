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
