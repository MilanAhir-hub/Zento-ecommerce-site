import { Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    Facebook01Icon,
    NewTwitterIcon,
    InstagramIcon,
    Linkedin01Icon,
} from "@hugeicons/core-free-icons";
import Logo from "./Logo";

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-[#F0F0F0] text-[#222222] font-sans">
            <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-12 md:py-16">
                
                {/* Main Content Row */}
                <div className="flex flex-col md:flex-row md:justify-between items-start gap-12 md:gap-6">
                    
                    {/* Brand Description */}
                    <div className="space-y-4 max-w-sm">
                        <Logo />
                        <p className="text-[13px] text-[#767676] leading-relaxed">
                            Considered pieces for the modern wardrobe. Crafted in small batches, designed to last.
                        </p>
                        <div className="flex items-center gap-4 pt-1 text-[#767676]">
                            {[
                                { label: "Facebook", icon: Facebook01Icon, href: "https://facebook.com" },
                                { label: "Twitter", icon: NewTwitterIcon, href: "https://twitter.com" },
                                { label: "Instagram", icon: InstagramIcon, href: "https://instagram.com" },
                                { label: "LinkedIn", icon: Linkedin01Icon, href: "https://linkedin.com" },
                            ].map(({ label, icon, href }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    aria-label={label}
                                    className="text-[#767676] hover:text-[#000000] transition-colors duration-200"
                                >
                                    <HugeiconsIcon icon={icon} size={15} aria-hidden="true" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Newsletter & Navigation */}
                    <div className="w-full md:max-w-md space-y-8">
                        <div>
                            <h3 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#000000] mb-3">
                                Subscribe
                            </h3>
                            <p className="text-[13px] text-[#767676] mb-4 leading-relaxed">
                                Sign up to receive news about collections, events, and releases.
                            </p>
                            <form
                                onSubmit={(e) => e.preventDefault()}
                                className="flex border-b border-black w-full"
                                aria-label="Subscribe to newsletter"
                            >
                                <input
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                    placeholder="Your email address"
                                    className="flex-1 min-w-0 py-2 bg-transparent text-[13px] text-[#000000] placeholder:text-[#767676] focus:outline-none"
                                />
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#000000] hover:opacity-70 transition-opacity cursor-pointer"
                                >
                                    Submit
                                </button>
                            </form>
                        </div>
                    </div>

                </div>

                {/* Bottom Copyright & Main Links */}
                <div className="mt-12 md:mt-16 pt-8 border-t border-[#F0F0F0] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    
                    {/* Editorial Links */}
                    <nav className="flex flex-wrap items-center gap-x-8 gap-y-3" aria-label="Footer Navigation">
                        {[
                            { label: "Shop", to: "/products" },
                            { label: "About", to: "/about" },
                            { label: "Help", to: "/help" },
                            { label: "Privacy", to: "/privacy" },
                            { label: "Terms", to: "/terms" },
                        ].map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="text-[12px] font-medium tracking-[0.05em] text-[#767676] hover:text-[#000000] transition-colors duration-200"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <p className="text-[12px] text-[#767676] tracking-[0.02em]">
                        © {year} Zento. All rights reserved.
                    </p>
                    
                </div>

            </div>
        </footer>
    );
};

export default Footer;
