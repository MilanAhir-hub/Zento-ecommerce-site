import { getContentBasedRecs } from './contentBased';
import { getCollaborativeRecs } from './collaborative';
import { getTrendingProducts } from './trending';
import { getRecentlyViewed } from './recentlyViewed';
import { Product } from '../../models/Product';

/**
 * STRATEGY WEIGHTS — How much influence each strategy has 
 * in the final hybrid recommendation list.
 */
const STRATEGY_WEIGHTS = {
    contentBased: 0.35,
    collaborative: 0.25,
    trending: 0.20,
    recentlyViewed: 0.20
};

/**
 * RecommendationResponse — Shape of the API response
 * Contains separate lists for each recommendation type,
 * so the frontend can render them in different sections.
 */
export interface RecommendationResponse {
    recommended: any[];     // Hybrid blend of content-based + collaborative
    trending: any[];        // Globally trending products
    recentlyViewed: any[];  // User's recently viewed products
}

/**
 * getHybridRecommendations — The main entry point for the recommendation engine.
 * 
 * Orchestrates all strategies in parallel and returns a unified response.
 * For the "recommended" list, it merges content-based and collaborative results
 * with deduplication. If the user has no history, it falls back to trending.
 * 
 * @param userId - The authenticated user's ID
 * @returns RecommendationResponse with all three recommendation lists
 */
export const getHybridRecommendations = async (userId: string): Promise<RecommendationResponse> => {
    // Run all strategies in parallel for performance
    const [contentBased, collaborative, trending, recentlyViewed] = await Promise.all([
        getContentBasedRecs(userId, 15).catch(() => []),
        getCollaborativeRecs(userId, 15).catch(() => []),
        getTrendingProducts(10, 7).catch(() => []),
        getRecentlyViewed(userId, 10).catch(() => [])
    ]);

    // Merge content-based and collaborative results into a single "recommended" list
    const recommended = mergeAndDeduplicate(contentBased, collaborative, trending);

    return {
        recommended,
        trending,
        recentlyViewed
    };
};

/**
 * mergeAndDeduplicate — Combines products from multiple strategies,
 * removes duplicates (by product _id), and caps at a limit.
 * 
 * Priority order: content-based first, then collaborative, then trending as fallback.
 */
const mergeAndDeduplicate = (
    contentBased: any[],
    collaborative: any[],
    trending: any[],
    limit: number = 10
): any[] => {
    const seen = new Set<string>();
    const merged: any[] = [];

    // Helper: add unique products to the merged list
    const addUnique = (products: any[]) => {
        for (const product of products) {
            const id = product._id?.toString();
            if (id && !seen.has(id)) {
                seen.add(id);
                merged.push(product);
            }
        }
    };

    // Interleave content-based and collaborative for variety
    const maxLen = Math.max(contentBased.length, collaborative.length);
    for (let i = 0; i < maxLen; i++) {
        if (i < contentBased.length) addUnique([contentBased[i]]);
        if (i < collaborative.length) addUnique([collaborative[i]]);
    }

    // If we still don't have enough, fill from trending
    if (merged.length < limit) {
        addUnique(trending);
    }

    return merged.slice(0, limit);
};

/**
 * getFallbackRecommendations — Used when no user ID is available
 * or the user has zero interaction history.
 * Returns newest products with available stock.
 */
export const getFallbackRecommendations = async (limit: number = 10) => {
    return await Product.find({ stock: { $gt: 0 } })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();
};
