import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, Logout03Icon } from "@hugeicons/core-free-icons";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";

interface ProfileMegaMenuProps {
    isVisible: boolean;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onItemClick: () => void;
}

const EASE = [0.22, 1, 0.36, 1] as const;

const ProfileMegaMenu = ({
    isVisible,
    onMouseEnter,
    onMouseLeave,
    onItemClick,
}: ProfileMegaMenuProps) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const prefersReduced = useReducedMotion();

    const handleLogout = async () => {
        try {
            await logout();
            onItemClick();
            navigate("/login");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const navSections = user
        ? [
              {
                  title: "Account",
                  links: [
                      { label: "Profile", to: "/user/personal-info" },
                      { label: "Orders", to: "/user/orders" },
                      { label: "Settings", to: "/user/settings" },
                      { label: "Notifications", to: "/user/notifications" },
                  ],
              },
              {
                  title: "Saved",
                  links: [
                      { label: "Wishlist", to: "/user/wishlist" },
                      { label: "Addresses", to: "/user/addresses" },
                  ],
              },
              {
                  title: "Support",
                  links: [
                      { label: "Help Center", to: "/help" },
                      { label: "Guide", to: "/guide" },
                  ],
              },
          ]
        : [
              {
                  title: "Support",
                  links: [
                      { label: "Help Center", to: "/help" },
                      { label: "Guide", to: "/guide" },
                      { label: "Track Order", to: "/track-order" },
                      { label: "Returns", to: "/returns" },
                  ],
              },
              {
                  title: "Discover",
                  links: [
                      { label: "Store Locator", to: "/stores" },
                      { label: "Gift Cards", to: "/gift-cards" },
                      { label: "Contact", to: "/contact" },
                  ],
              },
          ];

    const panelVariants = {
        hidden: { opacity: 0, y: prefersReduced ? 0 : -6 },
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
            {isVisible && (
                <motion.div
                    key="profile-mega"
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
                    aria-label="Account"
                >
                    <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-10 md:py-12">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                            {/* Identity / Sign-in */}
                            <motion.div variants={childVariants} className="md:col-span-4">
                                <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#767676] mb-6 flex items-center gap-2">
                                    <span>{user ? "Signed In" : "Account"}</span>
                                    <span className="h-px flex-1 bg-[#E5E5E5]" />
                                </h3>

                                {user ? (
                                    <div className="space-y-2">
                                        <p className="text-[26px] font-light text-[#000000] tracking-[0.01em] leading-tight text-balance">
                                            {user.name}
                                        </p>
                                        <p className="text-[13px] text-[#767676] break-all">
                                            {user.email}
                                        </p>

                                        {user.role === "vendor" || user.role === "admin" ? (
                                            <Link
                                                to={
                                                    user.role === "admin"
                                                        ? "/admin/dashboard"
                                                        : "/vendor/overview"
                                                }
                                                onClick={onItemClick}
                                                className="
                                                    group/dash
                                                    inline-flex items-center gap-2 mt-4
                                                    text-[12px] font-medium uppercase tracking-[0.14em]
                                                    text-[#000000] underline-offset-4
                                                    hover:underline
                                                    transition-colors duration-200
                                                "
                                            >
                                                Open {user.role === "admin" ? "Admin" : "Seller"}{" "}
                                                Dashboard
                                                <HugeiconsIcon
                                                    icon={ArrowRight01Icon}
                                                    size={14}
                                                    className="-translate-x-1 group-hover/dash:translate-x-0 transition-transform duration-300"
                                                />
                                            </Link>
                                        ) : (
                                            <Link
                                                to="/apply-seller"
                                                onClick={onItemClick}
                                                className="
                                                    group/dash
                                                    inline-flex items-center gap-2 mt-4
                                                    text-[12px] font-medium uppercase tracking-[0.14em]
                                                    text-[#000000] underline-offset-4
                                                    hover:underline
                                                    transition-colors duration-200
                                                "
                                            >
                                                Become a Retailer
                                                <HugeiconsIcon
                                                    icon={ArrowRight01Icon}
                                                    size={14}
                                                    className="-translate-x-1 group-hover/dash:translate-x-0 transition-transform duration-300"
                                                />
                                            </Link>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <p className="text-[14px] text-[#222222] leading-relaxed max-w-xs">
                                            Sign in to track orders, save items, and check out
                                            faster.
                                        </p>
                                        <Link
                                            to="/login"
                                            onClick={onItemClick}
                                            className="
                                                inline-flex items-center justify-center
                                                h-11 px-7
                                                bg-[#000000] text-white
                                                border border-[#000000]
                                                text-[11px] font-medium uppercase tracking-[0.14em]
                                                hover:bg-white hover:text-[#000000]
                                                transition-colors duration-300
                                                focus-visible:outline focus-visible:outline-1
                                                focus-visible:outline-offset-2 focus-visible:outline-[#000000]
                                            "
                                        >
                                            Sign In
                                        </Link>
                                        <p className="text-[12px] text-[#767676]">
                                            New here?{" "}
                                            <Link
                                                to="/register"
                                                onClick={onItemClick}
                                                className="text-[#000000] underline underline-offset-4 hover:no-underline"
                                            >
                                                Create an account
                                            </Link>
                                        </p>
                                    </div>
                                )}
                            </motion.div>

                            {/* Sections */}
                            <motion.div
                                variants={childVariants}
                                className="md:col-span-8 grid grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-8"
                            >
                                {navSections.map((section) => (
                                    <section key={section.title}>
                                        <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#767676] mb-4">
                                            {section.title}
                                        </h3>
                                        <ul className="space-y-2">
                                            {section.links.map((link) => (
                                                <li key={link.to}>
                                                    <Link
                                                        to={link.to}
                                                        onClick={onItemClick}
                                                        className="
                                                            group/link
                                                            flex items-center justify-between
                                                            py-1
                                                            text-[14px] text-[#222222] hover:text-[#000000]
                                                            transition-colors duration-200
                                                        "
                                                    >
                                                        <span>{link.label}</span>
                                                        <HugeiconsIcon
                                                            icon={ArrowRight01Icon}
                                                            size={12}
                                                            className="text-[#9a9a9a] -translate-x-1 opacity-0 group-hover/link:translate-x-0 group-hover/link:opacity-100 transition-[transform,opacity] duration-300"
                                                        />
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </section>
                                ))}
                            </motion.div>
                        </div>

                        {user && (
                            <motion.div
                                variants={childVariants}
                                className="
                                    mt-10 pt-6 border-t border-[#E5E5E5]
                                    flex flex-wrap items-center gap-x-8 gap-y-3
                                "
                            >
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="
                                        group/out
                                        inline-flex items-center gap-2
                                        text-[12px] font-medium uppercase tracking-[0.14em]
                                        text-[#000000]
                                        underline-offset-4 hover:underline
                                        transition-colors duration-200
                                    "
                                >
                                    <HugeiconsIcon
                                        icon={Logout03Icon}
                                        size={14}
                                        className="text-[#767676] group-hover/out:text-[#000000] transition-colors duration-200"
                                    />
                                    Sign Out
                                </button>
                                <Link
                                    to="/about"
                                    onClick={onItemClick}
                                    className="text-[12px] font-medium uppercase tracking-[0.14em] text-[#000000] underline-offset-4 hover:underline transition-colors duration-200"
                                >
                                    Privacy
                                </Link>
                                <Link
                                    to="/help"
                                    onClick={onItemClick}
                                    className="text-[12px] font-medium uppercase tracking-[0.14em] text-[#000000] underline-offset-4 hover:underline transition-colors duration-200"
                                >
                                    Support
                                </Link>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ProfileMegaMenu;
