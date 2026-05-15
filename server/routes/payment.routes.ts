import express from 'express';
import { createOrder, verifyPayment } from '../controllers/payment.controller';
import { isAuthenticated } from '../middlewares/auth.middleware';

const router = express.Router();

// Both routes require authentication
router.post('/create-order', isAuthenticated, createOrder);
router.post('/verify', isAuthenticated, verifyPayment);

export default router;
