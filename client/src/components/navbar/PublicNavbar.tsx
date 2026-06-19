import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    Search01Icon,
    User03Icon,
    Menu02Icon,
    Cancel01Icon,
    Logout03Icon,
    ShoppingBag01Icon,
} from "@hugeicons/core-free-icons";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { useCart } from "../../hooks/cart/useCart";
import { categories } from "../../constants/categories";
import Logo from "../ui/Logo";
import NavMegaMenu from "./NavMegaMenu";
import ProfileMegaMenu from "./ProfileMegaMenu";
import SearchMenu from "./SearchMenu";
import useScrolled from "../../hooks/useScrolled";

const getInitials = (name?: string) => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
};

const EASE = [0.22, 1, 0.36, 1] as const;

const PublicNavbar = () => {
    const { user, logout } = useAuth();
    const { cart } = useCart();
    const [activeCategory, setActiveCategory] = useState<typeof categories[0] | null>(null);
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [isProfileVisible, setIsProfileVisible] = useState(false);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [hoveredCategoryId, setHoveredCategoryId] = useState<number | null>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const scrolled = useScrolled({ threshold: 8 });
    const prefersReduced = useReducedMotion();

    const cartItemCount = cart?.items?.length || 0;
    const highlightedId = hoveredCategoryId || (isMenuVisible ? activeCategory?.id : null);

    // --- CATEGORY HANDLERS ---
    const handleMouseEnter = (category: typeof categories[0]) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsProfileVisible(false);
        setActiveCategory(category);
        setIsMenuVisible(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsMenuVisible(false);
            setIsProfileVisible(false);
        }, 200);
    };

    const handleMenuMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsMenuVisible(true);
    };

    // --- PROFILE HANDLERS ---
    const handleProfileMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsMenuVisible(false);
        setIsProfileVisible(true);
    };

    const handleProfileMenuMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsProfileVisible(true);
    };

    const handleItemClick = () => {
        setIsMenuVisible(false);
        setIsProfileVisible(false);
        setIsMobileMenuOpen(false);
        setHoveredCategoryId(null);
        setIsSearchVisible(false);
    };

    // Body scroll lock for mobile drawer
    useEffect(() => {
        if (!isMobileMenuOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [isMobileMenuOpen]);

    // Close any open panel on Esc
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key !== "Escape") return;
            if (isMobileMenuOpen) setIsMobileMenuOpen(false);
            else if (isSearchVisible) setIsSearchVisible(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isMobileMenuOpen, isSearchVisible]);

    // -- Motion variants -------------------------------------------------------
    const barHeight = scrolled ? "h-[56px]" : "h-[72px]";

    const drawerVariants = {
        hidden: { x: prefersReduced ? 0 : "-100%" },
        visible: {
            x: 0,
            transition: {
                duration: prefersReduced ? 0 : 0.45,
                ease: EASE,
                when: "beforeChildren",
                staggerChildren: prefersReduced ? 0 : 0.04,
                delayChildren: prefersReduced ? 0 : 0.15,
            },
        },
        exit: {
            x: prefersReduced ? 0 : "-100%",
            transition: { duration: prefersReduced ? 0 : 0.3, ease: EASE },
        },
    };

    const drawerItemVariants = {
        hidden: { opacity: 0, x: prefersReduced ? 0 : -12 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: prefersReduced ? 0 : 0.45, ease: EASE },
        },
    };

    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } },
        exit: { opacity: 0, transition: { duration: 0.2 } },
    };

    return (
        <>
            <motion.header
                initial={false}
                animate={{
                    boxShadow: scrolled
                        ? "0 4px 20px -10px rgba(0,0,0,0.08)"
                        : "0 0 0 0 rgba(0,0,0,0)",
                }}
                transition={{ duration: 0.3, ease: EASE }}
                className={`
                    sticky top-0 z-50 w-full
                    bg-white/95 backdrop-blur-md
                    transition-[border-color] duration-300
                `}
            >
                <div className="max-w-[1440px] mx-auto px-4 md:px-10">
                    {/* MAIN ROW: Logo (left) | Center Categories (inline) | Utilities (right) */}
                    <div
                        className={`
                            flex items-center justify-between relative
                            transition-[height] duration-300 ease-out
                            ${barHeight}
                        `}
                    >
                        {/* LEFT: Logo & Hamburger */}
                        <div className="flex items-center gap-6 min-w-0">
                            <button
                                type="button"
                                onClick={() => setIsMobileMenuOpen(true)}
                                aria-label="Open menu"
                                className="
                                    lg:hidden
                                    w-9 h-9
                                    inline-flex items-center justify-center
                                    text-[#222222] hover:text-[#000000]
                                    transition-colors duration-200
                                    focus-visible:outline focus-visible:outline-1
                                    focus-visible:outline-offset-2 focus-visible:outline-[#000000]
                                "
                            >
                                <HugeiconsIcon icon={Menu02Icon} size={20} aria-hidden="true" />
                            </button>
                            <Logo onClick={handleItemClick} className="block shrink-0" />
                        </div>

                        {/* CENTER: Categories (desktop only) */}
                        <nav className="hidden lg:flex items-center justify-center flex-1 mx-8 h-full" aria-label="Categories">
                            <ul className="flex items-center gap-6 xl:gap-8 h-full">
                                {categories.map((cat) => {
                                    const isActive = highlightedId === cat.id;
                                    const isDimmed = !!highlightedId && !isActive;
                                    return (
                                        <li
                                            key={cat.id}
                                            className="h-full flex items-center"
                                            onMouseEnter={() => {
                                                handleMouseEnter(cat);
                                                setHoveredCategoryId(cat.id);
                                            }}
                                            onMouseLeave={() => {
                                                handleMouseLeave();
                                                setHoveredCategoryId(null);
                                            }}
                                        >
                                            <Link
                                                to={`/category/${cat.name.toLowerCase()}`}
                                                onClick={handleItemClick}
                                                className={`
                                                    group/cat relative
                                                    h-full inline-flex items-center
                                                    text-[11px] font-medium uppercase
                                                    tracking-[0.12em]
                                                    transition-colors duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]
                                                    ${
                                                        isActive
                                                            ? "text-[#000000]"
                                                            : isDimmed
                                                            ? "text-[#b0b0b0]"
                                                            : "text-[#767676] hover:text-[#000000]"
                                                    }
                                                `}
                                            >
                                                <span>{cat.name}</span>
                                                {/* Active indicator line */}
                                                {isActive && (
                                                    <span className="absolute bottom-0 left-0 right-0 h-px bg-[#000000]" />
                                                )}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </nav>

                        {/* RIGHT: Utilities */}
                        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                            <button
                                type="button"
                                onClick={() => setIsSearchVisible(true)}
                                aria-label="Open search"
                                className="
                                    w-11 h-11
                                    inline-flex items-center justify-center
                                    text-[#222222] hover:text-[#000000]
                                    transition-colors duration-200
                                    focus-visible:outline focus-visible:outline-1
                                    focus-visible:outline-offset-2 focus-visible:outline-[#000000]
                                "
                            >
                                <HugeiconsIcon
                                    icon={Search01Icon}
                                    size={18}
                                    aria-hidden="true"
                                />
                            </button>

                            {/* Cart: icon + count badge */}
                            <Link
                                to="/cart"
                                onClick={handleItemClick}
                                aria-label={`Shopping bag, ${cartItemCount} ${cartItemCount === 1 ? "item" : "items"}`}
                                className="
                                    relative
                                    w-11 h-11
                                    inline-flex items-center justify-center
                                    text-[#222222] hover:text-[#000000]
                                    transition-colors duration-200
                                    focus-visible:outline focus-visible:outline-1
                                    focus-visible:outline-offset-2 focus-visible:outline-[#000000]
                                "
                            >
                                <HugeiconsIcon
                                    icon={ShoppingBag01Icon}
                                    size={18}
                                    aria-hidden="true"
                                />
                                <AnimatePresence>
                                    {cartItemCount > 0 && (
                                        <motion.span
                                            key={cartItemCount}
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0, opacity: 0 }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 500,
                                                damping: 28,
                                                mass: 0.6,
                                            }}
                                            className="
                                                absolute -top-0.5 -right-0.5
                                                min-w-[18px] h-[18px]
                                                px-1
                                                inline-flex items-center justify-center
                                                bg-[#000000] text-white
                                                text-[10px] font-medium leading-none
                                                rounded-full
                                                tabular-nums
                                            "
                                        >
                                            {cartItemCount}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </Link>

                            <div
                                onMouseEnter={handleProfileMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                className="flex items-center"
                            >
                                {user ? (
                                    <Link
                                        to="/user/home"
                                        onClick={handleItemClick}
                                        aria-label={`Account: ${user.name}`}
                                        className="
                                            w-9 h-9
                                            inline-flex items-center justify-center
                                            bg-[#000000] text-white
                                            text-[10px] font-medium uppercase tracking-[0.1em]
                                            rounded-full
                                            ring-2 ring-transparent
                                            hover:ring-[#000000]/10
                                            transition-[transform,box-shadow] duration-200
                                            hover:scale-105
                                            focus-visible:outline focus-visible:outline-1
                                            focus-visible:outline-offset-2 focus-visible:outline-[#000000]
                                        "
                                    >
                                        {getInitials(user.name)}
                                    </Link>
                                ) : (
                                    <button
                                        type="button"
                                        onMouseEnter={handleProfileMouseEnter}
                                        onClick={() => setIsProfileVisible((v) => !v)}
                                        aria-label="Account"
                                        className="
                                            w-11 h-11
                                            inline-flex items-center justify-center
                                            text-[#222222] hover:text-[#000000]
                                            transition-colors duration-200
                                            focus-visible:outline focus-visible:outline-1
                                            focus-visible:outline-offset-2 focus-visible:outline-[#000000]
                                        "
                                    >
                                        <HugeiconsIcon
                                            icon={User03Icon}
                                            size={18}
                                            aria-hidden="true"
                                        />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Category Mega Menu */}
                <NavMegaMenu
                    category={activeCategory}
                    isVisible={isMenuVisible}
                    onMouseEnter={handleMenuMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onItemClick={handleItemClick}
                />

                {/* Profile Mega Menu */}
                <ProfileMegaMenu
                    isVisible={isProfileVisible}
                    onMouseEnter={handleProfileMenuMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onItemClick={handleItemClick}
                />

                {/* Search Panel (luxury inline dropdown) */}
                <SearchMenu
                    isVisible={isSearchVisible}
                    onClose={() => setIsSearchVisible(false)}
                />
            </motion.header>

            {/* MOBILE SIDEBAR MENU */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            key="mobile-backdrop"
                            variants={backdropVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="fixed inset-0 z-[55] bg-[#000000]/40 lg:hidden backdrop-blur-sm"
                            onClick={() => setIsMobileMenuOpen(false)}
                            aria-hidden="true"
                        />

                        <motion.aside
                            key="mobile-drawer"
                            variants={drawerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="
                                fixed inset-y-0 left-0 z-[60]
                                w-[85vw] max-w-[360px] h-full
                                bg-white
                                border-r border-[#E5E5E5]
                                flex flex-col
                                overscroll-contain
                                lg:hidden
                            "
                            role="dialog"
                            aria-modal="true"
                            aria-label="Mobile menu"
                        >
                            <motion.div
                                variants={drawerItemVariants}
                                className="flex items-center justify-between px-6 h-16 border-b border-[#E5E5E5] shrink-0"
                            >
                                <span className="text-[13px] font-medium uppercase tracking-[0.12em] text-[#000000]">
                                    Menu
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    aria-label="Close menu"
                                    className="
                                        w-9 h-9
                                        inline-flex items-center justify-center
                                        text-[#222222] hover:text-[#000000]
                                        transition-colors duration-200
                                        focus-visible:outline focus-visible:outline-1
                                        focus-visible:outline-offset-2 focus-visible:outline-[#000000]
                                    "
                                >
                                    <HugeiconsIcon
                                        icon={Cancel01Icon}
                                        size={20}
                                        aria-hidden="true"
                                    />
                                </button>
                            </motion.div>

                            <nav
                                className="flex-1 overflow-y-auto overscroll-contain"
                                aria-label="Mobile categories"
                            >
                                <ul className="px-6 py-4">
                                    {categories.map((cat) => (
                                        <motion.li
                                            key={cat.id}
                                            variants={drawerItemVariants}
                                            className="border-b border-[#F0F0F0] last:border-b-0"
                                        >
                                            <Link
                                                to={`/category/${cat.name.toLowerCase()}`}
                                                onClick={handleItemClick}
                                                className="
                                                    group/mob
                                                    flex items-center justify-between
                                                    py-4
                                                    text-[14px] font-medium uppercase tracking-[0.12em]
                                                    text-[#222222] hover:text-[#000000]
                                                    transition-colors duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]
                                                "
                                            >
                                                <span>{cat.name}</span>
                                                <HugeiconsIcon
                                                    icon={Search01Icon}
                                                    size={14}
                                                    className="text-[#9a9a9a] -rotate-45 opacity-0 group-hover/mob:opacity-100 transition-opacity duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]"
                                                />
                                            </Link>
                                        </motion.li>
                                    ))}
                                </ul>
                            </nav>

                            {user && (
                                <motion.div
                                    variants={drawerItemVariants}
                                    className="shrink-0 px-6 py-4 border-t border-[#E5E5E5] bg-white"
                                >
                                    <button
                                        type="button"
                                        onClick={() => {
                                            logout();
                                            handleItemClick();
                                        }}
                                        className="
                                            group/out
                                            w-full
                                            inline-flex items-center justify-center gap-2
                                            h-11
                                            text-[11px] font-medium uppercase tracking-[0.14em]
                                            text-white bg-[#000000] border border-[#000000]
                                            hover:bg-white hover:text-[#000000]
                                            transition-colors duration-300
                                            focus-visible:outline focus-visible:outline-1
                                            focus-visible:outline-offset-2 focus-visible:outline-[#000000]
                                        "
                                    >
                                        <HugeiconsIcon
                                            icon={Logout03Icon}
                                            size={14}
                                            aria-hidden="true"
                                            className="text-white group-hover/out:text-[#000000] transition-colors duration-300"
                                        />
                                        Sign Out
                                    </button>
                                </motion.div>
                            )}
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default PublicNavbar;
