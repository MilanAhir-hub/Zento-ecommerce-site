import { Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";

const Hero = () => {
    return (
        <section className="w-full bg-white text-center relative overflow-hidden">
            <div className="max-w-[1100px] mx-auto px-6 py-28 lg:py-36 flex flex-col items-center relative z-10">
                <p className="text-[13px] font-medium tracking-[0.5px] text-[#86868b] mb-5">
                    New Arrival
                </p>

                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-[#1d1d1f] leading-[1.07] max-w-3xl">
                    Experience the Future of Shopping
                </h1>

                <p className="mt-6 text-[20px] text-[#86868b] max-w-xl leading-[1.4]">
                    Discover premium products crafted for performance, design,
                    and everyday lifestyle. Simple. Powerful. Beautiful.
                </p>

                <div className="mt-12 flex items-center gap-8">
                    <Link
                        to="/products"
                        className="text-[#0071e3] text-[17px] font-medium hover:underline flex items-center gap-1.5"
                    >
                        Shop now
                        <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
                    </Link>

                    <Link
                        to="/category/electronics"
                        className="text-[#0071e3] text-[17px] font-medium hover:underline"
                    >
                        Learn more
                    </Link>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d2d2d7] to-transparent" />
        </section>
    );
};

export default Hero;