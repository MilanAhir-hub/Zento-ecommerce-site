import { useState, useRef, useEffect } from 'react';
import { ShoppingCart, User, ChevronRight, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Searchbar from '../ui/Searchbar';
import CategoryBadge from '../category/CategoryBadge';
import { categories } from '../../constants/categories';
import Logo from '../ui/Logo';

const PublicNavbar = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const handleCategoriesScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 2);
        }
    };

    const scrollCategories = (dir: 'left' | 'right') => {
        if (scrollRef.current) {
            const offset = dir === 'left' ? -300 : 300;
            scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        handleCategoriesScroll();
        window.addEventListener('resize', handleCategoriesScroll);
        return () => window.removeEventListener('resize', handleCategoriesScroll);
    }, []);

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

                                <Link to="/login" className="flex items-center text-stone-800 hover:text-black transition-colors cursor-pointer group">
                                    <User className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                </Link>
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

                            <Link to="/login" className="flex items-center gap-2 text-stone-800 hover:text-black transition-colors cursor-pointer group">
                                <User className="h-[22px] w-[22px] group-hover:scale-110 transition-transform" />
                                <span className="text-sm font-semibold tracking-wide">Sign in</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Categories Bar */}
            <div className="w-full bg-white border-b border-stone-200">
                <div className="w-full md:w-[80%] mx-auto px-4 sm:px-6 lg:px-8 relative flex items-center py-4">
                    <div className={`absolute left-0 top-0 bottom-0 w-12 bg-linear-to-r from-white via-white to-transparent z-10 hidden md:flex items-center justify-start pl-2 transition-opacity duration-300 ${!canScrollLeft ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
                        <button
                            onClick={() => scrollCategories('left')}
                            disabled={!canScrollLeft}
                            className="p-1 bg-white border border-stone-200 hover:bg-stone-50 rounded-full cursor-pointer transition-all shadow-sm disabled:cursor-default"
                        >
                            <ChevronLeft className="h-4 w-4 text-stone-800" />
                        </button>
                    </div>

                    <div
                        ref={scrollRef}
                        onScroll={handleCategoriesScroll}
                        className="flex items-start overflow-x-auto scroll-smooth whitespace-nowrap [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-full pb-1"
                    >
                        {categories.map(cat => (
                            <CategoryBadge
                                key={cat.id}
                                name={cat.name}
                                image={cat.image}
                            />
                        ))}
                    </div>

                    <div className={`absolute right-0 top-0 bottom-0 w-12 bg-linear-to-l from-white via-white to-transparent z-10 hidden md:flex items-center justify-end pr-2 transition-opacity duration-300 ${!canScrollRight ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
                        <button
                            onClick={() => scrollCategories('right')}
                            disabled={!canScrollRight}
                            className="p-1 bg-white border border-stone-200 hover:bg-stone-50 rounded-full cursor-pointer transition-all shadow-sm disabled:cursor-default"
                        >
                            <ChevronRight className="h-4 w-4 text-stone-800" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default PublicNavbar;
