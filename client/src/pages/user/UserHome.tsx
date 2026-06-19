import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    PackageIcon,
    Settings03Icon,
    FavouriteIcon,
    Logout01Icon,
    ArrowRight01Icon,
    HelpCircleIcon
} from "@hugeicons/core-free-icons";

// Personalization Sections
import Recommended from "../../sections/Landing/Recommended";
import TrendingProducts from "../../sections/Landing/TrendingProducts";
import RecentlyViewed from "../../sections/Landing/RecentlyViewed";

const UserHome = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const dashboardItems = [
        {
            title: "Your Orders",
            description: "Track, return, or buy things again",
            icon: PackageIcon,
            link: "/user/orders",
            color: "text-blue-500",
            bg: "bg-blue-50"
        },
        {
            title: "Wishlist",
            description: "View and manage your favorite items",
            icon: FavouriteIcon,
            link: "/user/wishlist",
            color: "text-pink-500",
            bg: "bg-pink-50"
        },
        {
            title: "Account Settings",
            description: "Edit addresses, password and preferences",
            icon: Settings03Icon,
            link: "/user/settings",
            color: "text-gray-600",
            bg: "bg-gray-100"
        },
        {
            title: "Help & Support",
            description: "Browse guides or contact our experts",
            icon: HelpCircleIcon,
            link: "/help",
            color: "text-green-600",
            bg: "bg-green-50"
        }
    ];

    return (
        /* Break out of ProfileLayout's padded container using negative margins */
        <div className="bg-[#fbfbfd] min-h-screen font-sans -mx-4 sm:-mx-6 -mt-12">

            {/* Dashboard Header + Grid — constrained width */}
            <div className="max-w-[1100px] mx-auto px-6 pt-24 pb-16">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-[40px] font-semibold text-[#1d1d1f] tracking-tight leading-tight">
                            Hello, <span className="text-[#0071e3]">{user?.name || "Guest"}</span>.
                        </h1>
                        <p className="mt-2 text-[17px] text-[#86868b] font-medium">
                            Your personalized shopping dashboard.
                        </p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-[14px] font-medium text-[#c1c1c7] hover:text-[#e30000] transition-colors self-start md:self-center"
                    >
                        <HugeiconsIcon icon={Logout01Icon} size={18} />
                        Logout
                    </button>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {dashboardItems.map((item, idx) => (
                        <div
                            key={idx}
                            onClick={() => navigate(item.link)}
                            className="group bg-white p-6 rounded-3xl border border-[#d2d2d7]/30 hover:border-[#0071e3]/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-all cursor-pointer relative"
                        >
                            <div className={`w-12 h-12 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-6`}>
                                <HugeiconsIcon icon={item.icon} size={24} />
                            </div>

                            <h3 className="text-[17px] font-semibold text-[#1d1d1f] mb-1">
                                {item.title}
                            </h3>
                            <p className="text-[13px] text-[#86868b] leading-snug pr-4">
                                {item.description}
                            </p>

                            <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-[#0071e3]">
                                <HugeiconsIcon icon={ArrowRight01Icon} size={20} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Full-width Recommendation Sections — rendered OUTSIDE the constrained container */}
            <Recommended />
            <TrendingProducts />
            <RecentlyViewed />

        </div>
    );
};

export default UserHome;