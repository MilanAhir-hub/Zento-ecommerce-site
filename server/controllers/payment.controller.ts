import { Request, Response } from 'express';
import crypto from 'crypto';
import mongoose from 'mongoose';
import { razorpayInstance } from '../utils/razorpayClient';
import { Payment } from '../models/Payment';
import { Cart } from '../models/Cart';
import { createOrdersFromCart } from '../services/order.service';
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

        console.log("[SERVER PAY] Creating Razorpay order with options:", options);
        console.log("[SERVER PAY] Using RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID);

        // Create order via Razorpay API
        const order = await razorpayInstance.orders.create(options);
        console.log("[SERVER PAY] Razorpay API response order:", order);

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
            keyId: process.env.RAZORPAY_KEY_ID,
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

        console.log("[SERVER PAY] Verifying payment for order:", razorpay_order_id);
        console.log("[SERVER PAY] Received signatures - payment_id:", razorpay_payment_id, "signature:", razorpay_signature);

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

        console.log("[SERVER PAY] expectedSignature:", expectedSignature);
        console.log("[SERVER PAY] razorpay_signature:", razorpay_signature);

        // Check if both signatures match
        const isAuthentic = expectedSignature === razorpay_signature;
        console.log("[SERVER PAY] isAuthentic:", isAuthentic);

        if (isAuthentic) {
            // IDEMPOTENCY: Check if payment already processed (prevents duplicate orders)
            const existingPayment = await Payment.findOne({ razorpay_order_id });

            if (!existingPayment) {
                res.status(404).json({ success: false, message: 'Payment record not found' });
                return;
            }

            if (existingPayment.status === 'successful' && existingPayment.orderIds.length > 0) {
                // Already processed - return existing orders
                res.status(200).json({
                    success: true,
                    message: 'Payment already verified, orders exist',
                    orderIds: existingPayment.orderIds,
                    alreadyProcessed: true
                });
                return;
            }

            // Update the payment record in MongoDB to specify success
            const paymentRecord = await Payment.findOneAndUpdate(
                { razorpay_order_id },
                {
                    razorpay_payment_id,
                    razorpay_signature,
                    status: 'successful'
                },
                { new: true }
            );

            if (!paymentRecord) {
                res.status(404).json({ success: false, message: 'Payment record not found' });
                return;
            }

            // Create orders from cart after successful payment
            try {
                const cart = await Cart.findOne({ user: paymentRecord.userId }).populate("items.product");

                if (cart && cart.items.length > 0) {
                    const items = cart.items
                        .filter(item => item && item.product)
                        .map(item => ({
                            product: item.product._id,
                            quantity: item.quantity,
                        }));

                    const createdOrders = await createOrdersFromCart({
                        userId: paymentRecord.userId,
                        items,
                    });

                    // Link orders to payment for traceability
                    const orderIds = createdOrders.map(o => o._id);
                    await Payment.findByIdAndUpdate(paymentRecord._id, {
                        $addToSet: { orderIds: { $each: orderIds } }
                    });

                    console.log(`[Payment ${razorpay_order_id}] Created ${createdOrders.length} order(s) for user ${paymentRecord.userId}`);

                    res.status(200).json({
                        success: true,
                        message: 'Payment verified successfully, orders created',
                        orderIds,
                        ordersCount: createdOrders.length
                    });
                } else {
                    // No cart items - payment verified but no orders to create
                    console.log(`[Payment ${razorpay_order_id}] Verified but cart empty for user ${paymentRecord.userId}`);
                    res.status(200).json({
                        success: true,
                        message: 'Payment verified successfully (cart was empty)',
                        orderIds: []
                    });
                }
            } catch (orderError: any) {
                // Payment verified but order creation failed - log error, don't fail payment
                console.error(`[Payment ${razorpay_order_id}] Order creation failed:`, orderError);
                res.status(200).json({
                    success: true,
                    message: 'Payment verified but order creation failed. Contact support.',
                    error: orderError.message
                });
            }
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
