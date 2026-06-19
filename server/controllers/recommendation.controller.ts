import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { getHybridRecommendations, getFallbackRecommendations } from '../services/recommendation/hybridEngine';
import { RecommendationModule } from '../types/recommendation';
import { Product } from '../models/Product';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

// Helper to get optional userId from cookies
const getOptionalUserId = (req: AuthRequest): string | undefined => {
    try {
        const token = req.cookies?.token;
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
            return decoded.userId;
        }
    } catch (error) {
        // Ignore invalid tokens and treat as guest
    }
    return undefined;
};

/**
 * getRecommendations — Main legacy API handler for product recommendations.
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

/**
 * getHomeRecommendations — GET /api/recommendations/home
 */
export const getHomeRecommendations = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId || getOptionalUserId(req);

        let recommendedProducts: any[] = [];
        let trendingProducts: any[] = [];
        let recentlyViewedProducts: any[] = [];
        let strategy = 'fallback';

        if (userId) {
            const recommendations = await getHybridRecommendations(userId);
            recommendedProducts = recommendations.recommended;
            trendingProducts = recommendations.trending;
            recentlyViewedProducts = recommendations.recentlyViewed;
            strategy = 'hybrid';
        } else {
            const fallbacks = await getFallbackRecommendations(10);
            recommendedProducts = fallbacks;
            trendingProducts = fallbacks;
            recentlyViewedProducts = [];
        }

        // Ensure empty lists get fallback products
        if (recommendedProducts.length === 0) {
            recommendedProducts = await getFallbackRecommendations(10);
        }
        if (trendingProducts.length === 0) {
            trendingProducts = await getFallbackRecommendations(10);
        }

        const modules: RecommendationModule[] = [
            {
                moduleId: 'home_recommended',
                type: 'recommended_for_you',
                title: 'Recommended For You',
                subtitle: userId ? 'Personalized picks based on your activity.' : 'Explore our curated collection.',
                products: recommendedProducts,
                strategy
            },
            {
                moduleId: 'home_trending',
                type: 'trending',
                title: 'Trending Now',
                subtitle: "What everyone's loving right now.",
                products: trendingProducts,
                strategy: userId ? 'trending' : 'fallback'
            }
        ];

        if (userId && recentlyViewedProducts.length > 0) {
            modules.push({
                moduleId: 'home_recently_viewed',
                type: 'recently_viewed',
                title: 'Recently Viewed',
                subtitle: 'Pick up where you left off.',
                products: recentlyViewedProducts,
                strategy: 'recently_viewed'
            });
        }

        res.status(200).json(modules);
    } catch (error) {
        console.error('Error fetching home recommendations:', error);
        res.status(500).json({ message: 'Failed to fetch home recommendations' });
    }
};

/**
 * getProductRecommendations — GET /api/recommendations/product/:productId
 */
export const getProductRecommendations = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const productId = req.params.productId as string;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            res.status(400).json({ message: 'Invalid productId' });
            return;
        }

        const fallbacks = await getFallbackRecommendations(10);
        const filteredFallbacks = fallbacks.filter(p => p._id.toString() !== productId);

        const modules: RecommendationModule[] = [
            {
                moduleId: 'product_similar',
                type: 'similar',
                title: 'Similar Products',
                subtitle: 'Customers also viewed these',
                products: filteredFallbacks.slice(0, 5),
                strategy: 'fallback'
            },
            {
                moduleId: 'product_frequently_bought',
                type: 'frequently_bought_together',
                title: 'Frequently Bought Together',
                subtitle: 'Pair it with these',
                products: filteredFallbacks.slice(5, 10),
                strategy: 'fallback'
            }
        ];

        res.status(200).json(modules);
    } catch (error) {
        console.error('Error fetching product recommendations:', error);
        res.status(500).json({ message: 'Failed to fetch product recommendations' });
    }
};

/**
 * getCartRecommendations — GET /api/recommendations/cart
 */
export const getCartRecommendations = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const products = await getFallbackRecommendations(5);

        const modules: RecommendationModule[] = [
            {
                moduleId: 'cart_add_ons',
                type: 'frequently_bought_together',
                title: 'Frequently Bought Together',
                subtitle: 'Complete your order with these',
                products,
                strategy: 'fallback'
            }
        ];

        res.status(200).json(modules);
    } catch (error) {
        console.error('Error fetching cart recommendations:', error);
        res.status(500).json({ message: 'Failed to fetch cart recommendations' });
    }
};

/**
 * getWishlistRecommendations — GET /api/recommendations/wishlist
 */
export const getWishlistRecommendations = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const products = await getFallbackRecommendations(10);

        const modules: RecommendationModule[] = [
            {
                moduleId: 'wishlist_recommended',
                type: 'recommended_for_you',
                title: 'Based on your Wishlist',
                subtitle: 'Items you might like',
                products,
                strategy: 'fallback'
            }
        ];

        res.status(200).json(modules);
    } catch (error) {
        console.error('Error fetching wishlist recommendations:', error);
        res.status(500).json({ message: 'Failed to fetch wishlist recommendations' });
    }
};

/**
 * getSearchRecommendations — GET /api/recommendations/search
 */
export const getSearchRecommendations = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const products = await getFallbackRecommendations(10);

        const modules: RecommendationModule[] = [
            {
                moduleId: 'search_trending',
                type: 'trending',
                title: 'Trending Now',
                subtitle: "What everyone's loving right now.",
                products,
                strategy: 'fallback'
            }
        ];

        res.status(200).json(modules);
    } catch (error) {
        console.error('Error fetching search recommendations:', error);
        res.status(500).json({ message: 'Failed to fetch search recommendations' });
    }
};

/**
 * getCategoryRecommendations — GET /api/recommendations/category/:category
 */
export const getCategoryRecommendations = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { category } = req.params;

        const categoryProducts = await Product.find({
            category,
            stock: { $gt: 0 }
        })
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();

        if (categoryProducts.length < 10) {
            const seen = new Set(categoryProducts.map(p => p._id.toString()));
            const fallbacks = await getFallbackRecommendations(10);
            for (const fallback of fallbacks) {
                if (categoryProducts.length >= 10) break;
                if (!seen.has(fallback._id.toString())) {
                    seen.add(fallback._id.toString());
                    categoryProducts.push(fallback);
                }
            }
        }

        const modules: RecommendationModule[] = [
            {
                moduleId: 'category_trending',
                type: 'trending',
                title: 'Trending In This Category',
                subtitle: `Popular choices in ${category}`,
                products: categoryProducts,
                strategy: 'fallback'
            }
        ];

        res.status(200).json(modules);
    } catch (error) {
        console.error('Error fetching category recommendations:', error);
        res.status(500).json({ message: 'Failed to fetch category recommendations' });
    }
};
