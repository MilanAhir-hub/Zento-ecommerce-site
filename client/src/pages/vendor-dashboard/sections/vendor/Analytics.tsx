import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    ChartUpIcon,
    ShoppingBag01Icon,
    TargetIcon,
    PackageIcon,
    Loading03Icon,
    Alert01Icon,
    Analytics01Icon,
    Clock01Icon,
    CheckmarkCircle02Icon,
    Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { useVendorAnalytics } from "../../../../hooks/vendor/useVendorHooks";

interface ChartDataPoint {
    label: string;
    value: number;
}

interface MiniLineChartProps {
    data: ChartDataPoint[];
    valueFormatter: (value: number) => string;
    label: string;
}

const MiniLineChart = ({ data, valueFormatter, label }: MiniLineChartProps) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    if (!data || data.length === 0) {
        return (
            <div className="h-56 flex items-center justify-center bg-gray-bg border border-[#E5E5E5] rounded-none">
                <p className="text-gray-muted text-xs uppercase tracking-widest">No data available</p>
            </div>
        );
    }

    const width = 500;
    const height = 220;
    const paddingLeft = 50;
    const paddingRight = 15;
    const paddingTop = 25;
    const paddingBottom = 30;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    const values = data.map((d) => d.value);
    const maxValue = Math.max(...values, 1);
    const minValue = 0;

    const getCoords = (index: number, value: number) => {
        const x = paddingLeft + (index / (data.length - 1 || 1)) * chartWidth;
        const y = paddingTop + chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight;
        return { x, y };
    };

    let linePath = "";
    let areaPath = "";

    if (data.length > 0) {
        data.forEach((d, i) => {
            const { x, y } = getCoords(i, d.value);
            if (i === 0) {
                linePath += `M ${x} ${y}`;
                areaPath += `M ${x} ${paddingTop + chartHeight} L ${x} ${y}`;
            } else {
                linePath += ` L ${x} ${y}`;
                areaPath += ` L ${x} ${y}`;
            }
        });
        const firstX = paddingLeft;
        const lastX = paddingLeft + chartWidth;
        areaPath += ` L ${lastX} ${paddingTop + chartHeight} Z`;
    }

    const yTicks = 4;
    const yTickValues = Array.from(
        { length: yTicks },
        (_, i) => minValue + (i * (maxValue - minValue)) / (yTicks - 1)
    );

    // Show labels every 5 days for cleaner axis
    const xTicksIndices = data.length > 7
        ? Array.from({ length: 6 }, (_, i) => Math.min(Math.round((i * (data.length - 1)) / 5), data.length - 1))
        : data.map((_, i) => i);

    return (
        <div className="bg-white border border-[#E5E5E5] p-6 rounded-none relative select-none">
            <h4 className="text-xs font-semibold text-brand-black uppercase tracking-widest mb-6">{label}</h4>
            <div className="relative w-full h-[220px]">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                    {/* Y-Axis Gridlines and Labels */}
                    {yTickValues.map((v, i) => {
                        const { y } = getCoords(0, v);
                        return (
                            <g key={i}>
                                <line
                                    x1={paddingLeft}
                                    y1={y}
                                    x2={width - paddingRight}
                                    y2={y}
                                    stroke="#F2F2F2"
                                    strokeWidth="1"
                                    strokeDasharray="4 4"
                                />
                                <text
                                    x={paddingLeft - 10}
                                    y={y + 3}
                                    textAnchor="end"
                                    className="fill-gray-muted font-sans text-[9px] uppercase tracking-wider tabular-nums font-normal"
                                >
                                    {valueFormatter(v)}
                                </text>
                            </g>
                        );
                    })}

                    {/* Area path */}
                    {areaPath && (
                        <path
                            d={areaPath}
                            fill="url(#chartGradient)"
                            opacity="0.04"
                        />
                    )}

                    {/* Line path */}
                    {linePath && (
                        <path
                            d={linePath}
                            fill="none"
                            stroke="#000000"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    )}

                    {/* X Axis labels */}
                    {xTicksIndices.map((idx, i) => {
                        const d = data[idx];
                        const { x } = getCoords(idx, 0);
                        return (
                            <text
                                key={i}
                                x={x}
                                y={height - 8}
                                textAnchor="middle"
                                className="fill-gray-muted font-sans text-[9px] uppercase tracking-wider font-normal"
                            >
                                {d.label}
                            </text>
                        );
                    })}

                    {/* Gradients */}
                    <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#000000" />
                            <stop offset="100%" stopColor="#000000" />
                        </linearGradient>
                    </defs>

                    {/* Hover vertical line and dots */}
                    {hoveredIndex !== null && hoveredIndex >= 0 && hoveredIndex < data.length && (
                        <g>
                            <line
                                x1={getCoords(hoveredIndex, 0).x}
                                y1={paddingTop}
                                x2={getCoords(hoveredIndex, 0).x}
                                y2={paddingTop + chartHeight}
                                stroke="#000000"
                                strokeWidth="0.75"
                                strokeDasharray="3 3"
                            />
                            <circle
                                cx={getCoords(hoveredIndex, data[hoveredIndex].value).x}
                                cy={getCoords(hoveredIndex, data[hoveredIndex].value).y}
                                r="4"
                                fill="#000000"
                                stroke="#FFFFFF"
                                strokeWidth="1.5"
                            />
                        </g>
                    )}

                    {/* Hover trigger columns */}
                    {data.map((d, i) => {
                        const { x } = getCoords(i, 0);
                        const colWidth = chartWidth / (data.length - 1 || 1);
                        return (
                            <rect
                                key={i}
                                x={x - colWidth / 2}
                                y={paddingTop}
                                width={colWidth}
                                height={chartHeight}
                                fill="transparent"
                                className="cursor-crosshair"
                                onMouseEnter={() => setHoveredIndex(i)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            />
                        );
                    })}
                </svg>

                {/* Tooltip Overlay */}
                {hoveredIndex !== null && hoveredIndex >= 0 && hoveredIndex < data.length && (
                    <div
                        className="absolute bg-brand-black text-brand-white text-[10px] tracking-wider uppercase px-2 py-1 rounded-none border border-brand-black pointer-events-none transition-opacity duration-200 z-10"
                        style={{
                            left: `${(getCoords(hoveredIndex, data[hoveredIndex].value).x / width) * 100}%`,
                            top: `${(getCoords(hoveredIndex, data[hoveredIndex].value).y / height) * 100 - 15}%`,
                            transform: "translate(-50%, -100%)",
                        }}
                    >
                        <div className="font-semibold text-center">{valueFormatter(data[hoveredIndex].value)}</div>
                        <div className="text-[8px] text-gray-400 text-center mt-0.5">{data[hoveredIndex].label}</div>
                    </div>
                )}
            </div>
        </div>
    );
};

const Analytics = () => {
    const { data: analytics, isLoading, isError, error, refetch } = useVendorAnalytics();

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[420px] gap-4">
                <HugeiconsIcon icon={Loading03Icon} size={26} className="animate-spin text-brand-black" />
                <p className="text-gray-muted text-sm uppercase tracking-widest">Analyzing store performance…</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-white border border-[#E5E5E5] p-10 rounded-none text-center space-y-4 max-w-md mx-auto mt-12">
                <HugeiconsIcon icon={Alert01Icon} size={26} className="text-accent-sale mx-auto" />
                <h3 className="text-brand-black font-semibold uppercase tracking-wider">Analytics unavailable</h3>
                <p className="text-gray-muted text-sm">{(error as any)?.message || "Failed to load store analytics."}</p>
                <button
                    onClick={() => refetch()}
                    className="px-6 py-3 bg-brand-black text-brand-white text-xs font-semibold uppercase tracking-widest border border-brand-black hover:bg-brand-white hover:text-brand-black transition-colors duration-default ease-editorial rounded-none cursor-pointer"
                >
                    Retry
                </button>
            </div>
        );
    }

    const totalOrdersCount =
        (analytics?.pendingOrders || 0) +
        (analytics?.processingOrders || 0) +
        (analytics?.shippedOrders || 0) +
        (analytics?.deliveredOrders || 0) +
        (analytics?.cancelledOrders || 0);

    if (totalOrdersCount === 0) {
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

                <div className="bg-white border border-[#E5E5E5] rounded-none py-20 px-6 text-center max-w-md mx-auto space-y-4">
                    <HugeiconsIcon icon={Analytics01Icon} size={40} className="mx-auto text-gray-300" />
                    <h3 className="text-brand-black font-semibold uppercase tracking-wider">No performance data yet</h3>
                    <p className="text-gray-muted text-sm leading-relaxed">
                        Your store analytics will become active once customers place orders. Share your products and store to begin generating sales.
                    </p>
                </div>
            </div>
        );
    }

    const coreStats = [
        {
            label: "Revenue",
            value: `₹${(analytics?.totalRevenue || 0).toLocaleString("en-IN")}`,
            icon: ChartUpIcon,
            description: "Excludes cancelled orders",
        },
        {
            label: "Orders",
            value: totalOrdersCount.toLocaleString(),
            icon: ShoppingBag01Icon,
            description: "All customer checkouts",
        },
        {
            label: "Avg Order Value",
            value: `₹${Math.round(analytics?.avgOrderValue || 0).toLocaleString("en-IN")}`,
            icon: TargetIcon,
            description: "From converted orders",
        },
        {
            label: "Products Sold",
            value: (analytics?.productsSold || 0).toLocaleString(),
            icon: PackageIcon,
            description: "Total item units sold",
        },
    ];

    const statusStats = [
        {
            label: "Pending Orders",
            value: (analytics?.pendingOrders || 0).toString(),
            icon: Clock01Icon,
            color: "text-amber-600",
        },
        {
            label: "Delivered Orders",
            value: (analytics?.deliveredOrders || 0).toString(),
            icon: CheckmarkCircle02Icon,
            color: "text-green-600",
        },
        {
            label: "Cancelled Orders",
            value: (analytics?.cancelledOrders || 0).toString(),
            icon: Cancel01Icon,
            color: "text-red-600",
        },
    ];

    const formatDateLabel = (dateStr: string) => {
        try {
            const parts = dateStr.split("-");
            if (parts.length === 3) {
                const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
                return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
            }
        } catch { }
        return dateStr;
    };

    const formattedRevenueChart = (analytics?.revenueChart || []).map((pt) => ({
        label: formatDateLabel(pt.date),
        value: pt.revenue || 0,
    }));

    const formattedOrdersChart = (analytics?.ordersChart || []).map((pt) => ({
        label: formatDateLabel(pt.date),
        value: pt.orders || 0,
    }));

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

            {/* CORE METRICS GRID */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {coreStats.map((s, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-none p-6 border border-[#E5E5E5] hover:border-brand-black transition-colors duration-200"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <HugeiconsIcon icon={s.icon} size={20} className="text-brand-black" />
                        </div>
                        <p className="text-[10px] text-gray-muted uppercase tracking-widest">{s.label}</p>
                        <h3 className="text-[22px] font-medium text-brand-black mt-1.5 tabular-nums">{s.value}</h3>
                        <p className="text-[11px] text-gray-muted mt-2 italic font-light">{s.description}</p>
                    </div>
                ))}
            </div>

            {/* ORDER STATUS METRICS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statusStats.map((s, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-none p-5 border border-[#E5E5E5] flex items-center justify-between hover:border-brand-black transition-colors duration-200"
                    >
                        <div className="flex items-center gap-3">
                            <HugeiconsIcon icon={s.icon} size={20} className={s.color} />
                            <span className="text-[12px] text-gray-dark uppercase tracking-wider">{s.label}</span>
                        </div>
                        <span className="text-[20px] font-semibold text-brand-black tabular-nums">{s.value}</span>
                    </div>
                ))}
            </div>

            {/* CHARTS SECTION */}
            <div className="grid lg:grid-cols-2 gap-8">
                <MiniLineChart
                    data={formattedRevenueChart}
                    valueFormatter={(v) => `₹${v >= 1000 ? (v / 1000).toFixed(0) + "k" : v}`}
                    label="Revenue (Last 30 Days)"
                />
                <MiniLineChart
                    data={formattedOrdersChart}
                    valueFormatter={(v) => v.toString()}
                    label="Orders (Last 30 Days)"
                />
            </div>

            {/* TOP PRODUCTS DETAIL TABLE */}
            <div>
                <h3 className="text-lg font-semibold uppercase tracking-wider mb-6 text-brand-black">Top Products</h3>

                {analytics?.topProducts && analytics.topProducts.length > 0 ? (
                    <div className="border border-[#E5E5E5] bg-white overflow-x-auto rounded-none">
                        <table className="w-full min-w-[650px] border-collapse text-left">
                            <thead>
                                <tr className="border-b border-[#E5E5E5] bg-gray-bg text-[10px] font-semibold uppercase tracking-widest text-gray-muted">
                                    <th className="py-4 px-6">Rank & Product</th>
                                    <th className="py-4 px-6 text-right">Unit Price</th>
                                    <th className="py-4 px-6 text-right">Units Sold</th>
                                    <th className="py-4 px-6 text-right">Orders</th>
                                    <th className="py-4 px-6 text-right">Total Revenue</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E5E5E5] text-[13px] text-brand-black">
                                {analytics.topProducts.map((p: any, i: number) => (
                                    <tr key={p._id} className="hover:bg-gray-bg transition-colors duration-150">
                                        <td className="py-4 px-6 flex items-center gap-4">
                                            <span className="text-xs font-semibold text-gray-muted w-4">#{i + 1}</span>
                                            <div className="w-10 h-14 bg-gray-bg border border-[#E5E5E5] rounded-none overflow-hidden flex items-center justify-center shrink-0">
                                                {p.imageUrl ? (
                                                    <img src={p.imageUrl} className="w-full h-full object-cover" alt={p.title} />
                                                ) : (
                                                    <HugeiconsIcon icon={PackageIcon} size={16} className="text-gray-muted" />
                                                )}
                                            </div>
                                            <span className="font-medium truncate max-w-[240px]" title={p.title}>
                                                {p.title}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right tabular-nums">₹{p.price.toLocaleString("en-IN")}</td>
                                        <td className="py-4 px-6 text-right tabular-nums">{p.totalUnits || p.totalSold || 0}</td>
                                        <td className="py-4 px-6 text-right tabular-nums">{p.orderCount || 0}</td>
                                        <td className="py-4 px-6 text-right font-medium tabular-nums">
                                            ₹{(p.totalRevenue || 0).toLocaleString("en-IN")}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="bg-white border border-[#E5E5E5] rounded-none py-16 text-center">
                        <HugeiconsIcon icon={PackageIcon} size={30} className="mx-auto text-gray-300 mb-3" />
                        <p className="text-sm text-gray-muted uppercase tracking-wider">
                            No product data yet
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Analytics;
