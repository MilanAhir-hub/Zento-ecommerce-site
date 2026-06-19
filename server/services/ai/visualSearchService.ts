import { getDynamicVisionModel, getDynamicEmbeddingModel } from "./modelSelector";
import { Product } from "../../models/Product";

/** Structured metadata extracted from an uploaded image by Gemini Vision. */
export interface VisualMetadata {
    productType: string;
    category: string;
    color: string;
    style: string;
}

/**
 * Generates an embedding base on an image by first describing it, then embedding the description.
 * This acts as a hybrid multimodal approach when direct multimodal embeddings are constrained.
 */
export const generateImageEmbedding = async (
    imageBuffer: Buffer,
    mimeType: string
): Promise<{ embedding: number[], description: string }> => {
    console.log("Analyzing image with Gemini Vision...");

    const visionModel = await getDynamicVisionModel();
    const embeddingModel = await getDynamicEmbeddingModel();

    const prompt = "Describe the main product in this image in high detail. Focus on features that a user would search for: color, material, pattern, style, shape, brand (if visible) and specific item type. Make it highly optimized for a search engine query. Keep it concise but descriptive, no more than 3 sentences.";

    const imagePart = {
        inlineData: {
            data: imageBuffer.toString("base64"),
            mimeType,
        },
    };

    // 1. Get detailed description from image
    const visionResult = await visionModel.generateContent([prompt, imagePart]);
    const description = visionResult.response.text().trim();
    console.log(`Generated Description: ${description}`);

    // 2. Embed the description
    console.log("Generating text embedding for description...");
    const embedResult = await embeddingModel.embedContent(description);
    const embedding = embedResult.embedding.values;

    return { embedding, description };
};

/**
 * Extracts structured product metadata (type, category, color, style) from an image.
 * Uses a targeted JSON prompt so the output can drive post-search reranking.
 */
export const extractProductMetadata = async (
    imageBuffer: Buffer,
    mimeType: string
): Promise<VisualMetadata> => {
    const visionModel = await getDynamicVisionModel();

    const metaPrompt = `You are a product classifier. Analyze the product in this image and return ONLY a valid JSON object with these exact keys:
{
  "productType": "the specific product type, e.g. watch, sneakers, t-shirt, jeans, dress, handbag, sunglasses, jacket, heels, shorts, blazer, belt, perfume, sandals, hoodie, cargo pants, skirt, top, trouser, suit",
  "category": "the broad category, e.g. Footwear, Accessories, Casual Wear, Formal Wear, Streetwear, Luxury, Women, Men",
  "color": "the dominant color, e.g. blue, black, white, red, navy, brown, grey, silver, gold, pink, green",
  "style": "the style descriptor, e.g. casual, formal, sporty, luxury, vintage, classic, modern, streetwear, ethnic"
}
Return ONLY the JSON object, no markdown, no explanation.`;

    const imagePart = {
        inlineData: {
            data: imageBuffer.toString("base64"),
            mimeType,
        },
    };

    try {
        const result = await visionModel.generateContent([metaPrompt, imagePart]);
        const raw = result.response.text().trim();
        // Strip possible markdown code fences
        const cleaned = raw.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
        const parsed = JSON.parse(cleaned) as VisualMetadata;
        console.log("📋 Extracted Metadata:", parsed);
        return parsed;
    } catch (err: any) {
        console.warn("⚠️ Metadata extraction failed, using empty defaults:", err.message);
        return { productType: "", category: "", color: "", style: "" };
    }
};

/**
 * Generates an embedding directly from text (e.g., for syncing existing text-only products without parsing their images again, or matching search queries).
 */
export const generateTextEmbedding = async (text: string): Promise<number[]> => {
    const embeddingModel = await getDynamicEmbeddingModel();
    const embedResult = await embeddingModel.embedContent(text);
    return embedResult.embedding.values;
};

/**
 * Performs a vector search on the Product collection using MongoDB Atlas $vectorSearch.
 * NOTE: This requires a pre-configured Vector Search Index in MongoDB Atlas named "vector_index".
 */
export const searchProductsByVector = async (embedding: number[], limit: number = 10) => {
    try {
        console.log(`🔍 Vector Search: queryVector length = ${embedding.length}, limit = ${limit}`);

        const results = await Product.aggregate([
            {
                $vectorSearch: {
                    index: "vector_index",
                    path: "imageEmbedding",
                    queryVector: embedding,
                    numCandidates: 100,
                    limit: limit
                }
            },
            {
                $project: {
                    title: 1,
                    description: 1,
                    price: 1,
                    category: 1,
                    imageUrl: 1,
                    images: 1,
                    vendorId: 1,
                    score: { $meta: "vectorSearchScore" }
                }
            }
        ]);

        console.log(`🔍 Vector Search returned ${results.length} results.`);
        if (results.length > 0) {
            console.log(`   Top match: "${results[0].title}" (score: ${results[0].score})`);
        }

        return results;
    } catch (error: any) {
        console.error("❌ Vector search failed:", error.message);
        console.error("   Full error:", JSON.stringify(error, null, 2));
        // Return empty array instead of throwing, so the user sees "no results" gracefully
        return [];
    }
};

/**
 * Lightweight post-vector-search reranker.
 * Boosts results whose title/category semantically match the detected product type,
 * then color, then style. This ensures product-type-first ranking without
 * discarding any results (no strict filtering).
 */
export const rerankByProductType = (
    results: any[],
    metadata: VisualMetadata
): any[] => {
    if (!metadata.productType && !metadata.color && !metadata.style) {
        return results; // No metadata to boost with
    }

    const typeTokens  = tokenize(metadata.productType);
    const colorTokens = tokenize(metadata.color);
    const styleTokens = tokenize(metadata.style);
    const catTokens   = tokenize(metadata.category);

    const boosted = results.map((item) => {
        const titleLower = (item.title || "").toLowerCase();
        const descLower  = (item.description || "").toLowerCase();
        const catLower   = (item.category || "").toLowerCase();
        const searchable = `${titleLower} ${descLower} ${catLower}`;

        let boost = 0;

        // Level 1 — Product type match (strongest signal, +0.25)
        if (typeTokens.length > 0 && matchesAny(searchable, typeTokens)) {
            boost += 0.25;
        }

        // Category match (+0.10)
        if (catTokens.length > 0 && matchesAny(catLower, catTokens)) {
            boost += 0.10;
        }

        // Level 2 — Color match (+0.05)
        if (colorTokens.length > 0 && matchesAny(searchable, colorTokens)) {
            boost += 0.05;
        }

        // Level 3 — Style match (+0.02)
        if (styleTokens.length > 0 && matchesAny(searchable, styleTokens)) {
            boost += 0.02;
        }

        return { ...item, originalScore: item.score, score: item.score + boost };
    });

    // Sort descending by boosted score
    boosted.sort((a, b) => b.score - a.score);

    console.log("🔄 Reranked results:");
    boosted.slice(0, 5).forEach((r, i) => {
        console.log(`   ${i + 1}. "${r.title}" | original: ${r.originalScore?.toFixed(4)} | boosted: ${r.score.toFixed(4)}`);
    });

    return boosted;
};

/** Tokenize a string into lowercase words, filtering out noise. */
function tokenize(text: string): string[] {
    if (!text) return [];
    const stopWords = new Set(["a", "an", "the", "and", "or", "of", "for", "in", "on", "with", "to"]);
    return text
        .toLowerCase()
        .split(/[\s,;/]+/)
        .map(t => t.replace(/[^a-z0-9]/g, ""))
        .filter(t => t.length > 1 && !stopWords.has(t));
}

/** Check if any token appears in the searchable text. */
function matchesAny(text: string, tokens: string[]): boolean {
    return tokens.some(token => text.includes(token));
}
