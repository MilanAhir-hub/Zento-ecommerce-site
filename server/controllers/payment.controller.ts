import { Request, Response } from 'express';
import crypto from 'crypto';
import { razorpayInstance } from '../utils/razorpayClient';
import { Payment } from '../models/Payment';
import { AuthRequest } from '../middlewares/auth.middleware';

/**
 * Creates a new Razorpay Order
 * Endpoint: POST /api/payment/create-order
 */
export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { amount, currency = 'INR' } = req.body;

        // Basic validation
        if (!amount || amount <= 0) {
            res.status(400).json({ success: false, message: 'Invalid amount' });
            return;
        }

        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }

        // Razorpay accepts amount in paise (multiply by 100)
        const options = {
            amount: Math.round(amount * 100),
            currency,
            receipt: `receipt_order_${Date.now()}`,
        };

        // Create order via Razorpay API
        const order = await razorpayInstance.orders.create(options);

        if (!order) {
            res.status(500).json({ success: false, message: 'Failed to create order' });
            return;
        }

        // Create a pending payment record in DB
        const paymentRecord = new Payment({
            userId,
            razorpay_order_id: order.id,
            amount,
            currency,
            status: 'created'
        });
        await paymentRecord.save();

        res.status(200).json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
        });

    } catch (error: any) {
        console.error('Error in createOrder:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
};

/**
 * Verifies the Razorpay Payment Signature
 * Endpoint: POST /api/payment/verify
 */
export const verifyPayment = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        // Ensure all required fields exist
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            res.status(400).json({ success: false, message: 'Missing payment details' });
            return;
        }

        const secret = process.env.RAZORPAY_KEY_SECRET;
        if (!secret) {
            throw new Error("RAZORPAY_KEY_SECRET is not configured");
        }

        // Generate the expected signature to compare with Razorpay's signature
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(body.toString())
            .digest('hex');

        // Check if both signatures match
        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Update the payment record in MongoDB to specify success
            await Payment.findOneAndUpdate(
                { razorpay_order_id },
                {
                    razorpay_payment_id,
                    razorpay_signature,
                    status: 'successful'
                }
            );

            res.status(200).json({ success: true, message: 'Payment verified successfully' });
        } else {
            // Mark payment as failed if signature mismatch
            await Payment.findOneAndUpdate(
                { razorpay_order_id },
                {
                    status: 'failed'
                }
            );
            res.status(400).json({ success: false, message: 'Invalid payment signature' });
        }

    } catch (error: any) {
        console.error('Error in verifyPayment:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
};
