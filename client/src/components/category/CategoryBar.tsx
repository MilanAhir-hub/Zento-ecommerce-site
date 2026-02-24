import { useState, useRef, useEffect } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import CategoryBadge from './CategoryBadge';
import { categories } from '../../constants/categories';

const CategoryBar = () => {
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
    );
};

export default CategoryBar;
