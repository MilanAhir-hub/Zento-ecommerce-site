import { Package, Plus, Loader2, Trash2 } from "lucide-react";
import { useAdminProducts, useDeleteProductAdmin } from "../../hooks/admin/useAdmin";

const ProductsManagement = () => {
    const { data: products, isLoading } = useAdminProducts();
    const deleteProduct = useDeleteProductAdmin();

    return (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col h-full min-h-[500px]">
            <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between shrink-0">
                <h2 className="text-xl font-bold text-stone-900 flex items-center gap-3">
                    <Package className="w-6 h-6 text-stone-400" />
                    Products Inventory
                </h2>
                <button className="text-sm font-bold text-white bg-stone-900 px-4 py-2 rounded-xl hover:bg-stone-800 transition-colors flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Product
                </button>
            </div>
            <div className="p-6 flex-1 overflow-x-auto">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
                        <Loader2 className="w-8 h-8 text-stone-300 animate-spin mb-4" />
                        <p className="text-sm font-medium text-stone-500">Loading products...</p>
                    </div>
                ) : !products || products.length === 0 ? (
                    <div className="p-8 flex-1 flex flex-col items-center justify-center h-full min-h-[300px] text-center">
                        <Package className="w-16 h-16 text-stone-200 mb-4" />
                        <h3 className="text-lg font-bold text-stone-900 mb-1">Manage Products</h3>
                        <p className="text-stone-400 font-medium max-w-sm">Add, remove, or edit products available in the catalog across all vendors.</p>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-stone-100">
                                <th className="py-3 px-4 text-xs font-bold text-stone-400 uppercase tracking-wider">Product</th>
                                <th className="py-3 px-4 text-xs font-bold text-stone-400 uppercase tracking-wider">Category</th>
                                <th className="py-3 px-4 text-xs font-bold text-stone-400 uppercase tracking-wider">Price</th>
                                <th className="py-3 px-4 text-xs font-bold text-stone-400 uppercase tracking-wider">Vendor</th>
                                <th className="py-3 px-4 text-xs font-bold text-stone-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product: any) => (
                                <tr key={product._id} className="border-b border-stone-50 hover:bg-stone-50/50 transition-colors">
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center overflow-hidden shrink-0">
                                                <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
                                            </div>
                                            <p className="font-bold text-sm text-stone-900 line-clamp-1 max-w-[200px]">{product.title}</p>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-sm font-semibold text-stone-500 capitalize">{product.category}</td>
                                    <td className="py-4 px-4 font-bold text-sm text-stone-900">₹{product.price}</td>
                                    <td className="py-4 px-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${product.vendor ? 'bg-blue-100 text-blue-700' : 'bg-stone-100 text-stone-700'}`}>
                                            {product.vendor ? product.vendor.storeName : 'Platform'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <button
                                            onClick={() => {
                                                if (confirm(`Are you sure you want to forcibly remove ${product.title}?`)) {
                                                    deleteProduct.mutate(product._id);
                                                }
                                            }}
                                            disabled={deleteProduct.isPending}
                                            className="text-xs p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors inline-flex disabled:opacity-50"
                                            title="Delete product"
                                        >
                                            <Trash2 className="w-4 h-4" />
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
