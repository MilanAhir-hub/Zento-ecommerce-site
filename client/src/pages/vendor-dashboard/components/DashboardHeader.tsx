import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { User03Icon, Menu01Icon, Search01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";

interface DashboardHeaderProps {
    user: any;
    navigate: (path: string) => void;
    onMenuClick: () => void;
    activeSection: string;
}

const DashboardHeader = ({ user, navigate, onMenuClick, activeSection }: DashboardHeaderProps) => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const getSectionTitle = () => {
        switch (activeSection) {
            case 'overview': return 'Dashboard';
            case 'products': return 'My Products';
            case 'add-product': return 'Add Product';
            case 'add-banner': return 'Create Banner';
            case 'orders': return 'Orders';
            case 'analytics': return 'Analytics';
            case 'settings': return 'Settings';
            default: return 'Dashboard';
        }
    };

    return (
        <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-40 border-b border-[#e5e5ea]">
            <div className="h-[72px] flex items-center justify-between px-6 lg:px-10">
                {/* Mobile Menu Button */}
                <div className="flex items-center gap-4 lg:hidden">
                    <button
                        onClick={onMenuClick}
                        className="p-2 -ml-2 text-[#1d1d1f] hover:bg-[#f5f5f7] rounded-full transition-colors"
                    >
                        <HugeiconsIcon icon={Menu01Icon} size={22} />
                    </button>
                    <h1 className="font-semibold text-[17px] text-[#1d1d1f] tracking-tight">
                        {getSectionTitle()}
                    </h1>
                </div>

                {/* Desktop Search (Left aligned) */}
                <div className="max-w-[440px] w-full hidden lg:block group">
                    <div className="relative flex items-center">
                        <HugeiconsIcon
                            icon={Search01Icon}
                            size={18}
                            className="absolute left-4 text-[#86868b] group-focus-within:text-[#0071e3] transition-colors"
                        />
                        <input
                            type="text"
                            placeholder="Search your store..."
                            className="w-full bg-[#f5f5f7] border-none rounded-full py-2.5 pl-11 pr-5 text-[15px] focus:ring-4 focus:ring-[#0071e3]/10 focus:bg-white transition-all outline-none placeholder:text-[#86868b]"
                        />
                    </div>
                </div>

                {/* Desktop Title (Middle) */}
                <div className="hidden lg:block absolute left-1/2 -translate-x-1/2">
                    <span className="text-[17px] font-semibold text-[#1d1d1f] transition-opacity duration-300">
                        {getSectionTitle()}
                    </span>
                </div>

                {/* Tools & Profile */}
                <div className="flex items-center gap-2 lg:gap-5 ml-auto lg:ml-0">
                    {/* Mobile Search Toggle */}
                    <button
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                        className="lg:hidden p-2 text-[#86868b] hover:text-[#1d1d1f] transition-colors"
                    >
                        {isSearchOpen ? <HugeiconsIcon icon={Cancel01Icon} size={20} /> : <HugeiconsIcon icon={Search01Icon} size={20} />}
                    </button>

                    <div className="h-4 w-px bg-[#e5e5ea] hidden lg:block mx-1"></div>

                    <div
                        onClick={() => navigate('/user/profile')}
                        className="w-9 h-9 lg:w-9 lg:h-9 bg-linear-to-br from-[#f5f5f7] to-[#e5e5ea] border border-[#e5e5ea] text-[#1d1d1f] rounded-full flex items-center justify-center font-semibold text-[13px] cursor-pointer hover:border-[#d2d2d7] transition-all shadow-sm active:scale-95"
                        title="View Profile"
                    >
                        {user?.name ? (
                            user.name.substring(0, 1).toUpperCase()
                        ) : (
                            <HugeiconsIcon icon={User03Icon} size={18} />
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Search Input (Dropdown) */}
            <div className={`lg:hidden overflow-hidden transition-all duration-300 border-t border-[#e5e5ea] ${isSearchOpen ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                <div className="p-4 bg-white">
                    <div className="relative flex items-center">
                        <HugeiconsIcon icon={Search01Icon} size={18} className="absolute left-4 text-[#86868b]" />
                        <input
                            type="text"
                            placeholder="Search store..."
                            className="w-full bg-[#f5f5f7] border-none rounded-full py-2.5 pl-11 pr-5 text-[15px] outline-none"
                        />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;

