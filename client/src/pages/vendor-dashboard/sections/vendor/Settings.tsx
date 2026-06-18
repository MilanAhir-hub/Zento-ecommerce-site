import { HugeiconsIcon } from "@hugeicons/react";
import {
    Store01Icon,
    BankIcon,
    Loading03Icon,
    Mail01Icon,
    Location01Icon,
    Camera01Icon,
    Tick02Icon,
    Alert01Icon,
    Edit02Icon,
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
        email: "",
    });

    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        if (store) {
            setFormData({
                storeName: store.storeName || "",
                storeDescription: store.storeDescription || "",
                logo: store.logo || "",
                address: store.address || "",
                email: store.email || "",
            });
        }
    }, [store]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
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
                email: store.email || "",
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[420px] gap-5">
                <div className="w-10 h-10 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
                <span className="text-[12px] font-medium text-gray-400 tracking-wide">
                    Loading settings...
                </span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-14 text-center">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <HugeiconsIcon icon={Alert01Icon} size={28} className="text-red-500" />
                </div>
                <h3 className="text-[18px] font-semibold text-gray-900 mb-2">Unable to load settings</h3>
                <p className="text-[14px] text-gray-500 max-w-sm mx-auto mb-8 leading-relaxed">
                    {(error as any)?.message || "Something went wrong while fetching your store settings."}
                </p>
                <button
                    onClick={() => refetch()}
                    className="px-8 py-3 bg-gray-900 text-white text-[13px] font-semibold rounded-xl hover:bg-black transition-all duration-300 shadow-sm hover:shadow-md"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            {/* HEADER */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-[28px] md:text-[34px] font-semibold text-gray-900 tracking-tight">
                        Store Settings
                    </h2>
                    <p className="text-[14px] text-gray-500 mt-1.5">
                        Manage your store profile and business information.
                    </p>
                </div>

                {saveSuccess && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 text-[13px] font-medium rounded-full border border-emerald-100 animate-fade-in">
                        <HugeiconsIcon icon={Tick02Icon} size={15} />
                        Saved
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* STORE PROFILE */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-8 md:p-10">
                    {/* Section Header */}
                    <div className="mb-8">
                        <h3 className="text-[15px] font-semibold text-gray-900 mb-1">Store Profile</h3>
                        <p className="text-[13px] text-gray-400">Customize how your store appears to customers</p>
                    </div>

                    <div className="space-y-7">
                        {/* Logo & Name Row */}
                        <div className="flex flex-col sm:flex-row items-start gap-8">
                            {/* Logo Upload */}
                            <div className="relative shrink-0 group">
                                <div className="w-28 h-28 bg-gray-50 flex items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 group-hover:border-gray-300 transition-colors duration-300">
                                    {formData.logo ? (
                                        <img src={formData.logo} className="w-full h-full object-cover" alt="Store logo" />
                                    ) : (
                                        <HugeiconsIcon icon={Store01Icon} size={32} className="text-gray-300" />
                                    )}
                                </div>
                                <button
                                    type="button"
                                    className="absolute -bottom-1.5 -right-1.5 w-9 h-9 bg-gray-900 text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-black hover:scale-105 active:scale-95 transition-all duration-300"
                                    aria-label="Upload logo"
                                >
                                    <HugeiconsIcon icon={Camera01Icon} size={15} />
                                </button>
                            </div>

                            {/* Store Name */}
                            <div className="flex-1 w-full space-y-2">
                                <label
                                    htmlFor="settings-store-name"
                                    className="text-[13px] font-medium text-gray-700 block"
                                >
                                    Store Name
                                </label>
                                <input
                                    id="settings-store-name"
                                    name="storeName"
                                    value={formData.storeName}
                                    onChange={handleChange}
                                    placeholder="Enter your store name"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 focus:bg-white transition-all duration-300"
                                />
                            </div>
                        </div>

                        {/* Store Description */}
                        <div className="space-y-2">
                            <label
                                htmlFor="settings-store-desc"
                                className="text-[13px] font-medium text-gray-700 block"
                            >
                                Store Description
                            </label>
                            <textarea
                                id="settings-store-desc"
                                name="storeDescription"
                                value={formData.storeDescription}
                                onChange={handleChange}
                                placeholder="Tell customers about your store and what makes it special..."
                                rows={4}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 focus:bg-white transition-all duration-300 leading-relaxed resize-none"
                            />
                        </div>

                        {/* Email & Address Row */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Business Email (Read-only) */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="settings-business-email"
                                    className="text-[13px] font-medium text-gray-700 block"
                                >
                                    Business Email
                                </label>
                                <div className="relative">
                                    <HugeiconsIcon
                                        icon={Mail01Icon}
                                        size={16}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    />
                                    <input
                                        id="settings-business-email"
                                        value={formData.email}
                                        readOnly
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50 text-gray-500 cursor-not-allowed border border-gray-200 rounded-xl text-[14px]"
                                    />
                                </div>
                            </div>

                            {/* Store Address */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="settings-store-address"
                                    className="text-[13px] font-medium text-gray-700 block"
                                >
                                    Store Address
                                </label>
                                <div className="relative group">
                                    <HugeiconsIcon
                                        icon={Location01Icon}
                                        size={16}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-900 transition-colors duration-300"
                                    />
                                    <input
                                        id="settings-store-address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Business address"
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[14px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 focus:bg-white transition-all duration-300"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FINANCIAL SECURITY */}
                <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 p-6 flex items-center gap-5">
                    <div className="w-12 h-12 bg-white rounded-xl border border-gray-100 shadow-sm flex items-center justify-center shrink-0">
                        <HugeiconsIcon icon={BankIcon} size={20} className="text-gray-700" />
                    </div>
                    <div>
                        <p className="text-[14px] font-semibold text-gray-900">
                            Financial Security
                        </p>
                        <p className="text-[13px] text-gray-500 mt-0.5">
                            Payment accounts are managed via NOVARA Secure Financial Portal.
                        </p>
                    </div>
                </div>

                {/* ACTIONS */}
                <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-6 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={handleReset}
                        className="text-[14px] font-medium text-gray-400 hover:text-gray-900 px-5 py-2.5 rounded-xl hover:bg-gray-50 transition-all duration-300"
                    >
                        Reset Changes
                    </button>

                    <button
                        type="submit"
                        disabled={updateMutation.isPending}
                        className="w-full sm:w-auto px-10 py-3.5 bg-gray-900 text-white text-[13px] font-semibold rounded-xl hover:bg-black active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center gap-2.5"
                    >
                        {updateMutation.isPending ? (
                            <>
                                <HugeiconsIcon icon={Loading03Icon} size={15} className="animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <HugeiconsIcon icon={Edit02Icon} size={15} />
                                Save Settings
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Settings;
