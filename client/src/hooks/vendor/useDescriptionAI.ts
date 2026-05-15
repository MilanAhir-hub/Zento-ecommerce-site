import { useState } from "react";
import api from "../../services/api";

// Types
interface GenerateInput {
    title: string;
    category?: string;
    brand?: string;
    features?: string[];
    tone?: string;
}

interface AIResponse {
    success: boolean;
    description: string;
}

// Hook
export const useDescriptionAI = () => {
    const [loading, setLoading] = useState<boolean>(false);

    // Generate Description
    const generate = async (data: GenerateInput): Promise<string> => {
        setLoading(true);
        try {
            const res = await api.post<AIResponse>(
                "/vendor/ai/generate-description",
                data
            );
            return res.data.description;
        } catch (error) {
            console.error("Generate Error:", error);
            return "";
        } finally {
            setLoading(false);
        }
    };

    // Improve Description
    const improve = async (description: string): Promise<string> => {
        setLoading(true);
        try {
            const res = await api.post<AIResponse>(
                "/vendor/ai/improve-description",
                { description }
            );
            return res.data.description;
        } catch (error) {
            console.error("Improve Error:", error);
            return description; // fallback
        } finally {
            setLoading(false);
        }
    };

    return { generate, improve, loading };
};