import { TrendingUp, ShoppingBag, Users, AlertCircle, ChevronRight, Loader2 } from "lucide-react";
import { useAdminStats } from "../../hooks/admin/useAdmin";

const DashboardOverview = () => {
    const { data: stats, isLoading, isError } = useAdminStats();

    if (isLoading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-12 min-h-[400px]">
                <Loader2 className="w-12 h-12 text-stone-300 animate-spin mb-4" />
                <p className="text-stone-500 font-medium">Loading dashboard stats...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-12 min-h-[400px]">
                <AlertCircle className="w-12 h-12 text-red-300 mb-4" />
                <p className="text-red-500 font-medium text-center">Failed to load overview data.<br />Please check your connection and try again.</p>
            </div>
        );
    }

    return (
        <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Stat Card 1 */}
                <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-stone-500">Total Revenue</h3>
                        <div className="p-2 bg-stone-50 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-stone-700" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-stone-900">₹{stats?.totalRevenue?.toLocaleString() || '0'}</span>
                        <span className="text-xs font-bold text-stone-400">total</span>
                    </div>
                </div>

                {/* Stat Card 2 */}
                <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-stone-500">Active Orders</h3>
                        <div className="p-2 bg-stone-50 rounded-lg">
                            <ShoppingBag className="w-5 h-5 text-stone-700" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-stone-900">{stats?.activeOrders || '0'}</span>
                        <span className="text-xs font-bold text-stone-400">pending/shipped</span>
                    </div>
                </div>

                {/* Stat Card 3 */}
                <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-stone-500">Total Customers</h3>
                        <div className="p-2 bg-stone-50 rounded-lg">
                            <Users className="w-5 h-5 text-stone-700" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-stone-900">{stats?.totalCustomers || '0'}</span>
                        <span className="text-xs font-bold text-stone-400">registered</span>
                    </div>
                </div>

                {/* Stat Card 4 */}
                <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-stone-500">Pending Vendors</h3>
                        <div className="p-2 bg-red-50 rounded-lg">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-stone-900">{stats?.pendingVendors || '0'}</span>
                        {stats?.pendingVendors > 0 && <span className="text-xs font-bold text-red-500">action required</span>}
                    </div>
                </div>
            </div>

            {/* Quick Actions / Recent Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Orders Stub */}
                <div className="bg-white rounded-2xl border border-stone-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col">
                    <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-stone-900">Recent Orders</h2>
                        <button className="text-sm font-semibold text-stone-500 hover:text-stone-900 transition-colors">View All</button>
                    </div>
                    <div className="p-6 flex-1 flex items-center justify-center bg-stone-50/50">
                        <p className="text-stone-400 font-medium text-sm">No recent orders to display.</p>
                    </div>
                </div>

                {/* Vendor Requests Stub */}
                <div className="bg-white rounded-2xl border border-stone-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col">
                    <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                            Vendor Requests
                            <span className="bg-red-100 text-red-600 py-0.5 px-2.5 rounded-full text-[11px] font-bold">3 New</span>
                        </h2>
                        <button className="text-sm font-semibold text-stone-500 hover:text-stone-900 transition-colors">Review</button>
                    </div>
                    <div className="p-6 flex-1 flex flex-col gap-4">
                        {/* Mock Item 1 */}
                        <div className="flex items-center justify-between p-4 rounded-xl border border-stone-100 bg-white shadow-sm hover:border-stone-200 transition-colors cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 font-bold text-sm">ET</div>
                                <div>
                                    <p className="font-bold text-sm text-stone-900">ElectroTech Store</p>
                                    <p className="text-xs font-medium text-stone-500">Requested 2 hrs ago</p>
                                </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-stone-400" />
                        </div>
                        {/* Mock Item 2 */}
                        <div className="flex items-center justify-between p-4 rounded-xl border border-stone-100 bg-white shadow-sm hover:border-stone-200 transition-colors cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 font-bold text-sm">FF</div>
                                <div>
                                    <p className="font-bold text-sm text-stone-900">Fresh Foods Valley</p>
                                    <p className="text-xs font-medium text-stone-500">Requested 5 hrs ago</p>
                                </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-stone-400" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DashboardOverview;
