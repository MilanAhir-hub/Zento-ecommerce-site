import { HugeiconsIcon } from "@hugeicons/react";
import {
    Loading03Icon,
    Tick02Icon,
    Alert01Icon,
    ImageAdd01Icon,
    Cancel01Icon,
    SparklesIcon,
    MagicWand01Icon
} from "@hugeicons/core-free-icons";
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCreateVendorProduct, useUpdateVendorProduct, useVendorProduct } from "../../../../hooks/vendor/useVendorHooks";
import { useDescriptionAI } from "../../../../hooks/vendor/useDescriptionAI";
import { useImageAI } from "../../../../hooks/vendor/useImageAI";
import { categories } from "../../../../constants/categories";
import Select from "../../../../components/ui/Select";

const MAX_IMAGES = 4;

const AddProduct = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(productId);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data: productData, isLoading: isLoadingProduct } = useVendorProduct(productId || "");
    const createMutation = useCreateVendorProduct();
    const updateMutation = useUpdateVendorProduct();

    // AI Description Hook
    const { generate, improve, loading: isAILoading } = useDescriptionAI();
    const [aiTone, setAiTone] = useState("professional");

    // AI Image Enhancement Hook
    const { enhanceImage, loading: enhancingIndex, error: aiError } = useImageAI();

    const [formData, setFormData] = useState({
        title: "",
        price: "",
        category: "",
        subcategory: "",
        stock: "",
        description: "",
    });
    // Images selected for upload (new)
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    // Preview URLs: for new files = blob URL, for existing images = cloudinary URL
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    // Existing image URLs (from DB, in edit mode)
    const [existingImages, setExistingImages] = useState<string[]>([]);

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Sync AI error to main error state
    useEffect(() => {
        if (aiError) setError(aiError);
    }, [aiError]);

    // Populate form in edit mode
    useEffect(() => {
        if (isEditMode && productData) {
            setFormData({
                title: productData.title || "",
                price: productData.price?.toString() || "",
                category: productData.category || "",
                subcategory: productData.subcategory || "",
                stock: productData.stock?.toString() || "",
                description: productData.description || "",
            });
            const imgs = productData.images?.length
                ? productData.images.map((img: any) => typeof img === 'string' ? img : img.url)
                : productData.imageUrl
                    ? [productData.imageUrl]
                    : [];
            setExistingImages(imgs);
            setImagePreviews(imgs);
        }
    }, [isEditMode, productData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: value };
            // Reset subcategory if category changes
            if (name === 'category') {
                newData.subcategory = "";
            }
            return newData;
        });
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const totalAllowed = MAX_IMAGES - imagePreviews.length;
        const newFiles = files.slice(0, totalAllowed);

        const previews = newFiles.map(f => URL.createObjectURL(f));
        setSelectedFiles(prev => [...prev, ...newFiles]);
        setImagePreviews(prev => [...prev, ...previews]);

        // Reset input so same file can be re-selected
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleRemoveImage = (index: number) => {
        // Revoke blob URL if it's a new file preview
        const isNewFile = index >= existingImages.length;
        if (isNewFile) {
            const newFileIndex = index - existingImages.length;
            URL.revokeObjectURL(imagePreviews[index]);
            setSelectedFiles(prev => prev.filter((_, i) => i !== newFileIndex));
        } else {
            setExistingImages(prev => prev.filter((_, i) => i !== index));
        }
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleEnhance = async (index: number) => {
        const isNewFile = index >= existingImages.length;
        let fileToEnhance: File | null = null;

        if (isNewFile) {
            fileToEnhance = selectedFiles[index - existingImages.length];
        } else {
            // Fetch URL as file (for existing images)
            try {
                const url = existingImages[index];
                const response = await fetch(url);
                const blob = await response.blob();
                fileToEnhance = new File([blob], `existing-image-${index}.jpg`, { type: blob.type });
            } catch (err) {
                console.error("Failed to fetch existing image for AI processing:", err);
                return;
            }
        }

        if (fileToEnhance) {
            const newUrl = await enhanceImage(fileToEnhance, index);

            if (newUrl) {
                if (isNewFile) {
                    const newFileIndex = index - existingImages.length;

                    setSelectedFiles(prev => prev.filter((_, i) => i !== newFileIndex));
                    setExistingImages(prev => {
                        const newExisting = [...prev, newUrl];

                        // Sync previews so DOM order stays correct
                        setImagePreviews(previews => {
                            const copy = [...previews];
                            copy.splice(index, 1); // Remove from old spot
                            copy.splice(prev.length, 0, newUrl); // Insert at end of existingImages
                            return copy;
                        });
                        return newExisting;
                    });
                } else {
                    setExistingImages(prev => prev.map((url, i) => i === index ? newUrl : url));
                    setImagePreviews(prev => prev.map((url, i) => i === index ? newUrl : url));
                }
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (selectedFiles.length === 0 && existingImages.length === 0) {
            setError("Please upload at least one product image.");
            return;
        }

        try {
            const fd = new FormData();
            fd.append("title", formData.title);
            fd.append("price", formData.price);
            fd.append("category", formData.category);
            fd.append("subcategory", formData.subcategory);
            fd.append("stock", formData.stock);
            fd.append("description", formData.description);

            selectedFiles.forEach(file => fd.append("images", file));

            // Always append existing images (URLs that the frontend kept or generated via AI)
            existingImages.forEach(url => fd.append("existingImages", url));

            if (isEditMode && productId) {
                await updateMutation.mutateAsync({ id: productId, data: fd });
            } else {
                await createMutation.mutateAsync(fd);
            }

            setSuccess(true);
            setTimeout(() => navigate('/vendor/products'), 1500);
        } catch (err: any) {
            setError(err?.response?.data?.message || err?.message || "Failed to save product. Please try again.");
        }
    };

    const isSaving = createMutation.isPending || updateMutation.isPending;
    const canAddMoreImages = imagePreviews.length < MAX_IMAGES;

    if (isLoadingProduct) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] space-y-6">
                <div className="animate-spin text-brand-black">
                    <HugeiconsIcon icon={Loading03Icon} size={32} />
                </div>
                <p className="text-gray-muted font-medium tracking-tight">Preparing product studio...</p>
            </div>
        );
    }

    if (isEditMode && !productData) {
        return (
            <div className="max-w-[600px] mx-auto mt-20 p-12 bg-white rounded-none border border-[#E5E5E5] text-center">
                <div className="w-16 h-16 bg-gray-bg border border-[#E5E5E5] rounded-none flex items-center justify-center mx-auto mb-6">
                    <HugeiconsIcon icon={Alert01Icon} size={32} className="text-accent-sale" />
                </div>
                <h3 className="text-2xl font-semibold text-brand-black uppercase tracking-wider">Product Not Found</h3>
                <p className="text-gray-muted mt-2 mb-8 text-[15px]">We couldn't retrieve the details for this product.</p>
                <button
                    onClick={() => navigate('/vendor/products')}
                    className="px-8 py-3 bg-brand-black text-brand-white border border-brand-black rounded-none text-xs font-semibold uppercase tracking-widest hover:bg-brand-white hover:text-brand-black transition-colors"
                >
                    Back to Collection
                </button>
            </div>
        );
    }

    if (success) {
        return (
            <div className="bg-white p-12 lg:p-24 rounded-none border border-[#E5E5E5] flex flex-col items-center justify-center text-center space-y-8 min-h-[500px]">
                <div className="w-24 h-24 bg-gray-bg border border-[#E5E5E5] rounded-none flex items-center justify-center">
                    <HugeiconsIcon icon={Tick02Icon} size={48} className="text-brand-black" />
                </div>
                <div className="space-y-3">
                    <h2 className="text-[34px] font-semibold text-brand-black tracking-tight uppercase">
                        Successfully {isEditMode ? 'Updated' : 'Created'}
                    </h2>
                    <p className="text-gray-muted text-[18px] max-w-[320px] mx-auto leading-relaxed">
                        Your product is now {isEditMode ? 'live' : 'available'} in the store. Redirecting you...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-20 animate-in fade-in duration-700">

            {/* HEADER */}
            <div>
                <h2 className="text-[32px] font-medium uppercase tracking-widest text-brand-black">
                    {isEditMode ? "Refine Product" : "Create Product"}
                </h2>
                <p className="text-gray-muted text-[16px] mt-1">
                    {isEditMode
                        ? "Fine-tune your product experience."
                        : "Craft something customers will love."}
                </p>
            </div>

            {/* ERROR */}
            {error && (
                <div className="bg-[#ffe5e5] border border-accent-sale px-5 py-4 rounded-none text-sm text-accent-sale">
                    {error}
                </div>
            )}

            <form className="space-y-10" onSubmit={handleSubmit}>

                {/* MEDIA SECTION */}
                <div className="relative rounded-none border border-[#E5E5E5] bg-white p-8">

                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-[18px] font-semibold text-brand-black uppercase tracking-wider">Product Media</h3>
                            <p className="text-sm text-gray-muted">Upload up to {MAX_IMAGES} high-quality images</p>
                        </div>
                        <span className="text-xs bg-white border border-[#E5E5E5] px-3 py-1 rounded-none font-semibold text-brand-black">
                            {imagePreviews.length}/{MAX_IMAGES}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {imagePreviews.map((src, i) => (
                            <div
                                key={i}
                                className={`relative group aspect-square rounded-none overflow-hidden border transition-all duration-default ease-editorial ${i === 0 ? 'border-brand-black' : 'border-[#E5E5E5]'}`}
                            >
                                <img
                                    src={src}
                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                                    alt={`Product preview ${i + 1}`}
                                />

                                {i === 0 && (
                                    <div className="absolute top-2 left-2 bg-brand-black text-brand-white text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-none z-10">
                                        Primary
                                    </div>
                                )}

                                {/* ACTIONS OVERLAY */}
                                <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all z-20">
                                    {/* AI ENHANCE */}
                                    <button
                                        type="button"
                                        title="AI Background Removal & Optimization"
                                        disabled={enhancingIndex !== null}
                                        onClick={() => handleEnhance(i)}
                                        className="w-7 h-7 bg-white border border-[#E5E5E5] text-brand-black rounded-none flex items-center justify-center hover:bg-brand-black hover:text-brand-white transition-colors duration-default ease-editorial cursor-pointer"
                                    >
                                        <HugeiconsIcon icon={MagicWand01Icon} size={14} />
                                    </button>

                                    {/* DELETE */}
                                    <button
                                        type="button"
                                        title="Remove Image"
                                        onClick={() => handleRemoveImage(i)}
                                        className="w-7 h-7 bg-white border border-[#E5E5E5] text-accent-sale rounded-none flex items-center justify-center hover:bg-accent-sale hover:text-white transition-colors duration-default ease-editorial cursor-pointer"
                                    >
                                        <HugeiconsIcon icon={Cancel01Icon} size={14} />
                                    </button>
                                </div>

                                {/* LOADING OVERLAY */}
                                {enhancingIndex === i && (
                                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-30 animate-in fade-in duration-300">
                                        <HugeiconsIcon icon={Loading03Icon} size={24} className="text-brand-black animate-spin mb-2" />
                                        <span className="text-[10px] font-bold text-brand-black uppercase tracking-tighter">AI Processing...</span>
                                    </div>
                                )}
                            </div>
                        ))}

                        {canAddMoreImages && (
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="aspect-square rounded-none border border-dashed border-[#767676] flex flex-col items-center justify-center gap-2 hover:border-brand-black hover:bg-gray-bg transition-colors bg-white cursor-pointer"
                            >
                                <HugeiconsIcon icon={ImageAdd01Icon} size={24} className="text-gray-muted" />
                                <span className="text-[10px] font-bold text-gray-muted uppercase tracking-wider">Add Image</span>
                            </button>
                        )}
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageSelect}
                    />
                </div>

                {/* DETAILS */}
                <div className="bg-white rounded-none border border-[#E5E5E5] p-8 space-y-8">
                    <h3 className="text-[18px] font-semibold text-brand-black uppercase tracking-wider">Specifications</h3>

                    <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-semibold uppercase tracking-widest text-[#222222] ml-1">Product Title</label>
                            <input
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="iPhone 15 Pro, etc."
                                className="w-full bg-white border border-[#E5E5E5] px-4 py-3 rounded-none outline-none focus:border-brand-black transition-colors text-sm"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-semibold uppercase tracking-widest text-[#222222] ml-1">Retail Price (₹)</label>
                            <input
                                type="number"
                                name="price"
                                required
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="0.00"
                                className="w-full bg-white border border-[#E5E5E5] px-4 py-3 rounded-none outline-none focus:border-brand-black transition-colors text-sm"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-semibold uppercase tracking-widest text-[#222222] ml-1">Stock Level</label>
                            <input
                                type="number"
                                name="stock"
                                required
                                value={formData.stock}
                                onChange={handleChange}
                                placeholder="Units available"
                                className="w-full bg-white border border-[#E5E5E5] px-4 py-3 rounded-none outline-none focus:border-brand-black transition-colors text-sm"
                            />
                        </div>

                        <Select
                            label="Category"
                            required
                            value={formData.category}
                            onChange={(val) => handleChange({ target: { name: 'category', value: val } } as any)}
                            options={categories.map(cat => ({ value: cat.name, label: cat.name }))}
                            placeholder="Select Category"
                        />

                        <Select
                            label="Subcategory"
                            required
                            value={formData.subcategory}
                            onChange={(val) => handleChange({ target: { name: 'subcategory', value: val } } as any)}
                            disabled={!formData.category}
                            options={
                                categories
                                    .find((cat) => cat.name === formData.category)
                                    ?.subcategories.map((sub) => ({ value: sub, label: sub })) || []
                            }
                            placeholder="Select Subcategory"
                        />
                    </div>

                    {/* AI SECTION */}
                    <div className="space-y-4 pt-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-[#222222] ml-1">Marketing Description</h4>

                            <div className="flex items-center gap-2 p-1 bg-white rounded-none border border-[#E5E5E5]">
                                <select
                                    value={aiTone}
                                    onChange={(e) => setAiTone(e.target.value)}
                                    className="text-[10px] font-bold bg-white px-3 py-1.5 rounded-none outline-none border border-[#E5E5E5] uppercase tracking-tight text-brand-black"
                                >
                                    <option value="professional">Professional</option>
                                    <option value="minimalist">Minimal</option>
                                    <option value="vibrant">Vibrant</option>
                                    <option value="luxurious">Premium</option>
                                </select>

                                <button
                                    type="button"
                                    disabled={isAILoading || !formData.title || !formData.category}
                                    onClick={async () => {
                                        const desc = await generate({
                                            title: formData.title,
                                            category: formData.category,
                                            tone: aiTone
                                        });
                                        if (desc) setFormData(prev => ({ ...prev, description: desc }));
                                    }}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-black text-brand-white rounded-none hover:bg-brand-white hover:text-brand-black border border-brand-black transition-colors disabled:opacity-40 text-[10px] font-bold uppercase tracking-tight cursor-pointer"
                                >
                                    {isAILoading ? <HugeiconsIcon icon={Loading03Icon} size={12} className="animate-spin" /> : <HugeiconsIcon icon={SparklesIcon} size={12} />}
                                    <span>Generate</span>
                                </button>

                                <button
                                    type="button"
                                    disabled={isAILoading || !formData.description}
                                    onClick={async () => {
                                        const desc = await improve(formData.description);
                                        if (desc) setFormData(prev => ({ ...prev, description: desc }));
                                    }}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-brand-black rounded-none hover:bg-brand-black hover:text-brand-white transition-colors disabled:opacity-40 text-[10px] font-bold uppercase tracking-tight border border-[#E5E5E5] cursor-pointer"
                                >
                                    {isAILoading ? <HugeiconsIcon icon={Loading03Icon} size={12} className="animate-spin" /> : <HugeiconsIcon icon={MagicWand01Icon} size={12} />}
                                    <span>Polish</span>
                                </button>
                            </div>
                        </div>

                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={6}
                            required
                            placeholder="Craft a story for your product..."
                            className="w-full bg-white border border-[#E5E5E5] px-5 py-4 rounded-none outline-none focus:border-brand-black transition-colors text-sm leading-relaxed"
                        />
                    </div>
                </div>

                {/* ACTIONS */}
                <div className="flex justify-end items-center gap-6 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate('/vendor/products')}
                        className="text-sm font-semibold text-gray-muted hover:text-brand-black transition-colors cursor-pointer"
                    >
                        Discard Changes
                    </button>

                    <button
                        type="submit"
                        disabled={isSaving}
                        className="px-12 py-3.5 rounded-none bg-brand-black text-brand-white border border-brand-black text-xs font-semibold uppercase tracking-widest hover:bg-brand-white hover:text-brand-black transition-all duration-default ease-editorial disabled:opacity-50 min-w-[200px] flex items-center justify-center gap-2 cursor-pointer"
                    >
                        {isSaving ? (
                            <>
                                <HugeiconsIcon icon={Loading03Icon} size={18} className="animate-spin" />
                                <span>Securing...</span>
                            </>
                        ) : (
                            isEditMode ? "Update Product" : "Launch Product"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;
