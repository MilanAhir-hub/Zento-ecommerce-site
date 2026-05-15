import axios from "axios";
import { BannerPromptInput, buildBannerImagePrompt } from "../../utils/bannerPromptBuilder";

const GOOGLE_IMAGE_MODEL = "gemini-1.5-flash"; // Switched to stable 1.5-flash
const GOOGLE_IMAGE_ENDPOINT = `https://generativelanguage.googleapis.com/v1/models/${GOOGLE_IMAGE_MODEL}:generateContent`;

interface GeminiInlineData {
    mimeType?: string;
    data?: string;
}

interface GeminiPart {
    text?: string;
    inlineData?: GeminiInlineData;
}

interface GeminiCandidate {
    content?: {
        parts?: GeminiPart[];
    };
}

interface GeminiImageResponse {
    candidates?: GeminiCandidate[];
}

export interface BannerImageGenerationResult {
    imageBuffer: Buffer;
    mimeType: string;
    prompt: string;
    model: string;
    textResponse: string;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const shouldRetry = (status?: number): boolean => status === 429 || status === 503;

export const generateBannerImage = async (
    input: BannerPromptInput
): Promise<BannerImageGenerationResult> => {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not configured.");
    }

    const prompt = buildBannerImagePrompt(input);
    const maxAttempts = 3;
    let response: { data: GeminiImageResponse } | null = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
        try {
            response = await axios.post<GeminiImageResponse>(
                GOOGLE_IMAGE_ENDPOINT,
                {
                    contents: [
                        {
                            parts: [{ text: prompt }],
                        },
                    ],
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "x-goog-api-key": apiKey,
                    },
                    timeout: 120000,
                }
            );
            break;
        } catch (error) {
            if (!axios.isAxiosError(error)) {
                throw error;
            }

            const status = error.response?.status;
            const isRetryable = shouldRetry(status) && attempt < maxAttempts;

            if (isRetryable) {
                await sleep(attempt * 2000);
                continue;
            }

            if (status === 429) {
                throw new Error("Google AI image generation is temporarily rate-limited. Please try again in a moment.");
            }

            if (status === 503) {
                throw new Error("Google AI image generation is temporarily unavailable. Please try again shortly.");
            }

            throw new Error(error.response?.data?.error?.message || error.message || "Failed to generate banner image.");
        }
    }

    if (!response) {
        throw new Error("Failed to generate banner image.");
    }

    const parts = response.data.candidates?.flatMap(
        (candidate) => candidate.content?.parts || []
    ) || [];

    const imagePart = parts.find((part) => part.inlineData?.data);

    if (!imagePart?.inlineData?.data) {
        throw new Error("Google AI did not return an image for this banner request.");
    }

    const textResponse = parts
        .map((part) => part.text?.trim())
        .filter((text): text is string => Boolean(text))
        .join("\n")
        .trim();

    return {
        imageBuffer: Buffer.from(imagePart.inlineData.data, "base64"),
        mimeType: imagePart.inlineData.mimeType || "image/png",
        prompt,
        model: GOOGLE_IMAGE_MODEL,
        textResponse,
    };
};
