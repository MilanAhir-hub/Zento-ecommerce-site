import Lenis from "lenis";

/**
 * Easing curves for the brand. Stored as CSS cubic-bezier strings so they
 * work across GSAP, Framer Motion, and raw CSS. OutQuint is the workhorse
 * for editorial reveals; OutExpo is used for staggered lists; InOutQuart
 * for parallax and continuous motion.
 */
export const EASE = {
    outQuint: "cubic-bezier(0.22, 1, 0.36, 1)",
    outQuart: "cubic-bezier(0.25, 1, 0.5, 1)",
    outExpo: "cubic-bezier(0.16, 1, 0.3, 1)",
    inOutQuart: "cubic-bezier(0.76, 0, 0.24, 1)",
} as const;

/**
 * Reduced motion preference. Short-circuits all GSAP timelines and Framer
 * Motion transitions when the user has requested less motion.
 */
export const prefersReducedMotion = (): boolean => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
};

let lenisInstance: Lenis | null = null;

/**
 * Returns the active Lenis instance, creating it on first call.
 * The instance is shared across the app so ScrollTrigger can drive it.
 */
export const getLenis = (): Lenis | null => lenisInstance;

export const createLenis = (): Lenis => {
    if (lenisInstance) return lenisInstance;

    lenisInstance = new Lenis({
        // Slightly higher lerp for a heavier, more cinematic feel.
        lerp: 0.1,
        // Wheel + touch + keyboard navigation all funnel through Lenis.
        wheelMultiplier: 1,
        touchMultiplier: 1.2,
        // Smooth, but not so slow that users get impatient.
        duration: 1.4,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
    });

    return lenisInstance;
};

export const destroyLenis = (): void => {
    if (!lenisInstance) return;
    lenisInstance.destroy();
    lenisInstance = null;
};
