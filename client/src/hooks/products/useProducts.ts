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
    vendorId?: {
        _id: string;
        name: string;
        email: string;
        storeName?: string;
        storeDescription?: string;
        logo?: string;
        address?: string;
    } | string;
}

interface UseProductsOptions {
    limit?: number;
    category?: string;
    subcategory?: string;
    keyword?: string;
    page?: number;
}

export const useProducts = ({ limit, category, subcategory, keyword, page }: UseProductsOptions = {}) => {
    // Normalize keyword: treat empty string as undefined for cache stability
    const normalizedKeyword = keyword?.trim() === "" ? undefined : keyword;

    return useQuery({
        queryKey: ["products", limit, category, subcategory, normalizedKeyword, page],

        queryFn: async () => {
            const params = new URLSearchParams();

            if (limit) params.append("limit", limit.toString());
            if (normalizedKeyword) params.append("keyword", normalizedKeyword);
            if (page) params.append("page", page.toString());
            if (subcategory) params.append("subcategory", subcategory);

            const queryString = params.toString() ? `?${params.toString()}` : "";

            let endpoint = `/user/products${queryString}`;

            if (normalizedKeyword) {
                endpoint = `/products/search${queryString}`;

                if (category) {
                    // Search endpoint might expect different query param structure
                    const separator = endpoint.includes("?") ? "&" : "?";
                    endpoint += `${separator}category=${encodeURIComponent(category)}`;
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