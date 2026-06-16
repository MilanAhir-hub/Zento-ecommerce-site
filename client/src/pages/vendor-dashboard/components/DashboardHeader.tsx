import { HugeiconsIcon } from "@hugeicons/react";
import { User03Icon, Menu01Icon } from "@hugeicons/core-free-icons";

interface DashboardHeaderProps {
    user: any;
    navigate: (path: string) => void;
    onMenuClick: () => void;
    activeSection: string;
}

const DashboardHeader = ({ user, navigate, onMenuClick, activeSection }: DashboardHeaderProps) => {
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
        <header className="bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b border-[#E5E5E5]">
            <div className="h-[72px] flex items-center justify-between px-6 lg:px-10">
                {/* Mobile Menu Button */}
                <div className="flex items-center gap-4 lg:hidden">
                    <button
                        onClick={onMenuClick}
                        className="p-2 -ml-2 text-brand-black hover:bg-gray-bg rounded-none transition-colors"
                        aria-label="Open sidebar"
                    >
                        <HugeiconsIcon icon={Menu01Icon} size={22} />
                    </button>
                    <h1 className="font-semibold text-[17px] text-brand-black uppercase tracking-wider">
                        {getSectionTitle()}
                    </h1>
                </div>

                {/* Desktop Title (Middle) */}
                <div className="hidden lg:block mx-auto">
                    <h2 className="text-[14px] font-semibold text-brand-black uppercase tracking-widest transition-opacity duration-300">
                        {getSectionTitle()}
                    </h2>
                </div>

                {/* Profile */}
                <div className="flex items-center gap-2 lg:gap-5 ml-auto lg:ml-0">
                    <div
                        onClick={() => navigate('/user/profile')}
                        className="w-9 h-9 lg:w-9 lg:h-9 bg-white border border-[#E5E5E5] text-brand-black rounded-none flex items-center justify-center font-semibold text-[13px] cursor-pointer hover:border-brand-black transition-all active:scale-95"
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
        </header>
    );
};

export default DashboardHeader;
