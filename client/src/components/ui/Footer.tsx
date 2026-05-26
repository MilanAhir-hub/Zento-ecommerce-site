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

                </div>
            </div>
        </footer>
    );
};

export default Footer;