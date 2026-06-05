import { type ReactNode } from "react";
import { useGsapMaskReveal } from "../../hooks/motion/useGsapMaskReveal";

interface ImageMaskRevealProps {
    children: ReactNode;
    className?: string;
    /** Origin of the wipe. Default "left". */
    origin?: "left" | "right" | "top" | "bottom" | "center";
    /** Mask color. Default brand black. */
    maskColor?: string;
    /** Stagger delay (s). */
    delay?: number;
    /** Mask duration (s). */
    duration?: number;
}

/**
 * Wraps an image (or any element) in a curtain-style mask that wipes away
 * on scroll. The mask sits on top with a solid color and animates `scaleX`
 * or `scaleY` to `0` depending on origin.
 *
 * Pure CSS positioning, GPU-accelerated transforms, no layout impact.
 */
const ImageMaskReveal = ({
    children,
    className = "",
    origin = "left",
    maskColor = "#0A0A0A",
    delay = 0,
    duration = 1.2,
}: ImageMaskRevealProps) => {
    const { containerRef, maskRef } = useGsapMaskReveal<HTMLDivElement>({
        origin,
        stagger: delay,
        duration,
    });

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden ${className}`}
        >
            {children}
            <div
                ref={maskRef}
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-10 will-change-transform"
                style={{ backgroundColor: maskColor }}
            />
        </div>
    );
};

export default ImageMaskReveal;
