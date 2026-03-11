import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    User, ChevronDown, ChevronUp, Package, Heart, MapPin,
    HelpCircle, Book, Info, LogOut, Bell, Store, CheckCircle2, Clock, ChevronRight
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import api from "../../services/api";
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
    const { user, vendorRequest, logout, checkAuth } = useAuth();
    const navigate = useNavigate();
    const [isAccountOpen, setIsAccountOpen] = useState(true);
    const [showVendorForm, setShowVendorForm] = useState(false);

    // Vendor form state
    const [vendorForm, setVendorForm] = useState({
        storeName: '',
        businessType: '',
        gstNumber: '',
        phoneNumber: '',
        storeAddress: '',
        bankAccountNumber: '',
        ifscCode: '',
        storeLogo: ''
    });

    const vendorMutation = useMutation({
        mutationFn: async (data: typeof vendorForm) => {
            const res = await api.post('/user/vendor-request', data);
            return res.data;
        },
        onSuccess: () => {
            checkAuth(); // Refresh user state to get the new vendorRequest status
            setShowVendorForm(false);
        },
        onError: (error: any) => {
            console.error("Failed to submit vendor request", error?.response?.data || error.message);
            // In a real app we would show a toast here
            alert(error?.response?.data?.message || "Something went wrong while submitting your request.");
        }
    });

    const handleVendorInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setVendorForm({ ...vendorForm, [e.target.name]: e.target.value });
    };

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
                        <div className="p-4 lg:p-6 border-b-0 lg:border-b lg:border-stone-100 flex items-center justify-between">
                            <div className="flex items-center gap-4">
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

                            <Link to="/user/settings" className="lg:hidden h-10 w-10 flex items-center justify-center text-stone-400 hover:bg-stone-50 rounded-full transition-colors">
                                <ChevronRight className="h-5 w-5" />
                            </Link>
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

                {/* Right Content Box */}
                <div className="flex-1 w-full space-y-8">

                    {/* Account Type and Vendor Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 md:p-10">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-stone-100 pb-6 mb-8 gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-stone-900 tracking-tight mb-1">Account Type</h2>
                                <p className="text-stone-500 text-sm font-medium">Manage your roles and permissions</p>
                            </div>
                            <div className="flex items-center gap-2 bg-stone-50 px-4 py-2 rounded-lg border border-stone-200">
                                <span className="text-sm font-semibold text-stone-600">You are currently a:</span>
                                <span className={`text-sm font-bold uppercase tracking-wider px-2 py-0.5 rounded ${user?.role === 'vendor' ? 'bg-indigo-100 text-indigo-700' :
                                    user?.role === 'admin' ? 'bg-rose-100 text-rose-700' :
                                        'bg-stone-200 text-stone-800'
                                    }`}>
                                    {user?.role || 'User'}
                                </span>
                            </div>
                        </div>

                        {user?.role === 'vendor' ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center bg-stone-50 rounded-xl border border-stone-100">
                                <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-stone-200 mb-4">
                                    <Store className="w-8 h-8 text-indigo-600" />
                                </div>
                                <h3 className="text-xl font-bold text-stone-900 mb-2">Welcome Back, Seller</h3>
                                <p className="text-stone-500 text-sm mb-6 max-w-sm">Manage your store, products, and incoming orders from your dedicated vendor dashboard.</p>
                                <Link to="/vendor/dashboard" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full transition-colors active:scale-95 shadow-sm">
                                    Go to Vendor Dashboard
                                </Link>
                            </div>
                        ) : vendorRequest?.status === 'pending' ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center bg-amber-50 rounded-xl border border-amber-100">
                                <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-amber-200 mb-4">
                                    <Clock className="w-8 h-8 text-amber-500" />
                                </div>
                                <h3 className="text-xl font-bold text-stone-900 mb-2">Application Under Review</h3>
                                <p className="text-amber-700 font-medium mb-1">Your vendor request is pending approval.</p>
                                <p className="text-amber-600/80 text-sm max-w-sm">Our team will review your application and get back to you shortly. Thank you for your patience.</p>
                                <button disabled className="mt-6 bg-stone-200 text-stone-400 font-bold py-3 px-8 rounded-full cursor-not-allowed">
                                    Pending Approval
                                </button>
                            </div>
                        ) : vendorRequest?.status === 'approved' ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center bg-green-50 rounded-xl border border-green-100">
                                <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-green-200 mb-4">
                                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                                </div>
                                <h3 className="text-xl font-bold text-stone-900 mb-2">Application Approved</h3>
                                <p className="text-green-700 text-sm mb-6 max-w-sm">Your application was successful! Please refresh your page if your Vendor Dashboard is not active.</p>
                                {/* Fallback in case role isn't completely updated yet but request shows approved */}
                                <button onClick={() => window.location.reload()} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full transition-colors active:scale-95 shadow-sm">
                                    Refresh Page
                                </button>
                            </div>
                        ) : vendorRequest?.status === 'rejected' ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center bg-red-50 rounded-xl border border-red-100">
                                <h3 className="text-xl font-bold text-stone-900 mb-2">Application Rejected</h3>
                                <p className="text-red-700 text-sm">Unfortunately, your vendor application was not approved. Please contact support for more details.</p>
                            </div>
                        ) : user?.role === 'admin' ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center bg-rose-50 rounded-xl border border-rose-100">
                                <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-rose-200 mb-4">
                                    <Store className="w-8 h-8 text-rose-600" />
                                </div>
                                <h3 className="text-xl font-bold text-stone-900 mb-2">Welcome Back, Administrator</h3>
                                <p className="text-rose-700 text-sm mb-6 max-w-sm">Access your control panel to manage users, vendors, orders, and platform settings.</p>
                                <Link to="/admin/dashboard" className="bg-stone-900 hover:bg-black text-white font-bold py-3 px-8 rounded-full transition-colors active:scale-95 shadow-sm">
                                    Go to Admin Dashboard
                                </Link>
                            </div>
                        ) : (
                            <div className="bg-stone-50 rounded-xl border border-stone-100 p-8">
                                {!showVendorForm ? (
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                                        <div>
                                            <h3 className="text-lg font-bold text-stone-900 mb-1">Want to sell your products?</h3>
                                            <p className="text-sm text-stone-500">Reach millions of customers across India.</p>
                                        </div>
                                        <button
                                            onClick={() => setShowVendorForm(true)}
                                            className="bg-stone-900 hover:bg-black text-white font-bold py-3 px-8 rounded-full transition-colors active:scale-95 shrink-0 whitespace-nowrap"
                                        >
                                            Become a Vendor
                                        </button>
                                    </div>
                                ) : (
                                    <div className="animate-in fade-in duration-300">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-lg font-bold text-stone-900">Vendor Application</h3>
                                            <button onClick={() => setShowVendorForm(false)} className="text-sm text-stone-500 hover:text-stone-900 font-medium cursor-pointer">
                                                Cancel
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-stone-500 uppercase">Store Name *</label>
                                                <input type="text" name="storeName" value={vendorForm.storeName} onChange={handleVendorInputChange} required className="w-full px-4 py-3 bg-white border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-stone-900 transition-colors" placeholder="e.g. Trendy Gadgets" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-stone-500 uppercase">Business Type *</label>
                                                <select name="businessType" value={vendorForm.businessType} onChange={handleVendorInputChange} required className="w-full px-4 py-3 bg-white border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-stone-900 transition-colors">
                                                    <option value="" disabled>Select Type</option>
                                                    <option value="individual">Individual / Sole Proprietor</option>
                                                    <option value="llp">LLP / Partnership</option>
                                                    <option value="private_limited">Private Limited</option>
                                                </select>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-stone-500 uppercase">GST Number (Optional)</label>
                                                <input type="text" name="gstNumber" value={vendorForm.gstNumber} onChange={handleVendorInputChange} className="w-full px-4 py-3 bg-white border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-stone-900 transition-colors" placeholder="Enter GSTIN" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-stone-500 uppercase">Phone Number *</label>
                                                <input type="tel" name="phoneNumber" value={vendorForm.phoneNumber} onChange={handleVendorInputChange} required className="w-full px-4 py-3 bg-white border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-stone-900 transition-colors" placeholder="Enter mobile number" />
                                            </div>
                                            <div className="space-y-1 md:col-span-2">
                                                <label className="text-xs font-bold text-stone-500 uppercase">Store Address *</label>
                                                <input type="text" name="storeAddress" value={vendorForm.storeAddress} onChange={handleVendorInputChange} required className="w-full px-4 py-3 bg-white border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-stone-900 transition-colors" placeholder="Complete physical address of the store/warehouse" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-stone-500 uppercase">Bank Account Number *</label>
                                                <input type="text" name="bankAccountNumber" value={vendorForm.bankAccountNumber} onChange={handleVendorInputChange} required className="w-full px-4 py-3 bg-white border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-stone-900 transition-colors" placeholder="Enter account number" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-stone-500 uppercase">IFSC Code *</label>
                                                <input type="text" name="ifscCode" value={vendorForm.ifscCode} onChange={handleVendorInputChange} required className="w-full px-4 py-3 bg-white border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-stone-900 transition-colors" placeholder="e.g. HDFC0001234" />
                                            </div>
                                            <div className="space-y-1 md:col-span-2">
                                                <label className="text-xs font-bold text-stone-500 uppercase">Store Logo URL (Optional)</label>
                                                <input type="text" name="storeLogo" value={vendorForm.storeLogo} onChange={handleVendorInputChange} className="w-full px-4 py-3 bg-white border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-stone-900 transition-colors" placeholder="https://example.com/logo.png" />
                                            </div>
                                            <div className="md:col-span-2 mt-2">
                                                <button
                                                    disabled={vendorMutation.isPending || !vendorForm.storeName || !vendorForm.businessType || !vendorForm.phoneNumber || !vendorForm.storeAddress || !vendorForm.bankAccountNumber || !vendorForm.ifscCode}
                                                    onClick={() => vendorMutation.mutate(vendorForm)}
                                                    className="w-full sm:w-auto bg-stone-900 hover:bg-stone-700 text-white font-bold py-3.5 px-8 rounded-full transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer"
                                                >
                                                    {vendorMutation.isPending ? "Submitting Request..." : "Submit Vendor Request"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Standard Personal Information Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 md:p-10">
                        <div className="flex justify-between items-center border-b border-stone-100 pb-6 mb-8">
                            <h2 className="text-xl font-bold text-stone-900 tracking-tight">Personal Information</h2>
                            <button className="px-5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-900 text-sm font-semibold rounded-full transition-colors cursor-pointer">
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