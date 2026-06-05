import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "../../lib/motion/lenis";

gsap.registerPlugin(ScrollTrigger);

/**
 * Drives GSAP's ScrollTrigger update loop on the active Lenis instance.
 * Mount once at the top of the Home Page so scroll-triggered animations
 * stay in sync with smooth scrolling.
 */
export const useScrollTriggerSync = () => {
    const initialized = useRef(false);

    useLayoutEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        const setupSync = async () => {
            const { getLenis } = await import("../../lib/motion/lenis");
            const lenis = getLenis();
            if (!lenis) return;

            lenis.on("scroll", ScrollTrigger.update);

            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(0);
        };

        if (!prefersReducedMotion()) {
            setupSync();
        }

        return () => {
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    }, []);
};
