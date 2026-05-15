import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    ArrowDown01Icon, ArrowUp01Icon, Clock01Icon, CheckmarkCircle02Icon, Store01Icon
} from "@hugeicons/core-free-icons";
import Select from "../../components/ui/Select";
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
    const location = useLocation();
    const [isAccountOpen, setIsAccountOpen] = useState(true);
    const [showVendorForm, setShowVendorForm] = useState(false);

    useEffect(() => {
        if (location.pathname === '/apply-seller') {
            setShowVendorForm(true);
        }
    }, [location.pathname]);

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
        <div className="min-h-screen bg-[#f5f5f7] py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-[#0071e3] selection:text-white pb-20">
            <div className="max-w-[1060px] mx-auto flex flex-col lg:flex-row gap-8">

                {/* Sidebar */}
                <div className="w-full lg:w-[280px] shrink-0">
                    <div className="bg-white/80 backdrop-blur-2xl shadow-[0_2px_20px_-8px_rgba(0,0,0,0.05)] rounded-[28px] p-7 border border-white">

                        {/* User */}
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-[60px] w-[60px] rounded-full bg-linear-to-br from-[#f5f5f7] to-[#e5e5ea] border border-white shadow-sm flex items-center justify-center text-[22px] font-medium text-[#1d1d1f]">
                                {user ? getInitials(user.name) : "U"}
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-[17px] font-semibold text-[#1d1d1f] tracking-tight truncate">{user?.name}</p>
                                <p className="text-[14px] text-[#86868b] truncate">{user?.email}</p>
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="space-y-2">

                            <button
                                onClick={() => setIsAccountOpen(!isAccountOpen)}
                                className="w-full flex items-center justify-between py-2.5 text-[15px] font-semibold text-[#1d1d1f] transition cursor-pointer"
                            >
                                <span>Account</span>
                                {isAccountOpen ? <HugeiconsIcon icon={ArrowUp01Icon} size={18} className="text-[#86868b]" /> : <HugeiconsIcon icon={ArrowDown01Icon} size={18} className="text-[#86868b]" />}
                            </button>

                            <div className={`overflow-hidden transition-all duration-400 ease-in-out ${isAccountOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"}`}>
                                <div className="flex flex-col gap-1 pl-3 border-l-[1.5px] border-[#e5e5ea] ml-1.5 mt-1 mb-4">
                                    <Link to="/user/orders" className="py-1.5 pl-3 text-[14px] text-[#515154] hover:text-[#1d1d1f] transition font-medium">Orders</Link>
                                    <Link to="/user/wishlist" className="py-1.5 pl-3 text-[14px] text-[#515154] hover:text-[#1d1d1f] transition font-medium">Wishlist</Link>
                                    <Link to="/user/notifications" className="py-1.5 pl-3 text-[14px] text-[#515154] hover:text-[#1d1d1f] transition font-medium">Notifications</Link>
                                    <Link to="/user/addresses" className="py-1.5 pl-3 text-[14px] text-[#515154] hover:text-[#1d1d1f] transition font-medium">Addresses</Link>
                                </div>
                            </div>

                            <div className="h-px bg-[#e5e5ea] my-4 max-w-[90%] mx-auto"></div>

                            <div className="space-y-1">
                                <Link to="/help" className="block py-2.5 text-[15px] text-[#515154] hover:text-[#1d1d1f] transition font-medium">Support</Link>
                                <Link to="/guide" className="block py-2.5 text-[15px] text-[#515154] hover:text-[#1d1d1f] transition font-medium">Shopping Guide</Link>
                                <Link to="/about" className="block py-2.5 text-[15px] text-[#515154] hover:text-[#1d1d1f] transition font-medium">About Zento</Link>

                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left py-2.5 mt-4 text-[15px] text-[#e30000] hover:text-[#ff3b30] transition font-medium cursor-pointer"
                                >
                                    Sign Out
                                </button>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 space-y-10">

                    {/* Account Type */}
                    <div className="space-y-5">
                        <div className="px-1">
                            <h2 className="text-[32px] md:text-[40px] font-semibold text-[#1d1d1f] tracking-tight leading-tight">
                                Account
                            </h2>
                            <p className="text-[17px] text-[#86868b] mt-1 font-normal">
                                Manage your roles, store, and platform access.
                            </p>
                        </div>

                        <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-[0_2px_40px_-12px_rgba(0,0,0,0.05)] border border-black/3">

                            <div className="flex justify-between items-center mb-10 pb-6 border-b border-[#e5e5ea]">
                                <div>
                                    <p className="text-[13px] text-[#86868b] font-semibold tracking-wide uppercase">
                                        Current access level
                                    </p>
                                    <p className="text-[19px] font-medium text-[#1d1d1f] mt-1 capitalize">
                                        {user?.role || "User"} Account
                                    </p>
                                </div>

                                <div className="h-12 w-12 rounded-full bg-[#f5f5f7] flex items-center justify-center">
                                    <HugeiconsIcon icon={Store01Icon} size={22} className="text-[#1d1d1f]" />
                                </div>
                            </div>

                            {/* Role states */}
                            {user?.role === 'vendor' ? (
                                <div className="py-2 animate-in fade-in duration-500">
                                    <h3 className="text-[24px] font-semibold text-[#1d1d1f] tracking-tight mb-2">
                                        Your seller dashboard is ready.
                                    </h3>
                                    <p className="text-[15px] text-[#86868b] mb-8 leading-relaxed max-w-[80%]">
                                        Manage your store setup, view real-time sales analytics, and update your product catalog directly from your dedicated portal.
                                    </p>
                                    <Link to="/vendor" className="inline-flex items-center justify-center bg-[#0071e3] text-white px-8 py-3.5 rounded-full text-[15px] font-medium hover:bg-[#0077ED] transition-colors active:scale-[0.98]">
                                        Open Dashboard
                                    </Link>
                                </div>
                            ) : vendorRequest?.status === 'pending' ? (
                                <div className="py-2 animate-in fade-in duration-500">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-full mb-4">
                                        <HugeiconsIcon icon={Clock01Icon} size={16} className="text-amber-600" />
                                        <span className="text-[13px] font-medium text-amber-700">Under Review</span>
                                    </div>
                                    <h3 className="text-[24px] font-semibold text-[#1d1d1f] tracking-tight mb-2">
                                        Application in progress.
                                    </h3>
                                    <p className="text-[15px] text-[#86868b] mb-6 leading-relaxed max-w-[80%]">
                                        Our support team is carefully reviewing your seller details. You'll be notified here once the review is complete.
                                    </p>
                                    <button disabled className="bg-[#f5f5f7] text-[#86868b] px-8 py-3.5 rounded-full text-[15px] font-medium cursor-not-allowed">
                                        Pending Approval
                                    </button>
                                </div>
                            ) : vendorRequest?.status === 'approved' ? (
                                <div className="py-2 animate-in fade-in duration-500">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full mb-4">
                                        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} className="text-green-600" />
                                        <span className="text-[13px] font-medium text-green-700">Approved</span>
                                    </div>
                                    <h3 className="text-[24px] font-semibold text-[#1d1d1f] tracking-tight mb-2">
                                        Welcome aboard.
                                    </h3>
                                    <p className="text-[15px] text-[#86868b] mb-8 leading-relaxed max-w-[80%]">
                                        Your application has been successful. Please refresh this page to activate your seller privileges.
                                    </p>
                                    <button onClick={() => window.location.reload()} className="bg-[#0071e3] text-white px-8 py-3.5 rounded-full text-[15px] font-medium hover:bg-[#0077ED] transition-colors active:scale-[0.98]">
                                        Refresh Page
                                    </button>
                                </div>
                            ) : vendorRequest?.status === 'rejected' && (!showVendorForm) ? (
                                <div className="py-2 animate-in fade-in duration-500">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 rounded-full mb-4 border border-[#ff453a]/10">
                                        <HugeiconsIcon icon={Clock01Icon} size={16} className="text-[#ff453a]" />
                                        <span className="text-[13px] font-medium text-[#ff453a]">Application Declined</span>
                                    </div>
                                    <h3 className="text-[24px] font-semibold text-[#1d1d1f] tracking-tight mb-2">
                                        Action required on your application.
                                    </h3>
                                    <p className="text-[15px] text-[#86868b] mb-4 leading-relaxed max-w-[80%]">
                                        We couldn't approve your seller application at this time.
                                    </p>

                                    {vendorRequest?.rejectionReason && (
                                        <div className="p-4 bg-[#f5f5f7] rounded-2xl mb-8 border border-red-100 max-w-[80%]">
                                            <p className="text-[13px] font-semibold text-[#1d1d1f] mb-1">Reason provided by administration:</p>
                                            <p className="text-[14px] text-[#515154] leading-relaxed italic">
                                                "{vendorRequest.rejectionReason}"
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex gap-4">
                                        <button onClick={() => setShowVendorForm(true)} className="bg-[#1d1d1f] text-white px-8 py-3.5 rounded-full text-[15px] font-medium hover:bg-black transition-colors active:scale-[0.98] cursor-pointer">
                                            Update & Re-apply
                                        </button>
                                    </div>
                                </div>
                            ) : user?.role === 'admin' ? (
                                <div className="py-2 animate-in fade-in duration-500">
                                    <h3 className="text-[24px] font-semibold text-[#1d1d1f] tracking-tight mb-2">
                                        Platform Administrator.
                                    </h3>
                                    <p className="text-[15px] text-[#86868b] mb-8 leading-relaxed max-w-[80%]">
                                        You have full access to platform operations, user management, and detailed analytics via the admin interface.
                                    </p>
                                    <Link to="/admin/dashboard" className="inline-flex items-center justify-center bg-[#1d1d1f] text-white px-8 py-3.5 rounded-full text-[15px] font-medium hover:bg-black transition-colors active:scale-[0.98]">
                                        Go to Admin Dashboard
                                    </Link>
                                </div>
                            ) : !showVendorForm ? (
                                <div className="py-2 animate-in fade-in duration-500">
                                    <h3 className="text-[24px] font-semibold text-[#1d1d1f] tracking-tight mb-2">
                                        Start selling with Zento.
                                    </h3>
                                    <p className="text-[15px] text-[#86868b] mb-8 leading-relaxed max-w-[80%]">
                                        Turn your passion into a business. Reach millions of customers with our seamless, powerful selling tools. Let's get you set up.
                                    </p>
                                    <button
                                        onClick={() => setShowVendorForm(true)}
                                        className="bg-[#1d1d1f] text-white px-8 py-3.5 rounded-full text-[15px] font-medium hover:bg-black transition-colors active:scale-[0.98] cursor-pointer"
                                    >
                                        Apply to be a Seller
                                    </button>
                                </div>
                            ) : (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex justify-between items-end mb-8">
                                        <div>
                                            <h3 className="text-[24px] font-semibold text-[#1d1d1f] tracking-tight">Seller Application.</h3>
                                            <p className="text-[15px] text-[#86868b] mt-1">Tell us about your business.</p>
                                        </div>
                                        <button onClick={() => setShowVendorForm(false)} className="text-[15px] text-[#0071e3] hover:underline font-medium cursor-pointer mb-1">
                                            Cancel
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                        <div className="space-y-1.5">
                                            <label className="text-[13px] font-medium text-[#1d1d1f] ml-1">Store Name <span className="text-red-500">*</span></label>
                                            <input type="text" name="storeName" value={vendorForm.storeName} onChange={handleVendorInputChange} required className="w-full px-4 py-3.5 bg-[#f5f5f7] border border-transparent rounded-[14px] text-[15px] text-[#1d1d1f] placeholder:text-[#86868b] focus:outline-none focus:bg-white focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 transition-all duration-200" placeholder="e.g. Trendy Gadgets" />
                                        </div>
                                        <Select
                                            label="Business Type"
                                            required
                                            value={vendorForm.businessType}
                                            onChange={(val) => handleVendorInputChange({ target: { name: 'businessType', value: val } } as any)}
                                            options={[
                                                { value: "individual", label: "Individual / Sole Proprietor" },
                                                { value: "llp", label: "LLP / Partnership" },
                                                { value: "private_limited", label: "Private Limited" }
                                            ]}
                                            placeholder="Select structure"
                                            className="w-full"
                                        />
                                        <div className="space-y-1.5">
                                            <label className="text-[13px] font-medium text-[#1d1d1f] ml-1">GSTIN <span className="text-[#86868b] font-normal">(Optional)</span></label>
                                            <input type="text" name="gstNumber" value={vendorForm.gstNumber} onChange={handleVendorInputChange} className="w-full px-4 py-3.5 bg-[#f5f5f7] border border-transparent rounded-[14px] text-[15px] text-[#1d1d1f] placeholder:text-[#86868b] focus:outline-none focus:bg-white focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 transition-all duration-200" placeholder="e.g. 27AAAAA0000A1Z5" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[13px] font-medium text-[#1d1d1f] ml-1">Phone Number <span className="text-red-500">*</span></label>
                                            <input type="tel" name="phoneNumber" value={vendorForm.phoneNumber} onChange={handleVendorInputChange} required className="w-full px-4 py-3.5 bg-[#f5f5f7] border border-transparent rounded-[14px] text-[15px] text-[#1d1d1f] placeholder:text-[#86868b] focus:outline-none focus:bg-white focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 transition-all duration-200" placeholder="Mobile number" />
                                        </div>
                                        <div className="space-y-1.5 md:col-span-2">
                                            <label className="text-[13px] font-medium text-[#1d1d1f] ml-1">Store Address <span className="text-red-500">*</span></label>
                                            <input type="text" name="storeAddress" value={vendorForm.storeAddress} onChange={handleVendorInputChange} required className="w-full px-4 py-3.5 bg-[#f5f5f7] border border-transparent rounded-[14px] text-[15px] text-[#1d1d1f] placeholder:text-[#86868b] focus:outline-none focus:bg-white focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 transition-all duration-200" placeholder="Complete address of operation" />
                                        </div>

                                        <div className="col-span-full my-2">
                                            <div className="h-px w-full bg-[#f5f5f7]"></div>
                                            <p className="text-[15px] font-semibold text-[#1d1d1f] pt-5">Payout Details</p>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[13px] font-medium text-[#1d1d1f] ml-1">Account Number <span className="text-red-500">*</span></label>
                                            <input type="text" name="bankAccountNumber" value={vendorForm.bankAccountNumber} onChange={handleVendorInputChange} required className="w-full px-4 py-3.5 bg-[#f5f5f7] border border-transparent rounded-[14px] text-[15px] text-[#1d1d1f] placeholder:text-[#86868b] focus:outline-none focus:bg-white focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 transition-all duration-200" placeholder="e.g. 00000012345678" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[13px] font-medium text-[#1d1d1f] ml-1">IFSC Code <span className="text-red-500">*</span></label>
                                            <input type="text" name="ifscCode" value={vendorForm.ifscCode} onChange={handleVendorInputChange} required className="w-full px-4 py-3.5 bg-[#f5f5f7] border border-transparent rounded-[14px] text-[15px] text-[#1d1d1f] placeholder:text-[#86868b] focus:outline-none focus:bg-white focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 transition-all duration-200" placeholder="e.g. HDFC0001234" />
                                        </div>

                                        <div className="md:col-span-2 pt-4 flex justify-end">
                                            <button
                                                disabled={vendorMutation.isPending || !vendorForm.storeName || !vendorForm.businessType || !vendorForm.phoneNumber || !vendorForm.storeAddress || !vendorForm.bankAccountNumber || !vendorForm.ifscCode}
                                                onClick={() => vendorMutation.mutate(vendorForm)}
                                                className="bg-[#1d1d1f] hover:bg-black text-white px-10 py-3.5 rounded-full text-[15px] font-medium transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-md cursor-pointer w-full md:w-auto"
                                            >
                                                {vendorMutation.isPending ? "Submitting..." : "Submit Application"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>

                    {/* Personal Info */}
                    <div className="space-y-5">
                        <div className="flex justify-between items-end px-1">
                            <div>
                                <h2 className="text-[32px] md:text-[40px] font-semibold text-[#1d1d1f] tracking-tight leading-tight">
                                    Personal Info
                                </h2>
                                <p className="text-[17px] text-[#86868b] mt-1 font-normal">
                                    Your personal details associated with this account.
                                </p>
                            </div>

                            <button className="text-[15px] text-[#0071e3] hover:underline transition font-medium cursor-pointer mb-2">
                                Edit
                            </button>
                        </div>

                        <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-[0_2px_40px_-12px_rgba(0,0,0,0.05)] border border-black/3">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                                <div>
                                    <p className="text-[13px] text-[#86868b] font-medium mb-1.5 uppercase tracking-wide">Full Name</p>
                                    <p className="text-[17px] font-semibold text-[#1d1d1f]">
                                        {user?.name || "Guest User"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[13px] text-[#86868b] font-medium mb-1.5 uppercase tracking-wide">Email Address</p>
                                    <p className="text-[17px] font-semibold text-[#1d1d1f]">
                                        {user?.email || "not provided"}
                                    </p>
                                </div>

                                <div className="">
                                    <p className="text-[13px] text-[#86868b] font-medium mb-1.5 uppercase tracking-wide">Contact Phone</p>
                                    <p className="text-[17px] font-semibold text-[#1d1d1f]">
                                        +91 9265201108
                                    </p>
                                </div>

                                <div className="">
                                    <p className="text-[13px] text-[#86868b] font-medium mb-1.5 uppercase tracking-wide">Primary Address</p>
                                    <p className="text-[17px] font-medium text-[#1d1d1f] leading-snug">
                                        lord krishna society, dwarka<br />
                                        Gujarat - 361305
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default UserProfile;
