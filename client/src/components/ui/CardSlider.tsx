import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import { ProductCard } from "./ProductCard";
import type { Product } from "./ProductCard";

interface CardSliderProps<T> {
    title?: string;
    subtitle?: string;
    items?: T[];
    renderItem?: (item: T, index: number) => React.ReactNode;
    viewAllLink?: string;
    viewAllText?: string;
}

const CardSlider = <T,>({
    title = "Featured Collection",
    subtitle = "Explore our specially curated items.",
    items = [] as unknown as T[],
    renderItem,
    viewAllLink = "/products",
    viewAllText = "View All",
    className = ""
}: CardSliderProps<T> & { className?: string }) => {

    const prevRef = useRef<HTMLButtonElement>(null);
    const nextRef = useRef<HTMLButtonElement>(null);

    const defaultRenderItem = (item: any) => {
        const productData: Product = {
            _id: item._id || item.id,
            title: item.title,
            price: item.price,
            imageUrl: item.imageUrl
        };

        return (
            <div className="px-[2px]">
                <ProductCard product={productData} />
            </div>
        );
    };

    return (
        <section className={`py-12 font-sans overflow-hidden bg-white ${className}`}>
            <div className="max-w-[1100px] mx-auto px-6 relative">

                {/* Header */}
                <div className="flex items-end justify-between mb-8">

                    <div>
                        <h2 className="text-[30px] sm:text-[36px] font-semibold text-neutral-900 tracking-tight leading-tight">
                            {title}.
                        </h2>

                        {subtitle && (
                            <p className="mt-2 text-[15px] text-neutral-500 max-w-xl leading-relaxed">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {/* Desktop View All */}
                    <div className="hidden sm:flex items-center gap-6 pb-2">
                        {viewAllLink && (
                            <Link
                                to={viewAllLink}
                                className="text-[12px] font-bold text-[#0071e3] tracking-wide hover:underline transition"
                            >
                                {viewAllText}
                            </Link>
                        )}
                    </div>
                </div>

                {/* Slider Container */}
                <div className="relative -mx-2 group/slider">

                    {/* Navigation Buttons (Apple Style) */}
                    <button
                        ref={prevRef}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 
                        h-10 w-10 flex items-center justify-center rounded-full 
                        bg-white/90 backdrop-blur-md border border-neutral-200/50 shadow-md
                        text-neutral-800 opacity-0 group-hover/slider:opacity-100 
                        transition-all duration-300 hover:bg-white active:scale-95
                        disabled:hidden cursor-pointer"
                    >
                        <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
                    </button>

                    <button
                        ref={nextRef}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 
                        h-10 w-10 flex items-center justify-center rounded-full 
                        bg-white/90 backdrop-blur-md border border-neutral-200/50 shadow-md
                        text-neutral-800 opacity-0 group-hover/slider:opacity-100 
                        transition-all duration-300 hover:bg-white active:scale-95
                        disabled:hidden cursor-pointer"
                    >
                        <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
                    </button>

                    <Swiper
                        modules={[Navigation]}
                        onInit={(swiper) => {
                            // @ts-ignore
                            swiper.params.navigation.prevEl = prevRef.current;
                            // @ts-ignore
                            swiper.params.navigation.nextEl = nextRef.current;
                            swiper.navigation.init();
                            swiper.navigation.update();
                        }}
                        slidesPerView="auto"
                        spaceBetween={20}
                        slidesPerGroup={1}
                        speed={600}
                        grabCursor={true}
                        className="pb-8!"
                        breakpoints={{
                            320: { slidesPerView: 1.25, spaceBetween: 16 },
                            640: { slidesPerView: 2.25, spaceBetween: 20 },
                            1024: { slidesPerView: 3.25, spaceBetween: 24 },
                            1280: { slidesPerView: 4, spaceBetween: 28 },
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
                    <div className="mt-4 sm:hidden">
                        <Link
                            to={viewAllLink}
                            className="text-[13px] font-semibold text-[#0071e3]"
                        >
                            {viewAllText} →
                        </Link>
                    </div>
                )}

            </div>
        </section>
    );
};

export default CardSlider;