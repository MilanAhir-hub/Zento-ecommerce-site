import { Router } from 'express';
import {
    getRecommendations,
    getHomeRecommendations,
    getProductRecommendations,
    getCartRecommendations,
    getWishlistRecommendations,
    getSearchRecommendations,
    getCategoryRecommendations
} from '../controllers/recommendation.controller';
import { isAuthenticated } from '../middlewares/auth.middleware';

const router = Router();

// Legacy route (requires authentication)
router.get('/', isAuthenticated, getRecommendations);

// Contextual routes
router.get('/home', getHomeRecommendations);
router.get('/product/:productId', getProductRecommendations);
router.get('/cart', getCartRecommendations);
router.get('/wishlist', getWishlistRecommendations);
router.get('/search', getSearchRecommendations);
router.get('/category/:category', getCategoryRecommendations);

export default router;
