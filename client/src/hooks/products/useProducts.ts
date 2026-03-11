import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";

export interface Product {
    _id: string;
    title: string;
    description: string;
    price: number;
    oldPrice?: number;
    imageUrl: string;
    category: string;
    stock?: number;
}

interface UseProductsOptions {
    limit?: number;
    category?: string;
    keyword?: string;
    page?: number;
}

export const useProducts = ({ limit, category, keyword, page }: UseProductsOptions = {}) => {
    return useQuery({
        queryKey: ["products", limit, category, keyword, page],

        queryFn: async () => {
            const params = new URLSearchParams();

            if (limit) params.append("limit", limit.toString());
            if (keyword) params.append("keyword", keyword);
            if (page) params.append("page", page.toString());

            const queryString = params.toString() ? `?${params.toString()}` : "";

            let endpoint = `/user/products${queryString}`;

            if (keyword) {
                endpoint = `/products/search${queryString}`;

                if (category) {
                    endpoint += `&category=${encodeURIComponent(category)}`;
                }
            } else if (category) {
                endpoint = `/user/products/category/${category}${queryString}`;
            }

            const response = await api.get(endpoint);

            // Normalize: backend returns { data: [...] } consistently
            const data =
                Array.isArray(response.data)
                    ? response.data
                    : response.data.data || response.data.products || [];

            return data as Product[];
        },
    });
};