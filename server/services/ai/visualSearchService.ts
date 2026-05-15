import { getDynamicVisionModel, getDynamicEmbeddingModel } from "./modelSelector";
import { Product } from "../../models/Product";

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
