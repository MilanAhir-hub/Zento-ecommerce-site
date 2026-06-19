import { useQuery } from '@tanstack/react-query';
import { fetchProductRecommendations } from '../services/recommendation.api';
import type { RecommendationModule } from '../services/recommendation.api';

/**
 * useProductRecommendations — React Query hook for product detail page recommendations modules.
 * Caches recommendations for 5 minutes and is only enabled when productId is provided.
 */
export const useProductRecommendations = (productId?: string) => {
    return useQuery<RecommendationModule[]>({
        queryKey: ['recommendations', 'product', productId],
        queryFn: () => fetchProductRecommendations(productId!),
        enabled: !!productId,
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
        retry: 1,
    });
};
