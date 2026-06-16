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

interface PromoItem {
    image: string;
    title: string;
    link: string;
}

const CATEGORY_PROMOS: Record<string, PromoItem[]> = {
    women: [
        {
            image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=400&q=80",
            title: "New Outerwear",
            link: "/category/women",
        },
        {
            image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=400&q=80",
            title: "Seasonal Knits",
            link: "/category/women",
        },
    ],
    men: [
        {
            image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80",
            title: "Tailored Suits",
            link: "/category/men",
        },
        {
            image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
            title: "Casual Shirts",
            link: "/category/men",
        },
    ],
    footwear: [
        {
            image: "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?auto=format&fit=crop&w=400&q=80",
            title: "Leather Boots",
            link: "/category/footwear",
        },
        {
            image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=400&q=80",
            title: "Active Trainers",
            link: "/category/footwear",
        },
    ],
    accessories: [
        {
            image: "https://images.unsplash.com/photo-1509319117193-57bab727e09d?auto=format&fit=crop&w=400&q=80",
            title: "Atelier Hats",
            link: "/category/accessories",
        },
        {
            image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=400&q=80",
            title: "Leather Bags",
            link: "/category/accessories",
        },
    ],
    streetwear: [
        {
            image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=400&q=80",
            title: "Urban Fits",
            link: "/category/streetwear",
        },
        {
            image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
            title: "Utility Denim",
            link: "/category/streetwear",
        },
    ],
    "casual wear": [
        {
            image: "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=400&q=80",
            title: "Weekend Basics",
            link: "/category/casual wear",
        },
        {
            image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=400&q=80",
            title: "Loungewear",
            link: "/category/casual wear",
        },
    ],
    "formal wear": [
        {
            image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=400&q=80",
            title: "Classic Shirts",
            link: "/category/formal wear",
        },
        {
            image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80",
            title: "Smart Blazers",
            link: "/category/formal wear",
        },
    ],
    luxury: [
        {
            image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=400&q=80",
            title: "The Atelier",
            link: "/category/luxury",
        },
        {
            image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=400&q=80",
            title: "Runway Edits",
            link: "/category/luxury",
        },
    ],
};

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

    // Retrieve active category promos
    const categoryKey = category?.name.toLowerCase() || "";
    const promos = CATEGORY_PROMOS[categoryKey] || [
        {
            image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=400&q=80",
            title: "New Arrivals",
            link: `/category/${categoryKey}`,
        },
        {
            image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=400&q=80",
            title: "Highlights",
            link: `/category/${categoryKey}`,
        },
    ];

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
                        absolute left-0 right-0 top-full w-full
                        bg-white
                        border-b border-[#E5E5E5]
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
                            <motion.div variants={childVariants} className="md:col-span-3">
                                <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#767676] mb-6">
                                    Featured
                                </h3>
                                <Link
                                    to={`/category/${category.name.toLowerCase()}`}
                                    onClick={onItemClick}
                                    className="
                                        group/featured
                                        block
                                        text-[28px] md:text-[34px]
                                        font-light tracking-[0.01em]
                                        text-[#000000]
                                        leading-[1.1]
                                        text-balance
                                    "
                                >
                                    <span className="bg-[linear-gradient(currentColor,currentColor)] bg-no-repeat bg-[length:0%_1px] bg-[position:0_100%] group-hover/featured:bg-[length:100%_1px] transition-[background-size] duration-500 ease-out pb-1">
                                        Shop All {category.name}
                                    </span>
                                    <HugeiconsIcon
                                        icon={ArrowRight01Icon}
                                        size={18}
                                        className="inline-block ml-2 -translate-x-1 opacity-70 group-hover/featured:translate-x-0 group-hover/featured:opacity-100 transition-[transform,opacity] duration-300"
                                    />
                                </Link>
                            </motion.div>

                            {/* Subcategories */}
                            <motion.div
                                variants={childVariants}
                                className="md:col-span-5"
                            >
                                <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#767676] mb-6">
                                    Categories
                                </h3>
                                <ul className="grid grid-cols-2 gap-x-8 gap-y-3">
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

                            {/* Right Column: Promotional items with photos */}
                            <motion.div
                                variants={childVariants}
                                className="md:col-span-4"
                            >
                                <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#767676] mb-6">
                                    Highlights
                                </h3>
                                <div className="grid grid-cols-2 gap-6">
                                    {promos.map((promo, idx) => (
                                        <Link
                                            key={idx}
                                            to={promo.link}
                                            onClick={onItemClick}
                                            className="group/promo block overflow-hidden"
                                        >
                                            <div className="aspect-[3/4] bg-stone-50 overflow-hidden relative">
                                                <img
                                                    src={promo.image}
                                                    alt={promo.title}
                                                    width={200}
                                                    height={266}
                                                    loading="lazy"
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover/promo:scale-103"
                                                />
                                            </div>
                                            <span className="block text-[11px] font-medium uppercase tracking-[0.1em] mt-3 text-gray-500 group-hover/promo:text-black transition-colors duration-200">
                                                {promo.title}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        <motion.div
                            variants={childVariants}
                            className="
                                mt-10 pt-6
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
