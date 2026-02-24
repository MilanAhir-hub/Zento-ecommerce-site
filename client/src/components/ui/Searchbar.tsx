import { Search, Camera } from 'lucide-react';

const Searchbar = () => {
    return (
        <div className="flex items-center bg-[#f5f5f5] rounded-full h-9 md:h-11 w-full px-3 md:px-4 overflow-hidden border border-transparent focus-within:border-stone-300 focus-within:bg-white focus-within:shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all duration-300">
            <Search className="h-4 w-4 md:h-5 md:w-5 text-stone-500 shrink-0 mr-1.5 md:mr-2" />
            <input
                type="text"
                placeholder="Search an item..."
                className="w-full h-full outline-none placeholder-stone-500 text-stone-900 bg-transparent text-sm md:text-[15px]"
            />
            {/* Divider */}
            <div className="h-5 md:h-6 w-px bg-stone-300 mx-2 md:mx-3"></div>

            {/* Visual Search Button */}
            <button
                type="button"
                className="shrink-0 p-1 md:p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200 rounded-full transition-colors"
                title="Visual Search"
            >
                <Camera className="h-4 w-4 md:h-5 md:w-5" />
            </button>
        </div>
    );
};

export default Searchbar;