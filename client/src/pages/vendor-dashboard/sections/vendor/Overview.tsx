import { HugeiconsIcon } from "@hugeicons/react";
import {
    Analytics01Icon,
    PackageIcon,
    ShoppingBag01Icon,
    Store01Icon,
    Loading03Icon,
    Alert01Icon
} from "@hugeicons/core-free-icons";
import StatsCard from "../../components/StatsCard";
import { useVendorStats } from "../../../../hooks/vendor/useVendorHooks";
import { useNavigate } from "react-router-dom";

const Overview = () => {
    const { data: stats, isLoading, isError, error, refetch } = useVendorStats();
    const navigate = useNavigate();

    const statsConfig = [
        {
            label: "Total Sales",
            value: `₹${stats?.totalSales || 0}`,
            icon: Analytics01Icon,
        },
        {
            label: "Active Products",
            value: stats?.activeProducts?.toString() || "0",
            icon: PackageIcon,
        },
        {
            label: "New Orders",
            value: stats?.newOrders?.toString() || "0",
            icon: ShoppingBag01Icon,
        },
    ];

    // 🔄 LOADING (Apple minimal)
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[420px] gap-4">
                <HugeiconsIcon icon={Loading03Icon} size={26} className="animate-spin text-[#0071e3]" />
                <p className="text-[#86868b] text-[14px] font-medium tracking-tight">
                    Preparing your store insights…
                </p>
            </div>
        );
    }

    // ❌ ERROR (clean, not aggressive)
    if (isError) {
        return (
            <div className="bg-white border border-[#e5e5ea] p-10 rounded-[28px] text-center space-y-4 shadow-sm">
                <HugeiconsIcon icon={Alert01Icon} size={26} className="text-[#ff3b30] mx-auto" />
                <h3 className="text-[#1d1d1f] font-semibold text-[18px]">Unable to load data</h3>
                <p className="text-[#86868b] text-[14px] max-w-sm mx-auto">
                    {(error as any)?.message || "Something went wrong while fetching your analytics."}
                </p>
                <button
                    onClick={() => refetch()}
                    className="mt-2 px-6 py-2 rounded-full bg-[#1d1d1f] text-white text-sm hover:bg-black transition-all"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-in fade-in duration-700">

            {/* HEADER */}
            <div className="flex items-center justify-between px-1">
                <div>
                    <h2 className="text-[36px] font-semibold text-[#1d1d1f] tracking-tight">
                        Overview
                    </h2>
                    <p className="text-[#86868b] text-[15px] font-medium mt-1">
                        A quick look at your store performance.
                    </p>
                </div>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statsConfig.map((stat, i) => (
                    <div
                        key={i}
                        className="group transition-all duration-300 hover:scale-[1.02]"
                    >
                        <StatsCard
                            label={stat.label}
                            value={stat.value}
                            icon={stat.icon}
                        />
                    </div>
                ))}
            </div>

            {/* HERO / EMPTY STATE (APPLE STYLE MAGIC) */}
            <div className="relative overflow-hidden rounded-[40px] border border-black/5 bg-gradient-to-b from-white to-[#f5f5f7] p-12 lg:p-16 text-center shadow-[0_10px_60px_-20px_rgba(0,0,0,0.08)]">

                {/* SOFT GLOW BACKGROUND */}
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#0071e3]/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative z-10 max-w-[600px] mx-auto">

                    {/* ICON */}
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-md border border-[#e5e5ea] group-hover:scale-110 transition-transform duration-500">
                        <HugeiconsIcon icon={Store01Icon} size={34} className="text-[#1d1d1f]" />
                    </div>

                    {/* TITLE */}
                    <h3 className="text-[32px] lg:text-[38px] font-semibold text-[#1d1d1f] tracking-tight leading-tight">
                        Build something <br /> remarkable.
                    </h3>

                    {/* DESCRIPTION */}
                    <p className="text-[#6e6e73] mt-4 text-[17px] leading-relaxed font-medium">
                        Start by adding your first product. Once live, your store will begin reaching customers instantly.
                    </p>

                    {/* CTA */}
                    <button
                        onClick={() => navigate('/vendor/products/add')}
                        className="mt-10 px-10 py-4 rounded-full bg-[#0071e3] text-white text-[15px] font-medium hover:bg-[#0077ED] transition-all active:scale-[0.97] shadow-lg shadow-[#0071e3]/20"
                    >
                        Add Your First Product
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Overview;