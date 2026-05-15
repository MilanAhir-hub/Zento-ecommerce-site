import { HugeiconsIcon } from "@hugeicons/react";
import { PackageIcon, ShoppingBag01Icon } from "@hugeicons/core-free-icons";
import { Link } from "react-router-dom";

const MyOrders = () => {
    // Placeholder for real orders data
    const orders = [];

    if (orders.length === 0) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-20 text-center animate-in fade-in duration-700">
                <div className="w-24 h-24 rounded-full bg-[#f5f5f7] flex items-center justify-center mb-8 border border-[#d2d2d7]/30 shadow-sm">
                    <HugeiconsIcon icon={PackageIcon} size={40} className="text-[#86868b]" />
                </div>

                <h1 className="text-[32px] font-semibold text-[#1d1d1f] tracking-tight mb-3">
                    No orders yet
                </h1>

                <p className="text-[17px] text-[#86868b] max-w-md mx-auto mb-10 leading-relaxed">
                    Once you've made a purchase, your order history and tracking information will appear here.
                </p>

                <Link
                    to="/products"
                    className="inline-flex items-center gap-2 bg-[#0071e3] text-white px-8 py-3.5 rounded-full text-[15px] font-medium hover:bg-[#0077ed] transition-all active:scale-[0.98] shadow-md shadow-[#0071e3]/20"
                >
                    <HugeiconsIcon icon={ShoppingBag01Icon} size={18} />
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-[1000px] mx-auto px-6 py-16">
            <div className="flex items-center gap-4 mb-12">
                <div className="w-12 h-12 rounded-2xl bg-[#0071e3]/10 text-[#0071e3] flex items-center justify-center">
                    <HugeiconsIcon icon={PackageIcon} size={24} />
                </div>
                <h1 className="text-[32px] font-semibold text-[#1d1d1f] tracking-tight">Your Orders</h1>
            </div>

            {/* Orders list would go here */}
            <div className="grid gap-6">
                {/* Coming Soon / Prototype state */}
                <div className="bg-white rounded-3xl p-8 border border-[#d2d2d7]/30 text-center">
                    <p className="text-[#86868b]">Order tracking and history is being prepared for your account.</p>
                </div>
            </div>
        </div>
    );
};

export default MyOrders;
