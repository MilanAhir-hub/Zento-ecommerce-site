import { ShoppingBag, Loader2 } from "lucide-react";
import { useAdminOrders, useUpdateOrder } from "../../hooks/admin/useAdmin";

const OrdersManagement = () => {
    const { data: orders, isLoading } = useAdminOrders();
    const updateOrder = useUpdateOrder();

    return (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col h-full min-h-[500px]">
            <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between shrink-0">
                <h2 className="text-xl font-bold text-stone-900 flex items-center gap-3">
                    <ShoppingBag className="w-6 h-6 text-stone-400" />
                    Orders Management
                </h2>
                <div className="flex gap-2">
                    <button className="text-sm font-semibold text-stone-700 bg-stone-100 px-4 py-2 rounded-xl hover:bg-stone-200 transition-colors">Export</button>
                </div>
            </div>
            <div className="p-6 flex-1 overflow-x-auto">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
                        <Loader2 className="w-8 h-8 text-stone-300 animate-spin mb-4" />
                        <p className="text-sm font-medium text-stone-500">Loading orders...</p>
                    </div>
                ) : !orders || orders.length === 0 ? (
                    <div className="p-8 flex-1 flex flex-col items-center justify-center h-full min-h-[300px] text-center">
                        <ShoppingBag className="w-16 h-16 text-stone-200 mb-4" />
                        <h3 className="text-lg font-bold text-stone-900 mb-1">No Orders Found</h3>
                        <p className="text-stone-400 font-medium max-w-sm">When customers place orders, they will appear here for you to manage and fulfill.</p>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr className="border-b border-stone-100">
                                <th className="py-3 px-4 text-xs font-bold text-stone-400 uppercase tracking-wider">Order ID</th>
                                <th className="py-3 px-4 text-xs font-bold text-stone-400 uppercase tracking-wider">Customer</th>
                                <th className="py-3 px-4 text-xs font-bold text-stone-400 uppercase tracking-wider">Date</th>
                                <th className="py-3 px-4 text-xs font-bold text-stone-400 uppercase tracking-wider">Total</th>
                                <th className="py-3 px-4 text-xs font-bold text-stone-400 uppercase tracking-wider">Status</th>
                                <th className="py-3 px-4 text-xs font-bold text-stone-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order: any) => (
                                <tr key={order._id} className="border-b border-stone-50 hover:bg-stone-50/50 transition-colors">
                                    <td className="py-4 px-4 font-mono text-xs font-bold text-stone-900">{order._id.substring(order._id.length - 8)}</td>
                                    <td className="py-4 px-4 font-medium text-sm text-stone-700">{order.user?.name || 'Unknown'}</td>
                                    <td className="py-4 px-4 text-sm text-stone-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td className="py-4 px-4 font-bold text-sm text-stone-900">₹{order.totalAmount}</td>
                                    <td className="py-4 px-4">
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateOrder.mutate({ id: order._id, status: e.target.value })}
                                            disabled={updateOrder.isPending}
                                            className={`text-xs font-bold px-3 py-1 rounded-full border-0 cursor-pointer outline-none ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                    order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                                                        order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                            'bg-yellow-100 text-yellow-700'
                                                }`}
                                        >
                                            <option value="pending">PENDING</option>
                                            <option value="processing">PROCESSING</option>
                                            <option value="shipped">SHIPPED</option>
                                            <option value="delivered">DELIVERED</option>
                                            <option value="cancelled">CANCELLED</option>
                                        </select>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <button className="text-xs font-bold text-stone-500 hover:text-stone-900 transition-colors">View Details</button>
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
