import { useState, useEffect, useId, useRef } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Alert01Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { useProducts } from "../../hooks/products/useProducts";
import { ProductCard } from "../../components/ui/ProductCard";
import { useLocation } from "react-router-dom";
import { useInteractionLogger } from "../../hooks/useInteractionLogger";

const Listing = () => {
    const location = useLocation();
    const visualSearchData = location.state?.visualSearchData;
    const visualDescription = location.state?.visualDescription;
    const searchInputId = useId();
    const searchInputRef = useRef<HTMLInputElement>(null);
    const { log } = useInteractionLogger();

    const [searchInput, setSearchInput] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchInput);
        }, 400);
        return () => clearTimeout(handler);
    }, [searchInput]);

    const { data: regularProducts = [], isLoading, isError } = useProducts({ 
        limit: 50, 
        keyword: debouncedSearch || undefined 
    });

    const isVisualSearch = !!visualSearchData;
    const products = isVisualSearch ? visualSearchData : regularProducts;
    const hasSearchActive = debouncedSearch.trim().length > 0;

    // Initial page load (no search active, loading for the first time)
    const isInitialLoading = isLoading && !hasSearchActive && !isVisualSearch && regularProducts.length === 0;

    if (isInitialLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center bg-white">
                <div className="w-6 h-6 border border-neutral-300 border-t-neutral-900 rounded-full animate-spin"></div>
            </div>
        );
    }

    // Error State (clean + calm)
    if (isError) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
                <HugeiconsIcon icon={Alert01Icon} size={40} className="text-red-500/60 mb-4" />
                <p className="text-[18px] font-medium text-neutral-900">
                    Unable to load products.
                </p>
                <p className="text-[14px] text-neutral-500 mt-1">
                    Please try again later.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen font-sans">

            {/* Header (Apple editorial style) */}
            <div className="max-w-[1100px] mx-auto px-6 pt-20 pb-14">
                <h1 className="text-[40px] font-semibold text-neutral-900 tracking-tight">
                    {isVisualSearch ? "Visual Matches." : "Discover."}
                </h1>

                <p className="mt-3 text-[17px] text-neutral-500 max-w-xl leading-relaxed">
                    {isVisualSearch
                        ? "Findings based on visual similarities to your selection."
                        : "A curated collection of products designed to elevate your everyday experience."}
                </p>
                {isVisualSearch && visualDescription && (
                    <div className="mt-4 text-sm text-neutral-600 bg-neutral-100 p-4 rounded-xl border border-neutral-200 max-w-2xl">
                        <span className="font-semibold text-neutral-900 italic mr-2 border-r border-neutral-300 pr-2">AI Analysis</span>
                        {visualDescription}
                    </div>
                )}

                {/* Search Input & Item Count */}
                <div className="flex flex-wrap items-center gap-6 pt-6">
                    <div className="relative w-full max-w-xs group">
                        <div className="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none">
                            <HugeiconsIcon icon={Search01Icon} size={15} className="text-gray-400 group-focus-within:text-black transition-colors duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]" />
                        </div>
                        <label htmlFor={searchInputId} className="sr-only">Search products</label>
                        <input
                            ref={searchInputRef}
                            id={searchInputId}
                            type="text"
                            placeholder="Search products..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full pl-7 pr-3 py-2 bg-transparent border-0 border-b border-gray-200 text-black placeholder:text-gray-300 focus:outline-none focus:border-black transition-colors duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] font-normal text-xs tracking-[0.12em] uppercase"
                        />
                    </div>

                    <span className="text-[11px] font-medium text-gray-400 uppercase tracking-[0.15em] shrink-0">
                        {isLoading && hasSearchActive ? (
                            <span className="block w-4 h-4 border-2 border-stone-200 border-t-black rounded-full animate-spin" />
                        ) : (
                            `${products.length} ${products.length === 1 ? 'Product' : 'Products'}`
                        )}
                    </span>

                    {hasSearchActive && !isVisualSearch && (
                        <button
                            onClick={() => {
                                setSearchInput("");
                                searchInputRef.current?.focus();
                            }}
                            className="text-[11px] font-medium text-gray-400 uppercase tracking-[0.12em] hover:text-black transition-colors duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="max-w-[1100px] mx-auto px-6 pb-20">

                {products.length === 0 ? (
                    <div className="text-center py-28">
                        {hasSearchActive ? (
                            <>
                                <p className="text-[18px] text-[#767676] font-normal italic mb-4">
                                    No results found for "{debouncedSearch}"
                                </p>
                                <button
                                    onClick={() => setSearchInput("")}
                                    className="text-[13px] font-medium text-black underline underline-offset-8 uppercase tracking-[0.12em]"
                                >
                                    View all products
                                </button>
                            </>
                        ) : (
                            <>
                                <p className="text-[18px] text-neutral-900 font-medium">
                                    No products available.
                                </p>
                                <p className="text-[14px] text-neutral-500 mt-2">
                                    Check back later for new arrivals.
                                </p>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">

                        {products?.map((product: any) => (
                            <div
                                key={product._id}
                                onClick={() => {
                                    if (hasSearchActive && !isVisualSearch) {
                                        log({
                                            productId: product._id,
                                            action: 'click',
                                            metadata: { source: 'search' },
                                        });
                                    }
                                }}
                            >
                                <ProductCard product={product} />
                            </div>
                        ))}

                    </div>
                )}

            </div>
        </div>
    );
};

export default Listing;