import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css";

import { ProductCard } from "./ProductCard";
import type { Product } from "./ProductCard";

interface CardSliderProps<T> {
    title?: string;
    subtitle?: string;
    items?: T[];
    renderItem?: (item: T, index: number) => React.ReactNode;
    viewAllLink?: string;
    viewAllText?: string;
    className?: string;
}

const CardSlider = <T,>({
    title = "Featured Collection",
    subtitle = "Explore our specially curated items.",
    items = [] as unknown as T[],
    renderItem,
    viewAllLink = "/products",
    viewAllText = "View All",
    className = "",
}: CardSliderProps<T>) => {
    const prevRef = useRef<HTMLButtonElement>(null);
    const nextRef = useRef<HTMLButtonElement>(null);
    const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    useEffect(() => {
        if (!swiperInstance) return;
        const update = () => {
            setIsBeginning(swiperInstance.isBeginning);
            setIsEnd(swiperInstance.isEnd);
        };
        update();
        swiperInstance.on("slideChange", update);
        swiperInstance.on("reachBeginning", update);
        swiperInstance.on("reachEnd", update);
        return () => {
            swiperInstance.off("slideChange", update);
            swiperInstance.off("reachBeginning", update);
            swiperInstance.off("reachEnd", update);
        };
    }, [swiperInstance]);

    const defaultRenderItem = (item: unknown) => {
        const data = item as Partial<Product> & { id?: string };
        const productData: Product = {
            _id: data._id ?? data.id ?? "",
            title: data.title ?? "",
            price: data.price ?? 0,
            imageUrl: data.imageUrl ?? "",
        };
        return <ProductCard product={productData} />;
    };

    if (!items || items.length === 0) {
        return null;
    }

    return (
        <section
            className={`
                w-full bg-white
                py-12 md:py-16
                font-sans
                ${className}
            `}
            aria-label={title}
        >
            <div className="max-w-[1440px] mx-auto px-4 md:px-10">
                {/* Header */}
                <header className="flex items-end justify-between mb-8 md:mb-12 gap-6">
                    <div className="min-w-0">
                        <h2
                            className="
                                text-[20px] md:text-[24px]
                                font-medium uppercase
                                tracking-[0.1em]
                                text-[#000000]
                                leading-tight
                                text-balance
                            "
                        >
                            {title}
                        </h2>

                        {subtitle && (
                            <p
                                className="
                                    mt-2
                                    text-[14px] text-[#767676]
                                    max-w-xl
                                    leading-relaxed
                                "
                            >
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {
                        viewAllLink && (
                            <Link
                                to={viewAllLink}
                                className="
                                    hidden sm:inline-flex
                                    text-[11px] font-medium uppercase
                                    tracking-[0.12em]
                                    text-[#000000]
                                    underline-offset-4
                                    hover:underline
                                    transition-colors duration-200
                                    focus-visible:outline focus-visible:outline-1
                                    focus-visible:outline-offset-2 focus-visible:outline-[#000000]
                                "
                            >
                                {viewAllText}
                            </Link>
                        )
                    }
                </header >

                {/* Slider */}
                < div className="relative" >
                    <Swiper
                        modules={[Navigation]}
                        onSwiper={setSwiperInstance}
                        onBeforeInit={(swiper) => {
                            // @ts-expect-error – swiper types
                            swiper.params.navigation.prevEl = prevRef.current;
                            // @ts-expect-error – swiper types
                            swiper.params.navigation.nextEl = nextRef.current;
                        }}
                        slidesPerView="auto"
                        spaceBetween={16}
                        slidesPerGroup={1}
                        speed={400}
                        grabCursor
                        a11y={{
                            enabled: true,
                            prevSlideMessage: "Previous slide",
                            nextSlideMessage: "Next slide",
                        }}
                        breakpoints={{
                            640: { slidesPerView: 2.25, spaceBetween: 20 },
                            1024: { slidesPerView: 3.25, spaceBetween: 24 },
                            1280: { slidesPerView: 4, spaceBetween: 24 },
                        }}
                    >
                        {items.map((item, idx) => (
                            <SwiperSlide key={idx} className="h-auto!">
                                {renderItem ? renderItem(item, idx) : defaultRenderItem(item)}
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Navigation Arrows */}
                    <button
                        ref={prevRef}
                        type="button"
                        aria-label="Previous"
                        disabled={isBeginning}
                        className={`
                            absolute left-2 top-1/2 -translate-y-1/2 z-10
                            w-11 h-11
                            inline-flex items-center justify-center
                            bg-white border border-[#E5E5E5]
                            rounded-none
                            text-[#000000]
                            transition-[opacity,background-color,border-color] duration-200
                            hover:bg-[#000000] hover:text-white hover:border-[#000000]
                            disabled:opacity-0 disabled:pointer-events-none
                            focus-visible:outline focus-visible:outline-1
                            focus-visible:outline-offset-2 focus-visible:outline-[#000000]
                        `}
                    >
                        <HugeiconsIcon icon={ArrowLeft01Icon} size={18} aria-hidden="true" />
                    </button>

                    <button
                        ref={nextRef}
                        type="button"
                        aria-label="Next"
                        disabled={isEnd}
                        className={`
                            absolute right-2 top-1/2 -translate-y-1/2 z-10
                            w-11 h-11
                            inline-flex items-center justify-center
                            bg-white border border-[#E5E5E5]
                            rounded-none
                            text-[#000000]
                            transition-[opacity,background-color,border-color] duration-200
                            hover:bg-[#000000] hover:text-white hover:border-[#000000]
                            disabled:opacity-0 disabled:pointer-events-none
                            focus-visible:outline focus-visible:outline-1
                            focus-visible:outline-offset-2 focus-visible:outline-[#000000]
                        `}
                    >
                        <HugeiconsIcon icon={ArrowRight01Icon} size={18} aria-hidden="true" />
                    </button>
                </div >

                {viewAllLink && (
                    <div className="mt-6 sm:hidden">
                        <Link
                            to={viewAllLink}
                            className="
                                inline-flex items-center gap-1
                                text-[11px] font-medium uppercase
                                tracking-[0.12em]
                                text-[#000000]
                                underline-offset-4
                                hover:underline
                            "
                        >
                            {viewAllText}
                            <HugeiconsIcon
                                icon={ArrowRight01Icon}
                                size={12}
                                aria-hidden="true"
                            />
                        </Link>
                    </div>
                )}
            </div >
        </section >
    );
};

export default CardSlider;
