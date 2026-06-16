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

    // 🔄 LOADING (Minimalist)
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[420px] gap-4">
                <HugeiconsIcon icon={Loading03Icon} size={26} className="animate-spin text-brand-black" />
                <p className="text-gray-muted text-[14px] font-medium tracking-tight">
                    Preparing your store insights…
                </p>
            </div>
        );
    }

    // ❌ ERROR (Editorial)
    if (isError) {
        return (
            <div className="bg-white border border-[#E5E5E5] p-10 rounded-none text-center space-y-4">
                <HugeiconsIcon icon={Alert01Icon} size={26} className="text-[#BC0000] mx-auto" />
                <h3 className="text-brand-black font-semibold text-[18px] uppercase tracking-wider">Unable to load data</h3>
                <p className="text-gray-muted text-[14px] max-w-sm mx-auto">
                    {(error as any)?.message || "Something went wrong while fetching your analytics."}
                </p>
                <button
                    onClick={() => refetch()}
                    className="mt-4 px-6 py-3 bg-brand-black text-brand-white text-xs font-semibold uppercase tracking-widest border border-brand-black hover:bg-brand-white hover:text-brand-black transition-all duration-default ease-editorial rounded-none cursor-pointer"
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
                    <h2 className="text-[32px] font-medium uppercase tracking-widest text-brand-black">
                        Overview
                    </h2>
                    <p className="text-gray-muted text-[14px] mt-1">
                        A quick look at your store performance.
                    </p>
                </div>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statsConfig.map((stat, i) => (
                    <StatsCard
                        key={i}
                        label={stat.label}
                        value={stat.value}
                        icon={stat.icon}
                    />
                ))}
            </div>

            {/* HERO / EMPTY STATE (EDITORIAL STYLE) */}
            <div className="relative rounded-none border border-[#E5E5E5] bg-gray-bg p-12 lg:p-16 text-center">
                <div className="relative z-10 max-w-[600px] mx-auto">

                    {/* ICON */}
                    <div className="w-20 h-20 bg-white rounded-none flex items-center justify-center mx-auto mb-8 border border-[#E5E5E5]">
                        <HugeiconsIcon icon={Store01Icon} size={34} className="text-brand-black" />
                    </div>

                     {/* TITLE */}
                     <h3 className="text-[32px] lg:text-[36px] font-medium text-brand-black tracking-tight leading-tight uppercase">
                         Build something <br /> remarkable
                     </h3>

                     {/* DESCRIPTION */}
                     <p className="text-gray-dark mt-4 text-[15px] leading-relaxed">
                         Start by adding your first product. Once live, your store will begin reaching customers instantly.
                     </p>

                     {/* CTA */}
                     <button
                         onClick={() => navigate('/vendor/products/add')}
                         className="mt-10 px-10 py-4 rounded-none bg-brand-black text-brand-white text-xs font-semibold uppercase tracking-widest border border-brand-black hover:bg-brand-white hover:text-brand-black transition-all duration-default ease-editorial cursor-pointer"
                     >
                         Add Your First Product
                     </button>
                </div>
            </div>
        </div>
    );
};

export default Overview;