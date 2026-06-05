import { useEffect, useRef } from "react";
import { createLenis, destroyLenis, prefersReducedMotion } from "../../lib/motion/lenis";

/**
 * Drives the Lenis smooth scroll RAF loop. Mounts Lenis on first call,
 * tears it down on unmount so other pages get default browser scrolling.
 *
 * Returns the Lenis instance via ref so consumers (e.g. ScrollTrigger) can
 * call `lenis.scrollTo(...)` if they ever need to.
 */
export const useLenis = () => {
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        if (prefersReducedMotion()) return;

        const lenis = createLenis();

        const raf = (time: number) => {
            lenis.raf(time);
            rafRef.current = requestAnimationFrame(raf);
        };

        rafRef.current = requestAnimationFrame(raf);

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            destroyLenis();
        };
    }, []);
};
