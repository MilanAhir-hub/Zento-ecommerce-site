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
                <HugeiconsIcon icon={Loading03Icon} size={26} className="animate-spin text-brand-black" />
                <p className="text-gray-muted text-sm">Analyzing performance…</p>
            </div>
        );
    }

    if (statsError || topError) {
        return (
            <div className="bg-white border border-[#E5E5E5] p-10 rounded-none text-center space-y-4">
                <HugeiconsIcon icon={Alert01Icon} size={26} className="text-accent-sale mx-auto" />
                <h3 className="text-brand-black font-semibold uppercase tracking-wider">Analytics unavailable</h3>
                <p className="text-gray-muted text-sm">{((statsErr || topErr) as any)?.message}</p>
                <button
                    onClick={() => refetch()}
                    className="px-6 py-3 bg-brand-black text-brand-white text-xs font-semibold uppercase tracking-widest border border-brand-black hover:bg-brand-white hover:text-brand-black transition-colors duration-default ease-editorial rounded-none cursor-pointer"
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
                <h2 className="text-[32px] font-medium uppercase tracking-widest text-brand-black">
                    Analytics
                </h2>
                <p className="text-gray-muted text-[14px] mt-1">
                    Insights into your store performance
                </p>
            </div>

            {/* STATS */}
            <div className="grid md:grid-cols-3 gap-6">
                {analyticsStats.map((s, i) => (
                    <div key={i}
                        className="bg-white rounded-none p-6 border border-[#E5E5E5] hover:border-brand-black transition-colors duration-default ease-editorial">

                        <div className="flex justify-between items-center mb-4">
                            <HugeiconsIcon icon={s.icon} size={22} className="text-brand-black" />
                            <span className="text-[#1a7d32] text-xs font-semibold tabular-nums">
                                {s.trend}
                            </span>
                        </div>

                        <p className="text-xs text-gray-muted uppercase tracking-widest">{s.label}</p>
                        <h3 className="text-2xl font-medium text-brand-black mt-1 tabular-nums">{s.value}</h3>
                    </div>
                ))}
            </div>

            {/* CHART */}
            <div className="relative rounded-none border border-[#E5E5E5] bg-gray-bg p-10 text-center">
                <HugeiconsIcon icon={Analytics01Icon} size={40} className="mx-auto text-gray-300 mb-4" />

                <h3 className="text-lg font-semibold text-brand-black uppercase tracking-wider">
                    Performance Visualization
                </h3>

                <p className="text-gray-muted text-sm mt-2 max-w-md mx-auto">
                    Charts will appear here as your store gathers more data.
                </p>
            </div>

            {/* TOP PRODUCTS */}
            <div>
                <h3 className="text-lg font-semibold uppercase tracking-wider mb-6 text-brand-black">Top Products</h3>

                {topProducts && topProducts.length > 0 ? (
                    <div className="grid md:grid-cols-3 gap-6">
                        {topProducts.map((p: any, i: number) => (
                            <div key={i}
                                className="bg-white p-6 rounded-none border border-[#E5E5E5] hover:border-brand-black transition-colors duration-default ease-editorial">

                                <div className="flex justify-between mb-4">
                                    <div className="w-16 h-16 bg-gray-bg border border-[#E5E5E5] rounded-none overflow-hidden flex items-center justify-center shrink-0">
                                        {p.imageUrl ? (
                                            <img src={p.imageUrl} className="w-full h-full object-cover" alt={p.title} />
                                        ) : (
                                            <HugeiconsIcon icon={PackageIcon} size={22} className="text-gray-muted" />
                                        )}
                                    </div>

                                    <span className="text-xs text-brand-black font-semibold tabular-nums">
                                        #{i + 1}
                                    </span>
                                </div>

                                <h4 className="font-semibold text-sm truncate text-brand-black">{p.title}</h4>

                                <p className="text-xs text-gray-muted mt-2 uppercase tracking-wider tabular-nums">
                                    {p.totalSold} sold
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white border border-[#E5E5E5] rounded-none py-16 text-center">
                        <HugeiconsIcon icon={PackageIcon} size={30} className="mx-auto text-gray-300 mb-3" />
                        <p className="text-sm text-gray-muted">
                            No product data yet
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Analytics;
