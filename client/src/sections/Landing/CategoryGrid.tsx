import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "../../lib/motion/lenis";

import RevealText from "../../components/motion/RevealText";
import FadeIn from "../../components/motion/FadeIn";
import Magnetic from "../../components/motion/Magnetic";

gsap.registerPlugin(ScrollTrigger);

const CATEGORIES = [
    {
        name: "Women",
        link: "/category/women",
        image:
            "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1400&q=85",
    },
    {
        name: "Men",
        link: "/category/men",
        image:
            "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1400&q=85",
    },
];

const CategoryGrid = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const imageARef = useRef<HTMLImageElement>(null);
    const imageBRef = useRef<HTMLImageElement>(null);
    const textARef = useRef<HTMLDivElement>(null);
    const textBRef = useRef<HTMLDivElement>(null);

    // Staggered section entrance + subtle image parallax per card.
    useLayoutEffect(() => {
        if (!sectionRef.current) return;
        if (prefersReducedMotion()) {
            gsap.set([imageARef.current, imageBRef.current], { y: 0, scale: 1 });
            return;
        }

        const ctx = gsap.context(() => {
            // Independent parallax on each image, slightly offset for a
            // cinematic two-frame composition.
            [imageARef.current, imageBRef.current].forEach((img) => {
                if (!img) return;
                gsap.to(img, {
                    yPercent: -8,
                    ease: "none",
                    scrollTrigger: {
                        trigger: img.closest("a"),
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true,
                    },
                });
            });

            // Text panels fade up at slightly different scroll positions.
            [textARef.current, textBRef.current].forEach((el, idx) => {
                if (!el) return;
                gsap.fromTo(
                    el,
                    { y: 30, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 1.2,
                        delay: idx * 0.15,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: el.closest("a"),
                            start: "top 80%",
                            toggleActions: "play none none none",
                        },
                    }
                );
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="w-full py-20 md:py-28 bg-white"
            aria-label="Shop by category"
        >
            <div className="max-w-[1440px] mx-auto px-4 md:px-10">
                {/* Section header — editorial intro */}
                <div className="mb-10 md:mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                        <FadeIn duration={1} y={10} view>
                            <span className="block text-[11px] font-medium uppercase tracking-[0.3em] text-[#767676] mb-3">
                                Shop By Category
                            </span>
                        </FadeIn>
                        <RevealText
                            as="h2"
                            trigger="view"
                            stagger={0.07}
                            duration={1.1}
                            className="text-[34px] md:text-[52px] font-light leading-[1.05] tracking-[-0.01em] text-[#000000] text-balance"
                            wordClassName="font-light"
                        >
                            The Autumn Edit
                        </RevealText>
                    </div>
                    <FadeIn delay={0.4} duration={1} y={10} view>
                        <p className="md:max-w-xs text-[13px] md:text-[14px] text-[#767676] leading-relaxed tracking-wide">
                            Two considered collections, designed to be worn
                            through every quiet hour of the season.
                        </p>
                    </FadeIn>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {CATEGORIES.map((cat, i) => (
                        <Link
                            key={cat.name}
                            to={cat.link}
                            className="
                                group relative w-full aspect-[4/5]
                                overflow-hidden bg-stone-100 block
                                rounded-none
                            "
                        >
                            {/* Parallax image wrapper — taller than the card
                                so the parallax can translate without exposing
                                empty edges. */}
                            <div className="absolute inset-0 overflow-hidden">
                                <img
                                    ref={i === 0 ? imageARef : imageBRef}
                                    src={cat.image}
                                    alt={`${cat.name} collection`}
                                    width={1200}
                                    height={1500}
                                    loading="lazy"
                                    decoding="async"
                                    className="
                                        absolute inset-0 w-full h-full
                                        object-cover
                                        scale-[1.08]
                                        will-change-transform
                                        transition-transform duration-700
                                        ease-[cubic-bezier(0.22,1,0.36,1)]
                                        group-hover:scale-[1.04]
                                    "
                                />
                            </div>

                            {/* Gradient overlay for text legibility */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-black/10 transition-opacity duration-500 group-hover:opacity-90" />

                            {/* Floating editorial text */}
                            <div
                                ref={i === 0 ? textARef : textBRef}
                                className="
                                    absolute left-8 md:left-12 top-1/2 -translate-y-1/2 z-10
                                "
                            >
                                <h3
                                    className="
                                        text-[36px] md:text-[56px]
                                        font-light tracking-[-0.01em]
                                        text-white leading-[1]
                                        mb-4
                                    "
                                >
                                    {cat.name}
                                </h3>
                                <Magnetic strength={0.3}>
                                    <span
                                        className="
                                            inline-flex items-center gap-2
                                            text-[11px] font-medium uppercase
                                            tracking-[0.2em] text-white
                                            underline underline-offset-8
                                            decoration-white/50
                                            group-hover:decoration-white
                                            transition-colors duration-300
                                        "
                                    >
                                        Shop {cat.name}
                                    </span>
                                </Magnetic>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoryGrid;
