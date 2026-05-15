import { Request, Response } from 'express';
import Interaction from '../models/Interaction';

export const logInteraction = async (req: Request, res: Response) => {
    try {
        const { userId, productId, action, quantity, price } = req.body;

        // Create the new interaction record
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
