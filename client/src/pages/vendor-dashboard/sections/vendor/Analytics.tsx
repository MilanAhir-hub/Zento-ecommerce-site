import { HugeiconsIcon } from "@hugeicons/react";
import {
    ChartUpIcon,
    ShoppingBag01Icon,
    TargetIcon,
    PackageIcon,
    Loading03Icon,
    Alert01Icon,
    Analytics01Icon
} from "@hugeicons/core-free-icons";
import { useVendorStats, useVendorTopProducts } from "../../../../hooks/vendor/useVendorHooks";

const Analytics = () => {
    const { data: stats, isLoading: statsLoading, isError: statsError, error: statsErr, refetch } = useVendorStats();
    const { data: topProducts, isLoading: topLoading, isError: topError, error: topErr } = useVendorTopProducts();

    if (statsLoading || topLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[420px] gap-4">
                <HugeiconsIcon icon={Loading03Icon} size={26} className="animate-spin text-[#0071e3]" />
                <p className="text-[#86868b] text-sm">Analyzing performance…</p>
            </div>
        );
    }

    if (statsError || topError) {
        return (
            <div className="bg-white border border-[#e5e5ea] p-10 rounded-[28px] text-center space-y-4 shadow-sm">
                <HugeiconsIcon icon={Alert01Icon} size={26} className="text-[#ff3b30] mx-auto" />
                <h3 className="text-[#1d1d1f] font-semibold">Analytics unavailable</h3>
                <p className="text-[#86868b] text-sm">{((statsErr || topErr) as any)?.message}</p>
                <button
                    onClick={() => refetch()}
                    className="px-6 py-2 rounded-full bg-[#1d1d1f] text-white text-sm"
                >
                    Retry
                </button>
            </div>
        );
    }

    const analyticsStats = [
        {
            label: 'Revenue',
            value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`,
            icon: ChartUpIcon,
            trend: '+12%'
        },
        {
            label: 'Orders',
            value: stats?.totalSales?.toString() || "0",
            icon: ShoppingBag01Icon,
            trend: '+5%'
        },
        {
            label: 'Avg Order',
            value: stats?.totalSales
                ? `₹${Math.round((stats.totalRevenue || 0) / stats.totalSales)}`
                : '₹0',
            icon: TargetIcon,
            trend: '+2%'
        },
    ];

    return (
        <div className="space-y-12 animate-in fade-in duration-700 pb-20">

            {/* HEADER */}
            <div>
                <h2 className="text-[36px] font-semibold text-[#1d1d1f] tracking-tight">
                    Analytics
                </h2>
                <p className="text-[#86868b] text-[15px] mt-1">
                    Insights into your store performance
                </p>
            </div>

            {/* STATS */}
            <div className="grid md:grid-cols-3 gap-6">
                {analyticsStats.map((s, i) => (
                    <div key={i}
                        className="bg-white rounded-[28px] p-6 border border-black/5 shadow-sm hover:shadow-md transition">

                        <div className="flex justify-between items-center mb-4">
                            <HugeiconsIcon icon={s.icon} size={22} />
                            <span className="text-green-600 text-xs font-medium">
                                {s.trend}
                            </span>
                        </div>

                        <p className="text-sm text-[#86868b]">{s.label}</p>
                        <h3 className="text-2xl font-semibold">{s.value}</h3>
                    </div>
                ))}
            </div>

            {/* CHART */}
            <div className="relative rounded-[32px] border border-black/5 bg-gradient-to-b from-white to-[#f5f5f7] p-10 text-center">

                <div className="absolute -top-20 -right-20 w-72 h-72 bg-[#0071e3]/10 blur-3xl rounded-full"></div>

                <HugeiconsIcon icon={Analytics01Icon} size={40} className="mx-auto text-gray-300 mb-4" />

                <h3 className="text-lg font-semibold text-[#1d1d1f]">
                    Performance Visualization
                </h3>

                <p className="text-[#86868b] text-sm mt-2 max-w-md mx-auto">
                    Charts will appear here as your store gathers more data.
                </p>
            </div>

            {/* TOP PRODUCTS */}
            <div>
                <h3 className="text-xl font-semibold mb-6">Top Products</h3>

                {topProducts && topProducts.length > 0 ? (
                    <div className="grid md:grid-cols-3 gap-6">
                        {topProducts.map((p: any, i: number) => (
                            <div key={i}
                                className="bg-white p-6 rounded-[28px] border border-black/5 shadow-sm hover:shadow-md transition">

                                <div className="flex justify-between mb-4">
                                    <div className="w-16 h-16 bg-[#f5f5f7] rounded-xl overflow-hidden flex items-center justify-center">
                                        {p.imageUrl ? (
                                            <img src={p.imageUrl} className="w-full h-full object-cover" />
                                        ) : (
                                            <HugeiconsIcon icon={PackageIcon} size={22} />
                                        )}
                                    </div>

                                    <span className="text-xs text-green-600 font-medium">
                                        #{i + 1}
                                    </span>
                                </div>

                                <h4 className="font-semibold text-sm truncate">{p.title}</h4>

                                <p className="text-sm text-[#86868b] mt-2">
                                    {p.totalSold} sold
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white border border-black/5 rounded-[28px] py-16 text-center">
                        <HugeiconsIcon icon={PackageIcon} size={30} className="mx-auto text-gray-300 mb-3" />
                        <p className="text-sm text-[#86868b]">
                            No product data yet
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Analytics;
