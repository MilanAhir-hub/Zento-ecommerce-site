import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "../../lib/motion/lenis";

import RevealText from "../../components/motion/RevealText";
import FadeIn from "../../components/motion/FadeIn";
import Magnetic from "../../components/motion/Magnetic";

gsap.registerPlugin(ScrollTrigger);

const EDITORIAL_ITEMS = [
    {
        name: "Accessories",
        link: "/category/accessories",
        image:
            "https://images.unsplash.com/photo-1509319117193-57bab727e09d?auto=format&fit=crop&w=1000&q=85",
        className: "col-span-1 h-[320px] md:h-[420px]",
    },
    {
        name: "Footwear",
        link: "/category/footwear",
        image:
            "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=85",
        className: "col-span-1 h-[320px] md:h-[420px]",
    },
    {
        name: "New Season",
        link: "/new-arrivals",
        image:
            "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=85",
        className: "col-span-1 md:col-span-2 h-[260px] md:h-[440px]",
    },
];

const EditorialGrid = () => {
    const sectionRef = useRef<HTMLElement>(null);

    useLayoutEffect(() => {
        if (!sectionRef.current) return;

        if (prefersReducedMotion()) return;

        const ctx = gsap.context(() => {
            const cards = gsap.utils.toArray<HTMLElement>(
                sectionRef.current!.querySelectorAll<HTMLElement>(".editorial-card")
            );

            // Staggered entrance for the three cards.
            gsap.fromTo(
                cards,
                { y: 60, opacity: 0, filter: "blur(6px)" },
                {
                    y: 0,
                    opacity: 1,
                    filter: "blur(0px)",
                    duration: 1.3,
                    stagger: 0.12,
                    ease: "expo.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 75%",
                        toggleActions: "play none none none",
                    },
                }
            );

            // Independent parallax on each card image — slightly different
            // distances for visual rhythm.
            cards.forEach((card, i) => {
                const img = card.querySelector("img");
                if (!img) return;
                const distance = i === 2 ? 60 : 90; // wide image moves less
                gsap.to(img, {
                    yPercent: -(distance / 4),
                    ease: "none",
                    scrollTrigger: {
                        trigger: card,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true,
                    },
                });
            });

            // Text labels: fade up after the card lands.
            cards.forEach((card) => {
                const text = card.querySelector<HTMLElement>(".editorial-text");
                if (!text) return;
                gsap.fromTo(
                    text,
                    { y: 24, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 1.1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: card,
                            start: "top 70%",
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
            className="w-full py-24 md:py-32 bg-white"
            aria-label="Editorial selections"
        >
            <div className="max-w-[1440px] mx-auto px-4 md:px-10">
                {/* Section header */}
                <div className="mb-10 md:mb-16 text-center">
                    <FadeIn view duration={1} y={8}>
                        <span className="block text-[11px] font-medium uppercase tracking-[0.3em] text-[#767676] mb-3">
                            The Selection
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
                        Considered Objects
                    </RevealText>
                    <FadeIn view delay={0.4} duration={1} y={10}>
                        <p className="mt-5 text-[14px] text-[#767676] max-w-md mx-auto leading-relaxed tracking-wide">
                            Three small rituals, three ways to feel composed
                            this season.
                        </p>
                    </FadeIn>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    {EDITORIAL_ITEMS.map((item, index) => (
                        <Link
                            key={item.name}
                            to={item.link}
                            className={`
                                editorial-card group relative overflow-hidden
                                bg-stone-100
                                ${item.className}
                            `}
                        >
                            {/* Image wrapper — taller than card so the
                                parallax translate never exposes an edge. */}
                            <div className="absolute inset-0 overflow-hidden">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    width={index === 2 ? 1600 : 1000}
                                    height={index === 2 ? 1000 : 1200}
                                    loading="lazy"
                                    decoding="async"
                                    className="
                                        absolute inset-0 w-full h-full
                                        object-cover scale-[1.1]
                                        will-change-transform
                                        transition-transform duration-700
                                        ease-[cubic-bezier(0.22,1,0.36,1)]
                                        group-hover:scale-[1.04]
                                    "
                                />
                            </div>

                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent transition-opacity duration-500 group-hover:opacity-90" />

                            {/* Editorial text */}
                            <div className="editorial-text absolute bottom-8 left-8 md:bottom-12 md:left-12 z-10">
                                <h3
                                    className="
                                        text-[26px] md:text-[36px]
                                        font-light tracking-[-0.01em]
                                        text-white leading-[1.05]
                                        mb-3
                                    "
                                >
                                    {item.name}
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
                                        Shop Now
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

export default EditorialGrid;
