import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../../hooks/cart/useCart";
import { useAuth } from "../../context/authContext";
import toast from "react-hot-toast";
import { HugeiconsIcon } from "@hugeicons/react";
import { Loading03Icon, Shield01Icon, ArrowRight01Icon, LockIcon } from "@hugeicons/core-free-icons";
import Button from "../../components/ui/Button";
import BlurImage from "../../components/ui/BlurImage";
import { getCloudinaryUrl } from "../../utils/cloudinaryImage";

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
    const items = (cart?.items || []).filter((item) => item && item.product);
    const subtotal = items.reduce((t, i) => t + i.product.price * i.quantity, 0);
    const shipping = subtotal > 50000 || subtotal === 0 ? 0 : 500;
    const total = subtotal + shipping;
    const itemCount = items.reduce((t, i) => t + i.quantity, 0);

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
            const isLoaded = await loadRazorpayScript();
            if (!isLoaded) {
                toast.error("Razorpay SDK failed to load. Are you online?");
                setIsProcessing(false);
                return;
            }

            const orderResponse = await createRazorpayOrder(total);
            console.log("createRazorpayOrder response:", orderResponse);
            if (!orderResponse.success) {
                toast.error("Could not create order.");
                setIsProcessing(false);
                return;
            }

            const options = {
                key: orderResponse.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_XXXXXXXXX",
                amount: orderResponse.amount,
                currency: orderResponse.currency,
                name: "NOVARA",
                description: "Purchase Transaction",
                order_id: orderResponse.orderId,
                handler: async function (response: any) {
                    try {
                        console.log("[CLIENT PAY] Razorpay payment handler response:", response);
                        const verifyResult = await verifyRazorpayPayment(
                            response.razorpay_order_id,
                            response.razorpay_payment_id,
                            response.razorpay_signature,
                            total
                        );
                        console.log("[CLIENT PAY] Verification result from server:", verifyResult);

                        if (verifyResult.success) {
                            // Check if orders were created or already exist
                            if (verifyResult.orderIds && verifyResult.orderIds.length > 0) {
                                toast.success("Payment Successful! Order(s) created.");
                            } else if (verifyResult.alreadyProcessed) {
                                toast.success("Payment already processed. Orders exist.");
                            } else {
                                toast.success("Payment verified! Redirecting to orders...");
                            }
                            navigate("/user/orders");
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
                },
                theme: {
                    color: "#000000",
                },
            };

            console.log("Razorpay options:", options);
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
                <div className="flex flex-col items-center gap-4">
                    <HugeiconsIcon icon={Loading03Icon} size={22} className="animate-spin text-black" />
                    <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-gray-400">
                        Preparing checkout
                    </span>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
                <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-gray-400 mb-4">
                    Empty Bag
                </span>
                <h1 className="text-[28px] md:text-[36px] font-light text-black mb-4">
                    Nothing to checkout
                </h1>
                <p className="text-[14px] text-gray-500 mb-10 max-w-sm">
                    Your bag is empty. Discover our collection and add pieces that speak to your personal aesthetic.
                </p>
                <Link
                    to="/products"
                    className="text-[11px] font-medium uppercase tracking-[0.15em] text-black pb-2 border-b border-black hover:border-transparent transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]"
                >
                    Begin Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-[1200px] mx-auto px-4 md:px-10 py-12 md:py-16">
            {/* Breadcrumb */}
            <nav className="flex items-center text-[11px] font-medium text-gray-400 mb-10 tracking-[0.12em] uppercase">
                <Link to="/" className="hover:text-black transition-colors duration-200">Home</Link>
                <HugeiconsIcon icon={ArrowRight01Icon} size={10} className="mx-2 opacity-40" />
                <Link to="/cart" className="hover:text-black transition-colors duration-200">Bag</Link>
                <HugeiconsIcon icon={ArrowRight01Icon} size={10} className="mx-2 opacity-40" />
                <span className="text-black">Checkout</span>
            </nav>

            {/* Editorial Divider */}
            <div className="w-12 h-px bg-black mb-6" />

            {/* Header */}
            <header className="mb-12 md:mb-16">
                <h1 className="text-[36px] md:text-[48px] font-light text-black tracking-[0.02em] mb-2">
                    Checkout
                </h1>
                <p className="text-[13px] text-gray-500 font-normal">
                    {itemCount} {itemCount === 1 ? 'piece' : 'pieces'} selected
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
                {/* Order Summary */}
                <div className="lg:col-span-7">
                    {/* Summary Header */}
                    <div className="mb-8">
                        <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-gray-400 block mb-3">
                            Order Summary
                        </span>
                        <div className="h-px bg-black w-8" />
                    </div>

                    {/* Items List */}
                    <div className="space-y-0">
                        {items.map((item) => (
                            <div key={item.product._id} className="flex gap-5 py-6 border-b border-gray-100 last:border-b-0">
                                {/* Image */}
                                <div className="w-20 h-28 bg-[#F9F9F9] overflow-hidden shrink-0">
                                    <BlurImage
                                        src={getCloudinaryUrl(item.product.imageUrl || "", { width: 200 })}
                                        alt={item.product.title}
                                        wrapperClassName="w-full h-full"
                                        className="object-cover"
                                    />
                                </div>

                                {/* Details */}
                                <div className="flex-1 min-w-0 flex flex-col justify-between">
                                    <div>
                                        <Link
                                            to={`/products/${item.product._id}`}
                                            className="text-[14px] font-normal text-black line-clamp-1 hover:underline underline-offset-4 transition-all duration-200"
                                        >
                                            {item.product.title}
                                        </Link>
                                        <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-gray-400 mt-1">
                                            {item.product.category}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[12px] text-gray-500">Qty: {item.quantity}</span>
                                        <span className="text-[14px] font-medium tabular-nums text-black">
                                            ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Back to bag */}
                    <div className="mt-8 pt-6">
                        <Link
                            to="/cart"
                            className="text-[11px] font-medium uppercase tracking-[0.15em] text-black pb-1 border-b border-black hover:border-transparent transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]"
                        >
                            Return to Bag
                        </Link>
                    </div>
                </div>

                {/* Payment Column */}
                <div className="lg:col-span-5">
                    <div className="lg:sticky lg:top-32">
                        {/* Summary Header */}
                        <div className="mb-8">
                            <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-gray-400 block mb-3">
                                Payment Summary
                            </span>
                            <div className="h-px bg-black w-8" />
                        </div>

                        {/* Price Breakdown */}
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-[13px]">
                                <span className="text-gray-500 font-normal">Subtotal</span>
                                <span className="font-medium tabular-nums">₹{subtotal.toLocaleString("en-IN")}</span>
                            </div>

                            <div className="flex justify-between text-[13px]">
                                <span className="text-gray-500 font-normal">Shipping</span>
                                <span className="font-medium">
                                    {shipping === 0 ? (
                                        <span className="text-black">Complimentary</span>
                                    ) : (
                                        <span className="tabular-nums">₹{shipping.toLocaleString("en-IN")}</span>
                                    )}
                                </span>
                            </div>

                            {shipping > 0 && (
                                <p className="text-[11px] text-gray-400 font-normal italic">
                                    Complimentary shipping on orders above ₹50,000
                                </p>
                            )}

                            {/* Divider */}
                            <div className="h-px bg-gray-200 my-6" />

                            <div className="flex justify-between items-baseline">
                                <span className="text-[14px] font-medium text-black uppercase tracking-[0.08em]">
                                    Total
                                </span>
                                <span className="text-[24px] font-medium tabular-nums text-black">
                                    ₹{total.toLocaleString("en-IN")}
                                </span>
                            </div>
                        </div>

                        {/* Security Note */}
                        <div className="flex items-center gap-3 mb-6 p-4 border border-gray-200">
                            <HugeiconsIcon icon={LockIcon} size={16} className="text-gray-400 shrink-0" />
                            <p className="text-[12px] text-gray-500 font-normal">
                                Your payment is encrypted and secure. We never store your card details.
                            </p>
                        </div>

                        {/* Test Mode Warning Banner */}
                        <div className="mb-6 p-4 bg-amber-50/60 border border-amber-200/50 text-amber-900">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-800 block mb-1">
                                Test Mode Active
                            </span>
                            <p className="text-[12px] font-normal leading-relaxed text-amber-800 mb-2">
                                Real or international cards are not processed. Please use Razorpay's domestic sandbox cards:
                            </p>
                            <ul className="text-[11px] text-amber-800 space-y-1.5 font-mono">
                                <li>• <span className="font-semibold">RuPay (Domestic):</span> <code className="bg-amber-100/50 px-1 py-0.5">6527 6589 0000 1005</code></li>
                                <li>• <span className="font-semibold">Visa (Domestic):</span> <code className="bg-amber-100/50 px-1 py-0.5">4100 2800 0000 1007</code></li>
                                <li>• <span className="font-semibold">Mastercard (Domestic):</span> <code className="bg-amber-100/50 px-1 py-0.5">5500 6700 0000 1002</code></li>
                                <li>• <span className="font-semibold">Expiry:</span> <code className="bg-amber-100/50 px-1 py-0.5">12/30</code> | <span className="font-semibold">CVV:</span> <code className="bg-amber-100/50 px-1 py-0.5">123</code></li>
                                <li>• <span className="font-semibold">UPI ID:</span> <code className="bg-amber-100/50 px-1 py-0.5">success@razorpay</code></li>
                            </ul>
                        </div>

                        {/* Pay Button */}
                        <Button
                            onClick={handlePayment}
                            disabled={isProcessing}
                            className="w-full h-14 bg-black text-white text-[11px] font-medium uppercase tracking-[0.15em] hover:bg-gray-900 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] flex items-center justify-center gap-2"
                        >
                            {isProcessing ? (
                                <>
                                    <HugeiconsIcon icon={Loading03Icon} size={16} className="animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <HugeiconsIcon icon={Shield01Icon} size={16} />
                                    Pay ₹{total.toLocaleString("en-IN")}
                                </>
                            )}
                        </Button>

                        {/* Trust Indicators */}
                        <div className="mt-8 pt-8 border-t border-gray-100 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 border border-gray-200 flex items-center justify-center shrink-0">
                                    <span className="text-[10px] font-medium">SSL</span>
                                </div>
                                <p className="text-[11px] text-gray-400 font-normal">
                                    256-bit SSL encryption
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 border border-gray-200 flex items-center justify-center shrink-0">
                                    <span className="text-[10px] font-medium">PCI</span>
                                </div>
                                <p className="text-[11px] text-gray-400 font-normal">
                                    PCI DSS compliant gateway
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 border border-gray-200 flex items-center justify-center shrink-0">
                                    <span className="text-[10px] font-medium">RET</span>
                                </div>
                                <p className="text-[11px] text-gray-400 font-normal">
                                    14-day return policy
                                </p>
                            </div>
                        </div>

                        {/* Payment Methods */}
                        <div className="mt-8 pt-8 border-t border-gray-100">
                            <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-gray-400 block mb-4">
                                Accepted Methods
                            </span>
                            <div className="flex items-center gap-3 text-[12px] text-gray-500">
                                <span className="px-3 py-1 border border-gray-200 font-medium">UPI</span>
                                <span className="px-3 py-1 border border-gray-200 font-medium">Cards</span>
                                <span className="px-3 py-1 border border-gray-200 font-medium">Net Banking</span>
                                <span className="px-3 py-1 border border-gray-200 font-medium">Wallets</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
