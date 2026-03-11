import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { AlertCircle, ChevronRight, Search } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useProducts } from "../../hooks/products/useProducts";
import { useAuth } from "../../context/authContext";
import api from "../../services/api";
import { ProductCard } from "../../components/ui/ProductCard";

const CategoryPage = () => {
    const { name } = useParams<{ name: string }>();
    const { isAuthenticated } = useAuth();
    const queryClient = useQueryClient();

    const [searchInput, setSearchInput] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchInput);
        }, 300);
        return () => clearTimeout(handler);
    }, [searchInput]);

    const { data: products = [], isLoading, isError } = useProducts({ category: name, keyword: debouncedSearch, limit: 50 });

    const addToCartMutation = useMutation({
        mutationFn: async (productId: string) => {
            const response = await api.post("/user/cart", { productId, quantity: 1 });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
        onError: (error: any) => {
            console.error("Failed to add to cart:", error);
            alert(error?.response?.data?.message || "Please login to add items to the cart.");
        }
    });

    if (isLoading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-900"></div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-[400px] flex flex-col items-center justify-center text-stone-500 gap-4 max-w-[95%] mx-auto">
                <AlertCircle className="w-12 h-12 text-red-500 opacity-50" />
                <p className="font-medium text-lg">Failed to load products for this category.</p>
                <Link to="/" className="text-sm border border-stone-200 px-6 py-2 rounded-full hover:bg-stone-50 transition-colors">
                    Go Home
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans min-h-screen">

            {/* Breadcrumbs */}
            <nav className="flex items-center text-sm text-stone-500 mb-8 font-medium">
                <Link to="/" className="hover:text-stone-900 transition-colors">Home</Link>
                <ChevronRight className="w-4 h-4 mx-2" />
                <span className="text-stone-900 truncate max-w-[200px] sm:max-w-xs capitalize">{name}</span>
            </nav>

            <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-stone-900 tracking-tight capitalize">{name} Collection</h1>
                    <p className="mt-2 text-stone-500 font-medium whitespace-break-spaces">
                        Explore our curated selection of premium {name?.toLowerCase()} products.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                    {/* Search Bar */}
                    <div className="relative w-full md:w-72">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-stone-400" />
                        </div>
                        <input
                            type="text"
                            placeholder={`Search in ${name}...`}
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 text-stone-900 rounded-full focus:outline-none focus:ring-2 focus:ring-stone-900 focus:bg-white transition-all font-medium text-sm"
                        />
                    </div>

                    <div className="hidden sm:block text-sm font-bold text-stone-400 uppercase tracking-widest bg-stone-50 px-4 py-2.5 rounded-full border border-stone-100 shrink-0">
                        {products.length} {products.length === 1 ? 'Item' : 'Items'}
                    </div>
                </div>
            </div>

            {products.length === 0 ? (
                <div className="text-center py-24 bg-stone-50 rounded-3xl border border-dashed border-stone-200">
                    <p className="text-stone-500 font-medium text-lg">No products found in this category.</p>
                    <Link to="/" className="inline-block mt-4 text-sm font-bold bg-stone-900 text-white px-8 py-3 rounded-full hover:bg-black transition-colors">
                        Browse All Categories
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {products.map((product) => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            onAddToCart={(id) => {
                                if (!isAuthenticated) {
                                    alert("Please log in to add items to your cart.");
                                    return;
                                }
                                addToCartMutation.mutate(id);
                            }}
                            isAddingToCart={addToCartMutation.isPending && addToCartMutation.variables === product._id}
                            isAddedToCart={addToCartMutation.isSuccess && addToCartMutation.variables === product._id}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategoryPage;
