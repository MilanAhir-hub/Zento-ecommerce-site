import { useState } from "react";
import {
    LayoutDashboard, Users, ShoppingBag, Store,
    Settings, LogOut, Package, AlertCircle
} from "lucide-react";

import DashboardOverview from "../../sections/admin/DashboardOverview";
import OrdersManagement from "../../sections/admin/OrdersManagement";
import ProductsManagement from "../../sections/admin/ProductsManagement";
import CustomersManagement from "../../sections/admin/CustomersManagement";
import VendorsManagement from "../../sections/admin/VendorsManagement";
import VendorRequests from "../../sections/admin/VendorRequests";
import AdminSettings from "../../sections/admin/AdminSettings";

const AdminDashboard = () => {
    const [activeSection, setActiveSection] = useState('overview');

    const renderSection = () => {
        switch (activeSection) {
            case 'overview': return <DashboardOverview />;
            case 'orders': return <OrdersManagement />;
            case 'products': return <ProductsManagement />;
            case 'customers': return <CustomersManagement />;
            case 'vendors': return <VendorsManagement />;
            case 'requests': return <VendorRequests />;
            case 'settings': return <AdminSettings />;
            default: return <DashboardOverview />;
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 flex font-sans">

            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-stone-200 hidden md:flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-stone-100">
                    <span className="text-xl font-black tracking-tighter text-stone-900">ZENTO ADMIN</span>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    <div className="mb-6">
                        <p className="px-3 text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Overview</p>
                        <button
                            onClick={() => setActiveSection('overview')}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl group transition-all ${activeSection === 'overview' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                                }`}
                        >
                            <LayoutDashboard className={`w-5 h-5 ${activeSection === 'overview' ? 'text-stone-300 group-hover:text-white' : 'text-stone-400 group-hover:text-stone-700'}`} />
                            <span className="font-semibold text-sm">Dashboard</span>
                        </button>
                    </div>

                    <div className="mb-6">
                        <p className="px-3 text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Management</p>
                        <button
                            onClick={() => setActiveSection('orders')}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl group transition-all ${activeSection === 'orders' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                                }`}
                        >
                            <ShoppingBag className={`w-5 h-5 ${activeSection === 'orders' ? 'text-stone-300 group-hover:text-white' : 'text-stone-400 group-hover:text-stone-700'}`} />
                            <span className="font-semibold text-sm">Orders</span>
                            <span className={`ml-auto py-0.5 px-2 rounded-full text-[10px] font-bold ${activeSection === 'orders' ? 'bg-stone-700 text-stone-200' : 'bg-stone-200 text-stone-700'}`}>12</span>
                        </button>
                        <button
                            onClick={() => setActiveSection('products')}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl group transition-all ${activeSection === 'products' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                                }`}
                        >
                            <Package className={`w-5 h-5 ${activeSection === 'products' ? 'text-stone-300 group-hover:text-white' : 'text-stone-400 group-hover:text-stone-700'}`} />
                            <span className="font-semibold text-sm">Products</span>
                        </button>
                        <button
                            onClick={() => setActiveSection('customers')}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl group transition-all ${activeSection === 'customers' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                                }`}
                        >
                            <Users className={`w-5 h-5 ${activeSection === 'customers' ? 'text-stone-300 group-hover:text-white' : 'text-stone-400 group-hover:text-stone-700'}`} />
                            <span className="font-semibold text-sm">Customers</span>
                        </button>
                    </div>

                    <div className="mb-6">
                        <p className="px-3 text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Vendors</p>
                        <button
                            onClick={() => setActiveSection('vendors')}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl group transition-all ${activeSection === 'vendors' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                                }`}
                        >
                            <Store className={`w-5 h-5 ${activeSection === 'vendors' ? 'text-stone-300 group-hover:text-white' : 'text-stone-400 group-hover:text-stone-700'}`} />
                            <span className="font-semibold text-sm">All Vendors</span>
                        </button>
                        <button
                            onClick={() => setActiveSection('requests')}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl group transition-all ${activeSection === 'requests' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                                }`}
                        >
                            <AlertCircle className={`w-5 h-5 ${activeSection === 'requests' ? 'text-stone-300 group-hover:text-white' : 'text-stone-400 group-hover:text-stone-700'}`} />
                            <span className="font-semibold text-sm">Requests</span>
                            <span className={`ml-auto py-0.5 px-2 rounded-full text-[10px] font-bold ${activeSection === 'requests' ? 'bg-red-900/50 text-red-200' : 'bg-red-100 text-red-600'}`}>3</span>
                        </button>
                    </div>
                </nav>

                <div className="p-4 border-t border-stone-100">
                    <button
                        onClick={() => setActiveSection('settings')}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl group transition-all ${activeSection === 'settings' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                            }`}
                    >
                        <Settings className={`w-5 h-5 ${activeSection === 'settings' ? 'text-stone-300 group-hover:text-white' : 'text-stone-400 group-hover:text-stone-700'}`} />
                        <span className="font-semibold text-sm">Settings</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl group transition-all mt-1">
                        <LogOut className="w-5 h-5 text-red-400 group-hover:text-red-600" />
                        <span className="font-semibold text-sm">Sign out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-6 lg:px-8 shrink-0">
                    <h1 className="text-xl font-bold text-stone-900">Dashboard</h1>
                    <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="w-9 h-9 bg-stone-900 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm cursor-pointer hover:bg-stone-800 transition-colors">
                            AD
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="flex-1 overflow-y-auto p-6 lg:p-8">
                    {renderSection()}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
