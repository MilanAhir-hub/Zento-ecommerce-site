import { useRef, useState, useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    ArrowRight01Icon,
    PlayIcon,
    PauseIcon,
    VolumeHighIcon,
    VolumeMute01Icon,
} from "@hugeicons/core-free-icons";

import RevealText from "../../components/motion/RevealText";
import FadeIn from "../../components/motion/FadeIn";
import Magnetic from "../../components/motion/Magnetic";
import { useGsapParallax } from "../../hooks/motion/useGsapParallax";
import { prefersReducedMotion } from "../../lib/motion/lenis";

const VIDEO_ID = "RRv5udKGG68";

const Hero = () => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const videoContainerRef = useRef<HTMLDivElement>(null);
    const introOverlayRef = useRef<HTMLDivElement>(null);
    const introHeadlineRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(true);

    // Subtle parallax on the YouTube iframe so the background drifts gently
    // as the user scrolls. Keep it well under 100px to stay premium.
    const parallaxRef = useGsapParallax<HTMLDivElement>({ y: 60 });

    const postCommand = (func: string) => {
        iframeRef.current?.contentWindow?.postMessage(
            JSON.stringify({ event: "command", func, args: [] }),
            "*"
        );
    };

    const togglePlay = () => {
        postCommand(isPlaying ? "pauseVideo" : "playVideo");
        setIsPlaying(!isPlaying);
    };

    const toggleMute = () => {
        postCommand(isMuted ? "unMute" : "mute");
        setIsMuted(!isMuted);
    };

    // Intro mask: a black curtain covers the hero on mount, then wipes up
    // (scaleY 1 -> 0) to reveal the video beneath. Runs in parallel with
    // the headline word-by-word reveal.
    useLayoutEffect(() => {
        if (!introOverlayRef.current) return;
        if (prefersReducedMotion()) {
            gsap.set(introOverlayRef.current, { scaleY: 0 });
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
    }, []);

    return (
        <section className="relative w-full h-[85vh] min-h-[560px] overflow-hidden bg-black text-white">
            {/* Background YouTube Video — gentle parallax wrapper */}
            <div
                ref={videoContainerRef}
                className="absolute inset-0 overflow-hidden pointer-events-none"
            >
                <div
                    ref={parallaxRef}
                    className="absolute inset-0 will-change-transform"
                >
                    <iframe
                        ref={iframeRef}
                        src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${VIDEO_ID}&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&playsinline=1&enablejsapi=1&disablekb=1&fs=0`}
                        title="Hero background video"
                        allow="autoplay; encrypted-media"
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-0"
                        style={{
                            width: "177.78vh",
                            height: "56.25vw",
                            minWidth: "100%",
                            minHeight: "100%",
                        }}
                    />
                </div>
            </div>

            {/* Dark gradient overlay for readable typography */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60 pointer-events-none" />

            {/* Top-Right Video Controls */}
            <div className="absolute top-6 right-6 z-20 flex items-center gap-2">
                <button
                    type="button"
                    onClick={togglePlay}
                    aria-label={isPlaying ? "Pause video" : "Play video"}
                    className="
                        flex items-center justify-center w-10 h-10
                        rounded-full bg-white/15 backdrop-blur-md
                        border border-white/20 text-white
                        hover:bg-white/25
                        transition-[background-color,transform] duration-200
                        focus-visible:outline focus-visible:outline-1
                        focus-visible:outline-offset-2 focus-visible:outline-white
                    "
                >
                    <HugeiconsIcon
                        icon={isPlaying ? PauseIcon : PlayIcon}
                        size={18}
                        aria-hidden="true"
                    />
                </button>
                <button
                    type="button"
                    onClick={toggleMute}
                    aria-label={isMuted ? "Unmute video" : "Mute video"}
                    className="
                        flex items-center justify-center w-10 h-10
                        rounded-full bg-white/15 backdrop-blur-md
                        border border-white/20 text-white
                        hover:bg-white/25
                        transition-[background-color,transform] duration-200
                        focus-visible:outline focus-visible:outline-1
                        focus-visible:outline-offset-2 focus-visible:outline-white
                    "
                >
                    <HugeiconsIcon
                        icon={isMuted ? VolumeMute01Icon : VolumeHighIcon}
                        size={18}
                        aria-hidden="true"
                    />
                </button>
            </div>

            {/* Centered Editorial Content — word-by-word reveal */}
            <div className="relative z-10 h-full max-w-[1100px] mx-auto px-6 flex flex-col items-center justify-center text-center">
                <FadeIn delay={0.6} duration={1.1} y={12}>
                    <span className="block text-[11px] md:text-[12px] font-medium uppercase tracking-[0.3em] text-white/80">
                        The Autumn Edit
                    </span>
                </FadeIn>

                <div ref={introHeadlineRef} className="mt-5">
                    <RevealText
                        as="h1"
                        trigger="mount"
                        delay={0.75}
                        stagger={0.09}
                        duration={1.2}
                        blur
                        className="text-[42px] sm:text-[64px] md:text-[88px] font-light leading-[1.02] tracking-[-0.02em] text-white text-balance"
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
                        className="text-[42px] sm:text-[64px] md:text-[88px] font-light italic leading-[1.02] tracking-[-0.02em] text-white/90 text-balance"
                        wordClassName="font-light italic"
                    >
                        for the new season
                    </RevealText>
                </div>

                <FadeIn delay={1.55} duration={1} y={14}>
                    <p className="mt-7 text-[14px] md:text-[15px] text-white/75 max-w-md leading-relaxed tracking-wide">
                        A curated edit of considered pieces — slow-made,
                        quietly exceptional, designed to be lived in.
                    </p>
                </FadeIn>

                <FadeIn delay={1.85} duration={0.9} y={10}>
                    <div className="mt-10 flex items-center gap-6">
                        <Magnetic strength={0.4}>
                            <Link
                                to="/products"
                                className="
                                    inline-flex items-center gap-2
                                    px-8 h-12
                                    bg-white text-[#000000]
                                    text-[11px] font-medium uppercase
                                    tracking-[0.18em]
                                    rounded-none
                                    hover:bg-white/90
                                    transition-colors duration-200
                                    focus-visible:outline focus-visible:outline-1
                                    focus-visible:outline-offset-2 focus-visible:outline-white
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
                                    text-[11px] font-medium uppercase
                                    tracking-[0.18em]
                                    text-white/80 hover:text-white
                                    underline underline-offset-8
                                    transition-colors duration-200
                                    focus-visible:outline focus-visible:outline-1
                                    focus-visible:outline-offset-2 focus-visible:outline-white
                                "
                            >
                                Women
                            </Link>
                        </Magnetic>
                    </div>
                </FadeIn>
            </div>

            {/* Bottom-left editorial caption + scroll hint */}
            <div className="absolute bottom-8 left-0 w-full z-20 pointer-events-none">
                <div className="max-w-[1440px] mx-auto px-4 md:px-10 flex items-end justify-between gap-6">
                    <FadeIn delay={2.1} duration={0.9} y={8}>
                        <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/60">
                            Novara — A/W Cinematic Film
                        </p>
                    </FadeIn>
                    <FadeIn delay={2.3} duration={0.9} y={8}>
                        <span className="hidden md:block text-[10px] font-medium uppercase tracking-[0.3em] text-white/60">
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
