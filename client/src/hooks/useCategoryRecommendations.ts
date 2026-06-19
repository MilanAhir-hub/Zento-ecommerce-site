import { useQuery } from '@tanstack/react-query';
import { fetchCategoryRecommendations } from '../services/recommendation.api';
import type { RecommendationModule } from '../services/recommendation.api';

/**
 * useCategoryRecommendations — React Query hook for category page recommendations modules.
 * Caches recommendations for 5 minutes and is only enabled when a category name is provided.
 */
export const useCategoryRecommendations = (category?: string) => {
    return useQuery<RecommendationModule[]>({
        queryKey: ['recommendations', 'category', category],
        queryFn: () => fetchCategoryRecommendations(category!),
        enabled: !!category,
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
        retry: 1,
    });
};
