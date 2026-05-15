import React, { useEffect, useRef, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Search01Icon, Cancel01Icon, Camera01Icon } from '@hugeicons/core-free-icons';
import { Link, useNavigate } from 'react-router-dom';
import { useDebounce } from '../../hooks/useDebounce';
import { useProducts } from '../../hooks/products/useProducts';
import { useAuth } from '../../context/authContext';
import { addSearchHistory, syncSearchHistory, removeSearchHistory } from '../../services/searchHistory.api';
import { performVisualSearch } from '../../services/visualSearch.api';
import toast from 'react-hot-toast';

interface SearchMenuProps {
    isVisible: boolean;
    onClose: () => void;
}

const SearchMenu: React.FC<SearchMenuProps> = ({ isVisible, onClose }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [searchHistory, setSearchHistory] = useState<string[]>([]);
    const [isVisualSearching, setIsVisualSearching] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { user, isAuthenticated } = useAuth();

    // Debounce search term to avoid excessive API calls
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    // Fetch products based on debounced search term
    const { data: searchResults, isLoading: isSearching } = useProducts({
        keyword: debouncedSearchTerm,
        limit: 6
    });

    const getStorageKey = () => isAuthenticated && user?._id ? `searchHistory_${user._id}` : 'searchHistory';

    useEffect(() => {
        if (!isVisible) {
            document.body.style.overflow = 'unset';
            setSearchTerm(""); // Clear search term when closing
            return;
        }

        // Lock body scroll
        document.body.style.overflow = 'hidden';

        // Focus input
        setTimeout(() => {
            inputRef.current?.focus();
        }, 300);

        const loadHistory = async () => {
            const key = getStorageKey();
            const savedHistory = localStorage.getItem(key);
            let localArray: string[] = [];

            if (savedHistory) {
                try {
                    localArray = JSON.parse(savedHistory);
                    setSearchHistory(localArray); // Fast UI
                } catch (e) {
                    console.error("Parse error", e);
                }
            }

            if (isAuthenticated) {
                try {
                    const synced = await syncSearchHistory(localArray);
                    setSearchHistory(synced);
                    localStorage.setItem(key, JSON.stringify(synced));
                } catch (e) {
                    console.error("Failed to sync search history", e);
                }
            }
        };

        loadHistory();

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isVisible, isAuthenticated, user?._id]);

    const saveToHistory = async (term: string) => {
        const trimmedTerm = term.trim();
        if (!trimmedTerm) return;

        const newHistory = [
            trimmedTerm,
            ...searchHistory.filter(item => item.toLowerCase() !== trimmedTerm.toLowerCase())
        ].slice(0, 5); // Keep last 5 searches

        setSearchHistory(newHistory);
        const key = getStorageKey();
        localStorage.setItem(key, JSON.stringify(newHistory));

        if (isAuthenticated) {
            addSearchHistory(trimmedTerm).catch(err => console.error("History sync failed", err));
        }
    };

    const removeFromHistory = async (e: React.MouseEvent, term: string) => {
        e.preventDefault();
        e.stopPropagation();
        const newHistory = searchHistory.filter(item => item !== term);
        setSearchHistory(newHistory);
        const key = getStorageKey();
        localStorage.setItem(key, JSON.stringify(newHistory));

        if (isAuthenticated) {
            removeSearchHistory(term).catch(err => console.error("History removal failed", err));
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchTerm.trim()) {
            saveToHistory(searchTerm);
            navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
            onClose();
        }
    };

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
                onClose();
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
                fileInputRef.current.value = "";
            }
        }
    };

    const suggestions = [
        { name: 'Latest Arrivals', link: '/new-arrivals' },
        { name: 'Best Sellers', link: '/best-sellers' },
        { name: 'Exclusive Offers', link: '/offers' },
    ];

    const showLiveResults = searchTerm.trim().length > 0;

    return (
        <div
            className={`fixed inset-0 z-9999 bg-white transition-opacity duration-300 ease-in-out ${isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
        >
            {/* Clickable area to close - covers the whole background */}
            <div className="absolute inset-0 z-0" onClick={onClose} />

            {/* Content Container - Needs higher z-index than the close overlay */}
            <div
                className={`relative z-10 w-full max-w-[800px] mx-auto px-6 pt-24 transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
                    }`}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-8 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-black"
                >
                    <HugeiconsIcon icon={Cancel01Icon} size={24} />
                </button>

                {/* Search Input Area */}
                <div className="relative mb-12">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400">
                        <HugeiconsIcon icon={Search01Icon} size={28} />
                    </div>
                    <input
                        ref={inputRef}
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Search zento.com"
                        className="w-full bg-transparent border-none text-4xl md:text-5xl font-semibold text-gray-900 placeholder:text-gray-300 focus:outline-none pl-12 pb-4 border-b border-gray-200"
                    />

                    {/* Visual Search Trigger */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center pr-2">
                        <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <button
                            type="button"
                            onClick={handleVisualSearchClick}
                            disabled={isVisualSearching}
                            className="p-3 text-gray-400 hover:text-black transition-colors rounded-full hover:bg-gray-50 flex items-center justify-center"
                            title="Visual Search"
                        >
                            {isVisualSearching ? (
                                <div className="w-8 h-8 border-3 border-gray-100 border-t-gray-900 rounded-full animate-spin"></div>
                            ) : (
                                <HugeiconsIcon icon={Camera01Icon} size={32} />
                            )}
                        </button>
                    </div>
                </div>

                {/* Content Section */}
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                    {!showLiveResults ? (
                        /* Recent Searches & Suggestions */
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div>
                                <h3 className="text-[12px] font-semibold text-gray-400 uppercase tracking-widest mb-6">Recent Searches</h3>
                                {searchHistory.length > 0 ? (
                                    <div className="space-y-3">
                                        {searchHistory.map((item, idx) => (
                                            <div key={idx} className="flex items-center justify-between group/item">
                                                <Link
                                                    to={`/search?q=${encodeURIComponent(item)}`}
                                                    onClick={onClose}
                                                    className="text-lg text-gray-600 hover:text-black transition-colors"
                                                >
                                                    {item}
                                                </Link>
                                                <button
                                                    onClick={(e) => removeFromHistory(e, item)}
                                                    className="opacity-0 group-hover/item:opacity-100 p-1 hover:bg-gray-100 rounded-full transition-all text-gray-400 hover:text-red-500"
                                                >
                                                    <HugeiconsIcon icon={Cancel01Icon} size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400">No recent searches</p>
                                )}
                            </div>

                            <div>
                                <h3 className="text-[12px] font-semibold text-gray-400 uppercase tracking-widest mb-6">Suggestions</h3>
                                <div className="space-y-3">
                                    {suggestions.map((item, idx) => (
                                        <Link
                                            key={idx}
                                            to={item.link}
                                            onClick={onClose}
                                            className="block text-lg text-gray-600 hover:text-black transition-colors"
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Live Search Results */
                        <div>
                            <h3 className="text-[12px] font-semibold text-gray-400 uppercase tracking-widest mb-6">
                                {isSearching ? "Searching..." : "Products"}
                            </h3>

                            {isSearching ? (
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="h-6 bg-gray-100 animate-pulse rounded w-3/4"></div>
                                    ))}
                                </div>
                            ) : searchResults && searchResults.length > 0 ? (
                                <div className="space-y-4">
                                    {searchResults.map((product) => (
                                        <Link
                                            key={product._id}
                                            to={`/products/${product._id}`}
                                            onClick={() => {
                                                saveToHistory(product.title);
                                                onClose();
                                            }}
                                            className="block text-xl md:text-2xl text-gray-600 hover:text-black transition-colors font-medium"
                                        >
                                            {product.title}
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-8">
                                    <p className="text-xl text-gray-400">No matching products found.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchMenu;
