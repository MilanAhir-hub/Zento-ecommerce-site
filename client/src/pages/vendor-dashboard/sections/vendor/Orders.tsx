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
                <HugeiconsIcon icon={Loading03Icon} size={22} className="animate-spin text-black" />
                <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-gray-400">
                    Loading orders
                </span>
            </div>
        );
    }

    // ERROR
    if (isError) {
        return (
            <div className="border border-gray-200 p-12 text-center">
                <HugeiconsIcon icon={Alert01Icon} size={32} className="text-gray-300 mx-auto mb-6" />
                <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-gray-400 block mb-3">
                    Error
                </span>
                <h3 className="text-[20px] font-light text-black mb-3">Unable to load orders</h3>
                <p className="text-[14px] text-gray-500 mb-8">{(error as any)?.message}</p>
                <button
                    onClick={() => refetch()}
                    className="px-8 py-3 bg-black text-white text-[11px] font-medium uppercase tracking-[0.15em] hover:bg-gray-900 transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-20">

            {/* HEADER */}
            <div>
                <div className="w-12 h-px bg-black mb-6" />
                <h2 className="text-[32px] md:text-[40px] font-light text-black tracking-[0.02em]">
                    Orders
                </h2>
                <p className="text-[13px] text-gray-500 font-normal mt-2">
                    {orders?.length || 0} total orders
                </p>
            </div>

            {/* FILTER BAR */}
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">

                {/* SEARCH */}
                <div className="relative w-full max-w-xs group">
                    <div className="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none">
                        <HugeiconsIcon
                            icon={Search01Icon}
                            size={15}
                            className="text-gray-400 group-focus-within:text-black transition-colors duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]"
                        />
                    </div>
                    <label htmlFor="order-search" className="sr-only">
                        Search orders
                    </label>
                    <input
                        id="order-search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search orders..."
                        className="w-full pl-7 pr-3 py-2 bg-transparent border-0 border-b border-gray-200 text-black placeholder:text-gray-300 focus:outline-none focus:border-black transition-colors duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] font-normal text-xs tracking-[0.12em] uppercase"
                    />
                </div>

                {/* STATUS FILTER */}
                <div className="flex items-center gap-3">
                    <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-gray-400">
                        Filter:
                    </span>
                    <Select
                        value={statusFilter}
                        onChange={(val) => setStatusFilter(val)}
                        options={[
                            { value: "all", label: "All" },
                            { value: "Pending", label: "Pending" },
                            { value: "Shipped", label: "Shipped" },
                            { value: "Delivered", label: "Delivered" },
                            { value: "Cancelled", label: "Cancelled" },
                        ]}
                        className="w-[130px]"
                        triggerClassName="!h-9 !text-[12px]"
                    />
                </div>
            </div>

                {/* TABLE */}
                <div className="hidden lg:block">
                    {filteredOrders.length > 0 ? (
                        <div>
                            {/* Table Header */}
                            <div className="grid grid-cols-12 gap-4 pb-4 border-b border-gray-200">
                                <div className="col-span-2 text-[11px] font-medium uppercase tracking-[0.15em] text-gray-400">
                                    Order
                                </div>
                                <div className="col-span-3 text-[11px] font-medium uppercase tracking-[0.15em] text-gray-400">
                                    Customer
                                </div>
                                <div className="col-span-2 text-[11px] font-medium uppercase tracking-[0.15em] text-gray-400 text-center">
                                    Items
                                </div>
                                <div className="col-span-2 text-[11px] font-medium uppercase tracking-[0.15em] text-gray-400 text-center">
                                    Total
                                </div>
                                <div className="col-span-3 text-[11px] font-medium uppercase tracking-[0.15em] text-gray-400 text-right">
                                    Status
                                </div>
                            </div>

                            {/* Table Rows */}
                            {filteredOrders.map((o) => (
                                <div
                                    key={o._id}
                                    className="grid grid-cols-12 gap-4 items-center py-5 border-b border-gray-100 hover:bg-[#F9F9F9] transition-colors duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]"
                                >
                                    {/* Order ID */}
                                    <div className="col-span-2 text-[14px] font-medium tabular-nums text-black">
                                        #{o._id.slice(-6).toUpperCase()}
                                    </div>

                                    {/* Customer */}
                                    <div className="col-span-3">
                                        <p className="text-[14px] font-normal text-black">{o.user.name}</p>
                                        <p className="text-[12px] text-gray-500">{o.user.email}</p>
                                    </div>

                                    {/* Items */}
                                    <div className="col-span-2 text-center text-[14px] tabular-nums text-black">
                                        {o.items.length}
                                    </div>

                                    {/* Total */}
                                    <div className="col-span-2 text-center text-[14px] font-medium tabular-nums text-black">
                                        ₹{o.totalAmount.toLocaleString("en-IN")}
                                    </div>

                                    {/* Status Update */}
                                    <div className="col-span-3 flex justify-end">
                                        <Select
                                            value={o.status}
                                            onChange={(val) => handleStatusChange(o._id, val)}
                                            options={["Pending", "Shipped", "Delivered", "Cancelled"]}
                                            className="w-[120px]"
                                            triggerClassName="!h-9 !text-[12px]"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-24 text-center">
                            <div className="w-16 h-16 border border-gray-200 flex items-center justify-center mx-auto mb-6">
                                <HugeiconsIcon icon={ShoppingBag01Icon} size={24} className="text-gray-300" />
                            </div>
                            <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-gray-400 block mb-3">
                                No orders
                            </span>
                            <h3 className="text-[20px] font-light text-black mb-3">
                                {searchQuery ? "No orders found" : "No orders yet"}
                            </h3>
                            <p className="text-[14px] text-gray-500">
                                {searchQuery ? "Try a different search term" : "Orders will appear here once customers start purchasing."}
                            </p>
                        </div>
                    )}
                </div>

                {/* MOBILE */}
                <div className="lg:hidden space-y-0">
                    {filteredOrders.map((o) => (
                        <div key={o._id} className="py-5 border-b border-gray-100">
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-[14px] font-medium tabular-nums text-black">
                                    #{o._id.slice(-6).toUpperCase()}
                                </p>
                                <Select
                                    value={o.status}
                                    onChange={(val) => handleStatusChange(o._id, val)}
                                    options={["Pending", "Shipped", "Delivered", "Cancelled"]}
                                    className="w-[110px]"
                                    triggerClassName="!h-8 !text-[11px]"
                                />
                            </div>
                            <p className="text-[13px] text-gray-500">{o.user.name}</p>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-[13px] tabular-nums text-gray-500">
                                    {o.items.length} items
                                </span>
                                <span className="text-[14px] font-medium tabular-nums text-black">
                                    ₹{o.totalAmount.toLocaleString("en-IN")}
                                </span>
                            </div>
                        </div>
                    ))}
                    {filteredOrders.length === 0 && (
                        <div className="py-12 text-center">
                            <p className="text-[14px] text-gray-500">No orders found</p>
                        </div>
                    )}
                </div>
            </div>
    );
};

export default Orders;
