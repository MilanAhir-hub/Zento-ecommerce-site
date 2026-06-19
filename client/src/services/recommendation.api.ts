import api from './api';
import type { Product } from '../hooks/products/useProducts';

export interface RecommendationModule {
    moduleId: string;
    type: 'recommended_for_you' | 'similar' | 'frequently_bought_together' | 'trending' | 'recently_viewed';
    title: string;
    subtitle: string;
    products: Product[];
    reason?: string;
    strategy: string;
}

/**
 * Shape of the recommendation API response from the backend.
 * Extends Array<RecommendationModule> to match the unified DTO return type,
 * while maintaining backward compatibility with the legacy object properties.
 */
export interface RecommendationData extends Array<RecommendationModule> {
    recommended?: Product[];     // Personalized hybrid recommendations (legacy)
    trending?: Product[];        // Globally trending products (legacy)
    recentlyViewed?: Product[];  // User's recently viewed products (legacy)
}

/**
 * fetchRecommendations — Legacy API wrapper for fetching recommendations.
 */
export const fetchRecommendations = async (): Promise<RecommendationData> => {
    const response = await api.get('/recommendations');
    return response.data;
};

/**
 * fetchHomeRecommendations — Fetch modules for the Home page.
 */
export const fetchHomeRecommendations = async (): Promise<RecommendationModule[]> => {
    const response = await api.get('/recommendations/home');
    return response.data;
};

/**
 * fetchProductRecommendations — Fetch modules for the Product Detail page.
 */
export const fetchProductRecommendations = async (productId: string): Promise<RecommendationModule[]> => {
    const response = await api.get(`/recommendations/product/${productId}`);
    return response.data;
};

/**
 * fetchCartRecommendations — Fetch modules for the Cart page.
 */
export const fetchCartRecommendations = async (): Promise<RecommendationModule[]> => {
    const response = await api.get('/recommendations/cart');
    return response.data;
};

/**
 * fetchWishlistRecommendations — Fetch modules for the Wishlist page.
 */
export const fetchWishlistRecommendations = async (): Promise<RecommendationModule[]> => {
    const response = await api.get('/recommendations/wishlist');
    return response.data;
};

/**
 * fetchSearchRecommendations — Fetch modules for Search results page.
 */
export const fetchSearchRecommendations = async (): Promise<RecommendationModule[]> => {
    const response = await api.get('/recommendations/search');
    return response.data;
};

/**
 * fetchCategoryRecommendations — Fetch modules for Category pages.
 */
export const fetchCategoryRecommendations = async (category: string): Promise<RecommendationModule[]> => {
    const response = await api.get(`/recommendations/category/${category}`);
    return response.data;
};
