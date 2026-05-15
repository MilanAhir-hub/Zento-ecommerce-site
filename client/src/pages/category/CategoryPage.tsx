import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { Alert01Icon, ArrowRight01Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { useProducts } from "../../hooks/products/useProducts";
import { ProductCard } from "../../components/ui/ProductCard";

const CategoryPage = () => {
    const { name } = useParams<{ name: string }>();
    const [searchInput, setSearchInput] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchInput);
        }, 800);
        return () => clearTimeout(handler);
    }, [searchInput]);

    const { data: products = [], isLoading, isError } = useProducts({ category: name, keyword: debouncedSearch, limit: 50 });

    if (isError) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6 bg-white">
                <HugeiconsIcon icon={Alert01Icon} size={48} className="text-gray-300 mb-6" />
                <h2 className="text-2xl font-semibold text-gray-900">Something went wrong.</h2>
                <p className="mt-2 text-gray-500 max-w-sm mb-8">We couldn't load the products for this category. Please try again later.</p>
                <Link to="/" className="text-blue-600 font-medium hover:underline flex items-center gap-1">
                    Go back to home
                    <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full bg-white min-h-screen">

            {/* Centered Header Section */}
            <header className="max-w-[1100px] mx-auto px-6 pt-12 pb-16 text-center border-b border-gray-100">
                {/* Subtle Breadcrumbs */}
                <nav className="flex items-center justify-center text-[12px] font-medium text-gray-400 mb-6 tracking-wide">
                    <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
                    <HugeiconsIcon icon={ArrowRight01Icon} size={12} className="mx-2 opacity-30" />
                    <span className="text-gray-900 capitalize italic">{name}</span>
                </nav>

                <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-semibold tracking-tight text-gray-900 leading-tight capitalize">
                    {name}
                </h1>

                <p className="mt-6 text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
                    Explore our curated {name?.toLowerCase()} collection. Refined essentials and seasonal favorites designed for lasting style.
                </p>

                {/* Minimalist Search & Count Controls */}
                <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8">
                    <div className="relative w-full max-w-sm group">
                        <div className="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none">
                            <HugeiconsIcon icon={Search01Icon} size={16} className="text-gray-400 group-focus-within:text-gray-900 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder={`Search in ${name}...`}
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full pl-8 pr-4 py-2 bg-transparent border-b border-gray-200 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-gray-900 transition-all font-medium text-sm"
                            autoFocus
                        />
                    </div>

                    <span className="text-[12px] font-semibold text-gray-400 uppercase tracking-[0.15em] shrink-0">
                        {isLoading ? (
                            <div className="w-4 h-4 border-2 border-stone-200 border-t-stone-800 rounded-full animate-spin" />
                        ) : (
                            `${products.length} ${products.length === 1 ? 'Item' : 'Items'}`
                        )}
                    </span>
                </div>
            </header>

            {/* Product Grid Container */}
            <main className="max-w-[1400px] mx-auto px-6 py-20">
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-12 gap-x-8 opacity-50 transition-opacity">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="aspect-square bg-gray-100 animate-pulse rounded-2xl" />
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-32">
                        <p className="text-xl text-gray-400 font-medium">No results found for your search.</p>
                        <button
                            onClick={() => setSearchInput("")}
                            className="mt-4 text-blue-600 font-medium hover:underline text-sm"
                        >
                            View all items
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-12 gap-x-8">
                        {products.map((product) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                            />
                        ))}
                    </div>
                )}
            </main>

            {/* Final Divider */}
            <div className="w-full h-px bg-gray-100 mt-20" />
        </div>
    );
};


export default CategoryPage;
