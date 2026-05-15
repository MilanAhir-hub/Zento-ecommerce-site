import { HugeiconsIcon } from "@hugeicons/react";
import {
    Store01Icon,
    BankIcon,
    Loading03Icon,
    Mail01Icon,
    Location01Icon,
    Camera01Icon,
    Tick02Icon,
    Alert01Icon
} from "@hugeicons/core-free-icons";
import { useState, useEffect } from "react";
import { useVendorStore, useUpdateVendorStore } from "../../../../hooks/vendor/useVendorHooks";

const Settings = () => {
    const { data: store, isLoading, isError, error, refetch } = useVendorStore();
    const updateMutation = useUpdateVendorStore();

    const [formData, setFormData] = useState({
        storeName: "",
        storeDescription: "",
        logo: "",
        address: "",
        email: ""
    });

    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        if (store) {
            setFormData({
                storeName: store.storeName || "",
                storeDescription: store.storeDescription || "",
                logo: store.logo || "",
                address: store.address || "",
                email: store.email || ""
            });
        }
    }, [store]);

    const handleChange = (e: any) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            await updateMutation.mutateAsync(formData);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 2500);
        } catch {
            console.error("Update failed");
        }
    };

    const handleReset = () => {
        if (store) {
            setFormData({
                storeName: store.storeName || "",
                storeDescription: store.storeDescription || "",
                logo: store.logo || "",
                address: store.address || "",
                email: store.email || ""
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[420px] gap-4">
                <HugeiconsIcon icon={Loading03Icon} size={26} className="animate-spin text-[#0071e3]" />
                <p className="text-[#86868b] text-[14px] font-medium tracking-tight">Loading settings…</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-white border border-[#e5e5ea] p-10 rounded-[28px] text-center space-y-4 shadow-sm">
                <HugeiconsIcon icon={Alert01Icon} size={26} className="text-[#ff3b30] mx-auto" />
                <h3 className="text-[#1d1d1f] font-semibold text-[18px]">Unable to load settings</h3>
                <p className="text-[#86868b] text-[14px] max-w-sm mx-auto">
                    {(error as any)?.message || "Something went wrong while fetching your store settings."}
                </p>
                <button
                    onClick={() => refetch()}
                    className="mt-2 px-6 py-2 rounded-full bg-[#1d1d1f] text-white text-sm hover:bg-black transition-all"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-20 animate-in fade-in duration-700">

            {/* HEADER */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-[36px] font-semibold text-[#1d1d1f] tracking-tight">Settings</h2>
                    <p className="text-[#86868b] text-[15px] font-medium mt-1">Manage your store appearance and information.</p>
                </div>

                {saveSuccess && (
                    <div className="flex items-center gap-2 text-green-600 text-sm font-medium animate-in fade-in slide-in-from-right-4">
                        <HugeiconsIcon icon={Tick02Icon} size={16} />
                        Saved
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">

                {/* PROFILE */}
                <div className="bg-white p-8 rounded-[32px] border border-black/5 shadow-sm space-y-8">

                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-2xl bg-[#f5f5f7] flex items-center justify-center overflow-hidden border border-[#e5e5ea]">
                                {formData.logo ? (
                                    <img src={formData.logo} className="w-full h-full object-cover" />
                                ) : (
                                    <HugeiconsIcon icon={Store01Icon} size={28} className="text-[#86868b]" />
                                )}
                            </div>

                            <button type="button"
                                className="absolute -bottom-2 -right-2 bg-[#0071e3] text-white p-2.5 rounded-xl shadow-lg hover:bg-[#0077ED] transition-colors">
                                <HugeiconsIcon icon={Camera01Icon} size={16} />
                            </button>
                        </div>

                        <div className="flex-1 space-y-1.5">
                            <label className="text-[13px] font-semibold text-[#1d1d1f] ml-1">Store Name</label>
                            <input
                                name="storeName"
                                value={formData.storeName}
                                onChange={handleChange}
                                placeholder="Store name"
                                className="w-full bg-[#f5f5f7] px-4 py-3.5 rounded-xl outline-none focus:ring-4 focus:ring-[#0071e3]/5 transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[13px] font-semibold text-[#1d1d1f] ml-1">Store Description</label>
                        <textarea
                            name="storeDescription"
                            value={formData.storeDescription}
                            onChange={handleChange}
                            placeholder="Tell customers about your store..."
                            rows={4}
                            className="w-full bg-[#f5f5f7] px-4 py-3.5 rounded-xl outline-none focus:ring-4 focus:ring-[#0071e3]/5 focus:bg-white transition-all text-sm leading-relaxed"
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">

                        <div className="space-y-1.5">
                            <label className="text-[13px] font-semibold text-[#1d1d1f] ml-1">Business Email</label>
                            <div className="relative group">
                                <HugeiconsIcon icon={Mail01Icon} size={16}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#86868b]" />
                                <input
                                    value={formData.email}
                                    readOnly
                                    className="w-full pl-11 pr-4 py-3.5 bg-[#f5f5f7] rounded-xl text-[#86868b] cursor-not-allowed border border-dashed border-[#e5e5ea]"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[13px] font-semibold text-[#1d1d1f] ml-1">Store Address</label>
                            <div className="relative group">
                                <HugeiconsIcon icon={Location01Icon} size={16}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#86868b] group-focus-within:text-[#0071e3]" />
                                <input
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Business address"
                                    className="w-full pl-11 pr-4 py-3.5 bg-[#f5f5f7] rounded-xl outline-none focus:ring-4 focus:ring-[#0071e3]/5 transition-all text-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* BANK */}
                <div className="bg-gradient-to-r from-[#f5f5f7] to-white p-6 rounded-[24px] flex items-center gap-5 border border-black/3 shadow-sm">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-black/5">
                        <HugeiconsIcon icon={BankIcon} size={22} className="text-[#0071e3]" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-[#1d1d1f]">Financial Security</p>
                        <p className="text-[12px] text-[#86868b] mt-0.5">
                            Payment accounts and secondary settings are managed via Zento Secure Financial Portal.
                        </p>
                    </div>
                </div>

                {/* ACTIONS */}
                <div className="flex justify-end items-center gap-6 pt-4">
                    <button
                        type="button"
                        onClick={handleReset}
                        className="text-sm font-semibold text-[#6e6e73] hover:text-[#1d1d1f] transition-colors"
                    >
                        Reset Changes
                    </button>

                    <button
                        type="submit"
                        disabled={updateMutation.isPending}
                        className="px-12 py-3.5 rounded-full bg-[#0071e3] text-white text-sm font-semibold shadow-xl shadow-[#0071e3]/20 hover:bg-[#0077ED] transition-all active:scale-[0.98] disabled:opacity-50 min-w-[200px]"
                    >
                        {updateMutation.isPending ? "Saving..." : "Save Settings"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Settings;