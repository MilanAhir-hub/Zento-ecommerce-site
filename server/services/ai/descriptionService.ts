import { getGeminiModel } from "../../config/gemini.config";

export interface GenerateDescriptionParams {
    title: string;
    category: string;
    brand?: string;
    features?: string[];
    tone?: "professional" | "casual" | "enthusiastic" | "luxurious" | "minimalist" | string;
}

/**
 * Generates a beautiful e-commerce product description using AI.
 */
export const generateDescription = async ({
    title,
    category,
    brand,
    features,
    tone = "professional"
}: GenerateDescriptionParams): Promise<string> => {
    try {
        const model = getGeminiModel();

        const prompt = `
You are a world-class e-commerce copywriter.

Your task is to create a premium, high-converting product description for an online store.

Product Details:
- Title: ${title || "N/A"}
- Category: ${category || "N/A"}
- Brand: ${brand || "N/A"}
- Key Features: ${features && features.length > 0 ? features.join(", ") : "Not provided"}

Tone Instruction:
- Use a **${tone}** tone throughout the description.
- Ensure the language aligns perfectly with a ${tone} brand voice.
- Keep the tone natural, human-like, and non-generic.

Strict Instructions:
- Start with a strong, engaging hook (1–2 lines).
- Focus on BENEFITS (why it matters), not just features.
- Naturally incorporate the provided features into the description.
- Avoid generic phrases like "best product", "high quality", "must-have".
- Do NOT invent specifications, guarantees, or false claims.
- Use clean, modern formatting (short paragraphs and optional bullet points).
- Maintain a premium, polished, and trustworthy feel.
- Keep total length between 100–150 words.

Structure:
1. Hook
2. Value & benefits
3. Feature highlights (bullets if suitable)
4. Subtle call-to-action

Output Rules:
- Return ONLY the final product description.
- No headings, no labels, no explanations.
`;

        const result = await model.generateContent(prompt);
        const text = result?.response?.text?.();

        if (!text) {
            throw new Error("Empty response received from Gemini AI.");
        }

        return text.trim();
    } catch (error: any) {
        console.error("Error generating product description:", {
            message: error.message,
            stack: error.stack,
        });
        throw new Error("Failed to generate description. Please try again.");
    }
}

/**
 * Improves an existing e-commerce product description using AI.
 */
export const improveDescription = async (currentDescription: string, tone: string = "compelling"): Promise<string> => {
    try {
        const model = getGeminiModel();

        const prompt = `
You are a world-class e-commerce copywriter.

Your task is to refine and elevate an existing product description into a premium, high-converting version.

Current Description:
"""
${currentDescription || "N/A"}
"""

Tone Instruction:
- Use a **${tone}** tone for this improvement.
- Ensure the language is natural, human-like, and non-generic.
- Maintain a premium, modern, and trustworthy feel.

Strict Instructions:
- Improve clarity, flow, and readability.
- Make the description more persuasive and engaging.
- Replace weak or generic phrases with strong, natural language.
- Highlight the core value and benefits clearly.
- Fix grammar, structure, and formatting issues.
- Keep the content truthful — do NOT add any fake or unverified details.
- Remove redundancy and unnecessary fluff.
- Use clean formatting (short paragraphs and optional bullet points).
- Keep total length between 100–150 words.

Structure:
1. Strong opening
2. Clear value & benefits
3. Feature highlights (if applicable)
4. Subtle call-to-action

Output Rules:
- Return ONLY the improved description.
- No explanations, no labels, no extra text.
`;

        const result = await model.generateContent(prompt);
        const text = result?.response?.text?.();

        if (!text) {
            throw new Error("Empty response received from Gemini AI.");
        }

        return text.trim();
    } catch (error: any) {
        console.error("Error improving product description:", {
            message: error.message,
            stack: error.stack,
        });
        throw new Error("Failed to improve description. Please try again.");
    }
}