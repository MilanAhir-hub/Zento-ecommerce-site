import { HugeiconsIcon } from "@hugeicons/react";
import {
    ChartUpIcon,
    ShoppingBag01Icon,
    UserGroupIcon,
    Alert01Icon,
    ArrowRight01Icon,
    Loading03Icon
} from "@hugeicons/core-free-icons";
import { useAdminStats } from "../../hooks/admin/useAdmin";

const DashboardOverview = () => {
    const { data: stats, isLoading, isError } = useAdminStats();

    if (isLoading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center py-20">
                <HugeiconsIcon icon={Loading03Icon} size={40} className="text-[#0071e3] animate-spin mb-4" />
                <p className="text-[#86868b] font-medium text-[15px]">Syncing latest data...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                    <HugeiconsIcon icon={Alert01Icon} size={32} className="text-[#ff453a]" />
                </div>
                <p className="text-[#ff453a] font-semibold text-[17px]">Sync failed.</p>
                <p className="text-[#86868b] text-[14px] mt-1 max-w-xs">Check your secure connection and try again.</p>
            </div>
        );
    }

    const statCards = [
        { label: 'Total Revenue', value: stats?.totalRevenue, subtext: 'total gross', icon: ChartUpIcon, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Active Orders', value: stats?.activeOrders, subtext: 'to be fulfilled', icon: ShoppingBag01Icon, color: 'text-[#0071e3]', bg: 'bg-[#0071e3]/5' },
        { label: 'Customers', value: stats?.totalCustomers, subtext: 'verified users', icon: UserGroupIcon, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Pending Vendors', value: stats?.pendingVendors, subtext: 'action required', icon: Alert01Icon, color: 'text-[#ff453a]', bg: 'bg-red-50', alert: stats?.pendingVendors > 0 }
    ];

    return (
        <div className="space-y-12">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {statCards.map((card, idx) => (
                    <div key={idx} className="bg-white rounded-4xl p-6 sm:p-8 border border-[#d2d2d7]/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-all duration-300">
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <h3 className="text-[11px] sm:text-[13px] font-bold text-[#86868b] uppercase tracking-wider">{card.label}</h3>
                            <div className={`p-2.5 ${card.bg} rounded-2xl`}>
                                <HugeiconsIcon icon={card.icon} size={20} className={card.color} />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-[32px] font-bold text-[#1d1d1f] tracking-tight">
                                {typeof card.value === 'number' && card.label.includes('Revenue') ? `₹${card.value.toLocaleString()}` : card.value || '0'}
                            </span>
                        </div>
                        <p className={`mt-1 text-[12px] font-semibold ${card.alert ? 'text-[#ff453a]' : 'text-[#c1c1c7]'}`}>
                            {card.subtext}
                        </p>
                    </div>
                ))}
            </div>

            {/* Detailed Activity Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                {/* Recent Orders Overview */}
                <div className="bg-white rounded-4xl border border-[#d2d2d7]/30 overflow-hidden flex flex-col">
                    <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-[#f5f5f7] flex items-center justify-between">
                        <h2 className="text-[16px] sm:text-[18px] font-bold text-[#1d1d1f]">Recent Orders</h2>
                        <button className="text-[12px] sm:text-[13px] font-bold text-[#0071e3] hover:underline transition-all">View All</button>
                    </div>
                    <div className="p-12 flex-1 flex flex-col items-center justify-center bg-[#fbfbfd]/50">
                        <div className="w-12 h-12 bg-[#f5f5f7] rounded-full flex items-center justify-center mb-3">
                            <HugeiconsIcon icon={ShoppingBag01Icon} size={20} className="text-[#c1c1c7]" />
                        </div>
                        <p className="text-[#86868b] font-medium text-[14px]">No high-priority orders found.</p>
                    </div>
                </div>

                {/* Critical Vendor Requests */}
                <div className="bg-white rounded-4xl border border-[#d2d2d7]/30 overflow-hidden flex flex-col">
                    <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-[#f5f5f7] flex items-center justify-between">
                        <h2 className="text-[16px] sm:text-[18px] font-bold text-[#1d1d1f] flex items-center gap-3">
                            <span className="hidden sm:inline">Vendor Requests</span>
                            <span className="sm:hidden">Requests</span>
                            <span className="bg-[#ff453a] text-white py-0.5 px-2.5 rounded-full text-[10px] font-black">ACTION</span>
                        </h2>
                        <button className="text-[12px] sm:text-[13px] font-bold text-[#0071e3] hover:underline transition-all">Review Hub</button>
                    </div>
                    <div className="p-8 space-y-4">
                        {[
                            { name: 'ElectroTech Store', time: '2 hrs ago', initial: 'ET', color: 'bg-blue-50 text-blue-600' },
                            { name: 'Fresh Foods Valley', time: '5 hrs ago', initial: 'FF', color: 'bg-green-50 text-green-600' }
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-5 rounded-2xl border border-[#f5f5f7] hover:border-[#0071e3]/30 hover:bg-[#fbfbfd] transition-all cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <div className={`w-11 h-11 rounded-2xl ${item.color} flex items-center justify-center font-bold text-[14px]`}>
                                        {item.initial}
                                    </div>
                                    <div>
                                        <p className="font-bold text-[15px] text-[#1d1d1f]">{item.name}</p>
                                        <p className="text-[12px] font-medium text-[#86868b] uppercase tracking-wide">{item.time}</p>
                                    </div>
                                </div>
                                <HugeiconsIcon icon={ArrowRight01Icon} size={18} className="text-[#c1c1c7] group-hover:text-[#0071e3] transition-all" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
