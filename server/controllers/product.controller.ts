import { Request, Response } from "express";
import mongoose from "mongoose";
import { Product } from "../models/Product";

export const getProductsByCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log(`➡️ [REQUEST] GET /api/products/category/${req.params.category}`);
        const { category } = req.params;
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 15;

        // Fetch products matching category
        const products = await Product.find({ category })
            .limit(limit)
            .sort({ createdAt: -1 }); // Newest first

        console.log("📤 Sending response to client");
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
        console.log(`➡️ [REQUEST] GET /api/products/${req.params.id}`);
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            res.status(404).json({ success: false, message: "Product not found" });
            return;
        }

        const product = await Product.findById(id).populate("vendorId", "name email storeName storeDescription logo address");

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
        console.log("➡️ [REQUEST] GET /api/products/search");
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

export const getProductsByVendor = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log(`➡️ [REQUEST] GET /api/products/vendor/${req.params.vendorId}`);
        const { vendorId } = req.params;
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 15;

        if (!mongoose.isValidObjectId(vendorId)) {
            res.status(400).json({ success: false, message: "Invalid vendor ID" });
            return;
        }

        const products = await Product.find({ vendorId })
            .populate("vendorId", "name storeName logo")
            .limit(limit)
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        console.error("❌ Error:", error instanceof Error ? error.message : "Unknown error");
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};
