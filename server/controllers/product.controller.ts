import { Request, Response } from "express";
import mongoose from "mongoose";
import { Product } from "../models/Product";

export const getProductsByCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { category } = req.params;
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 15;

        // Fetch products matching category
        const products = await Product.find({ category })
            .limit(limit)
            .sort({ createdAt: -1 }); // Newest first

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        console.error(`Error in getProductsByCategory:`, error);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            res.status(404).json({ success: false, message: "Product not found" });
            return;
        }

        const product = await Product.findById(id);

        if (!product) {
            res.status(404).json({ success: false, message: "Product not found" });
            return;
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error(`Error in getProductById:`, error);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};

export const SearchProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const keyword = req.query.keyword ? String(req.query.keyword) : "";
        const category = req.query.category ? String(req.query.category) : "";

        const filter: any = {};
        if (category) {
            filter.category = { $regex: new RegExp(`^${category}$`, 'i') };
        }
        if (keyword) {
            filter.$or = [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }
            ];
        }

        const products = await Product.find(filter).limit(50);
        res.status(200).json({ success: true, products });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
