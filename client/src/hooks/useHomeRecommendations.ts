import { useQuery } from '@tanstack/react-query';
import { fetchHomeRecommendations } from '../services/recommendation.api';
import type { RecommendationModule } from '../services/recommendation.api';

/**
 * useHomeRecommendations — React Query hook for home page recommendations modules.
 * Caches recommendations for 5 minutes.
 */
export const useHomeRecommendations = () => {
    return useQuery<RecommendationModule[]>({
        queryKey: ['recommendations', 'home'],
        queryFn: fetchHomeRecommendations,
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
        retry: 1,
    });
};
