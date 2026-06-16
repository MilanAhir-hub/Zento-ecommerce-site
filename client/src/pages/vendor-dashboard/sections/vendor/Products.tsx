import { HugeiconsIcon } from "@hugeicons/react";
import {
    PlusSignIcon,
    Search01Icon,
    PencilEdit01Icon,
    Delete01Icon,
    PackageIcon,
    Loading03Icon,
    Alert01Icon,
    ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { useVendorProducts, useDeleteVendorProduct } from "../../../../hooks/vendor/useVendorHooks";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Products = () => {
    const { data: products, isLoading, isError, error, refetch } = useVendorProducts();
    const deleteMutation = useDeleteVendorProduct();
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`Delete "${name}"?`)) {
            try {
                await deleteMutation.mutateAsync(id);
            } catch {
                console.error("Delete failed");
            }
        }
    };

    const filteredProducts = products?.filter((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase())) || [];

    // LOADING
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[420px] gap-4">
                <HugeiconsIcon icon={Loading03Icon} size={22} className="animate-spin text-black" />
                <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-gray-400">
                    Loading products
                </span>
            </div>
        );
    }

    // ERROR
    if (isError) {
        return (
            <div className="border border-gray-200 p-12 text-center">
                <HugeiconsIcon icon={Alert01Icon} size={32} className="text-gray-300 mx-auto mb-6" />
                <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-gray-400 block mb-3">
                    Error
                </span>
                <h3 className="text-[20px] font-light text-black mb-3">Unable to load products</h3>
                <p className="text-[14px] text-gray-500 mb-8">{(error as any)?.message}</p>
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
        <div className="space-y-10 pb-10">
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
                <div>
                    <div className="w-12 h-px bg-black mb-6" />
                    <h2 className="text-[32px] md:text-[40px] font-light text-black tracking-[0.02em]">
                        Products
                    </h2>
                    <p className="text-[13px] text-gray-500 font-normal mt-2">
                        {products?.length || 0} {products?.length === 1 ? 'item' : 'items'} in your store
                    </p>
                </div>

                <button
                    onClick={() => navigate("/vendor/products/add")}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white text-[11px] font-medium uppercase tracking-[0.15em] hover:bg-gray-900 active:scale-[0.98] transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]"
                >
                    <HugeiconsIcon icon={PlusSignIcon} size={14} />
                    Add Product
                </button>
            </div>

            {/* SEARCH */}
            <div className="relative max-w-xs group">
                <div className="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none">
                    <HugeiconsIcon
                        icon={Search01Icon}
                        size={15}
                        className="text-gray-400 group-focus-within:text-black transition-colors duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]"
                    />
                </div>
                <label htmlFor="product-search" className="sr-only">
                    Search products
                </label>
                <input
                    id="product-search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-7 pr-3 py-2 bg-transparent border-0 border-b border-gray-200 text-black placeholder:text-gray-300 focus:outline-none focus:border-black transition-colors duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] font-normal text-xs tracking-[0.12em] uppercase"
                />
            </div>

            {/* PRODUCTS LIST */}
            {filteredProducts.length > 0 ? (
                <div>
                    {/* Desktop Table */}
                    <div className="hidden lg:block">
                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-4 pb-4 border-b border-gray-200">
                            <div className="col-span-5 text-[11px] font-medium uppercase tracking-[0.15em] text-gray-400">
                                Product
                            </div>
                            <div className="col-span-2 text-[11px] font-medium uppercase tracking-[0.15em] text-gray-400 text-center">
                                Price
                            </div>
                            <div className="col-span-2 text-[11px] font-medium uppercase tracking-[0.15em] text-gray-400 text-center">
                                Stock
                            </div>
                            <div className="col-span-3 text-[11px] font-medium uppercase tracking-[0.15em] text-gray-400 text-right">
                                Actions
                            </div>
                        </div>

                        {/* Table Rows */}
                        {filteredProducts.map((p) => (
                            <div
                                key={p._id}
                                className="grid grid-cols-12 gap-4 items-center py-5 border-b border-gray-100 hover:bg-[#F9F9F9] transition-colors duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]"
                            >
                                {/* Product */}
                                <div className="col-span-5 flex items-center gap-4">
                                    <div className="w-14 h-14 bg-[#F9F9F9] overflow-hidden shrink-0">
                                        {p.imageUrl ? (
                                            <img src={p.imageUrl} className="w-full h-full object-cover" alt={p.title} />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <HugeiconsIcon icon={PackageIcon} size={20} className="text-gray-300" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[14px] font-normal text-black truncate">{p.title}</p>
                                        <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-gray-400 mt-0.5">
                                            {p.category}
                                        </p>
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="col-span-2 text-center text-[14px] font-medium tabular-nums text-black">
                                    ₹{p.price.toLocaleString("en-IN")}
                                </div>

                                {/* Stock */}
                                <div className="col-span-2 text-center">
                                    <span className={`text-[13px] tabular-nums ${p.stock > 0 ? "text-black" : "text-gray-400"}`}>
                                        {p.stock || 0}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="col-span-3 flex justify-end gap-2">
                                    <button
                                        onClick={() => navigate(`/vendor/products/edit/${p._id}`)}
                                        className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-black transition-colors duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]"
                                        aria-label="Edit product"
                                    >
                                        <HugeiconsIcon icon={PencilEdit01Icon} size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(p._id, p.title)}
                                        className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-[#BC0000] transition-colors duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]"
                                        aria-label="Delete product"
                                    >
                                        <HugeiconsIcon icon={Delete01Icon} size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Mobile List */}
                    <div className="lg:hidden space-y-0">
                        {filteredProducts.map((p) => (
                            <div
                                key={p._id}
                                className="flex gap-4 py-5 border-b border-gray-100"
                            >
                                <div className="w-16 h-20 bg-[#F9F9F9] overflow-hidden shrink-0">
                                    {p.imageUrl ? (
                                        <img src={p.imageUrl} className="w-full h-full object-cover" alt={p.title} />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <HugeiconsIcon icon={PackageIcon} size={20} className="text-gray-300" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col justify-between">
                                    <div>
                                        <p className="text-[14px] font-normal text-black truncate">{p.title}</p>
                                        <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-gray-400 mt-0.5">
                                            {p.category}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-[14px] font-medium tabular-nums text-black">
                                            ₹{p.price.toLocaleString("en-IN")}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => navigate(`/vendor/products/edit/${p._id}`)}
                                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-black transition-colors duration-200"
                                                aria-label="Edit product"
                                            >
                                                <HugeiconsIcon icon={PencilEdit01Icon} size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(p._id, p.title)}
                                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#BC0000] transition-colors duration-200"
                                                aria-label="Delete product"
                                            >
                                                <HugeiconsIcon icon={Delete01Icon} size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                /* Empty State */
                <div className="py-24 text-center">
                    <div className="w-16 h-16 border border-gray-200 flex items-center justify-center mx-auto mb-6">
                        <HugeiconsIcon icon={PackageIcon} size={24} className="text-gray-300" />
                    </div>
                    <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-gray-400 block mb-3">
                        {searchQuery ? "No results" : "Empty collection"}
                    </span>
                    <h3 className="text-[20px] font-light text-black mb-3">
                        {searchQuery ? "No products found" : "No products yet"}
                    </h3>
                    <p className="text-[14px] text-gray-500 mb-8 max-w-sm mx-auto">
                        {searchQuery ? "Try a different search term" : "Start building your store by adding your first product."}
                    </p>

                    {!searchQuery && (
                        <button
                            onClick={() => navigate("/vendor/products/add")}
                            className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.15em] text-black pb-2 border-b border-black hover:border-transparent transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]"
                        >
                            Add your first product
                            <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default Products;
