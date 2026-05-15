import { Request, Response } from "express";
import mongoose from "mongoose";
import { Product } from "../models/Product";
import { User } from "../models/User";
import { buildProductPrompt } from "../utils/aiPromptBuilder";
import { AuthRequest } from "../middlewares/auth.middleware";
import { generateAIResponse } from "../services/ai/chatService";
import { generateDescription, improveDescription } from "../services/ai/descriptionService";
import { enhanceImageWithAI } from "../services/ai/imageEnhancementService";
import { generateBannerImage } from "../services/ai/bannerImageService";
import { uploadToCloudinary } from "../middlewares/upload.middleware";
import { generateImageEmbedding, searchProductsByVector } from "../services/ai/visualSearchService";

// Simple data questions that can be answered directly from the DB
const PRICE_PATTERNS = /\b(price|cost|how much|pricing|rate)\b/i;
const STOCK_PATTERNS = /\b(stock|availability|available|in stock|out of stock|left|remaining)\b/i;
const CATEGORY_PATTERNS = /\b(category|type|kind|what is this)\b/i;

/**
 * POST /api/ai/product-chat
 * Body: { productId: string, question: string }
 *
 * Handles AI-powered product Q&A using Google Gemini.
 * Simple fact-based questions (price, stock, category) are answered
 * directly from the database for performance.
 */
export const productChat = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log(" [REQUEST] POST /api/ai/product-chat");
        const { productId, question } = req.body;

        console.log("Product ID:", productId);
        console.log("Question:", question);

        // --- Validate input ---
        if (!productId || !question) {
            res.status(400).json({
                success: false,
                message: "Both 'productId' and 'question' are required.",
            });
            return;
        }

        // Sanitize and enforce 300-char limit
        const sanitizedQuestion = String(question).trim();
        if (sanitizedQuestion.length === 0) {
            res.status(400).json({
                success: false,
                message: "Question cannot be empty.",
            });
            return;
        }

        if (sanitizedQuestion.length > 300) {
            res.status(400).json({
                success: false,
                message: "Question must be 300 characters or less.",
            });
            return;
        }

        // Validate productId format
        if (!mongoose.isValidObjectId(productId)) {
            res.status(400).json({
                success: false,
                message: "Invalid product ID format.",
            });
            return;
        }

        // --- Fetch product ---
        const product = await Product.findById(productId);

        if (!product) {
            res.status(404).json({
                success: false,
                message: "Product not found.",
            });
            return;
        }

        // --- Performance shortcut: answer simple data questions from DB ---
        const lowerQ = sanitizedQuestion.toLowerCase();

        if (PRICE_PATTERNS.test(lowerQ) && !lowerQ.includes("worth") && !lowerQ.includes("value")) {
            res.status(200).json({
                success: true,
                answer: `The price of "${product.title}" is ₹${product.price.toLocaleString("en-IN")}.`,
                source: "database",
            });
            return;
        }

        if (STOCK_PATTERNS.test(lowerQ) && lowerQ.length < 60) {
            const stockMsg = product.stock > 0
                ? `Yes, "${product.title}" is currently in stock with ${product.stock} unit(s) available.`
                : `Sorry, "${product.title}" is currently out of stock.`;
            res.status(200).json({
                success: true,
                answer: stockMsg,
                source: "database",
            });
            return;
        }

        if (CATEGORY_PATTERNS.test(lowerQ) && lowerQ.length < 40) {
            res.status(200).json({
                success: true,
                answer: `"${product.title}" belongs to the "${product.category}" category.`,
                source: "database",
            });
            return;
        }

        // --- Send to Gemini for complex questions ---
        const prompt = buildProductPrompt(product, sanitizedQuestion);
        const answer = await generateAIResponse(prompt);

        res.status(200).json({
            success: true,
            answer,
            source: "ai",
        });
    } catch (error: any) {
        console.error("AI Product Chat error:", error.message || error);
        res.status(500).json({
            success: false,
            message: error.message || "Something went wrong. Please try again later.",
        });
    }
};

/**
 * POST /api/vendor/ai/generate-description
 * Body: { title, category, brand, features, tone }
 * 
 * Generates a premium product description for sellers.
 */
export const generateAIProductDescription = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("➡️ [REQUEST] POST /api/vendor/ai/generate-description");
        console.log("📥 Body:", req.body);
        const { title, category, brand, features, tone } = req.body;

        if (!title || !category) {
            res.status(400).json({
                success: false,
                message: "Title and Category are required to generate a description."
            });
            return;
        }

        console.log("🤖 Generating description using AI...");
        const description = await generateDescription({
            title,
            category,
            brand,
            features,
            tone
        });

        console.log("✅ AI content generated");

        console.log("📤 Sending response to client");
        res.status(200).json({
            success: true,
            description
        });
    } catch (error: any) {
        console.error("❌ Error:", error.message);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to generate description."
        });
    }
};

/**
 * POST /api/vendor/ai/improve-description
 * Body: { description, tone }
 * 
 * Improves/Refines an existing product description.
 */
export const improveAIProductDescription = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("➡️ [REQUEST] POST /api/vendor/ai/improve-description");
        console.log("📥 Body:", req.body);
        const { description, tone } = req.body;

        if (!description) {
            res.status(400).json({
                success: false,
                message: "Description is required to improve it."
            });
            return;
        }

        const improved = await improveDescription(description, tone);

        res.status(200).json({
            success: true,
            description: improved
        });
    } catch (error: any) {
        console.error("AI Improve Description error:", error.message || error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to improve description."
        });
    }
};

/**
 * POST /api/vendor/ai/enhance-image
 * Body: multipart/form-data with 'image' field
 * 
 * Enhances an image (background removal/resizing) using hybrid AI.
 */
export const processVendorImage = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("➡️ [REQUEST] POST /api/vendor/ai/enhance-image");
        const userId = (req as any).userId;
        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        const file = req.file;
        if (!file) {
            res.status(400).json({ success: false, message: "No image file provided." });
            return;
        }

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ success: false, message: "User not found." });
            return;
        }

        // Logic for monthly reset
        const now = new Date();
        const lastDate = user.lastImageEnhancementDate || new Date(0);

        let currentUsage = user.monthlyImageEnhancements || 0;

        // Check if month or year is different
        if (now.getMonth() !== lastDate.getMonth() || now.getFullYear() !== lastDate.getFullYear()) {
            currentUsage = 0;
        }

        // Process image with hybrid AI
        console.log("🤖 Generating enhanced image using AI...");
        const processedBuffer = await enhanceImageWithAI(
            file.buffer,
            file.mimetype,
            file.originalname,
            currentUsage
        );
        console.log("✅ AI image generated");

        // Upload to Cloudinary. Cloudinary's default upload params can handle automatic formatting/resizing as well.
        console.log("☁️ Uploading image to Cloudinary...");
        const cloudinaryResult = await uploadToCloudinary(processedBuffer, "vendor_enhanced_images", `enhanced_${Date.now()}`);
        console.log("✅ Uploaded to Cloudinary:", cloudinaryResult.secure_url || cloudinaryResult.url);

        // Update user stats
        user.monthlyImageEnhancements = currentUsage + 1;
        user.lastImageEnhancementDate = now;
        await user.save();
        console.log("💾 Enhancement stats saved to DB");

        console.log("📤 Sending response to client");
        res.status(200).json({
            success: true,
            imageUrl: cloudinaryResult.url,
            usageCount: user.monthlyImageEnhancements
        });
    } catch (error: any) {
        console.error("❌ Error:", error.message);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to enhance image."
        });
    }
};

/**
 * POST /api/vendor/ai/generate-banner
 * Body: { title, subtitle, category, subcategory, discountType, discountValue, startDate, endDate, theme, customPrompt }
 *
 * Generates a vendor banner image from structured form data using Google's text-to-image flow.
 */
export const generateAIVendorBanner = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        console.log("➡️ [REQUEST] POST /api/vendor/ai/generate-banner");

        const vendorId = req.userId;
        if (!vendorId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
            return;
        }

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
            customPrompt,
        } = req.body;

        if (!title || !category) {
            res.status(400).json({
                success: false,
                message: "Title and category are required to generate a banner.",
            });
            return;
        }

        if (customPrompt && String(customPrompt).trim().length > 500) {
            res.status(400).json({
                success: false,
                message: "Optional AI prompt must be 500 characters or less.",
            });
            return;
        }

        const generatedBanner = await generateBannerImage({
            title: String(title),
            subtitle: subtitle ? String(subtitle) : "",
            category: String(category),
            subcategory: subcategory ? String(subcategory) : "",
            discountType: discountType ? String(discountType) : "Percentage",
            discountValue: discountValue ? String(discountValue) : "",
            startDate: startDate ? String(startDate) : "",
            endDate: endDate ? String(endDate) : "",
            theme: theme ? String(theme) : "light",
            customPrompt: customPrompt ? String(customPrompt) : "",
        });

        const uploadResult = await uploadToCloudinary(
            generatedBanner.imageBuffer,
            "zento/banners/ai-generated",
            `${vendorId}_${Date.now()}_ai_banner`
        );

        res.status(200).json({
            success: true,
            imageUrl: uploadResult.url,
            prompt: generatedBanner.prompt,
            model: generatedBanner.model,
            notes: generatedBanner.textResponse,
        });
    } catch (error: any) {
        console.error("AI Vendor Banner error:", error.message || error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to generate banner image.",
        });
    }
};

/**
 * POST /api/ai/visual-search
 * Body: multipart/form-data with 'image' field
 *
 * Performs visual semantic search using Gemini multimodal analysis and MongoDB vector search.
 */
export const visualSearch = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("➡️ [REQUEST] POST /api/ai/visual-search");

        const file = req.file;
        if (!file) {
            res.status(400).json({ success: false, message: "No image file provided." });
            return;
        }

        // 1. Generate description and text embedding using Gemini AI
        console.log("🧠 Processing image via Gemini Vision...");
        const { embedding, description } = await generateImageEmbedding(file.buffer, file.mimetype);

        // 2. Perform Vector Search on the Product model
        console.log("🔍 Running Vector Search on MongoDB Atlas...");
        const matches = await searchProductsByVector(embedding, 15);

        console.log(`✅ Found ${matches.length} visual matches.`);

        res.status(200).json({
            success: true,
            description, // Sending back so client can see what AI thought
            products: matches
        });
    } catch (error: any) {
        console.error("❌ Visual Search Error:", error.message || error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to perform visual search."
        });
    }
};
