import express from "express";
import { productChat, visualSearch } from "../controllers/ai.controller";
import { upload } from "../middlewares/upload.middleware";

const router = express.Router();

/**
 * AI Product Chat Routes
 */

// POST /api/ai/product-chat — Public product Q&A endpoint
router.post("/product-chat", productChat);

// POST /api/ai/visual-search - Upload image for visual search
router.post("/visual-search", upload.single("image"), visualSearch);

export default router;
