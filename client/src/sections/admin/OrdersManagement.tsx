import { HugeiconsIcon } from "@hugeicons/react";
import { ShoppingBag01Icon, Loading03Icon } from "@hugeicons/core-free-icons";
import { useAdminOrders, useUpdateOrder } from "../../hooks/admin/useAdmin";
import Select from "../../components/ui/Select";

const OrdersManagement = () => {
    const { data: orders, isLoading } = useAdminOrders();
    const updateOrder = useUpdateOrder();

    return (
        <div className="bg-white rounded-4xl border border-[#d2d2d7]/30 overflow-hidden flex flex-col h-full min-h-[500px] shadow-sm">
            <div className="px-8 py-6 border-b border-[#f5f5f7] flex items-center justify-between shrink-0">
                <h2 className="text-[18px] font-bold text-[#1d1d1f] flex items-center gap-3">
                    <HugeiconsIcon icon={ShoppingBag01Icon} size={24} className="text-[#0071e3]" />
                    Orders Management
                </h2>
                <div className="flex gap-2">
                    <button className="text-[13px] font-bold text-[#1d1d1f] bg-[#f5f5f7] px-5 py-2.5 rounded-2xl hover:bg-[#d2d2d7]/30 transition-all border border-[#d2d2d7]/50">Export Report</button>
                </div>
            </div>
            <div className="p-4 flex-1 overflow-x-auto">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <HugeiconsIcon icon={Loading03Icon} size={32} className="text-[#0071e3] animate-spin mb-4" />
                        <p className="text-[14px] font-medium text-[#86868b]">Loading order history...</p>
                    </div>
                ) : !orders || orders.length === 0 ? (
                    <div className="p-12 flex-1 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-[#f5f5f7] rounded-full flex items-center justify-center mb-6">
                            <HugeiconsIcon icon={ShoppingBag01Icon} size={40} className="text-[#c1c1c7]" />
                        </div>
                        <h3 className="text-[18px] font-bold text-[#1d1d1f] mb-1">Queue is empty</h3>
                        <p className="text-[#86868b] text-[14px] max-w-[280px]">New customer orders will appear here in real-time as they are validated.</p>
                    </div>
                ) : (
                    <table className="w-full text-left min-w-[600px]">
                        <thead>
                            <tr className="border-b border-[#f5f5f7]">
                                <th className="py-4 px-6 text-[11px] font-bold text-[#86868b] uppercase tracking-widest">ID</th>
                                <th className="py-4 px-6 text-[11px] font-bold text-[#86868b] uppercase tracking-widest">Customer</th>
                                <th className="py-4 px-6 text-[11px] font-bold text-[#86868b] uppercase tracking-widest">Placement Date</th>
                                <th className="py-4 px-6 text-[11px] font-bold text-[#86868b] uppercase tracking-widest">Total Gross</th>
                                <th className="py-4 px-6 text-[11px] font-bold text-[#86868b] uppercase tracking-widest">Fulfillment</th>
                                <th className="py-4 px-6 text-[11px] font-bold text-[#86868b] uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f5f5f7]">
                            {orders.map((order: any) => (
                                <tr key={order._id} className="hover:bg-[#fbfbfd] transition-colors group">
                                    <td className="py-5 px-6 font-mono text-[11px] font-bold text-[#1d1d1f] tracking-tighter opacity-60">#{order._id.substring(order._id.length - 8).toUpperCase()}</td>
                                    <td className="py-5 px-6">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-[14px] text-[#1d1d1f]">{order.user?.name || 'Guest User'}</span>
                                            <span className="text-[11px] text-[#86868b]">Verified Customer</span>
                                        </div>
                                    </td>
                                    <td className="py-5 px-6 text-[13px] font-medium text-[#1d1d1f]">{new Date(order.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                                    <td className="py-5 px-6 font-bold text-[14px] text-[#1d1d1f]">₹{order.totalAmount.toLocaleString()}</td>
                                    <td className="py-5 px-6">
                                    <Select
                                        value={order.status}
                                        onChange={(val) => updateOrder.mutate({ id: order._id, status: val })}
                                        disabled={updateOrder.isPending}
                                        options={[
                                            { value: "Pending", label: "PENDING" },
                                            { value: "Processing", label: "PROCESSING" },
                                            { value: "Shipped", label: "SHIPPED" },
                                            { value: "Delivered", label: "DELIVERED" },
                                            { value: "Cancelled", label: "CANCELLED" }
                                        ]}
                                        className="w-[140px]"
                                        triggerClassName={`
                                            !py-1.5 !px-4 !font-black !rounded-full !text-[10px] !tracking-widest
                                            ${order.status === 'Delivered' ? '!bg-green-50 !text-green-600' :
                                                order.status === 'Processing' ? '!bg-[#0071e3]/5 !text-[#0071e3]' :
                                                    order.status === 'Cancelled' ? '!bg-red-50 !text-[#ff453a]' :
                                                        '!bg-orange-50 !text-orange-500'
                                            }
                                        `}
                                    />
                                    </td>
                                    <td className="py-5 px-6 text-right">
                                        <button className="text-[12px] font-bold text-[#0071e3] opacity-0 group-hover:opacity-100 transition-all hover:underline">Manage</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default OrdersManagement;
