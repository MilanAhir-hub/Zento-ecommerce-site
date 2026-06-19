import { Request, Response } from 'express';
import Interaction from '../models/Interaction';
import { AuthRequest } from '../middlewares/auth.middleware';

export const logInteraction = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;

        if (!userId) {
            res.status(401).json({ success: false, message: "User ID not found in token" });
            return;
        }

        const { productId, action, quantity, price } = req.body;

        const newInteraction = new Interaction({
            userId,
            productId,
            action,
            quantity,
            price
        });

        await newInteraction.save();

        res.status(201).json({ success: true, message: "Interaction logged" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error logging interaction" });
    }
};
