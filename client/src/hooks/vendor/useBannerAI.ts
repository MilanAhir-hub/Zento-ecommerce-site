import { useState } from "react";
import api from "../../services/api";

export interface GenerateBannerInput {
    title: string;
    subtitle?: string;
    category: string;
    subcategory?: string;
    discountType?: string;
    discountValue?: string;
    startDate?: string;
    endDate?: string;
    theme?: string;
    customPrompt?: string;
}

interface GenerateBannerResponse {
    success: boolean;
    imageUrl: string;
    prompt: string;
    model: string;
    notes?: string;
}

export const useBannerAI = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateBanner = async (
        payload: GenerateBannerInput
    ): Promise<GenerateBannerResponse | null> => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.post<GenerateBannerResponse>(
                "/vendor/ai/generate-banner",
                payload
            );

            return response.data;
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to generate banner image.");
            return null;
        } finally {
            setLoading(false);
        }
    };

    const clearError = () => setError(null);

    return {
        generateBanner,
        loading,
        error,
        clearError,
    };
};
