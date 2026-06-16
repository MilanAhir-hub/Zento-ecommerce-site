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
                className={`fixed inset-0 bg-brand-black/20 backdrop-blur-sm z-50 transition-opacity duration-default ease-editorial lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Sidebar Drawer */}
            <aside className={`w-[260px] bg-white border-r border-[#E5E5E5] flex flex-col fixed top-0 h-screen z-50 transition-transform duration-default ease-editorial lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}>
                <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-10 px-2">
                        <span className="text-[20px] font-semibold uppercase tracking-widest text-brand-black">
                            Novara <span className="text-gray-muted font-light">Sellers</span>
                        </span>

                        {/* Close button for mobile */}
                        <button
                            onClick={onClose}
                            className="lg:hidden p-1.5 text-gray-muted hover:text-brand-black transition-colors"
                            aria-label="Close sidebar"
                        >
                            <HugeiconsIcon icon={Cancel01Icon} size={20} />
                        </button>
                    </div>

                    <nav className="space-y-1">
                        <p className="px-3 text-[11px] font-semibold text-gray-muted uppercase tracking-widest mb-3">Management</p>
                        {sidebarMenu.map((item) => (
                            <Link
                                key={item.id}
                                to={item.path}
                                onClick={onClose}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-none transition-all duration-default ease-editorial group ${isActive(item.path)
                                    ? 'bg-brand-black text-brand-white font-semibold'
                                    : 'text-gray-dark hover:bg-gray-bg hover:text-brand-black hover:underline'
                                    }`}
                            >
                                <HugeiconsIcon
                                    icon={item.icon}
                                    size={20}
                                    className={`transition-transform duration-default ease-editorial ${isActive(item.path) ? 'scale-100 text-brand-white' : 'opacity-70 group-hover:opacity-100 text-gray-dark group-hover:text-brand-black'}`}
                                />
                                <span className={`text-[13px] font-medium tracking-tight ${isActive(item.path) ? 'font-semibold' : ''}`}>{item.label}</span>
                                {item.id === 'orders' && (
                                    <span className={`ml-auto text-[11px] font-semibold px-1.5 py-0.5 rounded-none tabular-nums ${isActive(item.path) ? 'bg-brand-white text-brand-black border border-brand-white' : 'bg-gray-light text-gray-muted'}`}>0</span>
                                )}
                            </Link>
                        ))}
                    </nav>

                    <div className="mt-8">
                        <p className="px-3 text-[11px] font-semibold text-gray-muted uppercase tracking-widest mb-3">Account</p>
                        <Link
                            to="/vendor/settings"
                            onClick={onClose}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-none transition-all duration-default ease-editorial group ${location.pathname.startsWith('/vendor/settings')
                                ? 'bg-brand-black text-brand-white font-semibold'
                                : 'text-gray-dark hover:bg-gray-bg hover:text-brand-black hover:underline'
                                }`}
                        >
                            <HugeiconsIcon
                                icon={Settings01Icon}
                                size={20}
                                className={`transition-transform duration-default ease-editorial ${location.pathname.startsWith('/vendor/settings') ? 'scale-100 text-brand-white' : 'opacity-70 group-hover:opacity-100 text-gray-dark group-hover:text-brand-black'}`}
                            />
                            <span className={`text-[13px] font-medium tracking-tight ${location.pathname.startsWith('/vendor/settings') ? 'font-semibold' : ''}`}>Settings</span>
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-[#BC0000] hover:bg-[#ffe5e5] rounded-none transition-all duration-default ease-editorial group mt-1 cursor-pointer"
                        >
                            <HugeiconsIcon icon={Logout01Icon} size={20} className="opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-transform duration-default ease-editorial" />
                            <span className="text-[13px] font-medium tracking-tight">Sign out</span>
                        </button>
                    </div>
                </div>

                <div className="p-6 border-t border-[#E5E5E5] bg-gray-bg">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-10 h-10 rounded-none bg-white border border-[#E5E5E5] flex items-center justify-center font-medium text-[14px] text-brand-black">
                            {user?.name?.substring(0, 2).toUpperCase() || 'VN'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-[13px] font-semibold text-brand-black truncate tracking-tight">{user?.name || 'Vendor'}</p>
                            <p className="text-[11px] font-medium text-gray-muted truncate tracking-tight">{user?.email}</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;

