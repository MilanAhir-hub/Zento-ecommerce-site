import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    AiBeautifyIcon,
    Calendar01Icon,
    Cancel01Icon,
    ColorsIcon,
    ImageAdd01Icon,
    Loading03Icon,
    MagicWand01Icon,
    SaleTag02Icon,
    SparklesIcon,
    TextIcon,
    Tick02Icon
} from "@hugeicons/core-free-icons";

import { categories } from "../../../../constants/categories";
import { useCreateVendorBanner } from "../../../../hooks/vendor/useVendorHooks";
import { useBannerAI } from "../../../../hooks/vendor/useBannerAI";
import Select from "../../../../components/ui/Select";

type BannerTheme = "light" | "dark";
type BannerImageMode = "ai" | "upload";

interface BannerFormState {
    title: string;
    subtitle: string;
    category: string;
    subcategory: string;
    discountType: "Percentage" | "Flat";
    discountValue: string;
    startDate: string;
    endDate: string;
    theme: BannerTheme;
    priority: string;
    isActive: boolean;
    customPrompt: string;
}

const getTodayValue = () => new Date().toISOString().split("T")[0];

const initialFormState: BannerFormState = {
    title: "",
    subtitle: "",
    category: "",
    subcategory: "",
    discountType: "Percentage",
    discountValue: "",
    startDate: getTodayValue(),
    endDate: "",
    theme: "light",
    priority: "0",
    isActive: true,
    customPrompt: "",
};

const inputClassName =
    "w-full bg-[#f5f5f7] px-4 py-3 rounded-xl outline-none focus:ring-4 focus:ring-[#0071e3]/5 transition-all placeholder:text-[#86868b]";

const AddBanner = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const createMutation = useCreateVendorBanner();
    const { generateBanner, loading: isGenerating, error: aiError, clearError } = useBannerAI();

    const [formData, setFormData] = useState<BannerFormState>(initialFormState);
    const [availableSubcategories, setAvailableSubcategories] = useState<string[]>([]);
    const [imageMode, setImageMode] = useState<BannerImageMode>("ai");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
    const [generatedImageUrl, setGeneratedImageUrl] = useState("");
    const [generatedPrompt, setGeneratedPrompt] = useState("");
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!formData.category) {
            setAvailableSubcategories([]);
            setFormData((prev) => ({ ...prev, subcategory: "" }));
            return;
        }

        const activeCategory = categories.find((category) => category.name === formData.category);
        const nextSubcategories = activeCategory?.subcategories || [];
        setAvailableSubcategories(nextSubcategories);

        if (!nextSubcategories.includes(formData.subcategory)) {
            setFormData((prev) => ({ ...prev, subcategory: "" }));
        }
    }, [formData.category, formData.subcategory]);

    useEffect(() => {
        return () => {
            if (uploadedPreview?.startsWith("blob:")) {
                URL.revokeObjectURL(uploadedPreview);
            }
        };
    }, [uploadedPreview]);

    useEffect(() => {
        if (aiError) {
            setError(aiError);
        }
    }, [aiError]);

    const previewImage = imageMode === "ai" ? generatedImageUrl : uploadedPreview;
    const offerLabel = formData.discountValue.trim()
        ? formData.discountType === "Flat"
            ? `Flat ${formData.discountValue} off`
            : `${formData.discountValue}% off`
        : "No live offer";

    const handleFieldChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target;
        const nextValue =
            event.target instanceof HTMLInputElement && event.target.type === "checkbox"
                ? event.target.checked
                : value;

        setFormData((prev) => ({
            ...prev,
            [name]: nextValue,
        }));
    };

    const handleThemeChange = (theme: BannerTheme) => {
        setFormData((prev) => ({ ...prev, theme }));
    };

    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        if (uploadedPreview?.startsWith("blob:")) {
            URL.revokeObjectURL(uploadedPreview);
        }

        setSelectedFile(file);
        setUploadedPreview(URL.createObjectURL(file));
        setImageMode("upload");
        setError(null);
        clearError();

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleRemoveUploadedImage = () => {
        if (uploadedPreview?.startsWith("blob:")) {
            URL.revokeObjectURL(uploadedPreview);
        }

        setSelectedFile(null);
        setUploadedPreview(null);
    };

    const handleGenerate = async () => {
        setError(null);
        clearError();

        if (!formData.title.trim() || !formData.category) {
            setError("Title and category are required before generating an AI banner.");
            return;
        }

        const response = await generateBanner({
            title: formData.title,
            subtitle: formData.subtitle,
            category: formData.category,
            subcategory: formData.subcategory,
            discountType: formData.discountType,
            discountValue: formData.discountValue,
            startDate: formData.startDate,
            endDate: formData.endDate,
            theme: formData.theme,
            customPrompt: formData.customPrompt,
        });

        if (!response) {
            return;
        }

        setGeneratedImageUrl(response.imageUrl);
        setGeneratedPrompt(response.prompt);
        setImageMode("ai");
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);

        if (formData.endDate && formData.startDate && formData.endDate < formData.startDate) {
            setError("End date must be the same as or later than the start date.");
            return;
        }

        if (imageMode === "upload" && !selectedFile) {
            setError("Please upload a banner image before saving.");
            return;
        }

        if (imageMode === "ai" && !generatedImageUrl) {
            setError("Generate an AI banner first, or switch to manual upload.");
            return;
        }

        try {
            const payload = new FormData();
            payload.append("title", formData.title);
            payload.append("subtitle", formData.subtitle);
            payload.append("category", formData.category);
            payload.append("subcategory", formData.subcategory);
            payload.append("discountType", formData.discountType);
            payload.append("discountValue", formData.discountValue);
            payload.append("startDate", formData.startDate);
            payload.append("endDate", formData.endDate);
            payload.append("theme", formData.theme);
            payload.append("priority", formData.priority);
            payload.append("isActive", String(formData.isActive));
            payload.append("customPrompt", formData.customPrompt);
            payload.append("imageSource", imageMode);

            if (imageMode === "ai") {
                payload.append("generatedImageUrl", generatedImageUrl);
                payload.append("generatedPrompt", generatedPrompt);
            } else if (selectedFile) {
                payload.append("image", selectedFile);
            }

            await createMutation.mutateAsync(payload);
            setSuccess(true);
            setTimeout(() => navigate("/vendor"), 1500);
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to create banner.");
        }
    };

    if (success) {
        return (
            <div className="bg-white p-12 lg:p-24 rounded-[48px] border border-black/5 flex flex-col items-center justify-center text-center space-y-8 shadow-[0_2px_60px_-15px_rgba(0,0,0,0.06)] min-h-[500px] animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-[#f2fbf4] rounded-full flex items-center justify-center shadow-inner">
                    <HugeiconsIcon icon={Tick02Icon} size={48} className="text-[#1a7d32]" />
                </div>
                <div className="space-y-3">
                    <h2 className="text-[34px] font-semibold text-[#1d1d1f] tracking-tight">Banner Created</h2>
                    <p className="text-[#86868b] text-[18px] font-medium max-w-[360px] mx-auto leading-relaxed">
                        Your campaign is saved and ready for the storefront. Redirecting you now...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-20 animate-in fade-in duration-700">
            <div>
                <h2 className="text-[38px] font-semibold text-[#1d1d1f] tracking-tight">Create Banner</h2>
                <p className="text-[#6e6e73] text-[16px] mt-1">
                    Build a polished campaign banner with AI or upload your own creative.
                </p>
            </div>

            {error && (
                <div className="bg-[#fff2f2] border border-[#ffe5e5] px-5 py-4 rounded-2xl text-sm text-[#d60000]">
                    {error}
                </div>
            )}

            <form className="space-y-10" onSubmit={handleSubmit}>
                <div className="grid xl:grid-cols-[1.55fr_0.95fr] gap-8">
                    <div className="relative rounded-[32px] border border-black/5 bg-linear-to-b from-white to-[#f5f5f7] p-8 shadow-[0_10px_50px_-15px_rgba(0,0,0,0.08)]">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                            <div>
                                <h3 className="text-[18px] font-semibold text-[#1d1d1f]">Banner Visual</h3>
                                <p className="text-sm text-[#86868b]">Preview the final look before you publish it.</p>
                            </div>

                            <div className="flex items-center gap-2 p-1 bg-white rounded-full border border-black/5 shadow-sm w-fit">
                                <button
                                    type="button"
                                    onClick={() => setImageMode("ai")}
                                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-[0.18em] transition-all ${imageMode === "ai" ? "bg-[#1d1d1f] text-white" : "text-[#6e6e73] hover:text-[#1d1d1f]"
                                        }`}
                                >
                                    AI Visual
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setImageMode("upload")}
                                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-[0.18em] transition-all ${imageMode === "upload" ? "bg-[#1d1d1f] text-white" : "text-[#6e6e73] hover:text-[#1d1d1f]"
                                        }`}
                                >
                                    Upload
                                </button>
                            </div>
                        </div>

                        {previewImage ? (
                            <div className="relative overflow-hidden rounded-[28px] border border-black/5 aspect-21/9 bg-[#dfe4ea]">
                                <img src={previewImage} alt="Banner preview" className="w-full h-full object-cover" />
                                <div className={`absolute inset-0 ${formData.theme === "dark" ? "bg-linear-to-r from-black/70 via-black/30 to-transparent" : "bg-linear-to-r from-white/90 via-white/45 to-transparent"}`} />
                                <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-between">
                                    <div className="flex items-start justify-between gap-4">
                                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] ${formData.theme === "dark" ? "bg-white/15 text-white backdrop-blur-md" : "bg-black/5 text-[#1d1d1f] backdrop-blur-md"}`}>
                                            {formData.category || "Campaign"}
                                        </span>

                                        {imageMode === "upload" && uploadedPreview && (
                                            <button
                                                type="button"
                                                onClick={handleRemoveUploadedImage}
                                                className="w-9 h-9 rounded-full bg-white/90 text-[#1d1d1f] flex items-center justify-center shadow-lg"
                                                aria-label="Remove uploaded banner"
                                            >
                                                <HugeiconsIcon icon={Cancel01Icon} size={18} />
                                            </button>
                                        )}
                                    </div>

                                    <div className="max-w-[58%] space-y-3">
                                        <div>
                                            <h4 className={`text-[26px] sm:text-[34px] font-semibold tracking-tight ${formData.theme === "dark" ? "text-white" : "text-[#1d1d1f]"}`}>
                                                {formData.title || "Your banner headline"}
                                            </h4>
                                            <p className={`text-sm sm:text-base leading-relaxed ${formData.theme === "dark" ? "text-white/80" : "text-[#515154]"}`}>
                                                {formData.subtitle || "Your supporting message will appear here."}
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-3">
                                            <span className="inline-flex rounded-full bg-[#0071e3] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-lg shadow-[#0071e3]/25">
                                                {offerLabel}
                                            </span>
                                            {formData.subcategory && (
                                                <span className={`inline-flex rounded-full px-4 py-2 text-xs font-semibold ${formData.theme === "dark" ? "bg-white/10 text-white" : "bg-black/5 text-[#1d1d1f]"}`}>
                                                    {formData.subcategory}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-[28px] border-2 border-dashed border-[#d2d2d7] bg-white/60 aspect-21/9 flex flex-col items-center justify-center text-center px-8">
                                <div className="w-14 h-14 rounded-full bg-[#f5f5f7] flex items-center justify-center mb-4">
                                    <HugeiconsIcon icon={AiBeautifyIcon} size={24} className="text-[#1d1d1f]" />
                                </div>
                                <h4 className="text-[20px] font-semibold text-[#1d1d1f] tracking-tight">
                                    {imageMode === "ai" ? "Generate a banner with AI" : "Upload your banner visual"}
                                </h4>
                                <p className="text-sm text-[#86868b] max-w-[420px] mt-2 leading-relaxed">
                                    {imageMode === "ai"
                                        ? "Use the form data and optional prompt to create a ready-to-save hero visual."
                                        : "Upload a finished banner image if you prefer complete manual control."}
                                </p>
                                {imageMode === "upload" && (
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="mt-5 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#1d1d1f] text-white text-sm font-semibold shadow-lg"
                                    >
                                        <HugeiconsIcon icon={ImageAdd01Icon} size={18} />
                                        Choose Image
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-[32px] border border-black/5 p-8 space-y-6 shadow-sm">
                        <div>
                            <h3 className="text-[18px] font-semibold text-[#1d1d1f]">Creative Controls</h3>
                            <p className="text-sm text-[#86868b] mt-1">
                                AI uses your title, category, offer, dates, theme, and optional prompt to build the image prompt on the backend.
                            </p>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[13px] font-semibold text-[#1d1d1f] ml-1">Theme</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => handleThemeChange("light")}
                                    className={`p-4 rounded-2xl border text-left transition-all ${formData.theme === "light" ? "border-[#0071e3] bg-[#f4f9ff] shadow-sm" : "border-[#e5e5ea] bg-[#f5f5f7]"}`}
                                >
                                    <p className="text-sm font-semibold text-[#1d1d1f]">Light</p>
                                    <p className="text-xs text-[#6e6e73] mt-1">Bright and modern</p>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleThemeChange("dark")}
                                    className={`p-4 rounded-2xl border text-left transition-all ${formData.theme === "dark" ? "border-[#0071e3] bg-[#f4f9ff] shadow-sm" : "border-[#e5e5ea] bg-[#f5f5f7]"}`}
                                >
                                    <p className="text-sm font-semibold text-[#1d1d1f]">Dark</p>
                                    <p className="text-xs text-[#6e6e73] mt-1">Luxury and dramatic</p>
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[13px] font-semibold text-[#1d1d1f] ml-1">Optional AI Prompt</label>
                            <textarea
                                name="customPrompt"
                                rows={5}
                                maxLength={500}
                                value={formData.customPrompt}
                                onChange={handleFieldChange}
                                placeholder="Example: Use premium festive lighting with elegant gift-wrap styling and extra negative space on the left."
                                className="w-full bg-[#f5f5f7] px-4 py-3 rounded-2xl outline-none focus:ring-4 focus:ring-[#0071e3]/5 transition-all text-sm leading-relaxed resize-none placeholder:text-[#86868b]"
                            />
                            <div className="flex items-center justify-between text-xs text-[#86868b] px-1">
                                <span>Optional vendor direction for the AI image.</span>
                                <span>{formData.customPrompt.length}/500</span>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-black/5 bg-[#f5f5f7] p-4 space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                                    <HugeiconsIcon icon={SparklesIcon} size={18} className="text-[#0071e3]" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-[#1d1d1f]">AI Banner Generation</p>
                                    <p className="text-xs text-[#6e6e73] mt-1">The backend creates the final prompt from this form before calling Google image generation.</p>
                                </div>
                            </div>

                            <button
                                type="button"
                                disabled={isGenerating}
                                onClick={handleGenerate}
                                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-[#0071e3] text-white text-sm font-semibold shadow-xl shadow-[#0071e3]/20 hover:bg-[#0077ED] transition-all disabled:opacity-50"
                            >
                                {isGenerating ? (
                                    <>
                                        <HugeiconsIcon icon={Loading03Icon} size={18} className="animate-spin" />
                                        Generating Banner...
                                    </>
                                ) : (
                                    <>
                                        <HugeiconsIcon icon={MagicWand01Icon} size={18} />
                                        Generate With AI
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="rounded-2xl border border-black/5 p-4 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center">
                                    <HugeiconsIcon icon={ImageAdd01Icon} size={18} className="text-[#1d1d1f]" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-[#1d1d1f]">Manual Upload</p>
                                    <p className="text-xs text-[#6e6e73] mt-1">Keep the previous workflow if needed.</p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-black/5 bg-white text-[#1d1d1f] text-sm font-semibold hover:bg-[#f5f5f7] transition-all"
                            >
                                <HugeiconsIcon icon={ImageAdd01Icon} size={18} />
                                Upload Banner Image
                            </button>
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageSelect}
                        />
                    </div>
                </div>

                <div className="bg-white rounded-[32px] border border-black/5 p-8 space-y-8 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-[#f5f5f7] flex items-center justify-center">
                            <HugeiconsIcon icon={TextIcon} size={18} className="text-[#1d1d1f]" />
                        </div>
                        <div>
                            <h3 className="text-[18px] font-semibold text-[#1d1d1f]">Campaign Content</h3>
                            <p className="text-sm text-[#86868b]">Shape the message and product context for the banner.</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                        <div className="space-y-1.5">
                            <label className="text-[13px] font-semibold text-[#1d1d1f] ml-1">Banner Title</label>
                            <input
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleFieldChange}
                                placeholder="Spring electronics week"
                                className={inputClassName}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[13px] font-semibold text-[#1d1d1f] ml-1">Subtitle</label>
                            <input
                                name="subtitle"
                                value={formData.subtitle}
                                onChange={handleFieldChange}
                                placeholder="Limited-time picks for everyday upgrades"
                                className={inputClassName}
                            />
                        </div>

                        <Select
                            label="Category"
                            required
                            value={formData.category}
                            onChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                            options={categories.map((category) => ({ value: category.name, label: category.name }))}
                            placeholder="Select category"
                        />

                        <Select
                            label="Subcategory"
                            value={formData.subcategory}
                            onChange={(value) => setFormData((prev) => ({ ...prev, subcategory: value }))}
                            disabled={!formData.category}
                            options={availableSubcategories.map((subcategory) => ({ value: subcategory, label: subcategory }))}
                            placeholder="Select subcategory"
                        />
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-[32px] border border-black/5 p-8 space-y-8 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-full bg-[#f5f5f7] flex items-center justify-center">
                                <HugeiconsIcon icon={SaleTag02Icon} size={18} className="text-[#1d1d1f]" />
                            </div>
                            <div>
                                <h3 className="text-[18px] font-semibold text-[#1d1d1f]">Offer Settings</h3>
                                <p className="text-sm text-[#86868b]">Control the offer details shown with this banner.</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                            <Select
                                label="Discount Type"
                                value={formData.discountType}
                                onChange={(value) => setFormData((prev) => ({ ...prev, discountType: value as BannerFormState["discountType"] }))}
                                options={[
                                    { value: "Percentage", label: "Percentage" },
                                    { value: "Flat", label: "Flat" },
                                ]}
                            />

                            <div className="space-y-1.5">
                                <label className="text-[13px] font-semibold text-[#1d1d1f] ml-1">Discount Value</label>
                                <input
                                    type="number"
                                    min="0"
                                    name="discountValue"
                                    value={formData.discountValue}
                                    onChange={handleFieldChange}
                                    placeholder={formData.discountType === "Flat" ? "500" : "25"}
                                    className={inputClassName}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[13px] font-semibold text-[#1d1d1f] ml-1">Priority</label>
                                <input
                                    type="number"
                                    min="0"
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleFieldChange}
                                    className={inputClassName}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[13px] font-semibold text-[#1d1d1f] ml-1">Status</label>
                                <label className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#f5f5f7] cursor-pointer">
                                    <span className="text-sm font-medium text-[#1d1d1f]">Activate immediately</span>
                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        checked={formData.isActive}
                                        onChange={handleFieldChange}
                                        className="h-4 w-4 accent-[#0071e3]"
                                    />
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[32px] border border-black/5 p-8 space-y-8 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-full bg-[#f5f5f7] flex items-center justify-center">
                                <HugeiconsIcon icon={Calendar01Icon} size={18} className="text-[#1d1d1f]" />
                            </div>
                            <div>
                                <h3 className="text-[18px] font-semibold text-[#1d1d1f]">Schedule</h3>
                                <p className="text-sm text-[#86868b]">Set the campaign window for this banner.</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                            <div className="space-y-1.5">
                                <label className="text-[13px] font-semibold text-[#1d1d1f] ml-1">Start Date</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleFieldChange}
                                    className={inputClassName}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[13px] font-semibold text-[#1d1d1f] ml-1">End Date</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleFieldChange}
                                    className={inputClassName}
                                />
                            </div>

                            <div className="md:col-span-2 rounded-2xl border border-black/5 bg-[#f5f5f7] p-4 flex items-start gap-3">
                                <HugeiconsIcon icon={ColorsIcon} size={18} className="text-[#0071e3] mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold text-[#1d1d1f]">Prompt-safe output</p>
                                    <p className="text-xs text-[#6e6e73] mt-1">
                                        The AI prompt asks for no rendered text or logos in the image so your banner stays clean for overlays.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-2">
                    <button
                        type="button"
                        onClick={() => navigate("/vendor")}
                        className="text-sm font-semibold text-[#6e6e73] hover:text-[#1d1d1f] transition-colors"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={createMutation.isPending}
                        className="px-12 py-3.5 rounded-full bg-[#0071e3] text-white text-sm font-semibold shadow-xl shadow-[#0071e3]/20 hover:bg-[#0077ED] transition-all active:scale-[0.98] disabled:opacity-50 min-w-[220px] flex items-center justify-center gap-2"
                    >
                        {createMutation.isPending ? (
                            <>
                                <HugeiconsIcon icon={Loading03Icon} size={18} className="animate-spin" />
                                Saving Banner...
                            </>
                        ) : (
                            "Create Banner"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddBanner;
