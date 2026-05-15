import { Router } from 'express';
import { getRecommendations } from '../controllers/recommendation.controller';
import { isAuthenticated } from '../middlewares/auth.middleware';

const router = Router();

// GET /api/recommendations — Returns personalized product recommendations
router.get('/', isAuthenticated, getRecommendations);

export default router;
