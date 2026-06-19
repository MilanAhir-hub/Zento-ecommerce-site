import { useQuery } from '@tanstack/react-query';
import { fetchCartRecommendations } from '../services/recommendation.api';
import type { RecommendationModule } from '../services/recommendation.api';

/**
 * useCartRecommendations — React Query hook for cart page recommendations modules.
 * Caches recommendations for 5 minutes.
 */
export const useCartRecommendations = () => {
    return useQuery<RecommendationModule[]>({
        queryKey: ['recommendations', 'cart'],
        queryFn: fetchCartRecommendations,
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
        retry: 1,
    });
};
