import React, { useRef, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Search01Icon, Camera01Icon } from '@hugeicons/core-free-icons';
import { useNavigate } from 'react-router-dom';
import { performVisualSearch } from '../../services/visualSearch.api';
import toast from 'react-hot-toast';

const Searchbar = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isVisualSearching, setIsVisualSearching] = useState(false);

    const handleVisualSearchClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsVisualSearching(true);
            const response = await performVisualSearch(file);

            if (response.success) {
                // Navigate to products and pass the visual search results
                navigate('/products', {
                    state: {
                        visualSearchData: response.products,
                        visualDescription: response.description
                    }
                });
            } else {
                toast.error(response.message || "Failed to find matching products.");
            }
        } catch (error: any) {
            console.error(error);
            toast.error("Visual Search failed. Check console for details.");
        } finally {
            setIsVisualSearching(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = ""; // Reset file input
            }
        }
    };

    return (
        <div className="flex items-center bg-[#f5f5f5] rounded-full h-9 md:h-11 w-full px-3 md:px-4 overflow-hidden border border-transparent focus-within:border-stone-300 focus-within:bg-white focus-within:shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all duration-300">
            <HugeiconsIcon icon={Search01Icon} size={20} className="text-stone-500 shrink-0 mr-1.5 md:mr-2" />
            <input
                type="text"
                placeholder="Search an item..."
                className="w-full h-full outline-none placeholder-stone-500 text-stone-900 bg-transparent text-sm md:text-[15px]"
            />
            {/* Divider */}
            <div className="h-5 md:h-6 w-px bg-stone-300 mx-2 md:mx-3"></div>

            {/* Hidden file input for Visual Search */}
            <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />

            {/* Visual Search Button */}
            <button
                type="button"
                onClick={handleVisualSearchClick}
                disabled={isVisualSearching}
                className="shrink-0 p-1 md:p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200 rounded-full transition-colors flex items-center justify-center"
                title="Visual Search"
            >
                {isVisualSearching ? (
                    <div className="w-5 h-5 border-2 border-stone-300 border-t-stone-900 rounded-full animate-spin"></div>
                ) : (
                    <HugeiconsIcon icon={Camera01Icon} size={20} />
                )}
            </button>
        </div>
    );
};

export default Searchbar;