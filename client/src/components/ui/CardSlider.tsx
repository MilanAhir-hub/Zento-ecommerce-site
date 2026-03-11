import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Heart, Sparkles } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

// Items are now strictly passed from parent components calling the API

interface CardSliderProps<T> {
    title?: string;
    subtitle?: string;
    items?: T[];
    renderItem?: (item: T, index: number) => ReactNode;
    viewAllLink?: string;
    viewAllText?: string;
}

const CardSlider = <T,>({
    title = "Featured Collection",
    subtitle = "Explore our specially curated items.",
    items = [] as unknown as T[],
    renderItem,
    viewAllLink = "/products",
    viewAllText = "View All"
}: CardSliderProps<T>) => {

    const navigate = useNavigate();

    const defaultRenderItem = (item: any) => {
        const discountPercent = item.oldPrice ? Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100) : 0;

        return (
            <div
                onClick={() => navigate(`/products/${item.id}`)}
                className="group flex flex-col bg-white border border-stone-200 rounded-xl overflow-hidden hover:shadow-xs transition duration-300 cursor-pointer h-full"
            >
                {/* Image Section */}
                <div className="relative overflow-hidden">
                    <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Discount Badge */}
                    {discountPercent > 0 && (
                        <span className="absolute top-3 left-3 bg-red-500 text-white font-bold text-xs px-2 py-1 rounded shadow-sm">
                            {discountPercent}% OFF
                        </span>
                    )}

                    {/* Floating Action Buttons */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover:translate-x-0">
                        {/* Wishlist */}
                        <button
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-full shadow-md p-2 flex items-center justify-center hover:bg-red-50 hover:text-red-500 text-stone-400 transition-colors"
                        >
                            <Heart className="w-4 h-4 transition-colors" />
                        </button>

                        {/* Ask AI */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/products/${item.id}`); // For now navigate to details for AI questions
                            }}
                            className="bg-white rounded-full shadow-md p-2 flex items-center justify-center hover:bg-orange-50 hover:text-orange-500 text-stone-400 transition-colors"
                            title="Ask AI about this product"
                        >
                            <Sparkles className="w-4 h-4 transition-colors" />
                        </button>
                    </div>
                </div>

                {/* Product Details */}
                <div className="p-4 flex flex-col flex-1 text-sm">
                    {/* Price */}
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-stone-900 text-lg font-bold">
                            ₹{item.price.toFixed(2)}
                        </span>
                        {item.oldPrice && (
                            <span className="text-stone-400 line-through text-xs">
                                ₹{item.oldPrice.toFixed(2)}
                            </span>
                        )}
                    </div>

                    {/* Title */}
                    <p className="text-stone-800 text-base font-medium my-1.5 line-clamp-1 group-hover:text-blue-700 transition-colors">
                        {item.title}
                    </p>

                    {/* Description (simulated) */}
                    <p className="text-stone-500 line-clamp-2 mt-1 mb-3">
                        {item.description || "Premium quality product built to last. Hand-picked specifically for you."}
                    </p>

                    <div className="mt-auto pt-3">
                        {/* Buttons grid */}
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={(e) => e.stopPropagation()}
                                className="bg-stone-100 cursor-pointer hover:bg-stone-200 text-stone-700 font-medium py-2 rounded-full transition-colors active:scale-[0.98]"
                            >
                                Add
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/products/${item.id}`);
                                }}
                                className="bg-stone-900 cursor-pointer hover:bg-black text-white font-bold py-2 rounded-full transition-colors shadow-sm active:scale-[0.98]"
                            >
                                Buy
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <section className="py-10 bg-white font-sans overflow-hidden">
            <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8 relative group/slider">

                {/* Header */}
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
                            {title}
                        </h2>
                        {subtitle && (
                            <p className="mt-3 text-stone-500 font-medium max-w-xl">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    <div className="hidden sm:flex items-center gap-6">
                        {/* Custom Navigation */}
                        <div className="flex items-center gap-2">
                            <button className="swiper-button-prev-custom h-10 w-10 flex items-center justify-center rounded-full border border-stone-200 bg-white shadow-sm text-stone-600 transition-all cursor-pointer hover:bg-stone-50 hover:text-stone-900 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:scale-100 disabled:active:scale-100">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button className="swiper-button-next-custom h-10 w-10 flex items-center justify-center rounded-full border border-stone-200 bg-white shadow-sm text-stone-600 transition-all cursor-pointer hover:bg-stone-50 hover:text-stone-900 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:scale-100 disabled:active:scale-100">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>

                        {viewAllLink && (
                            <Link
                                to={viewAllLink}
                                className="inline-flex items-center text-sm font-bold text-stone-900 uppercase tracking-widest hover:text-stone-600 transition-colors"
                            >
                                {viewAllText} <ChevronRight className="ml-1 w-4 h-4" />
                            </Link>
                        )}
                    </div>
                </div>

                {/* Swiper Container */}
                <div className="relative">
                    <Swiper
                        modules={[Navigation]}
                        slidesPerView="auto"
                        spaceBetween={24}
                        slidesPerGroup={2}
                        navigation={{
                            prevEl: '.swiper-button-prev-custom',
                            nextEl: '.swiper-button-next-custom',
                        }}
                        className="pb-8! px-2! -mx-2"
                        breakpoints={{
                            320: { slidesPerView: 1.5, spaceBetween: 16, slidesPerGroup: 1 },
                            640: { slidesPerView: 2.5, spaceBetween: 24, slidesPerGroup: 2 },
                            1024: { slidesPerView: 4, spaceBetween: 32, slidesPerGroup: 4 },
                            1280: { slidesPerView: 5, spaceBetween: 36, slidesPerGroup: 5 },
                        }}
                    >
                        {items.map((item, idx) => (
                            <SwiperSlide key={idx} className="h-auto">
                                {renderItem ? renderItem(item, idx) : defaultRenderItem(item)}
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* Mobile View All */}
                {viewAllLink && (
                    <div className="mt-4 sm:hidden text-center border-t border-stone-100 pt-6">
                        <Link to={viewAllLink} className="inline-flex items-center text-sm font-bold text-stone-900 uppercase tracking-widest hover:text-stone-600 transition-colors">
                            {viewAllText} <ChevronRight className="ml-1 w-4 h-4" />
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
};

export default CardSlider;