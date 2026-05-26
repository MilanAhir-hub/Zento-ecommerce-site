import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("FATAL ERROR: GEMINI_API_KEY is not defined in environment variables.");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

let discoveredModelName: string = "gemini-2.5-flash";

/**
 * Returns the Gemini generative model instance.
 * Automatically uses the most stable discovered model.
 */
export const getGeminiModel = (modelOverride?: string) => {
    return genAI.getGenerativeModel(
        { model: modelOverride || discoveredModelName },
        { apiVersion: 'v1beta' }
    );
};

/**
 * Initializes the model discovery. Call this on server startup.
 */
export const initializeModelDiscovery = async () => {
    try {
        const { getBestModelNames } = await import("../services/ai/modelSelector");
        const { vision } = await getBestModelNames();
        discoveredModelName = vision;
        console.log(`🤖 Global Gemini model set to: ${discoveredModelName}`);
    } catch (e) {
        console.error("Failed to initialize model discovery:", e);
    }
};
