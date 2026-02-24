import { ShoppingCart, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import Searchbar from '../ui/Searchbar';
import Logo from '../ui/Logo';
import { useAuth } from '../../context/authContext';

const getInitials = (name?: string) => {
    if (!name) return '';
    const nameParts = name.trim().split(' ');
    if (nameParts.length >= 2) {
        return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return nameParts[0].substring(0, 2).toUpperCase();
};

const PublicNavbar = () => {
    const { user } = useAuth();

    console.log('user at the public nav: ', user);

    return (
        <header className="sticky top-0 z-50 w-full bg-white transition-all duration-300">
            {/* Top Row: Main Header */}
            <div className="bg-white border-b border-stone-100">
                <div className="w-full md:w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center py-2 md:py-3 md:h-[76px] gap-2 md:gap-8">

                        {/* Logo (Desktop Only) */}
                        <Link to="/" className="hidden md:flex shrink-0 items-center gap-2 cursor-pointer transition-transform hover:scale-105 duration-200">
                            <Logo />
                        </Link>

                        {/* Searchbar & Mobile User/Cart Controls */}
                        <div className="w-full md:flex-1 flex items-center gap-3 md:gap-0 mt-1 md:mt-0">
                            <div className="flex-1 w-full md:max-w-xl xl:max-w-2xl md:mx-auto">
                                <Searchbar />
                            </div>

                            {/* Mobile User/Cart Controls */}
                            <div className="md:hidden flex items-center gap-4 shrink-0">
                                <Link to="/cart" className="relative flex items-center text-stone-800 hover:text-black transition-colors cursor-pointer group">
                                    <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                    <span className="absolute -top-1.5 -right-1.5 inline-flex items-center justify-center min-w-[16px] h-[16px] px-1 text-[9px] font-bold leading-none text-white bg-stone-900 rounded-full">
                                        0
                                    </span>
                                </Link>

                                {user ? (
                                    <Link to="/user/home" className="flex items-center justify-center text-white bg-stone-900 rounded-full h-7 w-7 text-[11px] font-bold hover:bg-black transition-colors cursor-pointer group">
                                        {getInitials(user.name)}
                                    </Link>
                                ) : (
                                    <Link to="/login" className="flex items-center text-stone-800 hover:text-black transition-colors cursor-pointer group">
                                        <User className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Desktop User/Cart Controls */}
                        <div className="hidden md:flex items-center justify-end gap-8 shrink-0 min-w-[180px]">
                            <Link to="/cart" className="relative flex items-center text-stone-800 hover:text-black transition-colors cursor-pointer group">
                                <ShoppingCart className="h-[22px] w-[22px] group-hover:scale-110 transition-transform" />
                                <span className="absolute -top-2 -right-2 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold leading-none text-white bg-stone-900 rounded-full">
                                    0
                                </span>
                            </Link>

                            {user ? (
                                <Link to="/user/profile" className="flex items-center gap-2 text-stone-800 hover:text-black transition-colors cursor-pointer group">
                                    <div className="flex items-center justify-center bg-stone-900 text-white rounded-full h-[32px] w-[32px] text-xs font-bold group-hover:bg-black transition-colors">
                                        {getInitials(user.name)}
                                    </div>
                                </Link>
                            ) : (
                                <Link to="/login" className="flex items-center gap-2 text-stone-800 hover:text-black transition-colors cursor-pointer group">
                                    <User className="h-[22px] w-[22px] group-hover:scale-110 transition-transform" />
                                    <span className="text-sm font-semibold tracking-wide">Sign in</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default PublicNavbar;
