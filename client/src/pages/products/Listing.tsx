import { HugeiconsIcon } from "@hugeicons/react";
import { Alert01Icon } from "@hugeicons/core-free-icons";
import { useProducts } from "../../hooks/products/useProducts";
import { ProductCard } from "../../components/ui/ProductCard";
import { useLocation } from "react-router-dom";

const Listing = () => {
    const location = useLocation();
    const visualSearchData = location.state?.visualSearchData;
    const visualDescription = location.state?.visualDescription;

    const { data: regularProducts = [], isLoading, isError } = useProducts({ limit: 50 });

    const isVisualSearch = !!visualSearchData;
    const products = isVisualSearch ? visualSearchData : regularProducts;

    // Loading State (Apple style minimal)
    if (!isVisualSearch && isLoading) {
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

                <div className="mt-6 text-[13px] text-neutral-400">
                    {products.length} products
                </div>
            </div>

            {/* Content */}
            <div className="max-w-[1100px] mx-auto px-6 pb-20">

                {products.length === 0 ? (
                    <div className="text-center py-28">
                        <p className="text-[18px] text-neutral-900 font-medium">
                            No products available.
                        </p>
                        <p className="text-[14px] text-neutral-500 mt-2">
                            Check back later for new arrivals.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">

                        {products?.map((product: any) => (
                            <div
                                key={product._id}
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