import { HugeiconsIcon } from "@hugeicons/react";
import {
    PlusSignIcon,
    Search01Icon,
    PencilEdit01Icon,
    Delete01Icon,
    PackageIcon,
    Loading03Icon,
    Alert01Icon
} from "@hugeicons/core-free-icons";
import { useVendorProducts, useDeleteVendorProduct } from "../../../../hooks/vendor/useVendorHooks";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Products = () => {
    const { data: products, isLoading, isError, error, refetch } = useVendorProducts();
    const deleteMutation = useDeleteVendorProduct();
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const getStatusStyles = (status?: string) => {
        switch (status) {
            case 'Active': return 'bg-[#f2fbf4] text-[#1a7d32] border-[#dcfce7]';
            case 'Out of Stock': return 'bg-[#fff2f2] text-[#d60000] border-[#ffe5e5]';
            default: return 'bg-[#f5f5f7] text-[#86868b] border-[#e5e5ea]';
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`Delete "${name}"?`)) {
            try {
                await deleteMutation.mutateAsync(id);
            } catch {
                console.error("Delete failed");
            }
        }
    };

    const filteredProducts = products?.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    // LOADING
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[420px] gap-4">
                <HugeiconsIcon icon={Loading03Icon} size={26} className="animate-spin text-[#0071e3]" />
                <p className="text-[#86868b] text-sm">Loading your products…</p>
            </div>
        );
    }

    // ERROR
    if (isError) {
        return (
            <div className="bg-white border border-[#e5e5ea] p-10 rounded-[28px] text-center space-y-4 shadow-sm">
                <HugeiconsIcon icon={Alert01Icon} size={26} className="text-[#ff3b30] mx-auto" />
                <h3 className="text-[#1d1d1f] font-semibold">Unable to load products</h3>
                <p className="text-[#86868b] text-sm">{(error as any)?.message}</p>
                <button
                    onClick={() => refetch()}
                    className="px-6 py-2 rounded-full bg-[#1d1d1f] text-white text-sm"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-10">

            {/* HEADER */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-[36px] font-semibold text-[#1d1d1f] tracking-tight">
                        Products
                    </h2>
                    <p className="text-[#86868b] text-[15px] mt-1">
                        {products?.length || 0} items in your store
                    </p>
                </div>

                <button
                    onClick={() => navigate('/vendor/products/add')}
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#0071e3] text-white text-sm font-medium shadow-lg shadow-[#0071e3]/20 hover:bg-[#0077ED] active:scale-[0.97]"
                >
                    <HugeiconsIcon icon={PlusSignIcon} size={16} />
                    Add Product
                </button>
            </div>

            {/* MAIN CARD */}
            <div className="relative rounded-[36px] border border-black/5 bg-gradient-to-b from-white to-[#f5f5f7] shadow-[0_10px_60px_-20px_rgba(0,0,0,0.08)] overflow-hidden">

                {/* glow */}
                <div className="absolute -top-20 -right-20 w-72 h-72 bg-[#0071e3]/10 blur-3xl rounded-full"></div>

                {/* SEARCH */}
                <div className="p-6 border-b border-[#f0f0f0]">
                    <div className="relative max-w-md group">
                        <HugeiconsIcon
                            icon={Search01Icon}
                            size={16}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#86868b] group-focus-within:text-[#0071e3]"
                        />
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search products"
                            className="w-full pl-10 pr-4 py-3 rounded-full bg-white border border-[#e5e5ea] focus:ring-4 focus:ring-[#0071e3]/10 outline-none text-sm"
                        />
                    </div>
                </div>

                {/* TABLE */}
                <div className="hidden lg:block">
                    {filteredProducts.length > 0 ? (
                        <table className="w-full">
                            <thead>
                                <tr className="text-[#86868b] text-xs uppercase border-b border-[#f0f0f0]">
                                    <th className="text-left px-8 py-4">Product</th>
                                    <th className="px-4">Price</th>
                                    <th className="px-4">Stock</th>
                                    <th className="px-4">Status</th>
                                    <th className="text-right px-8">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredProducts.map((p) => (
                                    <tr key={p._id} className="border-b border-[#f5f5f7] hover:bg-white/60 transition">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-[#f5f5f7] overflow-hidden flex items-center justify-center">
                                                    {p.imageUrl ? (
                                                        <img src={p.imageUrl} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <HugeiconsIcon icon={PackageIcon} size={22} />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-[#1d1d1f] text-sm">{p.title}</p>
                                                    <p className="text-xs text-[#86868b]">{p.category}</p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="text-center font-medium">₹{p.price}</td>
                                        <td className="text-center">{p.stock}</td>

                                        <td className="text-center">
                                            <span className={`px-3 py-1 text-xs rounded-full border ${getStatusStyles(p.stock > 0 ? 'Active' : 'Out of Stock')}`}>
                                                {p.stock > 0 ? 'Active' : 'Out of Stock'}
                                            </span>
                                        </td>

                                        <td className="px-8 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => navigate(`/vendor/products/edit/${p._id}`)}
                                                    className="w-9 h-9 rounded-full hover:bg-[#f5f5f7]"
                                                >
                                                    <HugeiconsIcon icon={PencilEdit01Icon} size={16} />
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(p._id, p.title)}
                                                    className="w-9 h-9 rounded-full hover:bg-[#fff2f2] text-red-500"
                                                >
                                                    <HugeiconsIcon icon={Delete01Icon} size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="py-24 text-center">
                            <HugeiconsIcon icon={PackageIcon} size={40} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="text-lg font-semibold text-[#1d1d1f]">
                                {searchQuery ? "No results found" : "No products yet"}
                            </h3>
                            <p className="text-[#86868b] text-sm mt-2">
                                {searchQuery ? "Try another search" : "Start building your store"}
                            </p>

                            {!searchQuery && (
                                <button
                                    onClick={() => navigate('/vendor/products/add')}
                                    className="mt-6 px-6 py-3 bg-[#1d1d1f] text-white rounded-full text-sm"
                                >
                                    Add Product
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* MOBILE */}
                <div className="lg:hidden p-4 space-y-4">
                    {filteredProducts.map((p) => (
                        <div key={p._id} className="bg-white p-4 rounded-2xl shadow-sm">
                            <div className="flex justify-between">
                                <div>
                                    <p className="font-semibold">{p.title}</p>
                                    <p className="text-sm text-gray-500">₹{p.price}</p>
                                </div>
                                <span className="text-xs">{p.stock > 0 ? 'Active' : 'Out of Stock'}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Products;