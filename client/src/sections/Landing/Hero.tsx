import { Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";

const Hero = () => {
    return (
        <section className="w-full bg-white text-center">

            <div className="max-w-[1100px] mx-auto px-6 py-24 lg:py-32 flex flex-col items-center">

                {/* Small Tagline */}
                <p className="text-sm tracking-wide text-gray-500 mb-4">
                    New Arrival
                </p>

                {/* Main Heading */}
                <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-semibold tracking-tight text-gray-900 leading-[1.05] max-w-3xl">
                    Experience the Future of Shopping
                </h1>

                {/* Subtext */}
                <p className="mt-6 text-lg text-gray-600 max-w-xl leading-relaxed">
                    Discover premium products crafted for performance, design,
                    and everyday lifestyle. Simple. Powerful. Beautiful.
                </p>

                {/* CTA */}
                <div className="mt-10 flex items-center gap-6">

                    <Link
                        to="/products"
                        className="text-blue-600 text-lg font-medium hover:underline flex items-center gap-1"
                    >
                        Shop now
                        <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
                    </Link>

                    <Link
                        to="/category/electronics"
                        className="text-gray-700 text-lg font-medium hover:underline"
                    >
                        Learn more
                    </Link>

                </div>

            </div>

            {/* Subtle Divider (Apple Style) */}
            <div className="w-full h-px bg-gray-200" />
        </section>
    );
};

export default Hero;