import { useState } from 'react';
import { ShoppingCart, User, Menu, X, ChevronRight, Home, LayoutGrid, Heart, Package, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import Searchbar from '../ui/Searchbar';

const PublicNavbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const navLinks = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Categories', path: '/categories', icon: LayoutGrid },
        { name: 'Wishlist', path: '/wishlist', icon: Heart },
        { name: 'My Orders', path: '/orders', icon: Package },
    ];

    return (
        <>
            <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-stone-200 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20 gap-4">

                        {/* Left Section: Hamburger (Mobile) + Logo */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={toggleMenu}
                                className="sm:hidden p-2 -ml-2 text-stone-600 hover:text-stone-900 transition-colors rounded-full hover:bg-stone-100 cursor-pointer"
                            >
                                <Menu className="h-6 w-6" />
                            </button>

                            <Link to="/" className="shrink-0 flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 duration-200">
                                <div className="w-10 h-10 bg-stone-900 rounded-xl flex justify-center items-center shadow-md">
                                    <span className="text-white font-bold text-xl tracking-wider">Z</span>
                                </div>
                                <span className="hidden sm:block font-bold text-2xl tracking-tight text-stone-900">Zento</span>
                            </Link>
                        </div>

                        {/* Center: Searchbar (Hidden on very small screens, or collapsed) */}
                        <div className="hidden md:flex flex-1 max-w-md">
                            <Searchbar />
                        </div>

                        {/* Right: Cart and Signin */}
                        <div className="flex items-center gap-2 sm:gap-5 shrink-0">
                            {/* Search (Mobile Only) */}
                            <button className="md:hidden p-2 text-stone-600 hover:text-stone-900 transition-colors rounded-full hover:bg-stone-100 cursor-pointer">
                                <Search className="h-6 w-6" />
                            </button>

                            {/* Cart Button */}
                            <Link to="/cart" className="relative p-2 text-stone-600 hover:text-stone-900 transition-colors rounded-full hover:bg-stone-100 duration-200 cursor-pointer">
                                <ShoppingCart className="h-6 w-6" />
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full shadow-sm">
                                    0
                                </span>
                            </Link>

                            <div className="hidden sm:block h-8 w-px bg-stone-200"></div>

                            {/* Signin Button */}
                            <Link to="/login" className="hidden sm:flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-md hover:shadow-lg active:scale-95 duration-200 cursor-pointer">
                                <User className="h-4 w-4" />
                                <span>Sign In</span>
                            </Link>

                            {/* User Icon (Mobile only when logged out) */}
                            <Link to="/login" className="sm:hidden p-2 text-stone-600 hover:text-stone-900 transition-colors rounded-full hover:bg-stone-100 cursor-pointer">
                                <User className="h-6 w-6" />
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Sidebar / Drawer */}
            <div
                className={`fixed inset-0 z-60 bg-black/50 transition-opacity duration-300 sm:hidden ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={toggleMenu}
            />

            <aside
                className={`fixed top-0 left-0 z-70 h-full w-[280px] bg-white shadow-2xl transition-transform duration-300 transform sm:hidden ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="flex flex-col h-full">
                    {/* Drawer Header */}
                    <div className="flex items-center justify-between p-5 border-b border-stone-100">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-stone-900 rounded-lg flex justify-center items-center shadow-md">
                                <span className="text-white font-bold text-lg tracking-wider">Z</span>
                            </div>
                            <span className="font-bold text-xl tracking-tight text-stone-900">Zento</span>
                        </div>
                        <button
                            onClick={toggleMenu}
                            className="p-2 text-stone-400 hover:text-stone-900 transition-colors rounded-full hover:bg-stone-50 cursor-pointer"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Drawer Content */}
                    <div className="flex-1 overflow-y-auto py-5 px-4 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={toggleMenu}
                                className="flex items-center justify-between p-3 rounded-xl hover:bg-stone-50 transition-colors group"
                            >
                                <div className="flex items-center gap-4">
                                    <link.icon className="h-5 w-5 text-stone-400 group-hover:text-stone-900 transition-colors" />
                                    <span className="text-sm font-medium text-stone-600 group-hover:text-stone-900">{link.name}</span>
                                </div>
                                <ChevronRight className="h-4 w-4 text-stone-300 group-hover:text-stone-400" />
                            </Link>
                        ))}
                    </div>

                    {/* Drawer Footer */}
                    <div className="p-5 border-t border-stone-100">
                        <Link
                            to="/login"
                            onClick={toggleMenu}
                            className="flex items-center justify-center gap-2 w-full bg-stone-900 text-white py-3 rounded-xl font-medium shadow-md active:scale-[0.98] transition-all"
                        >
                            <User className="h-5 w-5" />
                            <span>Sign In</span>
                        </Link>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default PublicNavbar;