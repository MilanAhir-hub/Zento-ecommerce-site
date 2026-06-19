import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    DashboardCircleIcon,
    UserGroupIcon,
    ShoppingBag01Icon,
    Store01Icon,
    Settings01Icon,
    Logout01Icon,
    PackageIcon,
    Alert01Icon
} from "@hugeicons/core-free-icons";

import DashboardOverview from "../../sections/admin/DashboardOverview";
import OrdersManagement from "../../sections/admin/OrdersManagement";
import ProductsManagement from "../../sections/admin/ProductsManagement";
import CustomersManagement from "../../sections/admin/CustomersManagement";
import VendorsManagement from "../../sections/admin/VendorsManagement";
import VendorRequests from "../../sections/admin/VendorRequests";
import AdminSettings from "../../sections/admin/AdminSettings";
import { useAdminRealTime } from "../../hooks/admin/useAdminRealTime";
import { useAuth } from "../../context/authContext";

const AdminDashboard = () => {
    useAdminRealTime(); // Mounts the global real-time socket connection for the admin area

    const [activeSection, setActiveSection] = useState('overview');
    const [filterVendorId, setFilterVendorId] = useState<string | null>(null);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const { logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const renderSection = () => {
        switch (activeSection) {
            case 'overview': return <DashboardOverview />;
            case 'orders': return <OrdersManagement />;
            case 'products': return <ProductsManagement filterVendorId={filterVendorId} onClearFilter={() => setFilterVendorId(null)} />;
            case 'customers': return <CustomersManagement />;
            case 'vendors': return (
                <VendorsManagement
                    onViewCatalog={(vendorId) => {
                        setFilterVendorId(vendorId);
                        setActiveSection('products');
                    }}
                />
            );
            case 'requests': return <VendorRequests />;
            case 'settings': return <AdminSettings />;
            default: return <DashboardOverview />;
        }
    };

    const navItems = [
        { id: 'overview', label: 'Dashboard', icon: DashboardCircleIcon, group: 'Overview' },
        { id: 'orders', label: 'Orders', icon: ShoppingBag01Icon, group: 'Management', badge: 12 },
        { id: 'products', label: 'Products', icon: PackageIcon, group: 'Management' },
        { id: 'customers', label: 'Customers', icon: UserGroupIcon, group: 'Management' },
        { id: 'vendors', label: 'All Vendors', icon: Store01Icon, group: 'Vendors' },
        { id: 'requests', label: 'Requests', icon: Alert01Icon, group: 'Vendors', badge: 3, badgeColor: 'bg-red-500' },
    ];

    return (
        <div className="min-h-screen bg-[#f5f5f7] flex font-sans antialiased text-[#1d1d1f]">

            {/* Mobile Sidebar Overlay */}
            {isMobileSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsMobileSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`w-72 bg-white/80 backdrop-blur-xl border-r border-[#d2d2d7]/30 hidden md:flex flex-col sticky top-0 h-screen max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-50 max-md:transition-transform max-md:duration-300 ${isMobileSidebarOpen ? 'max-md:translate-x-0' : 'max-md:-translate-x-full'}`}>
                <div className="h-20 flex items-center px-8">
                    <span className="text-[22px] font-bold tracking-tight text-[#1d1d1f]">Novara <span className="text-[#0071e3]">Admin</span></span>
                    <button
                        onClick={() => setIsMobileSidebarOpen(false)}
                        className="ml-auto md:hidden p-2 text-[#86868b] hover:text-[#1d1d1f] transition-colors"
                        aria-label="Close sidebar"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-8 overflow-y-auto custom-scrollbar">
                    {['Overview', 'Management', 'Vendors'].map((group) => (
                        <div key={group} className="space-y-1">
                            <p className="px-4 text-[11px] font-bold text-[#86868b] uppercase tracking-widest mb-3">{group}</p>
                            {navItems.filter(item => item.group === group).map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveSection(item.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl group transition-all duration-200 ${activeSection === item.id
                                        ? 'bg-[#0071e3] text-white shadow-[0_8px_20px_rgba(0,113,227,0.2)]'
                                        : 'text-[#1d1d1f] hover:bg-[#f5f5f7] hover:text-[#0071e3]'
                                        }`}
                                >
                                    <HugeiconsIcon
                                        icon={item.icon}
                                        size={20}
                                        className={`${activeSection === item.id ? 'text-white' : 'text-[#86868b] group-hover:text-[#0071e3]'}`}
                                    />
                                    <span className="font-semibold text-[14px]">{item.label}</span>
                                    {item.badge && (
                                        <span className={`ml-auto py-0.5 px-2 rounded-full text-[10px] font-bold ${activeSection === item.id
                                            ? 'bg-white/20 text-white'
                                            : (item.badgeColor || 'bg-[#f5f5f7] text-[#86868b]')
                                            }`}>
                                            {item.badge}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    ))}
                </nav>

                <div className="p-6 space-y-2">
                    <button
                        onClick={() => setActiveSection('settings')}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl group transition-all duration-200 ${activeSection === 'settings'
                            ? 'bg-[#0071e3] text-white shadow-[0_8px_20px_rgba(0,113,227,0.2)]'
                            : 'text-[#1d1d1f] hover:bg-[#f5f5f7] hover:text-[#0071e3]'
                            }`}
                    >
                        <HugeiconsIcon icon={Settings01Icon} size={20} className={`${activeSection === 'settings' ? 'text-white' : 'text-[#86868b] group-hover:text-[#0071e3]'}`} />
                        <span className="font-semibold text-[14px]">Settings</span>
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-[#e30000] hover:bg-red-50 rounded-2xl group transition-all duration-200"
                    >
                        <HugeiconsIcon icon={Logout01Icon} size={20} className="text-[#ff453a] group-hover:text-[#e30000]" />
                        <span className="font-semibold text-[14px]">Sign out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 md:ml-72">
                {/* Header */}
                <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-[#d2d2d7]/30 flex items-center justify-between px-4 sm:px-8 lg:px-12 sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsMobileSidebarOpen(true)}
                            className="md:hidden p-2 -ml-2 text-[#1d1d1f] hover:bg-[#f5f5f7] rounded-xl transition-colors"
                            aria-label="Open sidebar"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        </button>
                        <h1 className="text-[18px] sm:text-[22px] font-bold text-[#1d1d1f] tracking-tight">
                            {navItems.find(i => i.id === activeSection)?.label || 'Settings'}
                        </h1>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex-col items-end hidden sm:flex">
                            <span className="text-[13px] font-bold text-[#1d1d1f]">Milan Gagiya</span>
                            <span className="text-[11px] font-medium text-[#86868b]">Super Admin</span>
                        </div>
                        <div className="w-10 h-10 bg-white rounded-full border border-[#d2d2d7]/30 flex items-center justify-center font-bold text-sm shadow-sm cursor-pointer hover:bg-[#f5f5f7] transition-all duration-200">
                            MG
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="flex-1 p-8 lg:p-12 max-w-[1400px]">
                    {renderSection()}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
