import express from 'express';
import { logInteraction } from '../controllers/interaction.controller';
import { isAuthenticated } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/log', isAuthenticated, logInteraction);

export default router;
