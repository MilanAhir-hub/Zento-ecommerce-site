import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/cart/useCart";
import { useAuth } from "../../context/authContext";
import toast from "react-hot-toast";
import { HugeiconsIcon } from "@hugeicons/react";
import { Loading03Icon, Shield01Icon } from "@hugeicons/core-free-icons";
import Button from "../../components/ui/Button";

import { createRazorpayOrder, verifyRazorpayPayment } from "../../services/payment.api";
import { loadRazorpayScript } from "../../utils/loadRazorpay";

declare global {
    interface Window {
        Razorpay: any;
    }
}

const Checkout = () => {
    const { cart, isCartLoading } = useCart();
    const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (!isAuthLoading && !isAuthenticated) {
            navigate("/login", { state: { returnTo: "/checkout" } });
        }
    }, [isAuthenticated, isAuthLoading, navigate]);

    // Derived cart values
    const items = cart?.items || [];
    const subtotal = items.reduce((t, i) => t + i.product.price * i.quantity, 0);
    const shipping = subtotal > 50000 || subtotal === 0 ? 0 : 500;
    const total = subtotal + shipping;

    const handlePayment = async () => {
        if (!user) {
            toast.error("Please login to proceed.");
            return;
        }

        if (total === 0) {
            toast.error("Your cart is empty.");
            return;
        }

        setIsProcessing(true);

        try {
            // 1. Load Razorpay Script Dynamically
            const isLoaded = await loadRazorpayScript();
            if (!isLoaded) {
                toast.error("Razorpay SDK failed to load. Are you online?");
                setIsProcessing(false);
                return;
            }

            // 2. Create Order from Backend
            const orderResponse = await createRazorpayOrder(total);
            if (!orderResponse.success) {
                toast.error("Could not create order.");
                setIsProcessing(false);
                return;
            }

            // 3. Initialize Razorpay Options
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_XXXXXXXXX", // Replace with env variable in production
                amount: orderResponse.amount,
                currency: orderResponse.currency,
                name: "TogetherBuy",
                description: "Purchase Transaction",
                order_id: orderResponse.orderId,
                handler: async function (response: any) {
                    try {
                        const verifyResult = await verifyRazorpayPayment(
                            response.razorpay_order_id,
                            response.razorpay_payment_id,
                            response.razorpay_signature,
                            total
                        );

                        if (verifyResult.success) {
                            toast.success("Payment Successful! 🎉");
                            // TODO: Clear cart & redirect to success page
                            navigate("/user/home");
                        } else {
                            toast.error("Payment Verification Failed.");
                        }
                    } catch (err) {
                        console.error(err);
                        toast.error("Payment verification error.");
                    }
                },
                prefill: {
                    name: user.name || "Customer",
                    email: user.email || "",
                    contact: "" // Can fetch from generic profile config if available
                },
                theme: {
                    color: "#0071e3" // Apple style blue
                }
            };

            const paymentObject = new window.Razorpay(options);

            paymentObject.on("payment.failed", function (response: any) {
                console.error("Payment Failed:", response.error);
                toast.error(`Payment Failed: ${response.error.description}`);
            });

            paymentObject.open();

        } catch (error: any) {
            console.error("Checkout Error:", error);
            toast.error("Something went wrong during checkout.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (isAuthLoading || isCartLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <HugeiconsIcon icon={Loading03Icon} size={22} className="animate-spin text-[#86868b]" />
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-[22px] font-semibold text-[#1d1d1f] mb-2">Cart is empty</h1>
                <p className="text-[14px] text-[#6e6e73] mb-6">You cannot checkout an empty cart.</p>
                <Button onClick={() => navigate("/products")} className="px-5 py-2.5 rounded-full bg-[#0071e3]! text-white text-[13px]">
                    Return to Shop
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-[800px] mx-auto px-4 py-10 space-y-10">
            <h1 className="text-[28px] font-semibold text-[#1d1d1f]">Checkout</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Order Summary */}
                <div className="bg-[#f5f5f7] p-6 rounded-2xl">
                    <h2 className="text-[18px] font-medium mb-4">Order Summary</h2>
                    <div className="space-y-4 mb-6 text-[14px]">
                        {items.map((item) => (
                            <div key={item.product._id} className="flex justify-between text-[#1d1d1f]">
                                <span>{item.quantity} x {item.product.title.substring(0, 25)}...</span>
                                <span>₹{(item.product.price * item.quantity).toLocaleString("en-IN")}</span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-[#d2d2d7] pt-4 space-y-2 text-[14px]">
                        <div className="flex justify-between text-[#6e6e73]">
                            <span>Subtotal</span>
                            <span>₹{subtotal.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex justify-between text-[#6e6e73]">
                            <span>Shipping</span>
                            <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                        </div>
                        <div className="flex justify-between font-medium text-[#1d1d1f] text-[18px] pt-4">
                            <span>Total to Pay</span>
                            <span>₹{total.toLocaleString("en-IN")}</span>
                        </div>
                    </div>
                </div>

                {/* Payment Action */}
                <div className="flex flex-col justify-center space-y-6">
                    <div className="flex items-center gap-2 text-[#0071e3]">
                        <HugeiconsIcon icon={Shield01Icon} size={20} />
                        <span className="text-[14px] font-medium">Safe & Secure Payment</span>
                    </div>

                    <p className="text-[13px] text-[#6e6e73] leading-relaxed">
                        By proceeding to pay, you will be redirected to Razorpay's secure checkout gateway.
                        Your payment details are fully encrypted.
                    </p>

                    <Button
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className="w-full py-4 rounded-full bg-[#0071e3]! text-white font-medium text-[15px] flex justify-center items-center gap-2 transition hover:bg-[#005bb5]"
                    >
                        {isProcessing ? (
                            <>
                                <HugeiconsIcon icon={Loading03Icon} size={18} className="animate-spin" />
                                Processing...
                            </>
                        ) : (
                            `Pay ₹${total.toLocaleString("en-IN")}`
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
