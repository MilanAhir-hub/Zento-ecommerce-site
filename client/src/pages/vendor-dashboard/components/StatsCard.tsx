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
        <div className="bg-white p-7 rounded-none border border-[#E5E5E5] hover:border-brand-black transition-colors duration-default ease-editorial group">
            <div className="flex items-center justify-between mb-5">
                <div className="w-11 h-11 rounded-none flex items-center justify-center bg-gray-bg border border-[#E5E5E5] text-brand-black transition-colors duration-default ease-editorial">
                    <HugeiconsIcon icon={icon} size={22} className="opacity-80" />
                </div>
            </div>
            <p className="text-gray-muted text-[11px] font-semibold uppercase tracking-widest">{label}</p>
            <h3 className="text-[28px] font-medium text-brand-black mt-1 tracking-tight tabular-nums">{value}</h3>
        </div>
    );
};

export default StatsCard;

