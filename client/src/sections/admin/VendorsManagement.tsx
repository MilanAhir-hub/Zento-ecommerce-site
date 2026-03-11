import { Store, Loader2, MoreVertical, Package } from "lucide-react";
import { useAdminVendors } from "../../hooks/admin/useAdmin";

const VendorsManagement = () => {
    const { data: vendors, isLoading } = useAdminVendors();

    return (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col h-full min-h-[500px]">
            <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between shrink-0">
                <h2 className="text-xl font-bold text-stone-900 flex items-center gap-3">
                    <Store className="w-6 h-6 text-stone-400" />
                    All Vendors
                </h2>
            </div>
            <div className="p-6 flex-1 overflow-x-auto">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
                        <Loader2 className="w-8 h-8 text-stone-300 animate-spin mb-4" />
                        <p className="text-sm font-medium text-stone-500">Loading vendors...</p>
                    </div>
                ) : !vendors || vendors.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center">
                        <Store className="w-16 h-16 text-stone-200 mb-4" />
                        <h3 className="text-lg font-bold text-stone-900 mb-1">No Vendors Activated</h3>
                        <p className="text-stone-400 font-medium max-w-sm">Approved vendor applications will appear here as active stores.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {vendors.map((vendor: any) => (
                            <div key={vendor._id} className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-col hover:border-stone-300 transition-all shadow-sm">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center text-stone-700 font-bold text-lg shrink-0">
                                            {vendor.name?.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-stone-900">{vendor.name}</h3>
                                            <p className="text-xs font-medium text-stone-500">{vendor.email}</p>
                                        </div>
                                    </div>
                                    <button className="text-stone-400 hover:text-stone-900">
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="mt-auto flex items-center justify-between pt-4 border-t border-stone-100">
                                    <span className="text-xs font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full">Active Vendor</span>
                                    <button className="text-xs font-bold text-stone-500 hover:text-stone-900 flex items-center gap-1">
                                        <Package className="w-4 h-4" /> View Products
                                    </button>
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
