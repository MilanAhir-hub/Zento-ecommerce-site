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
            <div className="flex flex-col items-center justify-center min-h-[420px] gap-4">
                <HugeiconsIcon icon={Loading03Icon} size={22} className="animate-spin text-black" />
                <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-gray-400">
                    Loading settings
                </span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="border border-gray-200 p-12 text-center">
                <HugeiconsIcon icon={Alert01Icon} size={32} className="text-gray-300 mx-auto mb-6" />
                <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-gray-400 block mb-3">
                    Error
                </span>
                <h3 className="text-[20px] font-light text-black mb-3">Unable to load settings</h3>
                <p className="text-[14px] text-gray-500 max-w-sm mx-auto mb-8">
                    {(error as any)?.message || "Something went wrong while fetching your store settings."}
                </p>
                <button
                    onClick={() => refetch()}
                    className="px-8 py-3 bg-black text-white text-[11px] font-medium uppercase tracking-[0.15em] hover:bg-gray-900 transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-20">
            {/* HEADER */}
            <div className="flex justify-between items-end">
                <div>
                    <div className="w-12 h-px bg-black mb-6" />
                    <h2 className="text-[32px] md:text-[40px] font-light text-black tracking-[0.02em]">
                        Settings
                    </h2>
                    <p className="text-[13px] text-gray-500 font-normal mt-2">
                        Manage your store appearance and information.
                    </p>
                </div>

                {saveSuccess && (
                    <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-black">
                        <HugeiconsIcon icon={Tick02Icon} size={14} />
                        Saved
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
                {/* STORE PROFILE */}
                <div className="border border-gray-200 p-8 md:p-10">
                    {/* Section Header */}
                    <div className="mb-8">
                        <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-gray-400 block mb-3">
                            Store Profile
                        </span>
                        <div className="h-px bg-black w-8" />
                    </div>

                    <div className="space-y-8">
                        {/* Logo & Name Row */}
                        <div className="flex flex-col sm:flex-row items-start gap-8">
                            {/* Logo Upload */}
                            <div className="relative shrink-0">
                                <div className="w-28 h-28 bg-[#F9F9F9] flex items-center justify-center overflow-hidden border border-gray-200">
                                    {formData.logo ? (
                                        <img src={formData.logo} className="w-full h-full object-cover" alt="Store logo" />
                                    ) : (
                                        <HugeiconsIcon icon={Store01Icon} size={32} className="text-gray-300" />
                                    )}
                                </div>
                                <button
                                    type="button"
                                    className="absolute -bottom-2 -right-2 w-8 h-8 bg-black text-white flex items-center justify-center hover:bg-gray-900 transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]"
                                    aria-label="Upload logo"
                                >
                                    <HugeiconsIcon icon={Camera01Icon} size={14} />
                                </button>
                            </div>

                            {/* Store Name */}
                            <div className="flex-1 w-full space-y-2">
                                <label
                                    htmlFor="settings-store-name"
                                    className="text-[11px] font-medium uppercase tracking-[0.15em] text-black block"
                                >
                                    Store Name
                                </label>
                                <input
                                    id="settings-store-name"
                                    name="storeName"
                                    value={formData.storeName}
                                    onChange={handleChange}
                                    placeholder="Enter store name"
                                    className="w-full bg-white border border-gray-200 px-4 py-3 text-[14px] text-black placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]"
                                />
                            </div>
                        </div>

                        {/* Store Description */}
                        <div className="space-y-2">
                            <label
                                htmlFor="settings-store-desc"
                                className="text-[11px] font-medium uppercase tracking-[0.15em] text-black block"
                            >
                                Store Description
                            </label>
                            <textarea
                                id="settings-store-desc"
                                name="storeDescription"
                                value={formData.storeDescription}
                                onChange={handleChange}
                                placeholder="Tell customers about your store..."
                                rows={4}
                                className="w-full bg-white border border-gray-200 px-4 py-3 text-[14px] text-black placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] leading-relaxed resize-none"
                            />
                        </div>

                        {/* Email & Address Row */}
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Business Email (Read-only) */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="settings-business-email"
                                    className="text-[11px] font-medium uppercase tracking-[0.15em] text-black block"
                                >
                                    Business Email
                                </label>
                                <div className="relative">
                                    <HugeiconsIcon
                                        icon={Mail01Icon}
                                        size={15}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    />
                                    <input
                                        id="settings-business-email"
                                        value={formData.email}
                                        readOnly
                                        className="w-full pl-11 pr-4 py-3 bg-[#F9F9F9] text-gray-500 cursor-not-allowed border border-gray-200 border-dashed text-[14px]"
                                    />
                                </div>
                            </div>

                            {/* Store Address */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="settings-store-address"
                                    className="text-[11px] font-medium uppercase tracking-[0.15em] text-black block"
                                >
                                    Store Address
                                </label>
                                <div className="relative group">
                                    <HugeiconsIcon
                                        icon={Location01Icon}
                                        size={15}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors duration-200"
                                    />
                                    <input
                                        id="settings-store-address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Business address"
                                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 text-[14px] text-black placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FINANCIAL SECURITY */}
                <div className="border border-gray-200 p-6 flex items-center gap-5 bg-[#F9F9F9]">
                    <div className="w-12 h-12 bg-white border border-gray-200 flex items-center justify-center shrink-0">
                        <HugeiconsIcon icon={BankIcon} size={20} className="text-black" />
                    </div>
                    <div>
                        <p className="text-[13px] font-medium text-black uppercase tracking-[0.12em]">
                            Financial Security
                        </p>
                        <p className="text-[12px] text-gray-500 mt-1">
                            Payment accounts are managed via NOVARA Secure Financial Portal.
                        </p>
                    </div>
                </div>

                {/* ACTIONS */}
                <div className="flex flex-col sm:flex-row justify-end items-center gap-6 pt-4 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={handleReset}
                        className="text-[13px] font-medium text-gray-400 hover:text-black transition-colors duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]"
                    >
                        Reset Changes
                    </button>

                    <button
                        type="submit"
                        disabled={updateMutation.isPending}
                        className="w-full sm:w-auto px-12 py-3.5 bg-black text-white text-[11px] font-medium uppercase tracking-[0.15em] hover:bg-gray-900 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] flex items-center justify-center gap-2"
                    >
                        {updateMutation.isPending ? (
                            <>
                                <HugeiconsIcon icon={Loading03Icon} size={14} className="animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <HugeiconsIcon icon={Edit02Icon} size={14} />
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
