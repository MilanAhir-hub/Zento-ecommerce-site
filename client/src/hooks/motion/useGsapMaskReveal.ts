import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EASE, prefersReducedMotion } from "../../lib/motion/lenis";

gsap.registerPlugin(ScrollTrigger);

interface MaskRevealOptions {
    /** Origin of the wipe. "left" sweeps right, "right" sweeps left, etc. */
    origin?: "left" | "right" | "top" | "bottom" | "center";
    /** Stagger between children (s). */
    stagger?: number;
    /** Duration (s). */
    duration?: number;
    /** ScrollTrigger start, defaults to "top 85%". */
    start?: string;
}

/**
 * Curtain-style image mask reveal. Wraps a target in a sibling overlay that
 * scales/transforms away, exposing the image beneath. Honors reduced motion
 * by skipping the overlay animation and leaving the image visible.
 */
export const useGsapMaskReveal = <T extends HTMLElement = HTMLDivElement>(
    options: MaskRevealOptions = {}
) => {
    const containerRef = useRef<T>(null);
    const maskRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!containerRef.current || !maskRef.current) return;

        if (prefersReducedMotion()) {
            gsap.set(maskRef.current, { scaleX: 0, scaleY: 0, opacity: 0 });
            return;
        }

        const el = containerRef.current;
        const overlay = maskRef.current;
        const {
            origin = "left",
            stagger = 0,
            duration = 1.2,
            start = "top 85%",
        } = options;

        const initial: gsap.TweenVars = {};
        if (origin === "left") initial.scaleX = 1;
        else if (origin === "right") initial.scaleX = 1;
        else if (origin === "top") initial.scaleY = 1;
        else if (origin === "bottom") initial.scaleY = 1;
        else initial.scale = 1;

        gsap.set(overlay, {
            ...initial,
            transformOrigin:
                origin === "right"
                    ? "right center"
                    : origin === "bottom"
                    ? "center bottom"
                    : origin === "top"
                    ? "center top"
                    : "left center",
        });

        const animProps: gsap.TweenVars =
            origin === "left" || origin === "right"
                ? { scaleX: 0 }
                : origin === "top" || origin === "bottom"
                ? { scaleY: 0 }
                : { scale: 0 };

        gsap.to(overlay, {
            ...animProps,
            duration,
            delay: stagger,
            ease: EASE.outExpo,
            scrollTrigger: {
                trigger: el,
                start,
                toggleActions: "play none none none",
            },
        });

        return () => {
            ScrollTrigger.getAll()
                .filter((t) => t.trigger === el)
                .forEach((t) => t.kill());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { containerRef, maskRef };
};
