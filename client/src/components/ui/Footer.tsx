import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import Logo from "./Logo";

const Footer = () => {
    return (
        <footer className="bg-white border-t border-stone-200 pt-16 pb-8 font-sans">
            <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Info */}
                    <div className="space-y-6">
                        <Link to="/" className="inline-block">
                            <Logo />
                        </Link>
                        <p className="text-stone-500 leading-relaxed font-medium mt-4">
                            Your premium destination for the best tech, fashion, and lifestyle products. We deliver quality and trust.
                        </p>
                        <div className="flex space-x-4 pt-2">
                            <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-stone-100 text-stone-600 hover:bg-stone-900 hover:text-white transition-all duration-300">
                                <Facebook className="h-4 w-4" />
                            </a>
                            <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-stone-100 text-stone-600 hover:bg-stone-900 hover:text-white transition-all duration-300">
                                <Twitter className="h-4 w-4" />
                            </a>
                            <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-stone-100 text-stone-600 hover:bg-stone-900 hover:text-white transition-all duration-300">
                                <Instagram className="h-4 w-4" />
                            </a>
                            <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-stone-100 text-stone-600 hover:bg-stone-900 hover:text-white transition-all duration-300">
                                <Linkedin className="h-4 w-4" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold text-stone-900 mb-6 tracking-tight">Quick Links</h3>
                        <ul className="space-y-4">
                            <li>
                                <Link to="/about" className="text-stone-500 hover:text-stone-900 font-medium transition-colors">About Us</Link>
                            </li>
                            <li>
                                <Link to="/products" className="text-stone-500 hover:text-stone-900 font-medium transition-colors">Shop</Link>
                            </li>
                            <li>
                                <Link to="/faq" className="text-stone-500 hover:text-stone-900 font-medium transition-colors">FAQ</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-lg font-bold text-stone-900 mb-6 tracking-tight">Legal</h3>
                        <ul className="space-y-4">
                            <li>
                                <Link to="/privacy" className="text-stone-500 hover:text-stone-900 font-medium transition-colors">Privacy Policy</Link>
                            </li>
                            <li>
                                <Link to="/terms" className="text-stone-500 hover:text-stone-900 font-medium transition-colors">Terms of Service</Link>
                            </li>
                            <li>
                                <Link to="/refund" className="text-stone-500 hover:text-stone-900 font-medium transition-colors">Refund Policy</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-bold text-stone-900 mb-6 tracking-tight">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <MapPin className="h-5 w-5 text-stone-400 mt-0.5 mr-3 shrink-0" />
                                <span className="text-stone-500 font-medium">123 Commerce Avenue, New York, NY 10001</span>
                            </li>
                            <li className="flex items-center">
                                <Phone className="h-5 w-5 text-stone-400 mr-3 shrink-0" />
                                <span className="text-stone-500 font-medium">+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center">
                                <Mail className="h-5 w-5 text-stone-400 mr-3 shrink-0" />
                                <span className="text-stone-500 font-medium">support@zento.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-stone-200 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-stone-400 font-medium text-sm text-center md:text-left">
                        &copy; {new Date().getFullYear()} Zento Commerce. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="text-stone-400 font-medium text-sm">Secure Checkout</span>
                        {/* Placeholder for payment icons */}
                        <div className="flex gap-1">
                            <div className="h-6 w-10 bg-stone-100 rounded border border-stone-200"></div>
                            <div className="h-6 w-10 bg-stone-100 rounded border border-stone-200"></div>
                            <div className="h-6 w-10 bg-stone-100 rounded border border-stone-200"></div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;