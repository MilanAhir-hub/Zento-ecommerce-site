import { Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    Facebook01Icon,
    NewTwitterIcon,
    InstagramIcon,
    Linkedin01Icon,
    Mail01Icon,
    CallIcon,
    Location01Icon
} from "@hugeicons/core-free-icons";
import Logo from "./Logo";

const Footer = () => {
    return (
        <footer className="bg-white border-t border-[#e5e5e7] py-12">

            <div className="max-w-[1440px] mx-auto px-6 space-y-10">

                {/* TOP */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

                    {/* BRAND */}
                    <div className="space-y-4">
                        <Logo />

                        <p className="text-[13px] text-[#6e6e73] leading-relaxed max-w-xs">
                            Premium destination for tech, fashion and lifestyle essentials.
                        </p>

                        {/* SOCIAL */}
                        <div className="flex items-center gap-4 pt-2 text-[#86868b]">
                            <HugeiconsIcon icon={Facebook01Icon} size={16} className="hover:text-[#1d1d1f] cursor-pointer" />
                            <HugeiconsIcon icon={NewTwitterIcon} size={16} className="hover:text-[#1d1d1f] cursor-pointer" />
                            <HugeiconsIcon icon={InstagramIcon} size={16} className="hover:text-[#1d1d1f] cursor-pointer" />
                            <HugeiconsIcon icon={Linkedin01Icon} size={16} className="hover:text-[#1d1d1f] cursor-pointer" />
                        </div>
                    </div>

                    {/* LINKS */}
                    <div>
                        <h3 className="text-[13px] font-semibold text-[#1d1d1f] mb-4">
                            Shop
                        </h3>
                        <ul className="space-y-2 text-[13px] text-[#6e6e73]">
                            <li><Link to="/products" className="hover:text-[#1d1d1f]">All Products</Link></li>
                            <li><Link to="/about" className="hover:text-[#1d1d1f]">About</Link></li>
                            <li><Link to="/faq" className="hover:text-[#1d1d1f]">FAQ</Link></li>
                        </ul>
                    </div>

                    {/* LEGAL */}
                    <div>
                        <h3 className="text-[13px] font-semibold text-[#1d1d1f] mb-4">
                            Legal
                        </h3>
                        <ul className="space-y-2 text-[13px] text-[#6e6e73]">
                            <li><Link to="/privacy" className="hover:text-[#1d1d1f]">Privacy</Link></li>
                            <li><Link to="/terms" className="hover:text-[#1d1d1f]">Terms</Link></li>
                            <li><Link to="/refund" className="hover:text-[#1d1d1f]">Refunds</Link></li>
                        </ul>
                    </div>

                    {/* CONTACT */}
                    <div className="space-y-3 text-[13px] text-[#6e6e73]">
                        <h3 className="text-[13px] font-semibold text-[#1d1d1f] mb-2">
                            Contact
                        </h3>

                        <div className="flex items-start gap-2">
                            <HugeiconsIcon icon={Location01Icon} size={14} />
                            <span>New York, USA</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <HugeiconsIcon icon={CallIcon} size={14} />
                            <span>+1 555 123 4567</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <HugeiconsIcon icon={Mail01Icon} size={14} />
                            <span>support@zento.com</span>
                        </div>
                    </div>
                </div>

                {/* BOTTOM */}
                <div className="border-t border-[#f2f2f2] pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-[12px] text-[#86868b]">

                    <p>
                        © {new Date().getFullYear()} Zento
                    </p>

                    <div className="flex items-center gap-3">
                        <span>Secure checkout</span>
                        <div className="flex gap-1">
                            <div className="h-4 w-8 bg-[#f5f5f7] rounded-sm"></div>
                            <div className="h-4 w-8 bg-[#f5f5f7] rounded-sm"></div>
                            <div className="h-4 w-8 bg-[#f5f5f7] rounded-sm"></div>
                        </div>
                    </div>

                </div>
            </div>
        </footer>
    );
};

export default Footer;