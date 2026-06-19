import { HugeiconsIcon } from "@hugeicons/react";
import { PackageIcon, PlusSignIcon, Loading03Icon, Delete01Icon } from "@hugeicons/core-free-icons";
import { useAdminProducts, useDeleteProductAdmin } from "../../hooks/admin/useAdmin";

const ProductsManagement = ({ filterVendorId, onClearFilter }: { filterVendorId: string | null, onClearFilter: () => void }) => {
    const { data: products, isLoading } = useAdminProducts();
    const deleteProduct = useDeleteProductAdmin();

    const filteredProducts = filterVendorId
        ? products?.filter((p: any) => p.vendor?._id === filterVendorId)
        : products;

    const activeVendorName = filterVendorId && products
        ? products.find((p: any) => p.vendor?._id === filterVendorId)?.vendor?.storeName || 'Vendor'
        : null;

    return (
        <div className="bg-white rounded-4xl border border-[#d2d2d7]/30 overflow-hidden flex flex-col h-full min-h-[500px] shadow-sm">
            <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-[#f5f5f7] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
                <div className="flex flex-col gap-1">
                    <h2 className="text-[16px] sm:text-[18px] font-bold text-[#1d1d1f] flex items-center gap-3">
                        <HugeiconsIcon icon={PackageIcon} size={24} className="text-[#0071e3]" />
                        {filterVendorId ? `${activeVendorName}'s Catalog` : <><span className="hidden sm:inline">Products Inventory</span><span className="sm:hidden">Products</span></>}
                    </h2>
                    {filterVendorId && (
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] font-medium text-[#86868b]">Showing products from 1 vendor</span>
                            <button
                                onClick={onClearFilter}
                                className="text-[11px] font-bold text-[#0071e3] hover:underline cursor-pointer"
                            >
                                Clear filter
                            </button>
                        </div>
                    )}
                </div>
                <button className="text-[13px] font-bold text-white bg-[#0071e3] px-5 py-2.5 rounded-2xl hover:bg-[#005bb5] transition-all flex items-center gap-2 shadow-md shadow-[#0071e3]/10">
                    <HugeiconsIcon icon={PlusSignIcon} size={16} />
                    Add Product
                </button>
            </div>
            <div className="p-4 flex-1 overflow-x-auto">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <HugeiconsIcon icon={Loading03Icon} size={32} className="text-[#0071e3] animate-spin mb-4" />
                        <p className="text-[14px] font-medium text-[#86868b]">Syncing inventory...</p>
                    </div>
                ) : !filteredProducts || filteredProducts.length === 0 ? (
                    <div className="p-12 flex-1 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-[#f5f5f7] rounded-full flex items-center justify-center mb-6">
                            <HugeiconsIcon icon={PackageIcon} size={40} className="text-[#c1c1c7]" />
                        </div>
                        <h3 className="text-[18px] font-bold text-[#1d1d1f] mb-1">
                            {filterVendorId ? 'No products found' : 'Scale your catalog'}
                        </h3>
                        <p className="text-[#86868b] text-[14px] max-w-[280px]">
                            {filterVendorId
                                ? "This vendor hasn't listed any products yet."
                                : "Manage and monitor your global product inventory across all verified vendors."
                            }
                        </p>
                        {filterVendorId && (
                            <button
                                onClick={onClearFilter}
                                className="mt-4 text-[13px] font-bold text-[#0071e3] hover:underline cursor-pointer"
                            >
                                View full inventory
                            </button>
                        )}
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-[#f5f5f7]">
                                <th className="py-4 px-6 text-[11px] font-bold text-[#86868b] uppercase tracking-widest">Product Info</th>
                                <th className="py-4 px-6 text-[11px] font-bold text-[#86868b] uppercase tracking-widest">Category</th>
                                <th className="py-4 px-6 text-[11px] font-bold text-[#86868b] uppercase tracking-widest">Price</th>
                                <th className="py-4 px-6 text-[11px] font-bold text-[#86868b] uppercase tracking-widest">Ownership</th>
                                <th className="py-4 px-6 text-[11px] font-bold text-[#86868b] uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f5f5f7]">
                            {filteredProducts.map((product: any) => (
                                <tr key={product._id} className="hover:bg-[#fbfbfd] transition-colors group">
                                    <td className="py-5 px-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-[#f5f5f7] border border-[#d2d2d7]/30 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                                                <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
                                            </div>
                                            <p className="font-bold text-[14px] text-[#1d1d1f] line-clamp-1">{product.title}</p>
                                        </div>
                                    </td>
                                    <td className="py-5 px-6">
                                        <span className="text-[13px] font-medium text-[#86868b] capitalize">{product.category}</span>
                                    </td>
                                    <td className="py-5 px-6">
                                        <span className="font-bold text-[14px] text-[#1d1d1f]">₹{product.price.toLocaleString()}</span>
                                    </td>
                                    <td className="py-5 px-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-tight ${product.vendor ? 'bg-[#0071e3]/5 text-[#0071e3]' : 'bg-[#f5f5f7] text-[#86868b]'}`}>
                                            {product.vendor ? product.vendor.storeName : 'Platform'}
                                        </span>
                                    </td>
                                    <td className="py-5 px-6 text-right">
                                        <button
                                            onClick={() => {
                                                if (confirm(`Are you sure you want to forcibly remove ${product.title}?`)) {
                                                    deleteProduct.mutate(product._id);
                                                }
                                            }}
                                            disabled={deleteProduct.isPending}
                                            className="p-2.5 rounded-xl bg-red-50 text-[#ff453a] hover:bg-[#ff453a] hover:text-white transition-all inline-flex disabled:opacity-50 border border-red-100 cursor-pointer"
                                            title="Delete product"
                                        >
                                            <HugeiconsIcon icon={Delete01Icon} size={16} />
                                        </button>
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

export default ProductsManagement;
