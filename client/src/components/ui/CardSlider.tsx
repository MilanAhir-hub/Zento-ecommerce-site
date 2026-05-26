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
        <section className={`py-16 font-sans overflow-hidden ${className}`}>
            <div className="max-w-[1200px] mx-auto px-6 relative">

                <div className="flex items-end justify-between mb-10">

                    <div>
                        <h2 className="text-[32px] sm:text-[40px] font-semibold text-[#1d1d1f] tracking-tight leading-[1.1]">
                            {title}.
                        </h2>

                        {subtitle && (
                            <p className="mt-3 text-[17px] text-[#86868b] max-w-xl leading-[1.5]">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    <div className="hidden sm:flex items-center gap-6 pb-2">
                        {viewAllLink && (
                            <Link
                                to={viewAllLink}
                                className="text-[13px] font-semibold text-[#0071e3] tracking-wide hover:underline transition-all duration-200"
                            >
                                {viewAllText}
                            </Link>
                        )}
                    </div>
                </div>

                <div className="relative -mx-2 group/slider">

                    <button
                        ref={prevRef}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 
                        h-11 w-11 flex items-center justify-center rounded-full 
                        bg-white/95 backdrop-blur-md border border-[#d2d2d7]/50 shadow-[0_4px_12px_rgba(0,0,0,0.08)]
                        text-[#1d1d1f] opacity-0 group-hover/slider:opacity-100 
                        transition-all duration-300 hover:bg-white hover:shadow-[0_6px_16px_rgba(0,0,0,0.12)] active:scale-95
                        disabled:hidden cursor-pointer"
                    >
                        <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
                    </button>

                    <button
                        ref={nextRef}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 
                        h-11 w-11 flex items-center justify-center rounded-full 
                        bg-white/95 backdrop-blur-md border border-[#d2d2d7]/50 shadow-[0_4px_12px_rgba(0,0,0,0.08)]
                        text-[#1d1d1f] opacity-0 group-hover/slider:opacity-100 
                        transition-all duration-300 hover:bg-white hover:shadow-[0_6px_16px_rgba(0,0,0,0.12)] active:scale-95
                        disabled:hidden cursor-pointer"
                    >
                        <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
                    </button>

                    <Swiper
                        modules={[Navigation]}
                        onInit={(swiper) => {
                            swiper.params.navigation.prevEl = prevRef.current;
                            swiper.params.navigation.nextEl = nextRef.current;
                            swiper.navigation.init();
                            swiper.navigation.update();
                        }}
                        slidesPerView="auto"
                        spaceBetween={24}
                        slidesPerGroup={1}
                        speed={600}
                        grabCursor={true}
                        className="pb-10!"
                        breakpoints={{
                            320: { slidesPerView: 1.2, spaceBetween: 16 },
                            640: { slidesPerView: 2.25, spaceBetween: 20 },
                            1024: { slidesPerView: 3.25, spaceBetween: 24 },
                            1280: { slidesPerView: 4, spaceBetween: 24 },
                        }}
                    >
                        {items.map((item, idx) => (
                            <SwiperSlide key={idx} className="h-auto">
                                {renderItem ? renderItem(item, idx) : defaultRenderItem(item)}
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {viewAllLink && (
                    <div className="mt-2 sm:hidden">
                        <Link
                            to={viewAllLink}
                            className="text-[14px] font-semibold text-[#0071e3]"
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