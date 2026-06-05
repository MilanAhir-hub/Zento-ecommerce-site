import { motion, useReducedMotion } from "framer-motion";
import { type ReactNode } from "react";

interface FadeInProps {
    children: ReactNode;
    delay?: number;
    duration?: number;
    y?: number;
    className?: string;
    /** Trigger on view instead of mount. */
    view?: boolean;
}

/**
 * Single-element fade + translate. Light wrapper around Framer Motion for
 * minor entrance animations that don't warrant a full GSAP timeline.
 */
const FadeIn = ({
    children,
    delay = 0,
    duration = 0.9,
    y = 16,
    className = "",
    view = true,
}: FadeInProps) => {
    const prefersReduced = useReducedMotion();

    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y: prefersReduced ? 0 : y }}
            {...(view
                ? {
                      whileInView: { opacity: 1, y: 0 },
                      viewport: { once: true, amount: 0.3 },
                  }
                : { animate: { opacity: 1, y: 0 } })}
            transition={{
                duration: prefersReduced ? 0 : duration,
                delay: prefersReduced ? 0 : delay,
                ease: [0.22, 1, 0.36, 1],
            }}
        >
            {children}
        </motion.div>
    );
};

export default FadeIn;
