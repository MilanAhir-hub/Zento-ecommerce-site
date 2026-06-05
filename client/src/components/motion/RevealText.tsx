import { motion, useReducedMotion, type Variants } from "framer-motion";

interface RevealTextProps {
    children: string;
    /** HTML tag for the wrapper. Default "h2". */
    as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
    /** Stagger between words (s). Default 0.08. */
    stagger?: number;
    /** Word-level animation duration (s). Default 1.1. */
    duration?: number;
    /** Additional classes to apply to the wrapper. */
    className?: string;
    /** Classes applied to each word. */
    wordClassName?: string;
    /** Delay before the first word (s). */
    delay?: number;
    /** Trigger mode: "mount" plays on mount, "view" plays when in view. */
    trigger?: "mount" | "view";
    /** Whether to use a blur effect in addition to translate. */
    blur?: boolean;
}

/**
 * Splits a string into words and animates each one with a soft upward
 * motion + opacity transition. Intended for editorial luxury headlines —
 * not flashy. Uses Framer Motion micro-animation only; major scene-level
 * motion lives in GSAP.
 */
const RevealText = ({
    children,
    as = "h2",
    stagger = 0.08,
    duration = 1.1,
    className = "",
    wordClassName = "",
    delay = 0,
    trigger = "mount",
    blur = false,
}: RevealTextProps) => {
    const prefersReduced = useReducedMotion();
    const words = children.split(" ");

    const containerVariants: Variants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: prefersReduced ? 0 : stagger,
                delayChildren: prefersReduced ? 0 : delay,
            },
        },
    };

    const wordVariants: Variants = {
        hidden: {
            y: "110%",
            opacity: 0,
            filter: blur ? "blur(8px)" : "blur(0px)",
        },
        visible: {
            y: "0%",
            opacity: 1,
            filter: "blur(0px)",
            transition: {
                duration: prefersReduced ? 0 : duration,
                // Refined quintic out — used everywhere in the brand.
                ease: [0.22, 1, 0.36, 1],
            },
        },
    };

    const MotionTag = motion[as] as typeof motion.h2;
    const initial = "hidden";
    const animate = trigger === "view" ? undefined : "visible";
    const whileInView = trigger === "view" ? "visible" : undefined;
    const viewport = trigger === "view" ? { once: true, amount: 0.4 } : undefined;

    return (
        <MotionTag
            className={className}
            style={{ display: "inline-block", overflow: "hidden" }}
            variants={containerVariants}
            initial={initial}
            animate={animate}
            whileInView={whileInView}
            viewport={viewport}
            aria-label={children}
        >
            {words.map((word, i) => (
                <span
                    key={`${word}-${i}`}
                    className="inline-block overflow-hidden align-baseline"
                    style={{ marginRight: "0.25em" }}
                    aria-hidden="true"
                >
                    <motion.span
                        variants={wordVariants}
                        className={`inline-block will-change-transform ${wordClassName}`}
                    >
                        {word}
                    </motion.span>
                </span>
            ))}
        </MotionTag>
    );
};

export default RevealText;
