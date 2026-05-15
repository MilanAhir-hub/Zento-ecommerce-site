import { HugeiconsIcon } from "@hugeicons/react";

interface StatsCardProps {
    label: string;
    value: string;
    icon: any;
    color: string;
    bg: string;
}

const StatsCard = ({ label, value, icon }: Omit<StatsCardProps, 'color' | 'bg'>) => {
    return (
        <div className="bg-white p-7 rounded-[28px] border border-black/3 shadow-[0_2px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 group">
            <div className="flex items-center justify-between mb-5">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center bg-[#f5f5f7] border border-[#e5e5ea] text-[#1d1d1f] group-hover:scale-110 transition-transform duration-300`}>
                    <HugeiconsIcon icon={icon} size={22} className="opacity-80" />
                </div>
            </div>
            <p className="text-[#86868b] text-[13px] font-semibold uppercase tracking-widest">{label}</p>
            <h3 className="text-[32px] font-semibold text-[#1d1d1f] mt-1 tracking-tight">{value}</h3>
        </div>
    );
};

export default StatsCard;

