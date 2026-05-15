import axios from 'axios';
import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

interface GeminiModel {
    name: string;
    version: string;
    displayName: string;
    description: string;
    inputTokenLimit: number;
    outputTokenLimit: number;
    supportedGenerationMethods: string[];
}

let cachedVisionModelName: string | null = null;
let cachedEmbeddingModelName: string | null = null;

/**
 * Dynamically fetches available models from Google API and selects the best one.
 * 
 * IMPORTANT FINDINGS (April 2026):
 * - Vision models (generateContent) are available on BOTH v1 and v1beta
 * - Embedding models (embedContent) are ONLY available on v1beta
 * - Correct embedding model names: gemini-embedding-001, gemini-embedding-2
 * - OLD names like text-embedding-004 and embedding-001 are DEAD
 */
export const getBestModelNames = async (): Promise<{ vision: string; embedding: string }> => {
    if (cachedVisionModelName && cachedEmbeddingModelName) {
        return { vision: cachedVisionModelName, embedding: cachedEmbeddingModelName };
    }

    try {
        console.log("🔍 Dynamically discovering available Gemini models...");

        // Fetch from v1beta because embedding models are ONLY available there
        const response = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const models: GeminiModel[] = response.data.models;

        // 1. Find best Vision Model (supports generateContent)
        const visionPreferences = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.5-pro"];
        let selectedVision = "";

        for (const pref of visionPreferences) {
            const found = models.find(m => m.name.includes(pref) && m.supportedGenerationMethods.includes("generateContent"));
            if (found) {
                selectedVision = found.name.replace("models/", "");
                break;
            }
        }

        // 2. Find best Embedding Model (supports embedContent)
        const embeddingPreferences = ["gemini-embedding-2", "gemini-embedding-001"];
        let selectedEmbedding = "";

        for (const pref of embeddingPreferences) {
            const found = models.find(m => m.name.includes(pref) && !m.name.includes("preview") && m.supportedGenerationMethods.includes("embedContent"));
            if (found) {
                selectedEmbedding = found.name.replace("models/", "");
                break;
            }
        }

        // If gemini-embedding-2 exact match wasn't found (without preview), try with preview
        if (!selectedEmbedding) {
            const fallback = models.find(m => m.supportedGenerationMethods.includes("embedContent"));
            if (fallback) {
                selectedEmbedding = fallback.name.replace("models/", "");
            }
        }

        cachedVisionModelName = selectedVision || "gemini-2.5-flash";
        cachedEmbeddingModelName = selectedEmbedding || "gemini-embedding-001";

        console.log(`✅ Discovered Vision  -> ${cachedVisionModelName}`);
        console.log(`✅ Discovered Embedding -> ${cachedEmbeddingModelName}`);

        return { vision: cachedVisionModelName, embedding: cachedEmbeddingModelName };
    } catch (error: any) {
        console.error("❌ Model discovery failed, using defaults:", error.message);
        cachedVisionModelName = "gemini-2.5-flash";
        cachedEmbeddingModelName = "gemini-embedding-001";
        return { vision: cachedVisionModelName, embedding: cachedEmbeddingModelName };
    }
};

/**
 * Returns a configured GenerativeModel for vision/generateContent tasks.
 * Uses v1beta API (superset of v1, supports all models).
 */
export const getDynamicVisionModel = async (): Promise<GenerativeModel> => {
    const { vision } = await getBestModelNames();
    return genAI.getGenerativeModel({ model: vision }, { apiVersion: 'v1beta' });
};

/**
 * Returns a configured GenerativeModel for embedding tasks.
 * MUST use v1beta because embedding models are NOT available on v1.
 */
export const getDynamicEmbeddingModel = async (): Promise<GenerativeModel> => {
    const { embedding } = await getBestModelNames();
    return genAI.getGenerativeModel({ model: embedding }, { apiVersion: 'v1beta' });
};
