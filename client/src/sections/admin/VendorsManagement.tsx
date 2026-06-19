import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Store01Icon, Loading03Icon, Menu02Icon, PackageIcon, UserRemove01Icon, SentIcon } from "@hugeicons/core-free-icons";
import { useAdminVendors, useRemoveVendor } from "../../hooks/admin/useAdmin";

const VendorsManagement = ({ onViewCatalog }: { onViewCatalog: (vendorId: string) => void }) => {
    const { data: vendors, isLoading } = useAdminVendors();
    const { mutate: removeVendor, isPending: isRemoving } = useRemoveVendor();

    const [removingVendorId, setRemovingVendorId] = useState<string | null>(null);
    const [reason, setReason] = useState("");

    const handleRemoveVendor = (vendorId: string) => {
        if (!reason.trim()) return;
        removeVendor(
            { id: vendorId, reason },
            {
                onSuccess: () => {
                    setRemovingVendorId(null);
                    setReason("");
                }
            }
        );
    };

    return (
        <div className="bg-white rounded-4xl border border-[#d2d2d7]/30 overflow-hidden flex flex-col h-full min-h-[500px] shadow-sm">
            <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-[#f5f5f7] flex items-center justify-between shrink-0">
                <h2 className="text-[16px] sm:text-[18px] font-bold text-[#1d1d1f] flex items-center gap-3">
                    <HugeiconsIcon icon={Store01Icon} size={24} className="text-[#0071e3]" />
                    <span className="hidden sm:inline">Verified Partners</span>
                    <span className="sm:hidden">Partners</span>
                </h2>
            </div>
            <div className="p-8 flex-1 overflow-x-auto bg-[#fbfbfd]/50">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <HugeiconsIcon icon={Loading03Icon} size={32} className="text-[#0071e3] animate-spin mb-4" />
                        <p className="text-[14px] font-medium text-[#86868b]">Syncing partner network...</p>
                    </div>
                ) : !vendors || vendors.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <div className="w-20 h-20 bg-[#f5f5f7] rounded-full flex items-center justify-center mb-6">
                            <HugeiconsIcon icon={Store01Icon} size={40} className="text-[#c1c1c7]" />
                        </div>
                        <h3 className="text-[18px] font-bold text-[#1d1d1f] mb-1">No Active Vendors</h3>
                        <p className="text-[#86868b] text-[14px] max-w-[280px]">Partners will appear here once their store requests are approved.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {vendors.map((vendor: any) => (
                            <div key={vendor._id} className="bg-white rounded-4xl border border-[#d2d2d7]/30 p-8 flex flex-col hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-all duration-300 group">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-[#f5f5f7] to-white flex items-center justify-center text-[#1d1d1f] font-bold text-[16px] shrink-0 border border-[#d2d2d7]/30 group-hover:scale-105 transition-transform duration-300 shadow-sm">
                                            {vendor.name?.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div className="flex flex-col">
                                            <h3 className="font-bold text-[15px] text-[#1d1d1f] leading-tight">{vendor.name}</h3>
                                            <p className="text-[11px] font-medium text-[#86868b] mt-0.5">{vendor.email}</p>
                                        </div>
                                    </div>
                                    <button className="text-[#c1c1c7] hover:text-[#0071e3] p-1 transition-colors">
                                        <HugeiconsIcon icon={Menu02Icon} size={20} />
                                    </button>
                                </div>
                                <div className="mt-8 flex items-center justify-between pt-6 border-t border-[#f5f5f7]">
                                    <span className="text-[10px] font-black text-[#34c759] bg-[#34c759]/10 px-3 py-1 rounded-full uppercase tracking-widest">Active</span>
                                    <button
                                        onClick={() => onViewCatalog(vendor._id)}
                                        className="text-[12px] font-bold text-[#86868b] hover:text-[#0071e3] flex items-center gap-2 group/btn transition-colors text-nowrap cursor-pointer"
                                    >
                                        <HugeiconsIcon icon={PackageIcon} size={16} className="group-hover/btn:scale-110 transition-transform" />
                                        Catalog
                                    </button>
                                </div>

                                {/* Remove Vendor Section */}
                                <div className="mt-4 pt-4 border-t border-[#f5f5f7]">
                                    {removingVendorId === vendor._id ? (
                                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                            <textarea
                                                value={reason}
                                                onChange={(e) => setReason(e.target.value)}
                                                placeholder="Please specify the reason for removal..."
                                                className="w-full h-24 px-4 py-3 rounded-2xl bg-[#f5f5f7] border border-[#d2d2d7]/30 text-[13px] text-[#1d1d1f] placeholder:text-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 focus:border-[#0071e3] transition-all resize-none"
                                            />
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        setRemovingVendorId(null);
                                                        setReason("");
                                                    }}
                                                    disabled={isRemoving}
                                                    className="flex-1 px-4 py-2 rounded-xl text-[12px] font-bold text-[#1d1d1f] bg-[#f5f5f7] hover:bg-[#e8e8ed] transition-colors disabled:opacity-50"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => handleRemoveVendor(vendor._id)}
                                                    disabled={isRemoving || !reason.trim()}
                                                    className="flex-1 px-4 py-2 rounded-xl text-[12px] font-bold text-white bg-[#0071e3] hover:bg-[#0077ed] transition-colors flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(0,113,227,0.2)] disabled:opacity-50"
                                                >
                                                    {isRemoving ? (
                                                        <HugeiconsIcon icon={Loading03Icon} size={14} className="animate-spin" />
                                                    ) : (
                                                        <HugeiconsIcon icon={SentIcon} size={14} />
                                                    )}
                                                    Send
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setRemovingVendorId(vendor._id)}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-[12px] font-bold text-[#ff453a] bg-red-50 hover:bg-red-100 transition-colors group/remove"
                                        >
                                            <HugeiconsIcon icon={UserRemove01Icon} size={16} className="group-hover/remove:scale-110 transition-transform" />
                                            Remove Vendor
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VendorsManagement;
