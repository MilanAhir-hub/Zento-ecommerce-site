import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';

interface ProfileMegaMenuProps {
    isVisible: boolean;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onItemClick: () => void;
}

const ProfileMegaMenu: React.FC<ProfileMegaMenuProps> = ({
    isVisible,
    onMouseEnter,
    onMouseLeave,
    onItemClick
}) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            onItemClick();
            navigate('/login');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const navSections = user ? [
        {
            title: "Manage Account",
            links: [
                { label: "Profile Info", to: "/user/personal-info" },
                { label: "Order History", to: "/user/orders" },
                { label: "Settings", to: "/user/settings" },
                { label: "Notifications", to: "/user/notifications" },
            ]
        },
        {
            title: "Collections",
            links: [
                { label: "Wishlist", to: "/user/wishlist" },
                { label: "Saved Addresses", to: "/user/addresses" },
            ]
        },
        {
            title: "Support",
            links: [
                { label: "Help Center", to: "/help" },
                { label: "Zento Guide", to: "/guide" },
            ]
        }
    ] : [
        {
            title: "Support & Help",
            links: [
                { label: "Help Center", to: "/help" },
                { label: "Zento Guide", to: "/guide" },
                { label: "Track Order", to: "/track-order" },
                { label: "Returns & Exchanges", to: "/returns" },
            ]
        },
        {
            title: "Quick Links",
            links: [
                { label: "Store Locator", to: "/stores" },
                { label: "Gift Cards", to: "/gift-cards" },
                { label: "Contact Us", to: "/contact" },
            ]
        }
    ];

    return (
        <div
            className={`absolute left-0 right-0 top-[48px] w-full bg-white border-b border-gray-200 transition-all duration-300 ease-in-out z-40 overflow-hidden ${isVisible ? 'max-h-[550px] opacity-100 py-12' : 'max-h-0 opacity-0 py-0'
                }`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div className="max-w-[1300px] mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

                    {/* Left Section: User Identity or Login CTA */}
                    <div className="col-span-1">
                        <h3 className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-6">
                            {user ? 'My Account' : 'Welcome to Zento'}
                        </h3>
                        {user ? (
                            <div className="space-y-1">
                                <h2 className="text-2xl font-bold text-gray-900 tracking-tight leading-tight">
                                    {user.name}
                                </h2>
                                <p className="text-sm text-gray-500 font-medium">{user.email}</p>

                                {(user.role === 'vendor' || user.role === 'admin') ? (
                                    <Link
                                        to={user.role === 'admin' ? "/admin/dashboard" : "/vendor/overview"}
                                        onClick={onItemClick}
                                        className="inline-block mt-4 text-[13px] font-semibold text-[#0071e3] hover:underline"
                                    >
                                        Open {user.role === 'admin' ? "Admin" : "Seller"} Dashboard
                                    </Link>
                                ) : (
                                    <Link
                                        to="/apply-seller"
                                        onClick={onItemClick}
                                        className="inline-block mt-4 text-[13px] font-semibold text-[#0071e3] hover:underline"
                                    >
                                        Become a Retailer
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-sm text-gray-500 font-medium">
                                    Sign in for a better experience, track your orders and manage preferences.
                                </p>
                                <div className="flex flex-col gap-3 pt-2">
                                    <Link
                                        to="/login"
                                        onClick={onItemClick}
                                        className="inline-flex items-center justify-center px-4 py-2 text-[13px] font-semibold text-white bg-black rounded-full hover:bg-gray-800 transition-colors w-fit"
                                    >
                                        Sign In
                                    </Link>
                                    <p className="text-[12px] text-gray-500">
                                        New customer? <Link to="/register" onClick={onItemClick} className="text-[#0071e3] hover:underline">Create account</Link>
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Section: Navigation Segments */}
                    <div className="col-span-3">
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8">
                            {navSections.map((section, idx) => (
                                <div key={idx} className="space-y-6">
                                    <h4 className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-6">
                                        {section.title}
                                    </h4>
                                    <div className="flex flex-col gap-y-1">
                                        {section.links.map((link, lIdx) => (
                                            <Link
                                                key={lIdx}
                                                to={link.to}
                                                onClick={onItemClick}
                                                className="text-sm text-gray-600 hover:text-black transition-colors py-1"
                                            >
                                                {link.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="mt-12 pt-8 border-t border-gray-100 flex gap-12">
                    <div>
                        <h4 className="text-[11px] font-medium text-gray-400 uppercase mb-4 tracking-widest">
                            {user ? 'Account Actions' : 'Support'}
                        </h4>
                        <div className="flex gap-8 items-center">
                            {user ? (
                                <button
                                    onClick={handleLogout}
                                    className="text-sm font-medium hover:underline text-rose-600"
                                >
                                    Sign Out
                                </button>
                            ) : null}
                            <Link to="/about" onClick={onItemClick} className="text-sm font-medium hover:underline text-gray-900">
                                Privacy Policy
                            </Link>
                            <Link to="/help" onClick={onItemClick} className="text-sm font-medium hover:underline text-gray-900">
                                Global Support
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileMegaMenu;
