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
 * fetchRecommendations — Calls the backend recommendation API.
 * Returns personalized recommendations for the authenticated user.
 * 
 * @returns RecommendationData with all recommendation modules / lists
 */
export const fetchRecommendations = async (): Promise<RecommendationData> => {
    const response = await api.get('/recommendations');
    return response.data;
};
