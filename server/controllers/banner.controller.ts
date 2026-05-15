import { Request, Response } from "express";
import { Banner } from "../models/Banner";
import { AuthRequest } from "../middlewares/auth.middleware";
import { uploadToCloudinary } from "../middlewares/upload.middleware";

export const createBanner = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const {
            title,
            subtitle,
            category,
            subcategory,
            discountType,
            discountValue,
            startDate,
            endDate,
            theme,
            priority,
            isActive,
            generatedImageUrl,
            generatedPrompt,
            imageSource,
        } = req.body;

        const vendorId = req.userId;
        const file = req.file;

        if (!title || !category || (!file && !generatedImageUrl)) {
            res.status(400).json({
                success: false,
                message: "Title, category and a banner image are required",
            });
            return;
        }

        const imageUrl = generatedImageUrl
            ? String(generatedImageUrl)
            : (
                await uploadToCloudinary(
                    file!.buffer,
                    "zento/banners",
                    `${vendorId}_${Date.now()}_banner`
                )
            ).url;

        const banner = await Banner.create({
            vendorId,
            title,
            subtitle: subtitle || "",
            imageUrl,
            category,
            subcategory: subcategory || "",
            discountType: discountType || "Percentage",
            discountValue: Number(discountValue) || 0,
            startDate: new Date(startDate || Date.now()),
            endDate: new Date(endDate || Date.now()),
            theme: theme || "light",
            priority: Number(priority) || 0,
            isActive: isActive === "false" ? false : true,
            imageSource: imageSource === "ai" ? "ai" : "upload",
            generatedPrompt: generatedPrompt ? String(generatedPrompt) : "",
        });

        res.status(201).json({
            success: true,
            banner,
        });
    } catch (error: any) {
        console.error("Banner Creation Error:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to create banner",
            error: error.message,
        });
    }
};

export const getBanners = async (_req: Request, res: Response): Promise<void> => {
    try {
        console.log("[REQUEST] GET /api/banners");
        const banners = await Banner.find({ isActive: true }).sort({ priority: 1 });
        res.status(200).json({ success: true, banners });
    } catch (error) {
        console.error("Banner fetch error:", error instanceof Error ? error.message : "Unknown error");
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
