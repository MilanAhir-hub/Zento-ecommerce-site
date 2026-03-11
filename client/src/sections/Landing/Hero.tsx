import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getButtonStyles } from "../../components/ui/Button";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

// Define the content for the 3 carousel slides
const slides = [
    {
        id: 1,
        title: "50% Off For \n Your First Shopping",
        subtitle: "Get Free Shipping on all orders over ₹99.00",
        image: "https://www.jiomart.com/images/product/original/rvfoi0ci9e/tunifi-buds-tone-with-40-hours-playtime-spatial-audio-13mm-drivers-multi-modes-product-images-orvfoi0ci9e-p612508132-0-202509221817.jpg?im=Resize=(420,420)",
        link: "/products",
        buttonText: "Shop Now"
    },
    {
        id: 2,
        title: "Premium Tech \n Exclusive Collection",
        subtitle: "Discover the latest innovations with up to 30% discount.",
        image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=800", // Smartwatch (transparent-like against stone)
        link: "/category/Electronics",
        buttonText: "View Tech"
    },
    {
        id: 3,
        title: "Winter Fashion \n clearance Sale",
        subtitle: "Upgrade your wardrobe. Buy 2 get 1 free on all outerwear.",
        image: "https://images.unsplash.com/photo-1434389678369-182bf2c6e644?auto=format&fit=crop&q=80&w=800", // Jacket
        link: "/category/Fashion",
        buttonText: "Shop Fashion"
    }
];

const AUTOPLAY_INTERVAL = 5000; // 5 seconds per slide

const Hero = () => {
    return (
        <section className="relative w-[95vw] mx-auto bg-stone-100 font-sans overflow-hidden rounded-3xl shadow-2xl before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_top_right,_#e7e5e4_0%,_transparent_70%)] before:pointer-events-none after:absolute after:inset-0 after:bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJmIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc0IiBudW1PY3RhdmVzPSIzIiAvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNmKSIgb3BhY2l0eT0iMC4wMjUiIC8+PC9zdmc+')] after:opacity-20 after:pointer-events-none">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-12 lg:pb-0">
                <Swiper
                    modules={[Autoplay, Pagination, EffectFade]}
                    effect="fade"
                    fadeEffect={{ crossFade: true }}
                    spaceBetween={0}
                    slidesPerView={1}
                    loop={true}
                    autoplay={{
                        delay: AUTOPLAY_INTERVAL,
                        disableOnInteraction: false,
                    }}
                    pagination={{
                        clickable: true,
                    }}
                    className="w-full"
                    style={{
                        "--swiper-pagination-color": "#0c0a09", // stone-950 for richer contrast
                        "--swiper-pagination-bullet-inactive-color": "#a8a29e", // stone-400
                        "--swiper-pagination-bullet-inactive-opacity": "0.5",
                        "--swiper-pagination-bullet-width": "80px",
                        "--swiper-pagination-bullet-height": "4px",
                        "--swiper-pagination-bullet-border-radius": "9999px",
                        "--swiper-pagination-bottom": "20px",
                        paddingBottom: "50px"
                    } as React.CSSProperties}
                >
                    {slides.map((slide) => (
                        <SwiperSlide key={slide.id}>
                            <div className="w-full shrink-0 relative flex flex-col lg:flex-row items-center min-h-[50vh] lg:min-h-[70vh] py-12 lg:py-0">
                                {/* Decorative accent line */}
                                <div className="absolute left-0 top-1/4 w-1 h-32 bg-gradient-to-b from-stone-800/20 to-transparent hidden lg:block" />

                                {/* Text Content */}
                                <div className="relative z-10 flex-1 w-full lg:w-1/2 flex flex-col justify-center order-2 lg:order-1 pt-10 lg:pt-0 px-4 lg:px-8">
                                    {/* Subtle badge / tagline */}
                                    <span className="inline-block text-sm uppercase tracking-[0.3em] font-semibold text-stone-700 mb-4 border-l-4 border-stone-800 pl-3">
                                        Exclusive Offer
                                    </span>

                                    <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black text-stone-900 tracking-[-0.02em] leading-[1.1] mb-6 whitespace-pre-line drop-shadow-sm">
                                        {slide.title}
                                    </h1>

                                    <p className="text-xl sm:text-2xl text-stone-700 font-light mb-10 max-w-lg leading-relaxed">
                                        {slide.subtitle}
                                    </p>

                                    <div className="flex items-center">
                                        <Link
                                            to={slide.link}
                                            className={`${getButtonStyles('primary', 'lg', 'shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-0.5')} group`}
                                        >
                                            {slide.buttonText}
                                            <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1.5 transition-transform duration-300" />
                                        </Link>
                                    </div>
                                </div>

                                {/* Image Area */}
                                <div className="relative flex-1 w-full lg:w-1/2 flex items-center justify-center order-1 lg:order-2 h-[350px] sm:h-[450px] lg:h-full">
                                    <div className="relative w-full h-full flex items-center justify-center">
                                        {/* Soft glow behind image */}
                                        <div className="absolute w-3/4 h-3/4 bg-stone-200/50 rounded-full blur-3xl" />
                                        <img
                                            src={slide.image}
                                            alt="Slide content"
                                            className="relative w-full h-full max-h-[250px] lg:max-h-[300px] object-contain object-center scale-110 lg:scale-[1.3] mt-8 lg:mt-20 drop-shadow-2xl transition-transform duration-700 hover:scale-[1.35]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default Hero;