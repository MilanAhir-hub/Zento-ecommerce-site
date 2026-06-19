import { useQuery } from '@tanstack/react-query';
import { fetchSearchRecommendations } from '../services/recommendation.api';
import type { RecommendationModule } from '../services/recommendation.api';

/**
 * useSearchRecommendations — React Query hook for search/listing page recommendations modules (e.g. zero-results fallback).
 * Caches recommendations for 5 minutes.
 */
export const useSearchRecommendations = () => {
    return useQuery<RecommendationModule[]>({
        queryKey: ['recommendations', 'search'],
        queryFn: fetchSearchRecommendations,
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
        retry: 1,
    });
};
