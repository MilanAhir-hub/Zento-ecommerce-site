import { Search, Camera } from 'lucide-react';

const Searchbar = () => {
    return (
        <div className="flex items-center border-b gap-3 border-stone-200 h-[46px] overflow-hidden max-w-md w-full px-2 focus-within:border-stone-900 transition-colors">
            <Search className="h-5 w-5 text-stone-400 shrink-0" />
            <input
                type="text"
                placeholder="Find premium products..."
                className="w-full h-full outline-none placeholder-stone-400 text-stone-700 bg-transparent text-sm"
            />
            <div className="flex items-center gap-2 shrink-0">
                <button
                    type="button"
                    className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-all duration-200"
                    title="Search by image"
                >
                    <Camera className="h-5 w-5" />
                </button>
                <button
                    type="submit"
                    className="bg-stone-900 hover:bg-stone-800 px-5 h-8 rounded-full text-xs font-medium text-white transition-all transform active:scale-95 shadow-sm"
                >
                    Search
                </button>
            </div>
        </div>
    );
};

export default Searchbar;