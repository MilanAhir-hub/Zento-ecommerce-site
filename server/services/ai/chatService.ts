import { getGeminiModel } from "../../config/gemini.config";

/**
 * Sends a prompt to Google Gemini and returns the generated text response.
 */
export const generateAIResponse = async (
    prompt: string,
    product?: {
        title?: string;
        description?: string;
        features?: string[];
        category?: string;
    }
): Promise<string> => {
    try {
        const model = getGeminiModel();

        // Structured prompt (VERY IMPORTANT for accuracy)
        const structuredPrompt = `
You are a smart AI shopping assistant for an e-commerce website.

Rules:
- Answer only based on the given product information
- Be clear, concise, and helpful
- Do NOT make up information
- If unsure, say "Information not available"

Product Details:
Title: ${product?.title || "N/A"}
Category: ${product?.category || "N/A"}
Description: ${product?.description || "N/A"}
Features: ${product?.features?.join(", ") || "N/A"}

User Question:
${prompt}

Answer:
`;

        // API call
        const result = await model.generateContent(structuredPrompt);

        // Safe extraction
        const text = result?.response?.text?.();

        if (!text) {
            throw new Error("Empty response from Gemini");
        }

        return text.trim();

    } catch (error: any) {
        console.error("Gemini API error:", {
            message: error.message,
            stack: error.stack,
        });

        throw new Error("Failed to generate AI response. Please try again later.");
    }
};
