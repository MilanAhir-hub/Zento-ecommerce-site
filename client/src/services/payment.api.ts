import api from "./api";

export const createRazorpayOrder = async (amount: number) => {
    const { data } = await api.post("/payment/create-order", { amount });
    return data;
};

export const verifyRazorpayPayment = async (
    razorpay_order_id: string,
    razorpay_payment_id: string,
    razorpay_signature: string,
    amount: number
) => {
    const { data } = await api.post("/payment/verify", {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        amount
    });
    return data;
};
