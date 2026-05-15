import { useState, useRef } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Search01Icon, ShoppingCart01Icon, User03Icon, Menu02Icon, Cancel01Icon, Logout03Icon } from '@hugeicons/core-free-icons';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { useCart } from '../../hooks/cart/useCart';
import { categories } from '../../constants/categories';
import logo from '../../assets/Logo/fashion_logo.png';
import NavMegaMenu from './NavMegaMenu';
import ProfileMegaMenu from './ProfileMegaMenu';
import SearchMenu from './SearchMenu';

const getInitials = (name?: string) => {
    if (!name) return '';
    const nameParts = name.trim().split(' ');
    if (nameParts.length >= 2) {
        return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return nameParts[0].substring(0, 2).toUpperCase();
};

const PublicNavbar = () => {
    const { user, logout } = useAuth();
    const { cart } = useCart();
    const [activeCategory, setActiveCategory] = useState<typeof categories[0] | null>(null);
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [isProfileVisible, setIsProfileVisible] = useState(false);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // --- CATEGORY HANDLERS ---
    const handleMouseEnter = (category: typeof categories[0]) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsProfileVisible(false); // Close profile if open
        setActiveCategory(category);
        setIsMenuVisible(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsMenuVisible(false);
            setIsProfileVisible(false);
        }, 300);
    };

    const handleMenuMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsMenuVisible(true);
    };

    // --- PROFILE HANDLERS ---
    const handleProfileMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsMenuVisible(false); // Close categories if open
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
    };

    const cartItemCount = cart?.items?.length || 0;

    return (
        <>
            <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white border-b border-gray-200/40">
                <div className="max-w-[1440px] mx-auto px-6">
                    <div className="flex items-center justify-between gap-8 h-[48px]">

                        {/* MOBILE MENU BUTTON (Hidden on PC) */}
                        <div className="md:hidden flex-1 flex items-center justify-start">
                            <button
                                onClick={() => setIsMobileMenuOpen(true)}
                                className="text-gray-700 hover:text-black transition"
                            >
                                <HugeiconsIcon icon={Menu02Icon} size={24} />
                            </button>
                        </div>

                        {/* LEFT/CENTER: Logo */}
                        <Link to="/" onClick={handleItemClick} className="flex items-center shrink-0 md:flex-initial absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
                            <img src={logo} alt="Logo" className="h-16 w-16 rounded-full object-cover" />
                        </Link>

                        {/* CENTER: Categories */}
                        <nav className="hidden text-fontGray md:flex items-center gap-12 text-[12px] font-normal tracking-tight h-full">
                            {categories.map((cat, index) => (
                                <div
                                    key={index}
                                    onMouseEnter={() => handleMouseEnter(cat)}
                                    onMouseLeave={handleMouseLeave}
                                    className="h-full flex items-center"
                                >
                                    <Link
                                        to={`/category/${cat.name.toLowerCase()}`}
                                        onClick={handleItemClick}
                                        className="hover:text-black transition duration-200 py-2 inline-block"
                                    >
                                        {cat.name}
                                    </Link>
                                </div>
                            ))}
                        </nav>

                        {/* RIGHT: Icons */}
                        <div className="flex items-center gap-6 flex-1 justify-end md:flex-initial">

                            {/* Search Icon */}
                            <button
                                onClick={() => setIsSearchVisible(true)}
                                className="text-gray-700 hover:text-black transition"
                            >
                                <HugeiconsIcon icon={Search01Icon} size={18} />
                            </button>

                            {/* Cart */}
                            <Link
                                to="/cart"
                                onClick={handleItemClick}
                                className="relative text-gray-700 hover:text-black transition"
                            >
                                <HugeiconsIcon icon={ShoppingCart01Icon} size={18} />
                                {cartItemCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 text-[8px] bg-black text-white rounded-full px-1 py-[0.1px] font-bold">
                                        {cartItemCount}
                                    </span>
                                )}
                            </Link>

                            {/* User */}
                            <div
                                onMouseEnter={handleProfileMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                className="h-full flex items-center"
                            >
                                {user ? (
                                    <div
                                        className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-900 text-white text-[9px] font-bold cursor-default"
                                    >
                                        {getInitials(user.name)}
                                    </div>
                                ) : (
                                    <div
                                        className="text-gray-700 hover:text-black transition cursor-default"
                                    >
                                        <HugeiconsIcon icon={User03Icon} size={18} />
                                    </div>
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
            </header>

            {/* Search Menu Overlay */}
            <SearchMenu
                isVisible={isSearchVisible}
                onClose={() => setIsSearchVisible(false)}
            />

            {/* Backdrop for the menu */}
            <div
                className={`fixed inset-0 top-[48px] z-40 bg-white/5 backdrop-blur-xl transition-all duration-500 ease-in-out ${(isMenuVisible || isProfileVisible) ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
            />

            {/* MOBILE SIDEBAR MENU */}
            <div
                className={`fixed inset-y-0 left-0 z-[60] w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <span className="text-lg font-semibold tracking-tight">Menu</span>
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-gray-500 hover:text-black transition"
                    >
                        <HugeiconsIcon icon={Cancel01Icon} size={24} />
                    </button>
                </div>
                <nav className="flex flex-col p-6 pb-24 gap-6 text-[14px] font-normal tracking-tight overflow-y-auto max-h-[calc(100vh-80px)]">
                    {categories.map((cat, index) => (
                        <Link
                            key={index}
                            to={`/category/${cat.name.toLowerCase()}`}
                            onClick={handleItemClick}
                            className="text-gray-700 hover:text-black transition duration-200"
                        >
                            {cat.name}
                        </Link>
                    ))}
                </nav>

                {/* LOGOUT BUTTON (Only for authenticated users) */}
                {user && (
                    <div className="absolute bottom-0 left-0 w-full p-6 border-t border-gray-100 bg-white">
                        <button
                            onClick={() => {
                                logout();
                                handleItemClick();
                            }}
                            className="flex items-center gap-3 text-red-500 hover:text-red-600 transition duration-200 text-[14px] font-medium w-full"
                        >
                            <HugeiconsIcon icon={Logout03Icon} size={20} />
                            Logout
                        </button>
                    </div>
                )}
            </div>

            {/* BACKDROP FOR MOBILE SIDEBAR */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-[55] bg-black/20 backdrop-blur-sm md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </>
    );
};

export default PublicNavbar;
