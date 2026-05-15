import express from 'express';
import { logInteraction } from '../controllers/interaction.controller';

const router = express.Router();

// this will used by the frontend to send the data
router.post('/log', logInteraction);

export default router;
