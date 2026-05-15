import { useState } from "react";
import api from "../../services/api";

interface AIImageResponse {
    success: boolean;
    imageUrl: string;
    usageCount: number;
}

export const useImageAI = () => {
    const [loading, setLoading] = useState<number | null>(null); // Tracks index of the image being processed
    const [error, setError] = useState<string | null>(null);

    const enhanceImage = async (file: File, index: number): Promise<string | null> => {
        setLoading(index);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("image", file);

            const res = await api.post<AIImageResponse>(
                "/vendor/ai/enhance-image",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            if (res.data.success) {
                return res.data.imageUrl;
            }
            throw new Error("Enhancement failed");
        } catch (err: any) {
            setError(err?.response?.data?.message || "AI Enhancement failed");
            return null;
        } finally {
            setLoading(null);
        }
    };

    return { enhanceImage, loading, error };
};
