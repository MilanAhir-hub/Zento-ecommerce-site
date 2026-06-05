import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EASE, prefersReducedMotion } from "../../lib/motion/lenis";

gsap.registerPlugin(ScrollTrigger);

interface RevealOptions {
    /** Y translation in px to start from. Default 32. */
    y?: number;
    /** Delay (s) after ScrollTrigger fires. */
    delay?: number;
    /** Duration (s). */
    duration?: number;
    /** When to trigger: "top 85%" by default. */
    start?: string;
    /** If true, animates blur in addition to opacity/y. */
    blur?: boolean;
}

/**
 * Scroll-triggered reveal for a single element. Fades + translates up as it
 * enters the viewport. Honors prefers-reduced-motion.
 */
export const useGsapReveal = <T extends HTMLElement = HTMLDivElement>(
    options: RevealOptions = {}
) => {
    const ref = useRef<T>(null);

    useLayoutEffect(() => {
        if (!ref.current) return;
        if (prefersReducedMotion()) {
            gsap.set(ref.current, { opacity: 1, y: 0, filter: "blur(0px)" });
            return;
        }

        const el = ref.current;
        const {
            y = 32,
            delay = 0,
            duration = 1.1,
            start = "top 88%",
            blur = false,
        } = options;

        const from: gsap.TweenVars = { opacity: 0, y };
        if (blur) from.filter = "blur(8px)";

        gsap.fromTo(
            el,
            from,
            {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration,
                delay,
                ease: EASE.outQuint,
                scrollTrigger: {
                    trigger: el,
                    start,
                    toggleActions: "play none none none",
                },
            }
        );

        return () => {
            ScrollTrigger.getAll()
                .filter((t) => t.trigger === el)
                .forEach((t) => t.kill());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return ref;
};
