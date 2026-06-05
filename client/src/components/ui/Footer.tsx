import { Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    Facebook01Icon,
    NewTwitterIcon,
    InstagramIcon,
    Linkedin01Icon,
    Mail01Icon,
    CallIcon,
} from "@hugeicons/core-free-icons";
import Logo from "./Logo";

const footerLinks = {
    shop: [
        { label: "All Products", to: "/products" },
        { label: "New Arrivals", to: "/new-arrivals" },
        { label: "Best Sellers", to: "/best-sellers" },
        { label: "Sale", to: "/sale" },
    ],
    company: [
        { label: "About", to: "/about" },
        { label: "Stores", to: "/stores" },
        { label: "Careers", to: "/careers" },
        { label: "Press", to: "/press" },
    ],
    support: [
        { label: "Help Center", to: "/help" },
        { label: "FAQ", to: "/faq" },
        { label: "Shipping", to: "/shipping" },
        { label: "Returns", to: "/returns" },
    ],
    legal: [
        { label: "Privacy", to: "/privacy" },
        { label: "Terms", to: "/terms" },
        { label: "Refunds", to: "/refunds" },
        { label: "Accessibility", to: "/accessibility" },
    ],
};

const Footer = () => {
    const year = new Date().getFullYear();

    return (
<<<<<<< HEAD
        <footer className="bg-white border-t border-[#E5E5E5] text-[#222222]">
            <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-14 md:py-20">
                {/* TOP — Brand + Columns */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-8">
                    {/* BRAND */}
                    <div className="col-span-2 md:col-span-1 space-y-4">
                        <Logo />
                        <p className="text-[12px] text-[#767676] leading-relaxed max-w-xs">
                            Considered pieces for the modern wardrobe. Crafted in small batches,
                            designed to last.
                        </p>

                        {/* SOCIAL */}
                        <ul className="flex items-center gap-4 pt-2 text-[#767676]">
                            {[
                                { label: "Facebook", icon: Facebook01Icon, href: "https://facebook.com" },
                                { label: "Twitter", icon: NewTwitterIcon, href: "https://twitter.com" },
                                { label: "Instagram", icon: InstagramIcon, href: "https://instagram.com" },
                                { label: "LinkedIn", icon: Linkedin01Icon, href: "https://linkedin.com" },
                            ].map(({ label, icon, href }) => (
                                <li key={label}>
                                    <a
                                        href={href}
                                        target="_blank"
                                        rel="noreferrer noopener"
                                        aria-label={label}
                                        className="
                                            inline-flex items-center justify-center
                                            w-8 h-8
                                            text-[#767676] hover:text-[#000000]
                                            transition-colors duration-200
                                            focus-visible:outline focus-visible:outline-1
                                            focus-visible:outline-offset-2 focus-visible:outline-[#000000]
                                        "
                                    >
                                        <HugeiconsIcon icon={icon} size={16} aria-hidden="true" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {[
                        { heading: "Shop", items: footerLinks.shop },
                        { heading: "Company", items: footerLinks.company },
                        { heading: "Support", items: footerLinks.support },
                        { heading: "Legal", items: footerLinks.legal },
                    ].map((column) => (
                        <nav key={column.heading} aria-label={column.heading}>
                            <h3
                                className="
                                    text-[11px] font-medium uppercase tracking-[0.1em]
                                    text-[#000000] mb-4
                                "
                            >
                                {column.heading}
                            </h3>
                            <ul className="space-y-2.5">
                                {column.items.map((link) => (
                                    <li key={link.to}>
                                        <Link
                                            to={link.to}
                                            className="
                                                text-[13px] text-[#222222]
                                                hover:text-[#000000] hover:underline
                                                underline-offset-4
                                                transition-colors duration-200
                                            "
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    ))}
                </div>

                {/* NEWSLETTER */}
                <div className="mt-14 pt-10 border-t border-[#E5E5E5]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        <div>
                            <h3
                                className="
                                    text-[11px] font-medium uppercase tracking-[0.1em]
                                    text-[#000000] mb-2
                                "
                            >
                                Newsletter
                            </h3>
                            <p className="text-[13px] text-[#767676] max-w-md leading-relaxed">
                                Be the first to know about new collections, private sales, and
                                in-store events.
                            </p>
                        </div>

                        <form
                            onSubmit={(e) => e.preventDefault()}
                            className="flex w-full max-w-md md:justify-self-end"
                            aria-label="Subscribe to newsletter"
                        >
                            <label htmlFor="footer-newsletter" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="footer-newsletter"
                                type="email"
                                name="email"
                                autoComplete="email"
                                placeholder="Email address…"
                                className="
                                    flex-1 min-w-0 h-11 px-4
                                    bg-white border border-[#E5E5E5] border-r-0
                                    rounded-none
                                    text-[14px] text-[#000000] placeholder:text-[#767676]
                                    focus:outline-none focus:border-[#000000]
                                    transition-colors duration-200
                                "
                            />
                            <button
                                type="submit"
                                className="
                                    h-11 px-6
                                    bg-[#000000] text-white
                                    border border-[#000000]
                                    rounded-none
                                    text-[11px] font-medium uppercase tracking-[0.12em]
                                    hover:bg-white hover:text-[#000000]
                                    transition-colors duration-200
                                    focus-visible:outline focus-visible:outline-1
                                    focus-visible:outline-offset-2 focus-visible:outline-[#000000]
                                "
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                {/* BOTTOM */}
                <div
                    className="
                        mt-12 pt-6 border-t border-[#E5E5E5]
                        flex flex-col md:flex-row justify-between items-start md:items-center
                        gap-4
                    "
                >
                    <p className="text-[12px] text-[#767676]">
                        © {year} Zento. All rights reserved.
                    </p>

                    <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] text-[#767676]">
                        <li className="inline-flex items-center gap-2">
                            <HugeiconsIcon icon={Mail01Icon} size={12} aria-hidden="true" />
                            <a
                                href="mailto:support@zento.com"
                                className="hover:text-[#000000] transition-colors duration-200"
                            >
                                support@zento.com
                            </a>
                        </li>
                        <li className="inline-flex items-center gap-2">
                            <HugeiconsIcon icon={CallIcon} size={12} aria-hidden="true" />
                            <a
                                href="tel:+15551234567"
                                className="hover:text-[#000000] transition-colors duration-200"
                            >
                                +1&nbsp;555&nbsp;123&nbsp;4567
                            </a>
                        </li>
                        <li>USD&nbsp;·&nbsp;English</li>
                    </ul>
=======
        <footer className="bg-white border-t border-[#d2d2d7] py-16">

                        <div className="max-w-[1200px] mx-auto px-6 space-y-12">

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

                                <div className="space-y-5">
                                    <Logo />

                                    <p className="text-[14px] text-[#86868b] leading-[1.6] max-w-xs">
                                        Premium destination for tech, fashion and lifestyle essentials.
                                    </p>

                                    <div className="flex items-center gap-4 pt-1 text-[#86868b]">
                                        <HugeiconsIcon icon={Facebook01Icon} size={18} className="hover:text-[#0071e3] cursor-pointer transition-colors" />
                                        <HugeiconsIcon icon={NewTwitterIcon} size={18} className="hover:text-[#0071e3] cursor-pointer transition-colors" />
                                        <HugeiconsIcon icon={InstagramIcon} size={18} className="hover:text-[#0071e3] cursor-pointer transition-colors" />
                                        <HugeiconsIcon icon={Linkedin01Icon} size={18} className="hover:text-[#0071e3] cursor-pointer transition-colors" />
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-[13px] font-semibold text-[#1d1d1f] mb-5 uppercase tracking-[0.5px]">
                                        Shop
                                    </h3>
                                    <ul className="space-y-3 text-[14px] text-[#86868b]">
                                        <li><Link to="/products" className="hover:text-[#0071e3] transition-colors">All Products</Link></li>
                                        <li><Link to="/about" className="hover:text-[#0071e3] transition-colors">About</Link></li>
                                        <li><Link to="/faq" className="hover:text-[#0071e3] transition-colors">FAQ</Link></li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-[13px] font-semibold text-[#1d1d1f] mb-5 uppercase tracking-[0.5px]">
                                        Legal
                                    </h3>
                                    <ul className="space-y-3 text-[14px] text-[#86868b]">
                                        <li><Link to="/privacy" className="hover:text-[#0071e3] transition-colors">Privacy</Link></li>
                                        <li><Link to="/terms" className="hover:text-[#0071e3] transition-colors">Terms</Link></li>
                                        <li><Link to="/refund" className="hover:text-[#0071e3] transition-colors">Refunds</Link></li>
                                    </ul>
                                </div>

                                <div className="space-y-4 text-[14px] text-[#86868b]">
                                    <h3 className="text-[13px] font-semibold text-[#1d1d1f] mb-2 uppercase tracking-[0.5px]">
                                        Contact
                                    </h3>

                                    <div className="flex items-start gap-3">
                                        <HugeiconsIcon icon={Location01Icon} size={16} />
                                        <span>New York, USA</span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <HugeiconsIcon icon={CallIcon} size={16} />
                                        <span>+1 555 123 4567</span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <HugeiconsIcon icon={Mail01Icon} size={16} />
                                        <span>support@zento.com</span>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-[#d2d2d7] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[12px] text-[#86868b]">

                                <p>
                                    © {new Date().getFullYear()} Zento. All rights reserved.
                                </p>

                                <div className="flex items-center gap-4">
                                    <span className="text-[12px]">Secure checkout</span>
                                    <div className="flex gap-1.5">
                                        <div className="h-5 w-10 bg-[#f5f5f7] rounded-sm"></div>
                                        <div className="h-5 w-10 bg-[#f5f5f7] rounded-sm"></div>
                                        <div className="h-5 w-10 bg-[#f5f5f7] rounded-sm"></div>
                                    </div>
                                </div>

>>>>>>> origin/main
                            </div>
                        </div>
                    </footer>
                    );
};

                    export default Footer;
