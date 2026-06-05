import { useState } from "react";
import { useAuth } from "../../context/authContext";
import { useNavigate, Routes, Route, useLocation } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignCircleIcon } from "@hugeicons/core-free-icons";

// Components
import Sidebar from "./components/Sidebar";
import DashboardHeader from "./components/DashboardHeader";

// Sections
import Overview from "./sections/vendor/Overview";
import Products from "./sections/vendor/Products";
import AddProduct from "./sections/vendor/AddProduct";
import Orders from "./sections/vendor/Orders";
import Analytics from "./sections/vendor/Analytics";
import Settings from "./sections/vendor/Settings";

const VendorDashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const getActiveSection = () => {
        const pathname = location.pathname;

        if (pathname === "/vendor" || pathname === "/vendor/overview" || pathname === "/vendor/dashboard") {
            return "overview";
        }

        if (pathname.startsWith("/vendor/products/add") || pathname.startsWith("/vendor/products/edit/")) {
            return "add-product";
        }


        const pathParts = pathname.split("/").filter(Boolean);
        return pathParts[pathParts.length - 1] || "overview";
    };

    const activeSection = getActiveSection();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-[#f5f5f7] flex font-sans text-[#1d1d1f] selection:bg-[#0071e3] selection:text-white">
            {/* Sidebar component */}
            <Sidebar
                activeSection={activeSection}
                setActiveSection={(section) => {
                    navigate(`/vendor/${section === 'overview' ? '' : section}`);
                    setIsSidebarOpen(false);
                }}
                user={user}
                handleLogout={handleLogout}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 min-h-screen relative lg:ml-[260px]">
                {/* Dashboard Header */}
                <DashboardHeader
                    user={user}
                    navigate={navigate}
                    onMenuClick={() => setIsSidebarOpen(true)}
                    activeSection={activeSection}
                />

                {/* Dashboard Content */}
                <div className="p-4 lg:p-10 pb-24 lg:pb-12 max-w-[1400px] mx-auto w-full">
                    <Routes>
                        <Route path="/" element={<Overview />} />
                        <Route path="/overview" element={<Overview />} />
                        <Route path="/dashboard" element={<Overview />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/products/add" element={<AddProduct />} />
                        <Route path="/products/edit/:productId" element={<AddProduct />} />
                        <Route path="/add-product" element={<AddProduct />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/analytics" element={<Analytics />} />
                        <Route path="/settings" element={<Settings />} />
                    </Routes>
                </div>

                {/* Floating Action Button (Mobile Only) */}
                <button
                    onClick={() => navigate('/vendor/products/add')}
                    className="fixed bottom-8 right-6 lg:hidden bg-[#1d1d1f] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl active:scale-95 transition-all z-40"
                >
                    <HugeiconsIcon icon={PlusSignCircleIcon} size={24} />
                </button>
            </main>
        </div>
    );
};

export default VendorDashboard;
