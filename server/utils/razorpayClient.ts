import Razorpay from 'razorpay';
import dotenv from 'dotenv';

const key_id = process.env.RAZORPAY_KEY_ID;
const key_secret = process.env.RAZORPAY_KEY_SECRET;

if (!key_id || !key_secret) {
    console.warn("⚠️ RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not defined in .env");
}

/**
 * Global Razorpay instance initialized securely with environment variables.
 */
export const razorpayInstance = new Razorpay({
    key_id: key_id || "MISSING_KEY",
    key_secret: key_secret || "MISSING_SECRET",
});
