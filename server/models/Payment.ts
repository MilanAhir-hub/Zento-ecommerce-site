import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
    userId: mongoose.Types.ObjectId;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    amount: number;
    currency: string;
    status: 'created' | 'successful' | 'failed';
    createdAt: Date;
    updatedAt: Date;
}

const paymentSchema: Schema<IPayment> = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    razorpay_order_id: {
        type: String,
        required: true
    },
    razorpay_payment_id: {
        type: String,
        required: false // Not present immediately on order creation
    },
    razorpay_signature: {
        type: String,
        required: false
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'INR'
    },
    status: {
        type: String,
        enum: ['created', 'successful', 'failed'],
        default: 'created'
    }
}, { timestamps: true });

export const Payment = mongoose.model<IPayment>('Payment', paymentSchema);
