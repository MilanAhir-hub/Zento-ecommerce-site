import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { PackageIcon, Loading03Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { Link } from "react-router-dom";
import { useOrders } from "../../hooks/user/useOrders";
import { getCloudinaryUrl } from "../../utils/cloudinaryImage";

const MyOrders = () => {
    const [page, setPage] = useState(1);
    const { orders, isLoading, totalPages, cancelOrder, isCancelling } = useOrders(page, 5);

    const handleCancel = async (orderId: string) => {
        if (window.confirm("Are you sure you want to cancel this order?")) {
            await cancelOrder(orderId);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Pending":
                return "bg-amber-50 text-amber-800 border-amber-200/50";
            case "Processing":
                return "bg-blue-50 text-blue-800 border-blue-200/50";
            case "Shipped":
                return "bg-indigo-50 text-indigo-800 border-indigo-200/50";
            case "Delivered":
                return "bg-emerald-50 text-emerald-800 border-emerald-200/50";
            case "Cancelled":
                return "bg-rose-50 text-rose-800 border-rose-200/50";
            default:
                return "bg-gray-50 text-gray-800 border-gray-200";
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center">
                <HugeiconsIcon icon={Loading03Icon} size={24} className="animate-spin text-black mb-4" />
                <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-gray-400">
                    Loading your orders
                </span>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-20 text-center animate-in fade-in duration-700">
                <div className="w-20 h-20 bg-gray-50 flex items-center justify-center mb-8 border border-gray-100 shadow-sm">
                    <HugeiconsIcon icon={PackageIcon} size={32} className="text-gray-400" />
                </div>

                <h1 className="text-[28px] font-light text-black tracking-tight mb-4">
                    No orders yet
                </h1>

                <p className="text-[14px] text-gray-500 max-w-sm mx-auto mb-10 leading-relaxed">
                    Once you've made a purchase, your order history and tracking information will appear here.
                </p>

                <Link
                    to="/products"
                    className="inline-flex items-center justify-center bg-black text-white px-8 py-3.5 rounded-none text-[11px] font-medium uppercase tracking-[0.15em] hover:bg-gray-900 transition-all duration-200 active:scale-[0.98]"
                >
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-[1000px] mx-auto px-4 md:px-10 py-12 md:py-16">
            {/* Header */}
            <header className="mb-12">
                <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-gray-400 block mb-3">
                    Purchases
                </span>
                <h1 className="text-[36px] md:text-[44px] font-light text-black tracking-[0.02em]">
                    Your Orders
                </h1>
            </header>

            {/* Orders List */}
            <div className="space-y-10">
                {orders.map((order) => (
                    <div 
                        key={order._id} 
                        className="bg-white border border-gray-100 p-6 md:p-8 hover:shadow-sm transition-all duration-300"
                    >
                        {/* Order Metadata Header */}
                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 pb-6 border-b border-gray-100 mb-6">
                            <div className="space-y-1">
                                <span className="text-[11px] font-mono text-gray-400 block uppercase">
                                    Order ID: {order._id}
                                </span>
                                <span className="text-[13px] text-gray-500 block">
                                    Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </span>
                            </div>

                            <div className="flex items-center gap-4 flex-wrap">
                                <span className={`text-[11px] font-medium uppercase tracking-[0.1em] px-3 py-1 border ${getStatusColor(order.status)}`}>
                                    {order.status}
                                </span>
                                <span className="text-[16px] font-medium text-black">
                                    ₹{order.totalAmount.toLocaleString("en-IN")}
                                </span>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-6">
                            {order.items.map((item) => (
                                <div key={item.product?._id} className="flex gap-4 md:gap-6 items-start">
                                    {/* Image */}
                                    <div className="w-16 h-20 bg-[#F9F9F9] overflow-hidden shrink-0 border border-gray-100">
                                        {item.product?.imageUrl ? (
                                            <img
                                                src={getCloudinaryUrl(item.product.imageUrl, { width: 150 })}
                                                alt={item.product.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                                <HugeiconsIcon icon={PackageIcon} size={20} className="text-gray-300" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0">
                                        {item.product ? (
                                            <Link
                                                to={`/products/${item.product._id}`}
                                                className="text-[14px] font-normal text-black hover:underline underline-offset-4 line-clamp-1"
                                            >
                                                {item.product.title}
                                            </Link>
                                        ) : (
                                            <span className="text-[14px] text-gray-400 italic">Product no longer available</span>
                                        )}
                                        <p className="text-[12px] text-gray-500 mt-1">
                                            Qty: {item.quantity} × ₹{item.price.toLocaleString("en-IN")}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Actions */}
                        {(order.status === "Pending" || order.status === "Processing") && (
                            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                                <button
                                    onClick={() => handleCancel(order._id)}
                                    disabled={isCancelling}
                                    className="inline-flex items-center gap-2 border border-gray-200 text-gray-600 hover:text-black hover:border-black px-4 py-2 text-[11px] font-medium uppercase tracking-[0.1em] transition-all duration-200 disabled:opacity-40"
                                >
                                    <HugeiconsIcon icon={Cancel01Icon} size={12} />
                                    Cancel Order
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-12">
                    <button
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                        disabled={page === 1}
                        className="px-4 py-2 border border-gray-200 text-[11px] uppercase tracking-[0.1em] hover:border-black disabled:opacity-30 disabled:hover:border-gray-200 transition-all duration-200"
                    >
                        Previous
                    </button>
                    <span className="text-[12px] text-gray-500">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                        disabled={page === totalPages}
                        className="px-4 py-2 border border-gray-200 text-[11px] uppercase tracking-[0.1em] hover:border-black disabled:opacity-30 disabled:hover:border-gray-200 transition-all duration-200"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default MyOrders;
