import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { Link } from "react-router-dom";

interface NavMegaMenuProps {
    category: {
        id: number;
        name: string;
        subcategories: string[];
    } | null;
    isVisible: boolean;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onItemClick: () => void;
}

const EASE = [0.22, 1, 0.36, 1] as const;

const NavMegaMenu = ({
    category,
    isVisible,
    onMouseEnter,
    onMouseLeave,
    onItemClick,
}: NavMegaMenuProps) => {
    const prefersReduced = useReducedMotion();

    const panelVariants = {
        hidden: {
            opacity: 0,
            y: prefersReduced ? 0 : -6,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: prefersReduced ? 0 : 0.45,
                ease: EASE,
                when: "beforeChildren",
                staggerChildren: prefersReduced ? 0 : 0.03,
                delayChildren: prefersReduced ? 0 : 0.08,
            },
        },
        exit: {
            opacity: 0,
            y: prefersReduced ? 0 : -4,
            transition: { duration: prefersReduced ? 0 : 0.18, ease: EASE },
        },
    };

    const childVariants = {
        hidden: { opacity: 0, y: prefersReduced ? 0 : 8 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: prefersReduced ? 0 : 0.45, ease: EASE },
        },
    };

    return (
        <AnimatePresence>
            {isVisible && category && (
                <motion.div
                    key={`mega-${category.id}`}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    variants={panelVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="
                        absolute left-0 right-0 top-full mt-3 w-full
                        bg-white/95 backdrop-blur-md
                        border-y border-[#E5E5E5]
                        shadow-[0_24px_60px_-20px_rgba(0,0,0,0.15)]
                        overflow-hidden
                        z-40
                    "
                    role="region"
                    aria-label={`${category.name} categories`}
                >
                    <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-10 md:py-12">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                            {/* Featured column */}
                            <motion.div variants={childVariants} className="md:col-span-4">
                                <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#767676] mb-6 flex items-center gap-2">
                                    <span>Featured</span>
                                    <span className="h-px flex-1 bg-[#E5E5E5]" />
                                </h3>
                                <Link
                                    to={`/category/${category.name.toLowerCase()}`}
                                    onClick={onItemClick}
                                    className="
                                        group/featured
                                        block
                                        text-[34px] md:text-[40px]
                                        font-light tracking-[0.01em]
                                        text-[#000000]
                                        leading-[1.05]
                                        text-balance
                                    "
                                >
                                    <span className="bg-[linear-gradient(currentColor,currentColor)] bg-no-repeat bg-[length:0%_1px] bg-[position:0_100%] group-hover/featured:bg-[length:100%_1px] transition-[background-size] duration-500 ease-out pb-1">
                                        Shop All {category.name}
                                    </span>
                                    <HugeiconsIcon
                                        icon={ArrowRight01Icon}
                                        size={20}
                                        className="inline-block ml-2 -translate-x-1 opacity-70 group-hover/featured:translate-x-0 group-hover/featured:opacity-100 transition-[transform,opacity] duration-300"
                                    />
                                </Link>
                            </motion.div>

                            {/* Subcategories */}
                            <motion.div
                                variants={childVariants}
                                className="md:col-span-8"
                            >
                                <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#767676] mb-6 flex items-center gap-2">
                                    <span>Categories</span>
                                    <span className="h-px flex-1 bg-[#E5E5E5]" />
                                </h3>
                                <ul className="grid grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-3">
                                    {category.subcategories.map((sub) => (
                                        <motion.li key={sub} variants={childVariants}>
                                            <Link
                                                to={`/category/${category.name.toLowerCase()}/${sub
                                                    .toLowerCase()
                                                    .replace(/\s+/g, "-")}`}
                                                onClick={onItemClick}
                                                className="
                                                    group/sub
                                                    flex items-center justify-between
                                                    py-1
                                                    text-[15px] text-[#222222] hover:text-[#000000]
                                                    transition-colors duration-200
                                                "
                                            >
                                                <span>{sub}</span>
                                                <HugeiconsIcon
                                                    icon={ArrowRight01Icon}
                                                    size={14}
                                                    className="text-[#9a9a9a] -translate-x-1 opacity-0 group-hover/sub:translate-x-0 group-hover/sub:opacity-100 transition-[transform,opacity] duration-300"
                                                />
                                            </Link>
                                        </motion.li>
                                    ))}
                                </ul>
                            </motion.div>
                        </div>

                        <motion.div
                            variants={childVariants}
                            className="
                                mt-10 pt-6 border-t border-[#E5E5E5]
                                flex flex-wrap items-center gap-x-8 gap-y-3
                            "
                        >
                            <Link
                                to="/new-arrivals"
                                onClick={onItemClick}
                                className="text-[12px] font-medium uppercase tracking-[0.14em] text-[#000000] underline-offset-4 hover:underline transition-colors duration-200"
                            >
                                New Arrivals
                            </Link>
                            <Link
                                to="/best-sellers"
                                onClick={onItemClick}
                                className="text-[12px] font-medium uppercase tracking-[0.14em] text-[#000000] underline-offset-4 hover:underline transition-colors duration-200"
                            >
                                Best Sellers
                            </Link>
                            <Link
                                to="/sale"
                                onClick={onItemClick}
                                className="text-[12px] font-medium uppercase tracking-[0.14em] text-[#BC0000] underline-offset-4 hover:underline transition-colors duration-200"
                            >
                                Sale
                            </Link>
                            <span className="ml-auto text-[11px] font-medium uppercase tracking-[0.12em] text-[#9a9a9a] hidden md:inline">
                                Free shipping over ₹2,500
                            </span>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default NavMegaMenu;
