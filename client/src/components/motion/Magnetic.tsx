import { useRef, type ReactNode } from "react";
import {
    motion,
    useMotionValue,
    useSpring,
    useReducedMotion,
} from "framer-motion";

interface MagneticProps {
    children: ReactNode;
    /** Strength of the magnetic pull. 0 = no effect, 1 = full follow. */
    strength?: number;
    className?: string;
}

/**
 * Magnetic hover wrapper. The child is pulled toward the cursor with a
 * spring-damped motion. Used for high-emphasis CTAs on the home page
 * (Shop Now, View Collection, etc).
 *
 * Falls back to zero offset under prefers-reduced-motion.
 */
const Magnetic = ({ children, strength = 0.35, className = "" }: MagneticProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const prefersReduced = useReducedMotion();

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springConfig = { stiffness: 200, damping: 18, mass: 0.6 };
    const sx = useSpring(x, springConfig);
    const sy = useSpring(y, springConfig);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (prefersReduced) return;
        const el = ref.current;
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) * strength;
        const dy = (e.clientY - cy) * strength;

        x.set(dx);
        y.set(dy);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            className={className}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ x: sx, y: sy, display: "inline-block" }}
        >
            {children}
        </motion.div>
    );
};

export default Magnetic;
