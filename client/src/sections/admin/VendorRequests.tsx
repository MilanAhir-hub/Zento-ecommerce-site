import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Alert01Icon, Loading03Icon, Store01Icon, SentIcon } from "@hugeicons/core-free-icons";
import { useAdminVendorRequests, useHandleVendorRequest } from "../../hooks/admin/useAdmin";

const VendorRequests = () => {
    const { data: requests, isLoading } = useAdminVendorRequests();
    const reviewRequest = useHandleVendorRequest();

    const [rejectingRequestId, setRejectingRequestId] = useState<string | null>(null);
    const [rejectReason, setRejectReason] = useState("");

    const handleReject = (id: string) => {
        if (!rejectReason.trim()) return;
        reviewRequest.mutate(
            { id, action: 'reject', reason: rejectReason },
            {
                onSuccess: () => {
                    setRejectingRequestId(null);
                    setRejectReason("");
                }
            }
        );
    };

    return (
        <div className="bg-white rounded-4xl border border-[#d2d2d7]/30 overflow-hidden flex flex-col h-full min-h-[500px] shadow-sm">
            <div className="px-8 py-6 border-b border-[#f5f5f7] flex items-center justify-between shrink-0">
                <h2 className="text-[18px] font-bold text-[#1d1d1f] flex items-center gap-3">
                    <HugeiconsIcon icon={Alert01Icon} size={24} className="text-[#ff453a]" />
                    Vendor Approval Queue
                </h2>
                <span className="text-[11px] font-black text-[#ff453a] bg-red-50 px-3 py-1 rounded-full uppercase tracking-widest">Action Required</span>
            </div>

            <div className="p-4 flex-1 overflow-x-auto">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <HugeiconsIcon icon={Loading03Icon} size={32} className="text-[#0071e3] animate-spin mb-4" />
                        <p className="text-[14px] font-medium text-[#86868b]">Syncing requests...</p>
                    </div>
                ) : !requests || requests.filter((req: any) => req.status === 'pending').length === 0 ? (
                    <div className="p-12 flex-1 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-[#f5f5f7] rounded-full flex items-center justify-center mb-6">
                            <HugeiconsIcon icon={Store01Icon} size={40} className="text-[#c1c1c7]" />
                        </div>
                        <h3 className="text-[18px] font-bold text-[#1d1d1f] mb-1">Queue is clear</h3>
                        <p className="text-[#86868b] text-[14px] max-w-[280px]">No pending vendor applications at this moment. You're all caught up!</p>
                    </div>
                ) : (
                    <table className="w-full text-left min-w-[700px]">
                        <thead>
                            <tr className="border-b border-[#f5f5f7]">
                                <th className="py-4 px-6 text-[11px] font-bold text-[#86868b] uppercase tracking-widest">Store Profile</th>
                                <th className="py-4 px-6 text-[11px] font-bold text-[#86868b] uppercase tracking-widest">Category</th>
                                <th className="py-4 px-6 text-[11px] font-bold text-[#86868b] uppercase tracking-widest">Business Email</th>
                                <th className="py-4 px-6 text-[11px] font-bold text-[#86868b] uppercase tracking-widest text-right">Verification</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f5f5f7]">
                            {requests.filter((req: any) => req.status === 'pending').map((request: any) => (
                                <tr key={request._id} className="hover:bg-[#fbfbfd] transition-colors group">
                                    <td className="py-5 px-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-[#f5f5f7] to-white flex items-center justify-center text-[#1d1d1f] font-bold text-[16px] shrink-0 border border-[#d2d2d7]/30 group-hover:scale-105 transition-transform duration-300 shadow-sm">
                                                {request.storeName?.substring(0, 2).toUpperCase() || 'ST'}
                                            </div>
                                            <p className="font-bold text-[14px] text-[#1d1d1f]">{request.storeName}</p>
                                        </div>
                                    </td>
                                    <td className="py-5 px-6">
                                        <span className="text-[13px] font-medium text-[#86868b]">{request.businessType || 'Retail'}</span>
                                    </td>
                                    <td className="py-5 px-6 text-[13px] font-medium text-[#1d1d1f]">{request.email}</td>
                                    <td className="py-5 px-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {rejectingRequestId === request._id ? (
                                                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 min-w-[300px]">
                                                    <textarea
                                                        value={rejectReason}
                                                        onChange={(e) => setRejectReason(e.target.value)}
                                                        placeholder="Specify reason for rejection..."
                                                        className="w-full h-20 px-4 py-3 rounded-2xl bg-[#f5f5f7] border border-[#d2d2d7]/30 text-[13px] text-[#1d1d1f] placeholder:text-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 focus:border-[#0071e3] transition-all resize-none"
                                                    />
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => {
                                                                setRejectingRequestId(null);
                                                                setRejectReason("");
                                                            }}
                                                            disabled={reviewRequest.isPending}
                                                            className="flex-1 px-4 py-2 rounded-xl text-[12px] font-bold text-[#1d1d1f] bg-[#f5f5f7] hover:bg-[#e8e8ed] transition-colors disabled:opacity-50"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(request._id)}
                                                            disabled={reviewRequest.isPending || !rejectReason.trim()}
                                                            className="flex-1 px-4 py-2 rounded-xl text-[12px] font-bold text-white bg-[#0071e3] hover:bg-[#0077ed] transition-colors flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(0,113,227,0.2)] disabled:opacity-50"
                                                        >
                                                            {reviewRequest.isPending ? (
                                                                <HugeiconsIcon icon={Loading03Icon} size={14} className="animate-spin" />
                                                            ) : (
                                                                <HugeiconsIcon icon={SentIcon} size={14} />
                                                            )}
                                                            Send
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => setRejectingRequestId(request._id)}
                                                        disabled={reviewRequest.isPending}
                                                        className="px-4 py-2 rounded-xl text-[12px] font-bold text-[#ff453a] hover:bg-red-50 transition-all disabled:opacity-50 cursor-pointer"
                                                    >
                                                        Decline
                                                    </button>
                                                    <button
                                                        onClick={() => reviewRequest.mutate({ id: request._id, action: 'approve' })}
                                                        disabled={reviewRequest.isPending}
                                                        className="px-5 py-2 rounded-xl text-[12px] font-black bg-[#0071e3] text-white hover:bg-[#005bb5] shadow-lg shadow-[#0071e3]/10 transition-all disabled:opacity-50 cursor-pointer"
                                                    >
                                                        Approve Store
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default VendorRequests;
