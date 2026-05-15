import { HugeiconsIcon } from "@hugeicons/react";
import {
    Search01Icon,
    ShoppingBag01Icon,
    Loading03Icon,
    Alert01Icon,
} from "@hugeicons/core-free-icons";
import { useVendorOrders, useUpdateVendorOrderStatus } from "../../../../hooks/vendor/useVendorHooks";
import { useState } from "react";
import Select from "../../../../components/ui/Select";

const Orders = () => {
    const { data: orders, isLoading, isError, error, refetch } = useVendorOrders();
    const updateStatusMutation = useUpdateVendorOrderStatus();

    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-[#fffbeb] text-[#92400e] border-[#fef3c7]';
            case 'Shipped': return 'bg-[#eff6ff] text-[#1d4ed8] border-[#dbeafe]';
            case 'Delivered': return 'bg-[#f0fdf4] text-[#166534] border-[#dcfce7]';
            case 'Cancelled': return 'bg-[#fef2f2] text-[#b91c1c] border-[#fee2e2]';
            default: return 'bg-[#f5f5f7] text-[#86868b] border-[#e5e5ea]';
        }
    };

    const handleStatusChange = async (id: string, status: string) => {
        try {
            await updateStatusMutation.mutateAsync({ id, status });
        } catch {
            console.error("Failed");
        }
    };

    const filteredOrders = orders?.filter(order => {
        const matchSearch =
            order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.user.name.toLowerCase().includes(searchQuery.toLowerCase());

        const matchStatus =
            statusFilter === "all" ||
            order.status.toLowerCase() === statusFilter;

        return matchSearch && matchStatus;
    }) || [];

    // LOADING
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[420px] gap-4">
                <HugeiconsIcon icon={Loading03Icon} size={26} className="animate-spin text-[#0071e3]" />
                <p className="text-[#86868b] text-sm">Loading orders…</p>
            </div>
        );
    }

    // ERROR
    if (isError) {
        return (
            <div className="bg-white border border-[#e5e5ea] p-10 rounded-[28px] text-center space-y-4 shadow-sm">
                <HugeiconsIcon icon={Alert01Icon} size={26} className="text-[#ff3b30] mx-auto" />
                <h3 className="text-[#1d1d1f] font-semibold">Unable to load orders</h3>
                <p className="text-[#86868b] text-sm">{(error as any)?.message}</p>
                <button
                    onClick={() => refetch()}
                    className="px-6 py-2 rounded-full bg-[#1d1d1f] text-white text-sm"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-in fade-in duration-700 pb-20">

            {/* HEADER */}
            <div>
                <h2 className="text-[36px] font-semibold text-[#1d1d1f] tracking-tight">
                    Orders
                </h2>
                <p className="text-[#86868b] text-[15px] mt-1">
                    {orders?.length || 0} total orders
                </p>
            </div>

            {/* MAIN CARD */}
            <div className="relative rounded-[36px] border border-black/5 bg-gradient-to-b from-white to-[#f5f5f7] shadow-[0_10px_60px_-20px_rgba(0,0,0,0.08)] overflow-hidden">

                {/* glow */}
                <div className="absolute -top-20 -right-20 w-72 h-72 bg-[#0071e3]/10 blur-3xl rounded-full"></div>

                {/* FILTER BAR */}
                <div className="p-6 flex flex-col md:flex-row gap-4 border-b border-[#f0f0f0]">

                    {/* SEARCH */}
                    <div className="relative flex-1 group">
                        <HugeiconsIcon icon={Search01Icon} size={16}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#86868b] group-focus-within:text-[#0071e3]" />
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search orders"
                            className="w-full pl-10 pr-4 py-3 rounded-full bg-white border border-[#e5e5ea] text-sm outline-none focus:ring-4 focus:ring-[#0071e3]/10"
                        />
                    </div>

                    {/* FILTER */}
                    <Select
                        value={statusFilter}
                        onChange={(val) => setStatusFilter(val)}
                        options={[
                            { value: "all", label: "All" },
                            { value: "pending", label: "Pending" },
                            { value: "shipped", label: "Shipped" },
                            { value: "delivered", label: "Delivered" },
                            { value: "cancelled", label: "Cancelled" }
                        ]}
                        className="w-[160px]"
                    />
                </div>

                {/* TABLE */}
                <div className="hidden lg:block">
                    {filteredOrders.length > 0 ? (
                        <table className="w-full">
                            <thead className="text-xs text-[#86868b] uppercase border-b">
                                <tr>
                                    <th className="px-8 py-4 text-left">Order</th>
                                    <th>Customer</th>
                                    <th>Items</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th className="text-right px-8">Update</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredOrders.map(o => (
                                    <tr key={o._id} className="hover:bg-white/60 transition">
                                        <td className="px-8 py-5 font-semibold">
                                            #{o._id.slice(-6).toUpperCase()}
                                        </td>

                                        <td className="text-sm">
                                            <p className="font-semibold">{o.user.name}</p>
                                            <p className="text-[#86868b]">{o.user.email}</p>
                                        </td>

                                        <td className="text-center">{o.items.length}</td>
                                        <td className="text-center font-medium">₹{o.totalAmount}</td>

                                        <td className="text-center">
                                            <span className={`px-3 py-1 text-xs rounded-full border ${getStatusStyles(o.status)}`}>
                                                {o.status}
                                            </span>
                                        </td>

                                        <td className="px-8 text-right">
                                            <Select
                                                value={o.status}
                                                onChange={(val) => handleStatusChange(o._id, val)}
                                                options={["Pending", "Shipped", "Delivered", "Cancelled"]}
                                                className="w-[120px]"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="py-24 text-center">
                            <HugeiconsIcon icon={ShoppingBag01Icon} size={40} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="text-lg font-semibold">No orders yet</h3>
                            <p className="text-[#86868b] text-sm mt-2">
                                Orders will appear here
                            </p>
                        </div>
                    )}
                </div>

                {/* MOBILE */}
                <div className="lg:hidden p-4 space-y-4">
                    {filteredOrders.map(o => (
                        <div key={o._id} className="bg-white p-4 rounded-2xl shadow-sm">
                            <div className="flex justify-between">
                                <p className="font-semibold">#{o._id.slice(-6)}</p>
                                <span className="text-xs">{o.status}</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{o.user.name}</p>
                            <p className="text-sm mt-2">₹{o.totalAmount}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Orders;
