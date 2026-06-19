import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Interaction from '../models/Interaction';
import { Product } from '../models/Product';
import { AuthRequest } from '../middlewares/auth.middleware';

const VALID_ACTIONS = ['view', 'click', 'add_to_cart', 'remove_from_cart', 'checkout', 'purchase', 'search_query', 'wishlist_add', 'wishlist_remove'];

export const logInteraction = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;

        if (!userId) {
            res.status(401).json({ success: false, message: "User ID not found in token" });
            return;
        }

        const { productId, action, quantity } = req.body;

        if (!action || !VALID_ACTIONS.includes(action)) {
            res.status(400).json({ success: false, message: "Invalid action" });
            return;
        }

        if (action !== 'search_query') {
            if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
                res.status(400).json({ success: false, message: "Invalid productId" });
                return;
            }

            const product = await Product.findById(productId);
            if (!product) {
                res.status(404).json({ success: false, message: "Product not found" });
                return;
            }

            const newInteraction = new Interaction({
                userId,
                productId,
                action,
                quantity: quantity || 1,
                price: product.price
            });

            await newInteraction.save();

            res.status(201).json({ success: true, message: "Interaction logged" });
        } else {
            const newInteraction = new Interaction({
                userId,
                action,
                metadata: {
                    searchQuery: req.body.searchQuery || req.body.metadata?.searchQuery || null
                }
            });

            await newInteraction.save();

            res.status(201).json({ success: true, message: "Interaction logged" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Error logging interaction" });
    }
};
