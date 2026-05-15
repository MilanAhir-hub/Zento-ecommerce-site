import { useQuery } from '@tanstack/react-query';
import { fetchRecommendations } from '../services/recommendation.api';
import type { RecommendationData } from '../services/recommendation.api';
import { useAuth } from '../context/authContext';

/**
 * useRecommendations — React Query hook for fetching personalized recommendations.
 * 
 * Only enabled when the user is authenticated (recommendations require user context).
 * Caches results for 5 minutes to avoid unnecessary re-fetches.
 * 
 * @returns Standard React Query result with `data` typed as RecommendationData
 */
export const useRecommendations = () => {
    const { isAuthenticated } = useAuth();

    return useQuery<RecommendationData>({
        queryKey: ['recommendations'],
        queryFn: fetchRecommendations,
        enabled: isAuthenticated,  // Only fetch when user is logged in
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
        retry: 1,
    });
};
