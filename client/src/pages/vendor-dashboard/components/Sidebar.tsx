import { HugeiconsIcon } from "@hugeicons/react";
import {
    DashboardCircleIcon,
    PackageIcon,
    PlusSignCircleIcon,
    ShoppingBag01Icon,
    Analytics01Icon,
    Settings01Icon,
    Logout01Icon,
    Cancel01Icon
} from "@hugeicons/core-free-icons";
import { Link, useLocation } from "react-router-dom";

export const sidebarMenu = [
    { id: 'overview', label: 'Dashboard', icon: DashboardCircleIcon, path: '/vendor' },
    { id: 'products', label: 'My Products', icon: PackageIcon, path: '/vendor/products' },
    { id: 'add-product', label: 'Add Product', icon: PlusSignCircleIcon, path: '/vendor/products/add' },
    { id: 'orders', label: 'Orders', icon: ShoppingBag01Icon, path: '/vendor/orders' },
    { id: 'analytics', label: 'Analytics', icon: Analytics01Icon, path: '/vendor/analytics' },
];

interface SidebarProps {
    activeSection?: string;
    setActiveSection: (section: string) => void;
    user: any;
    handleLogout: () => void;
    isOpen?: boolean;
    onClose?: () => void;
}

const Sidebar = ({ user, handleLogout, isOpen, onClose }: SidebarProps) => {
    const location = useLocation();

    // Helper to check if a menu item is active
    const isActive = (itemPath: string) => {
        if (itemPath === '/vendor') {
            return location.pathname === '/vendor' || location.pathname === '/vendor/overview' || location.pathname === '/vendor/dashboard';
        }

        if (location.pathname === itemPath) return true;

        if (itemPath === '/vendor/products') {
            return location.pathname.startsWith('/vendor/products') && location.pathname !== '/vendor/products/add';
        }

        return location.pathname.startsWith(itemPath);
    };

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-50 transition-opacity duration-300 lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Sidebar Drawer */}
            <aside className={`w-[260px] bg-white border-r border-[#e5e5ea] flex flex-col fixed top-0 h-screen z-50 transition-transform duration-400 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}>
                <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-10 px-2">
                        <span className="text-[22px] font-semibold tracking-tight text-[#1d1d1f]">Zento <span className="text-[#86868b] font-normal">Sellers</span></span>

                        {/* Close button for mobile */}
                        <button
                            onClick={onClose}
                            className="lg:hidden p-1.5 text-[#86868b] hover:text-[#1d1d1f] transition-colors"
                        >
                            <HugeiconsIcon icon={Cancel01Icon} size={20} />
                        </button>
                    </div>

                    <nav className="space-y-1">
                        <p className="px-3 text-[11px] font-semibold text-[#86868b] uppercase tracking-widest mb-3">Management</p>
                        {sidebarMenu.map((item) => (
                            <Link
                                key={item.id}
                                to={item.path}
                                onClick={onClose}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${isActive(item.path)
                                    ? 'bg-[#f5f5f7] text-[#0071e3]'
                                    : 'text-[#515154] hover:bg-[#f5f5f7] hover:text-[#1d1d1f]'
                                    }`}
                            >
                                <HugeiconsIcon icon={item.icon} size={20} className={`transition-transform duration-200 ${isActive(item.path) ? 'scale-105' : 'opacity-70 group-hover:opacity-100'}`} />
                                <span className={`text-[14.5px] font-medium tracking-tight ${isActive(item.path) ? 'font-semibold' : ''}`}>{item.label}</span>
                                {item.id === 'orders' && (
                                    <span className={`ml-auto text-[11px] font-semibold px-1.5 py-0.5 rounded-md ${isActive(item.path) ? 'bg-[#0071e3] text-white' : 'bg-[#e5e5ea] text-[#86868b]'}`}>0</span>
                                )}
                            </Link>
                        ))}
                    </nav>

                    <div className="mt-8">
                        <p className="px-3 text-[11px] font-semibold text-[#86868b] uppercase tracking-widest mb-3">Account</p>
                        <Link
                            to="/vendor/settings"
                            onClick={onClose}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${location.pathname.startsWith('/vendor/settings')
                                ? 'bg-[#f5f5f7] text-[#0071e3]'
                                : 'text-[#515154] hover:bg-[#f5f5f7] hover:text-[#1d1d1f]'
                                }`}
                        >
                            <HugeiconsIcon icon={Settings01Icon} size={20} className={`${location.pathname.startsWith('/vendor/settings') ? 'scale-105' : 'opacity-70 group-hover:opacity-100'}`} />
                            <span className={`text-[14.5px] font-medium tracking-tight ${location.pathname.startsWith('/vendor/settings') ? 'font-semibold' : ''}`}>Settings</span>
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-[#e30000] hover:bg-red-50 rounded-xl transition-all duration-200 group mt-1 cursor-pointer"
                        >
                            <HugeiconsIcon icon={Logout01Icon} size={20} className="opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-transform" />
                            <span className="text-[14.5px] font-medium tracking-tight">Sign out</span>
                        </button>
                    </div>
                </div>

                <div className="p-6 border-t border-[#e5e5ea]">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#f5f5f7] to-[#e5e5ea] border border-white shadow-sm flex items-center justify-center font-medium text-[15px] text-[#1d1d1f]">
                            {user?.name?.substring(0, 2).toUpperCase() || 'VN'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-[14px] font-semibold text-[#1d1d1f] truncate tracking-tight">{user?.name || 'Vendor'}</p>
                            <p className="text-[12px] font-medium text-[#86868b] truncate tracking-tight">{user?.email}</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;

