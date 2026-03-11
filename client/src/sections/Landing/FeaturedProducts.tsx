import { useRef } from "react";
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useProducts } from "../../hooks/products/useProducts";
import { ProductCard } from "../../components/ui/ProductCard";

const FeaturedProducts = () => {
    // Replace manual api fetching and state with useQuery hook
    const { data: products = [], isLoading, isError } = useProducts({ limit: 10 });
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = direction === 'left' ? -400 : 400;
            scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    if (isLoading) {
        return (
            <section className="py-16 bg-white">
                <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="h-[400px] flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-900"></div>
                    </div>
                </div>
            </section>
        );
    }

    if (isError) {
        return (
            <section className="py-16 bg-white">
                <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="h-[400px] flex flex-col items-center justify-center text-stone-500 gap-4">
                        <AlertCircle className="w-12 h-12 text-red-500 opacity-50" />
                        <p className="font-medium text-lg">Failed to load featured products.</p>
                    </div>
                </div>
            </section>
        );
    }

    if (products.length === 0) return null;

    return (
        <section className="py-20 bg-white font-sans overflow-hidden">
            <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
                            Featured Highlights
                        </h2>
                        <p className="mt-3 text-stone-500 font-medium max-w-xl">
                            Handpicked premium selections carefully curated just for you.
                        </p>
                    </div>

                    {/* Navigation Arrows */}
                    <div className="hidden sm:flex items-center gap-3">
                        <button
                            onClick={() => scroll('left')}
                            className="h-12 w-12 flex items-center justify-center rounded-full border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors shadow-sm active:scale-95"
                            aria-label="Scroll left"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="h-12 w-12 flex items-center justify-center rounded-full border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors shadow-sm active:scale-95"
                            aria-label="Scroll right"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto gap-8 sm:gap-10 pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar snap-x snap-mandatory"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {products.map((product) => (
                        <div key={product._id} className="flex-none w-[300px] sm:w-[340px] md:w-[360px] snap-start">
                            <ProductCard
                                product={product}
                                onAddToCart={(id: string) => {
                                    console.log('Add to cart', id);
                                }}
                                onAddToWishlist={(id: string) => {
                                    console.log('Add to wishlist', id);
                                }}
                                onAskAI={(id: string) => {
                                    console.log('Ask AI', id);
                                }}
                            />
                        </div>
                    ))}
                </div>

                {/* Mobile View All button */}
                <div className="mt-4 sm:hidden text-center border-t border-stone-100 pt-6">
                    <Link to="/products" className="inline-flex items-center text-sm font-bold text-stone-900 uppercase tracking-widest hover:text-stone-600 transition-colors">
                        View All Products <ChevronRight className="ml-1 w-4 h-4" />
                    </Link>
                </div>
            </div>

            {/* Inject CSS to hide scrollbar for webkit browsers */}
            <style>
                {`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                `}
            </style>
        </section>
    );
};

export default FeaturedProducts;