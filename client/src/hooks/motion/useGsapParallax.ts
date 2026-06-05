import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "../../lib/motion/lenis";

gsap.registerPlugin(ScrollTrigger);

interface ParallaxOptions {
    /** Distance to translate (px). Positive = moves down on scroll. */
    y?: number;
    /** When to start the effect, defaults to "top bottom". */
    start?: string;
    /** When to end, defaults to "bottom top". */
    end?: string;
}

/**
 * Subtle vertical parallax. Drives `y` on the element based on scroll
 * progress through its trigger. Designed for hero images and large editorial
 * photography — never use aggressively.
 */
export const useGsapParallax = <T extends HTMLElement = HTMLDivElement>(
    options: ParallaxOptions = {}
) => {
    const ref = useRef<T>(null);

    useLayoutEffect(() => {
        if (!ref.current) return;
        if (prefersReducedMotion()) return;

        const el = ref.current;
        const { y = 80, start = "top bottom", end = "bottom top" } = options;

        const tween = gsap.fromTo(
            el,
            { y },
            {
                y: -y,
                ease: "none",
                scrollTrigger: {
                    trigger: el.parentElement ?? el,
                    start,
                    end,
                    scrub: true,
                },
            }
        );

        return () => {
            tween.scrollTrigger?.kill();
            tween.kill();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return ref;
};
