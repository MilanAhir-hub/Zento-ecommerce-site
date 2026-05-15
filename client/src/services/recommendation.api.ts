import api from './api';

/**
 * Shape of the recommendation API response from the backend.
 * Contains three separate recommendation lists.
 */
export interface RecommendationData {
    recommended: any[];     // Personalized hybrid recommendations
    trending: any[];        // Globally trending products
    recentlyViewed: any[];  // User's recently viewed products
}

/**
 * fetchRecommendations — Calls the backend recommendation API.
 * Returns personalized recommendations for the authenticated user.
 * 
 * @returns RecommendationData with all three recommendation lists
 */
export const fetchRecommendations = async (): Promise<RecommendationData> => {
    const response = await api.get('/recommendations');
    return response.data;
};
