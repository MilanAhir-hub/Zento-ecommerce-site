import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "../../lib/motion/lenis";

gsap.registerPlugin(ScrollTrigger);

const BRANDS = [
    "CHANEL",
    "GUCCI",
    "PRADA",
    "DIOR",
    "BALENCIAGA",
    "SAINT LAURENT",
    "GIVENCHY",
    "VALENTINO",
    "HERMÈS",
    "VERSACE",
];

/**
 * Brand ticker. Renders two copies of the brand list in a single track
 * and animates it left with `gsap.to(x, { xPercent: -50 })` so the loop
 * is seamless. Speed is driven by scroll velocity via ScrollTrigger so
 * the ticker feels like a tactile extension of the page.
 */
const BrandTicker = () => {
    const trackRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!trackRef.current) return;
        if (prefersReducedMotion()) return;

        const track = trackRef.current;
        const tween = gsap.to(track, {
            xPercent: -50,
            duration: 30,
            ease: "none",
            repeat: -1,
        });

        // Drive marquee speed from raw wheel events. GSAP doesn't expose a
        // scroll-velocity API directly, so we track deltas ourselves and
        // pulse the timeScale on each significant scroll input.
        let velocity = 0;
        let raf: number | null = null;

        const onWheel = (e: WheelEvent) => {
            velocity += e.deltaY;
        };

        const tick = () => {
            velocity *= 0.9; // decay
            const absV = Math.min(Math.abs(velocity) / 800, 1);
            tween.timeScale(0.5 + absV * 3);
            raf = requestAnimationFrame(tick);
        };

        window.addEventListener("wheel", onWheel, { passive: true });
        raf = requestAnimationFrame(tick);

        return () => {
            tween.kill();
            window.removeEventListener("wheel", onWheel);
            if (raf) cancelAnimationFrame(raf);
        };
    }, []);

    return (
        <div
            className="w-full bg-[#F9F9F9] py-6 overflow-hidden select-none"
            aria-label="Featured brands"
        >
            <div className="relative w-full flex items-center">
                <div ref={trackRef} className="flex gap-16 whitespace-nowrap will-change-transform">
                    {[...BRANDS, ...BRANDS, ...BRANDS, ...BRANDS].map((brand, index) => (
                        <span
                            key={`brand-${index}`}
                            className="
                                text-[13px] font-medium tracking-[0.2em]
                                text-[#767676] hover:text-[#000000]
                                transition-colors duration-200 uppercase
                            "
                        >
                            {brand}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BrandTicker;
