import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EASE, prefersReducedMotion } from "../../lib/motion/lenis";

gsap.registerPlugin(ScrollTrigger);

interface StaggerOptions {
    /** Stagger between children (s). Default 0.1. */
    stagger?: number;
    /** Y translation to start from per child. Default 40. */
    y?: number;
    /** Duration (s). Default 1. */
    duration?: number;
    /** ScrollTrigger start. */
    start?: string;
    /** Selector inside the container to stagger. Default ":scope > *". */
    selector?: string;
}

/**
 * Staggered scroll reveal for direct children. Each child fades + translates
 * up in sequence. Use sparingly — every section using this should feel
 * meaningfully different in pacing from the previous.
 */
export const useGsapStagger = <T extends HTMLElement = HTMLDivElement>(
    options: StaggerOptions = {}
) => {
    const ref = useRef<T>(null);

    useLayoutEffect(() => {
        if (!ref.current) return;

        if (prefersReducedMotion()) {
            gsap.set(ref.current.children, { opacity: 1, y: 0 });
            return;
        }

        const el = ref.current;
        const {
            stagger = 0.1,
            y = 40,
            duration = 1,
            start = "top 85%",
            selector,
        } = options;

        const targets = selector
            ? el.querySelectorAll(selector)
            : Array.from(el.children);

        gsap.fromTo(
            targets,
            { opacity: 0, y },
            {
                opacity: 1,
                y: 0,
                duration,
                stagger,
                ease: EASE.outExpo,
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
