import { useRef, useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";

import RevealText from "../../components/motion/RevealText";
import FadeIn from "../../components/motion/FadeIn";
import Magnetic from "../../components/motion/Magnetic";
import { useGsapParallax } from "../../hooks/motion/useGsapParallax";
import { prefersReducedMotion } from "../../lib/motion/lenis";

const HERO_IMAGE =
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=2400&q=80";

const Hero = () => {
    const imageRef = useRef<HTMLImageElement>(null);
    const introOverlayRef = useRef<HTMLDivElement>(null);
    const introHeadlineRef = useRef<HTMLDivElement>(null);

    // Subtle parallax on the hero background image so it drifts gently
    // as the user scrolls. Keep it well under 100px to stay premium.
    const parallaxRef = useGsapParallax<HTMLDivElement>({ y: 60 });

    // Intro mask: a black curtain covers the hero on mount, then wipes up
    // (scaleY 1 -> 0) to reveal the content beneath. Runs in parallel with
    // the headline word-by-word reveal and a subtle image zoom-out.
    useLayoutEffect(() => {
        if (!introOverlayRef.current) return;
        if (prefersReducedMotion()) {
            gsap.set(introOverlayRef.current, { scaleY: 0 });
            if (imageRef.current) {
                gsap.set(imageRef.current, { scale: 1 });
            }
            return;
        }

        const tl = gsap.timeline({
            defaults: { ease: "expo.inOut" },
        });

        tl.set(introOverlayRef.current, { scaleY: 1, transformOrigin: "top" }).to(
            introOverlayRef.current,
            {
                scaleY: 0,
                duration: 1.4,
                ease: "expo.inOut",
            }
        );

        if (imageRef.current) {
            gsap.fromTo(
                imageRef.current,
                { scale: 1.15 },
                {
                    scale: 1,
                    duration: 1.8,
                    ease: "power3.out",
                    delay: 0.1,
                }
            );
        }
    }, []);

    return (
        <section className="relative w-full h-[90vh] min-h-[650px] overflow-hidden bg-white text-black flex flex-col md:flex-row">
            {/* Left Column: Editorial Content */}
            <div className="w-full md:w-[45%] lg:w-[40%] bg-[#F9F9F9] md:bg-white flex flex-col justify-center px-6 md:px-12 lg:px-20 py-16 md:py-0 relative z-10">
                <FadeIn delay={0.6} duration={1.1} y={12}>
                    <span className="block text-[11px] font-semibold uppercase tracking-[0.3em] text-[#767676] mb-4">
                        The Autumn Edit
                    </span>
                </FadeIn>

                <div ref={introHeadlineRef} className="mt-2">
                    <RevealText
                        as="h1"
                        trigger="mount"
                        delay={0.75}
                        stagger={0.09}
                        duration={1.2}
                        blur
                        className="text-[40px] sm:text-[56px] md:text-[62px] lg:text-[72px] font-light leading-[1.05] tracking-[-0.02em] text-[#000000] text-balance"
                        wordClassName="font-light"
                    >
                        Quiet Luxury
                    </RevealText>
                    <RevealText
                        as="h1"
                        trigger="mount"
                        delay={1.05}
                        stagger={0.09}
                        duration={1.2}
                        blur
                        className="text-[40px] sm:text-[56px] md:text-[62px] lg:text-[72px] font-light italic leading-[1.05] tracking-[-0.02em] text-[#222222] text-balance"
                        wordClassName="font-light italic"
                    >
                        for the new season
                    </RevealText>
                </div>

                <FadeIn delay={1.55} duration={1} y={14}>
                    <p className="mt-6 text-[14px] text-[#767676] max-w-sm leading-relaxed tracking-wide text-pretty font-medium">
                        A curated edit of considered pieces — slow-made,
                        quietly exceptional, designed to be lived in.
                    </p>
                </FadeIn>

                <FadeIn delay={1.85} duration={0.9} y={10}>
                    <div className="mt-8 flex items-center gap-6">
                        <Magnetic strength={0.4}>
                            <Link
                                to="/products"
                                className="
                                    inline-flex items-center gap-2
                                    px-8 h-12
                                    bg-[#000000] text-[#FFFFFF]
                                    text-[11px] font-semibold uppercase
                                    tracking-[0.18em]
                                    rounded-none
                                    border border-black
                                    hover:bg-transparent hover:text-black
                                    transition-colors duration-200
                                    focus-visible:outline focus-visible:outline-1
                                    focus-visible:outline-offset-2 focus-visible:outline-black
                                "
                            >
                                Shop The Edit
                                <HugeiconsIcon icon={ArrowRight01Icon} size={14} aria-hidden="true" />
                            </Link>
                        </Magnetic>
                        <Magnetic strength={0.3}>
                            <Link
                                to="/category/women"
                                className="
                                    inline-flex items-center gap-2
                                    text-[11px] font-semibold uppercase
                                    tracking-[0.18em]
                                    text-[#767676] hover:text-[#000000]
                                    underline underline-offset-8
                                    transition-colors duration-200
                                    focus-visible:outline focus-visible:outline-1
                                    focus-visible:outline-offset-2 focus-visible:outline-black
                                "
                            >
                                Women
                            </Link>
                        </Magnetic>
                    </div>
                </FadeIn>

                {/* Bottom-left editorial caption */}
                <div className="absolute bottom-6 left-6 md:left-12 lg:left-20 pointer-events-none hidden md:block">
                    <FadeIn delay={2.1} duration={0.9} y={8}>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#767676]">
                            Novara — A/W Editorial Campaign
                        </p>
                    </FadeIn>
                </div>
            </div>

            {/* Right Column: Parallax Image Container */}
            <div className="w-full md:w-[55%] lg:w-[60%] relative h-[45vh] md:h-full bg-stone-100 overflow-hidden">
                <div
                    ref={parallaxRef}
                    className="absolute inset-0 will-change-transform"
                >
                    <img
                        ref={imageRef}
                        src={HERO_IMAGE}
                        alt="Autumn collection model editorial showcase"
                        width={1600}
                        height={1200}
                        fetchPriority="high"
                        className="absolute inset-0 w-full h-full object-cover scale-[1.15]"
                    />
                </div>

                {/* Subtle bottom-right scroll hint for layout rhythm */}
                <div className="absolute bottom-6 right-6 pointer-events-none hidden md:block z-10">
                    <FadeIn delay={2.3} duration={0.9} y={8}>
                        <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#767676]">
                            Scroll
                        </span>
                    </FadeIn>
                </div>
            </div>

            {/* Intro mask — covers hero on mount, then wipes away (top -> bottom) */}
            <div
                ref={introOverlayRef}
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-30 bg-[#0A0A0A] will-change-transform"
                style={{ transformOrigin: "top" }}
            />
        </section>
    );
};

export default Hero;
