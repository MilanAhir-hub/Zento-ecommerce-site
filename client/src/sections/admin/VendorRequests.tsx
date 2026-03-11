import { AlertCircle, Check, X, Loader2 } from "lucide-react";
import { useAdminVendorRequests, useHandleVendorRequest } from "../../hooks/admin/useAdmin";

const VendorRequests = () => {
    const { data: requests, isLoading } = useAdminVendorRequests();
    const handleAction = useHandleVendorRequest();

    const pendingRequests = requests?.filter((req: any) => req.status === 'pending') || [];

    return (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col h-full min-h-[500px]">
            <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between shrink-0">
                <h2 className="text-xl font-bold text-stone-900 flex items-center gap-3">
                    <AlertCircle className="w-6 h-6 text-stone-400" />
                    Vendor Applications
                </h2>
                <div className="flex gap-2 text-sm font-semibold rounded-xl overflow-hidden border border-stone-200">
                    <button className="px-4 py-2 bg-stone-100 text-stone-900">Pending</button>
                    <button className="px-4 py-2 bg-white text-stone-500 hover:bg-stone-50">History</button>
                </div>
            </div>
            <div className="p-6 flex-1 flex flex-col gap-4 overflow-y-auto">
                {isLoading ? (
                    <div className="flex-1 flex flex-col items-center justify-center min-h-[300px]">
                        <Loader2 className="w-8 h-8 text-stone-300 animate-spin mb-4" />
                        <p className="text-sm font-medium text-stone-500">Loading vendor applications...</p>
                    </div>
                ) : pendingRequests.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
                        <AlertCircle className="w-16 h-16 text-stone-200 mb-4" />
                        <h3 className="text-lg font-bold text-stone-900 mb-1">No Pending Requests</h3>
                        <p className="text-stone-400 font-medium max-w-sm">All vendor applications have been processed. You're all caught up!</p>
                    </div>
                ) : (
                    pendingRequests.map((request: any) => (
                        <div key={request._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border border-stone-200 bg-white shadow-sm hover:border-stone-300 transition-colors gap-4">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center text-stone-700 font-bold text-lg shrink-0">
                                    {request.storeName?.substring(0, 2).toUpperCase() || 'ST'}
                                </div>
                                <div>
                                    <h4 className="font-bold text-base text-stone-900 mb-1">{request.storeName}</h4>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs font-medium text-stone-500">
                                        <p>Type: <span className="text-stone-700">{request.businessType}</span></p>
                                        <p>Phone: <span className="text-stone-700">{request.phoneNumber}</span></p>
                                        <p>Applicant: <span className="text-stone-700">{request.user?.name}</span></p>
                                    </div>
                                    <p className="text-xs text-stone-400 mt-2 line-clamp-1">{request.storeAddress}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    onClick={() => handleAction.mutate({ id: request._id, action: 'approve' })}
                                    disabled={handleAction.isPending}
                                    className="px-4 py-2 bg-stone-900 text-white text-sm font-bold rounded-xl hover:bg-stone-800 transition-colors flex items-center gap-2 disabled:opacity-50"
                                >
                                    <Check className="w-4 h-4" /> Approve
                                </button>
                                <button
                                    onClick={() => handleAction.mutate({ id: request._id, action: 'reject' })}
                                    disabled={handleAction.isPending}
                                    className="px-4 py-2 bg-red-50 text-red-600 text-sm font-bold rounded-xl hover:bg-red-100 transition-colors flex items-center gap-2 disabled:opacity-50"
                                >
                                    <X className="w-4 h-4" /> Reject
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default VendorRequests;
