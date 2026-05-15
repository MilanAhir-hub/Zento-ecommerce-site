import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { getHybridRecommendations, getFallbackRecommendations } from '../services/recommendation/hybridEngine';

/**
 * getRecommendations — Main API handler for product recommendations.
 * 
 * Returns a structured response with three recommendation lists:
 * - recommended: Personalized hybrid blend (content-based + collaborative)
 * - trending: Globally popular products
 * - recentlyViewed: User's recently viewed products
 * 
 * If the user has no interaction history, returns fallback recommendations.
 */
export const getRecommendations = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;

        if (!userId) {
            // Not authenticated — return fallback trending products
            const fallback = await getFallbackRecommendations(10);
            res.status(200).json({
                recommended: fallback,
                trending: fallback,
                recentlyViewed: []
            });
            return;
        }

        // Get personalized hybrid recommendations
        const recommendations = await getHybridRecommendations(userId);

        // If the hybrid engine returned empty "recommended", use fallback
        if (recommendations.recommended.length === 0) {
            recommendations.recommended = await getFallbackRecommendations(10);
        }

        // If trending is empty, also fill with fallback
        if (recommendations.trending.length === 0) {
            recommendations.trending = await getFallbackRecommendations(10);
        }

        res.status(200).json(recommendations);
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        res.status(500).json({ message: 'Failed to fetch recommendations' });
    }
};
