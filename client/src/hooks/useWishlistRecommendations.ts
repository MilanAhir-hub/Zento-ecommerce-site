import { useQuery } from '@tanstack/react-query';
import { fetchWishlistRecommendations } from '../services/recommendation.api';
import type { RecommendationModule } from '../services/recommendation.api';

/**
 * useWishlistRecommendations — React Query hook for wishlist page recommendations modules.
 * Caches recommendations for 5 minutes.
 */
export const useWishlistRecommendations = () => {
    return useQuery<RecommendationModule[]>({
        queryKey: ['recommendations', 'wishlist'],
        queryFn: fetchWishlistRecommendations,
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
        retry: 1,
    });
};
