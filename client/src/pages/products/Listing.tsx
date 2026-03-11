import { AlertCircle } from "lucide-react";
import { useProducts } from "../../hooks/products/useProducts";
import { ProductCard } from "../../components/ui/ProductCard";

const Listing = () => {
    const { data: products = [], isLoading, isError } = useProducts({ limit: 50 });

    if (isLoading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-900"></div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-[400px] flex flex-col items-center justify-center text-stone-500 gap-4">
                <AlertCircle className="w-12 h-12 text-red-500 opacity-50" />
                <p className="font-medium text-lg">Failed to load products.</p>
            </div>
        );
    }

    return (
        <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans">
            <div className="mb-10 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Discover Products</h1>
                    <p className="mt-2 text-stone-500 font-medium">Explore our curated collection of premium items.</p>
                </div>
                <div className="text-sm font-bold text-stone-400 uppercase tracking-widest bg-stone-50 px-4 py-2 rounded-full border border-stone-100">
                    {products.length} Items
                </div>
            </div>

            {products.length === 0 ? (
                <div className="text-center py-20 bg-stone-50 rounded-3xl border border-dashed border-stone-200">
                    <p className="text-stone-500 font-medium">No products found. Check back later!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            onAddToCart={(id: string) => {
                                // Add to cart functionality could be wired here like in CategoryPage
                                console.log('Add to cart', id);
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Listing;