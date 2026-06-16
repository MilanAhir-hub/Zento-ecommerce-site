import { useRef, useState, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    PlayIcon,
    PauseIcon,
    VolumeHighIcon,
    VolumeMute01Icon,
} from "@hugeicons/core-free-icons";

import RevealText from "../../components/motion/RevealText";
import FadeIn from "../../components/motion/FadeIn";
import { prefersReducedMotion } from "../../lib/motion/lenis";

gsap.registerPlugin(ScrollTrigger);

const VIDEO_ID = "GZmOln0LX7k";

const FashionFilm = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const videoWrapRef = useRef<HTMLDivElement>(null);
    const maskRef = useRef<HTMLDivElement>(null);
    const headlineRef = useRef<HTMLDivElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(true);

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

    // Mask reveal: a black overlay sits over the video and scales away from
    // the top edge as the section scrolls into view. Pin the headline as
    // it drifts up through the mask for a premium layered reveal.
    useLayoutEffect(() => {
        if (!sectionRef.current || !maskRef.current) return;

        if (prefersReducedMotion()) {
            gsap.set(maskRef.current, { scaleY: 0 });
            return;
        }

        const ctx = gsap.context(() => {
            // Mask reveal
            gsap.fromTo(
                maskRef.current,
                { scaleY: 1 },
                {
                    scaleY: 0,
                    ease: "expo.out",
                    duration: 1.6,
                    scrollTrigger: {
                        trigger: videoWrapRef.current,
                        start: "top 80%",
                        toggleActions: "play none none none",
                    },
                }
            );

            // Headline: gentle upward drift inside the mask window.
            gsap.fromTo(
                headlineRef.current,
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.4,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 75%",
                        toggleActions: "play none none none",
                    },
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="w-full py-24 md:py-32 bg-white"
            aria-label="Autumn / Winter Cinematic Film"
        >
            <div className="max-w-[1440px] mx-auto px-4 md:px-10">
                {/* Section header */}
                <div ref={headlineRef} className="mb-10 md:mb-14 text-center md:text-left">
                    <FadeIn view duration={1} y={8}>
                        <span className="block text-[11px] font-medium uppercase tracking-[0.3em] text-[#767676] mb-3">
                            Novara Campaign
                        </span>
                    </FadeIn>
                    <RevealText
                        as="h2"
                        trigger="view"
                        stagger={0.07}
                        duration={1.1}
                        className="text-[34px] md:text-[56px] font-light leading-[1.05] tracking-[-0.01em] text-[#000000] uppercase text-balance"
                        wordClassName="font-light"
                    >
                        Autumn / Winter Cinematic Film
                    </RevealText>
                </div>

                {/* Video wrapper with mask reveal */}
                <div
                    ref={videoWrapRef}
                    className="relative w-full aspect-video bg-black overflow-hidden rounded-none"
                >
                    <div className="absolute inset-0 pointer-events-none">
                        <iframe
                            ref={iframeRef}
                            src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${VIDEO_ID}&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&playsinline=1&enablejsapi=1&disablekb=1&fs=0`}
                            title="Novara Fashion Campaign Film"
                            className="absolute inset-0 w-full h-full border-0"
                            allow="autoplay; encrypted-media"
                        />
                    </div>

                    {/* Subtle film grain overlay */}
                    <div className="absolute inset-0 bg-black/10 pointer-events-none" />

                    {/* Mask overlay — wipes from top to bottom on scroll */}
                    <div
                        ref={maskRef}
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 z-10 bg-[#0A0A0A] will-change-transform"
                        style={{ transformOrigin: "top" }}
                    />

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

                    {/* Bottom-left running caption */}
                    <div className="absolute bottom-6 left-6 z-20 pointer-events-none">
                        <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/70">
                            Directed by Novara Studio — A/W 26
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FashionFilm;
