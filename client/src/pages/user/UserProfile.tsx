import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    User, ChevronDown, ChevronUp, Package, Heart, MapPin,
    HelpCircle, Book, Info, LogOut, Bell
} from "lucide-react";
import { useAuth } from "../../context/authContext";

const getInitials = (name?: string) => {
    if (!name) return '';
    const nameParts = name.trim().split(' ');
    if (nameParts.length >= 2) {
        return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return nameParts[0].substring(0, 2).toUpperCase();
};

const UserProfile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isAccountOpen, setIsAccountOpen] = useState(true);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Failed to logout", error);
        }
    }

    return (
        <div className="min-h-[calc(100vh-130px)] bg-white lg:bg-[#f8f8f8] py-4 lg:py-8 px-4 sm:px-6 lg:px-8 transition-colors">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-start gap-6 md:gap-8">

                {/* Left Sidebar Navigation */}
                <div className="w-full lg:w-72 shrink-0">
                    <div className="bg-transparent lg:bg-white lg:rounded-2xl lg:shadow-sm lg:border lg:border-stone-200 overflow-hidden lg:transition-all">

                        {/* User Header */}
                        <div className="p-4 lg:p-6 border-b-0 lg:border-b lg:border-stone-100 flex items-center gap-4">
                            <div className="flex items-center justify-center bg-stone-900 text-white rounded-full h-[52px] w-[52px] text-lg font-bold shrink-0 shadow-sm">
                                {user ? getInitials(user.name) : <User className="h-6 w-6" />}
                            </div>
                            <div className="overflow-hidden">
                                <h2 className="font-bold text-stone-900 truncate text-lg lg:text-base">
                                    {user?.name}
                                </h2>
                                <p className="text-sm font-medium text-stone-500 truncate mt-0.5">
                                    {user?.email}
                                </p>
                            </div>
                        </div>

                        {/* Mobile Quick Actions Row */}
                        <div className="flex lg:hidden items-center justify-around py-6 border-b border-stone-100 lg:border-none bg-transparent">
                            {/* Orders Button */}
                            <Link to="/user/orders" className="flex flex-col items-center gap-2 group">
                                <div className="h-12 w-12 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center text-stone-600 group-hover:bg-stone-100 group-hover:text-stone-900 transition-all">
                                    <Package className="h-[22px] w-[22px]" />
                                </div>
                                <span className="text-[12px] font-bold text-stone-600 group-hover:text-stone-900 transition-colors">Orders</span>
                            </Link>

                            {/* Wishlist Button */}
                            <Link to="/user/wishlist" className="flex flex-col items-center gap-2 group">
                                <div className="h-12 w-12 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center text-stone-600 group-hover:bg-stone-100 group-hover:text-stone-900 transition-all">
                                    <Heart className="h-[22px] w-[22px]" />
                                </div>
                                <span className="text-[12px] font-bold text-stone-600 group-hover:text-stone-900 transition-colors">Wishlist</span>
                            </Link>

                            {/* Help Button */}
                            <Link to="/help" className="flex flex-col items-center gap-2 group">
                                <div className="h-12 w-12 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center text-stone-600 group-hover:bg-stone-100 group-hover:text-stone-900 transition-all">
                                    <HelpCircle className="h-[22px] w-[22px]" />
                                </div>
                                <span className="text-[12px] font-bold text-stone-600 group-hover:text-stone-900 transition-colors">Help</span>
                            </Link>
                        </div>


                        {/* Navigation Options */}
                        <div className="p-0 lg:p-4 space-y-1">
                            {/* My Account Section */}
                            <div className="border-b lg:border-none border-stone-100">
                                <button
                                    onClick={() => setIsAccountOpen(!isAccountOpen)}
                                    className="w-full flex items-center justify-between p-4 lg:p-3 text-stone-900 hover:bg-stone-50 lg:rounded-xl transition-colors font-bold cursor-pointer"
                                >
                                    <span>My Account</span>
                                    {isAccountOpen ? <ChevronUp className="h-4 w-4 text-stone-500" /> : <ChevronDown className="h-4 w-4 text-stone-500" />}
                                </button>

                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isAccountOpen ? "max-h-[300px] opacity-100 mt-1" : "max-h-0 opacity-0"}`}>
                                    <div className="flex flex-col pl-4 lg:pl-3 space-y-1 pb-4 lg:pb-1">
                                        {/* Desktop only links in dropdown */}
                                        <Link to="/user/orders" className="hidden lg:flex items-center gap-3 p-2.5 text-stone-600 hover:text-stone-900 hover:bg-stone-50 rounded-xl transition-colors group">
                                            <Package className="h-4 w-4 text-stone-400 group-hover:text-stone-700 transition-colors" />
                                            <span className="text-[14px] font-semibold">My Orders</span>
                                        </Link>
                                        <Link to="/user/wishlist" className="hidden lg:flex items-center gap-3 p-2.5 text-stone-600 hover:text-stone-900 hover:bg-stone-50 rounded-xl transition-colors group">
                                            <Heart className="h-4 w-4 text-stone-400 group-hover:text-stone-700 transition-colors" />
                                            <span className="text-[14px] font-semibold">Wishlist</span>
                                        </Link>

                                        {/* Notifications - requested for mobile */}
                                        <Link to="/user/notifications" className="flex items-center gap-3 p-2.5 text-stone-600 hover:text-stone-900 hover:bg-stone-50 lg:rounded-xl transition-colors group">
                                            <Bell className="h-4 w-4 text-stone-400 group-hover:text-stone-700 transition-colors" />
                                            <span className="text-[14px] font-semibold lg:font-semibold">My Notifications</span>
                                        </Link>

                                        {/* Delivery Address */}
                                        <Link to="/user/addresses" className="flex items-center gap-3 p-2.5 text-stone-600 hover:text-stone-900 hover:bg-stone-50 lg:rounded-xl transition-colors group">
                                            <MapPin className="h-4 w-4 text-stone-400 group-hover:text-stone-700 transition-colors" />
                                            <span className="text-[14px] font-semibold">Delivery Address</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <div className="hidden lg:block h-px bg-stone-100 my-3"></div>

                            {/* Help & Support */}
                            <div className="py-2 lg:py-1 border-b lg:border-none border-stone-100">
                                <h3 className="px-4 lg:px-3 text-[11px] font-bold text-stone-400 uppercase tracking-widest mb-2 mt-2 lg:mt-0">Help & Support</h3>
                                <Link to="/help" className="flex items-center gap-3 p-4 lg:p-3 text-stone-700 hover:text-stone-900 hover:bg-stone-50 lg:rounded-xl transition-colors font-semibold text-[14px] group">
                                    <HelpCircle className="h-4 w-4 text-stone-400 group-hover:text-stone-700 transition-colors" />
                                    <span>Need Help</span>
                                </Link>
                                <Link to="/guide" className="flex items-center gap-3 p-4 lg:p-3 text-stone-700 hover:text-stone-900 hover:bg-stone-50 lg:rounded-xl transition-colors font-semibold text-[14px] group">
                                    <Book className="h-4 w-4 text-stone-400 group-hover:text-stone-700 transition-colors" />
                                    <span>Guide</span>
                                </Link>
                            </div>

                            <div className="hidden lg:block h-px bg-stone-100 my-3"></div>

                            {/* More Information */}
                            <div className="py-2 lg:py-1">
                                <h3 className="px-4 lg:px-3 text-[11px] font-bold text-stone-400 uppercase tracking-widest mb-2 mt-2 lg:mt-0">More Information</h3>
                                <Link to="/about" className="flex items-center gap-3 p-4 lg:p-3 text-stone-700 hover:text-stone-900 hover:bg-stone-50 lg:rounded-xl transition-colors font-semibold text-[14px] group">
                                    <Info className="h-4 w-4 text-stone-400 group-hover:text-stone-700 transition-colors" />
                                    <span>About Zento</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 p-4 lg:p-3 text-red-600 hover:bg-red-50 lg:rounded-xl transition-colors font-semibold text-[14px] cursor-pointer group text-left px-4"
                                >
                                    <LogOut className="h-4 w-4 text-red-500 group-hover:text-red-600 transition-colors" />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Content Box (Hidden on Mobile) */}
                <div className="hidden lg:block flex-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 md:p-10">
                        <div className="flex justify-between items-center border-b border-stone-100 pb-6 mb-8 mt-2">
                            <h2 className="text-2xl font-bold text-stone-900 tracking-tight">Account Information</h2>
                            <button className="px-6 py-2.5 bg-stone-900 hover:bg-black text-white text-sm font-semibold rounded-full transition-colors cursor-pointer shadow-md">
                                Edit
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12">
                            {/* Full Name */}
                            <div>
                                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Full Name</p>
                                <p className="text-[15px] font-semibold text-stone-900">
                                    {user?.name || "Milan Naranbhai Gagiya"}
                                </p>
                            </div>

                            {/* Email ID */}
                            <div>
                                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Email ID</p>
                                <p className="text-[15px] font-semibold text-stone-900 break-all">
                                    {user?.email || "9265201108@nomail.jiomart.com"}
                                </p>
                            </div>

                            {/* Mobile No */}
                            <div>
                                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Mobile No</p>
                                <p className="text-[15px] font-semibold text-stone-900">
                                    +91 9265201108
                                </p>
                            </div>

                            {/* Default Address */}
                            <div className="md:col-span-2">
                                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Default Address</p>
                                <p className="text-[15px] font-medium text-stone-800 leading-relaxed max-w-3xl">
                                    lord krishna society, dwarka, Gujarat - 361305
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default UserProfile;