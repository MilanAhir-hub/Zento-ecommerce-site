import {
    useEffect,
    useRef,
    useState,
    useId,
    useCallback,
    type KeyboardEvent,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    Search01Icon,
    Cancel01Icon,
    Camera01Icon,
    ArrowRight01Icon,
    ArrowTurnBackwardIcon,
} from "@hugeicons/core-free-icons";
import { Link, useNavigate } from "react-router-dom";
import { useDebounce } from "../../hooks/useDebounce";
import { useProducts, type Product } from "../../hooks/products/useProducts";
import { useAuth } from "../../context/authContext";
import { useInteractionLogger } from "../../hooks/useInteractionLogger";
import {
    addSearchHistory,
    syncSearchHistory,
    removeSearchHistory,
} from "../../services/searchHistory.api";
import { performVisualSearch } from "../../services/visualSearch.api";
import toast from "react-hot-toast";

interface SearchMenuProps {
    isVisible: boolean;
    onClose: () => void;
}

const EASE = [0.22, 1, 0.36, 1] as const;

const QUICK_LINKS = [
    { name: "New Arrivals", link: "/new-arrivals" },
    { name: "Best Sellers", link: "/best-sellers" },
    { name: "The Edit", link: "/edit" },
    { name: "Sale", link: "/sale", isSale: true },
];

const SearchMenu = ({ isVisible, onClose }: SearchMenuProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const inputId = useId();
    const navigate = useNavigate();
    const prefersReduced = useReducedMotion();
    const { log } = useInteractionLogger();

    const [searchTerm, setSearchTerm] = useState("");
    const [searchHistory, setSearchHistory] = useState<string[]>([]);
    const [isVisualSearching, setIsVisualSearching] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(0);
    const { user, isAuthenticated } = useAuth();

    const debouncedSearchTerm = useDebounce(searchTerm, 250);
    const showLiveResults = debouncedSearchTerm.trim().length > 0;
    const trimmedTerm = searchTerm.trim();

    const { data: searchResults, isFetching: isSearching } = useProducts({
        keyword: debouncedSearchTerm,
        limit: 6,
    });

    const getStorageKey = useCallback(
        () =>
            isAuthenticated && user?._id ? `searchHistory_${user._id}` : "searchHistory",
        [isAuthenticated, user?._id]
    );

    // Reset on close
    useEffect(() => {
        if (!isVisible) {
            setSearchTerm("");
            setFocusedIndex(0);
        }
    }, [isVisible]);

    // Focus + load history on open
    useEffect(() => {
        if (!isVisible) return;

        const focusTimeout = setTimeout(() => {
            inputRef.current?.focus();
        }, 120);

        const loadHistory = async () => {
            const key = getStorageKey();
            const savedHistory = localStorage.getItem(key);
            let localArray: string[] = [];

            if (savedHistory) {
                try {
                    localArray = JSON.parse(savedHistory);
                    setSearchHistory(localArray);
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
        return () => clearTimeout(focusTimeout);
    }, [isVisible, isAuthenticated, getStorageKey]);

    const saveToHistory = useCallback(
        async (term: string) => {
            const trimmedTerm = term.trim();
            if (!trimmedTerm) return;

            const newHistory = [
                trimmedTerm,
                ...searchHistory.filter(
                    (item) => item.toLowerCase() !== trimmedTerm.toLowerCase()
                ),
            ].slice(0, 5);

            setSearchHistory(newHistory);
            const key = getStorageKey();
            localStorage.setItem(key, JSON.stringify(newHistory));

            if (isAuthenticated) {
                addSearchHistory(trimmedTerm).catch((err) =>
                    console.error("History sync failed", err)
                );
            }
        },
        [searchHistory, isAuthenticated, getStorageKey]
    );

    const removeFromHistory = async (e: React.MouseEvent, term: string) => {
        e.preventDefault();
        e.stopPropagation();
        const newHistory = searchHistory.filter((item) => item !== term);
        setSearchHistory(newHistory);
        const key = getStorageKey();
        localStorage.setItem(key, JSON.stringify(newHistory));

        if (isAuthenticated) {
            removeSearchHistory(term).catch((err) =>
                console.error("History removal failed", err)
            );
        }
    };

    const handleSubmit = (term: string) => {
        const t = term.trim();
        if (!t) return;
        log({ action: 'search_query', metadata: { searchQuery: t } });
        saveToHistory(t);
        navigate(`/search?q=${encodeURIComponent(t)}`);
        onClose();
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Escape") {
            e.preventDefault();
            onClose();
            return;
        }

        // Build a flat list of the currently visible selectable items
        const items: Array<{ kind: "history" | "result"; value: string }> = [];
        if (!showLiveResults) {
            searchHistory.forEach((t) => items.push({ kind: "history", value: t }));
        } else if (searchResults && searchResults.length > 0) {
            searchResults.forEach((p) =>
                items.push({ kind: "result", value: p._id })
            );
        }
        if (items.length === 0) {
            if (e.key === "Enter" && trimmedTerm) handleSubmit(trimmedTerm);
            return;
        }

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setFocusedIndex((i) => (i + 1) % items.length);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setFocusedIndex((i) => (i - 1 + items.length) % items.length);
        } else if (e.key === "Enter") {
            e.preventDefault();
            const item = items[focusedIndex];
            if (!item) return;
            if (item.kind === "history") handleSubmit(item.value);
            else {
                const product = searchResults?.find((p) => p._id === item.value);
                if (product) {
                    saveToHistory(product.title);
                    navigate(`/products/${product._id}`);
                    onClose();
                }
            }
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
                navigate("/products", {
                    state: {
                        visualSearchData: response.products,
                        visualDescription: response.description,
                    },
                });
            } else {
                toast.error(response.message || "Failed to find matching products.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Visual Search failed. Check console for details.");
        } finally {
            setIsVisualSearching(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    // -- Motion variants -------------------------------------------------------
    const panelVariants = {
        hidden: {
            opacity: 0,
            y: prefersReduced ? 0 : -8,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: prefersReduced ? 0 : 0.45,
                ease: EASE,
                when: "beforeChildren",
                staggerChildren: prefersReduced ? 0 : 0.04,
                delayChildren: prefersReduced ? 0 : 0.1,
            },
        },
        exit: {
            opacity: 0,
            y: prefersReduced ? 0 : -6,
            transition: { duration: prefersReduced ? 0 : 0.2, ease: EASE },
        },
    };

    const childVariants = {
        hidden: { opacity: 0, y: prefersReduced ? 0 : 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: prefersReduced ? 0 : 0.5, ease: EASE },
        },
    };

    const renderPrice = (p: Product) => (
        <span className="flex items-baseline gap-2">
            <span className="text-[14px] font-medium text-[#000000] tracking-[0.02em]">
                ₹{p.price.toLocaleString()}
            </span>
            {p.oldPrice && p.oldPrice > p.price && (
                <span className="text-[12px] text-[#767676] line-through">
                    ₹{p.oldPrice.toLocaleString()}
                </span>
            )}
        </span>
    );

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    key="search-panel"
                    variants={panelVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="
                        absolute left-0 right-0 top-full
                        w-full bg-white
                        border-b border-[#E5E5E5]
                        shadow-[0_24px_60px_-20px_rgba(0,0,0,0.18)]
                        z-40 overflow-hidden
                    "
                    role="dialog"
                    aria-modal="false"
                    aria-label="Search"
                >
                    <div className="max-w-[1440px] mx-auto px-4 md:px-10 pt-8 pb-12">
                        {/* Input row */}
                        <motion.div
                            variants={childVariants}
                            className="relative flex items-center gap-3 border-b border-[#E5E5E5] pb-4"
                        >
                            <HugeiconsIcon
                                icon={Search01Icon}
                                size={20}
                                aria-hidden="true"
                                className="text-[#767676] shrink-0"
                            />
                            <label htmlFor={inputId} className="sr-only">
                                Search products
                            </label>
                            <input
                                ref={inputRef}
                                id={inputId}
                                type="search"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setFocusedIndex(0);
                                }}
                                onKeyDown={handleKeyDown}
                                placeholder="Search products, brands, categories…"
                                autoComplete="off"
                                spellCheck={false}
                                className="
                                    flex-1 h-10 bg-transparent
                                    text-[18px] md:text-[22px]
                                    font-light tracking-[0.02em]
                                    text-[#000000] placeholder:text-[#9a9a9a]
                                    focus:outline-none
                                "
                            />
                            {trimmedTerm && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchTerm("");
                                        setFocusedIndex(0);
                                        inputRef.current?.focus();
                                    }}
                                    aria-label="Clear search"
                                    className="
                                        w-8 h-8 shrink-0
                                        inline-flex items-center justify-center
                                        text-[#767676] hover:text-[#000000]
                                        transition-colors duration-200
                                    "
                                >
                                    <HugeiconsIcon icon={Cancel01Icon} size={14} />
                                </button>
                            )}

                            {/* Visual search */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                accept="image/*"
                                className="sr-only"
                                onChange={handleFileChange}
                                tabIndex={-1}
                            />
                            <button
                                type="button"
                                onClick={handleVisualSearchClick}
                                disabled={isVisualSearching}
                                aria-label="Search by image"
                                title="Visual Search"
                                className="
                                    w-10 h-10 shrink-0
                                    inline-flex items-center justify-center
                                    text-[#767676] hover:text-[#000000]
                                    border border-[#E5E5E5]
                                    rounded-full
                                    transition-[color,border-color] duration-200
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                    focus-visible:outline focus-visible:outline-1
                                    focus-visible:outline-offset-2 focus-visible:outline-[#000000]
                                "
                            >
                                {isVisualSearching ? (
                                    <span
                                        aria-hidden="true"
                                        className="block h-4 w-4 border border-[#E5E5E5] border-t-[#000000] rounded-full animate-spin"
                                    />
                                ) : (
                                    <HugeiconsIcon icon={Camera01Icon} size={16} />
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={onClose}
                                aria-label="Close search"
                                className="
                                    w-10 h-10 shrink-0
                                    inline-flex items-center justify-center
                                    text-[#222222] hover:text-[#000000]
                                    transition-colors duration-200
                                    focus-visible:outline focus-visible:outline-1
                                    focus-visible:outline-offset-2 focus-visible:outline-[#000000]
                                "
                            >
                                <HugeiconsIcon icon={Cancel01Icon} size={20} />
                            </button>
                        </motion.div>

                        {/* Body */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mt-8">
                            {!showLiveResults ? (
                                <>
                                    <motion.section
                                        variants={childVariants}
                                        className="md:col-span-5"
                                        aria-labelledby="recent-searches-heading"
                                    >
                                        <h3
                                            id="recent-searches-heading"
                                            className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#767676] mb-4"
                                        >
                                            Recent
                                        </h3>
                                        {searchHistory.length > 0 ? (
                                            <ul className="space-y-1">
                                                {searchHistory.map((item, i) => (
                                                    <motion.li
                                                        key={item}
                                                        variants={childVariants}
                                                        className={`group/item flex items-center justify-between rounded-sm ${focusedIndex === i ? "bg-[#F7F7F7]" : ""}`}
                                                    >
                                                        <button
                                                            type="button"
                                                            onClick={() => handleSubmit(item)}
                                                            onMouseEnter={() => setFocusedIndex(i)}
                                                            className="
                                                                flex-1 min-w-0 text-left
                                                                flex items-center gap-3
                                                                py-2 px-2 -mx-2
                                                                text-[15px] font-medium text-[#222222] hover:text-[#000000]
                                                                transition-colors duration-200
                                                            "
                                                        >
                                                            <HugeiconsIcon
                                                                icon={ArrowTurnBackwardIcon}
                                                                size={14}
                                                                className="text-[#9a9a9a] rotate-180 shrink-0"
                                                            />
                                                            <span className="truncate">{item}</span>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => removeFromHistory(e, item)}
                                                            aria-label={`Remove ${item} from history`}
                                                            className="
                                                                w-8 h-8 shrink-0
                                                                inline-flex items-center justify-center
                                                                text-[#9a9a9a] hover:text-[#000000]
                                                                opacity-0 group-hover/item:opacity-100
                                                                transition-[opacity,color] duration-200
                                                            "
                                                        >
                                                            <HugeiconsIcon
                                                                icon={Cancel01Icon}
                                                                size={12}
                                                            />
                                                        </button>
                                                    </motion.li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-[13px] text-[#9a9a9a] italic">
                                                No recent searches
                                            </p>
                                        )}
                                    </motion.section>

                                    <motion.section
                                        variants={childVariants}
                                        className="md:col-span-7"
                                        aria-labelledby="suggestions-heading"
                                    >
                                        <h3
                                            id="suggestions-heading"
                                            className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#767676] mb-4"
                                        >
                                            Discover
                                        </h3>
                                        <ul className="grid grid-cols-2 md:grid-cols-2 gap-x-8 gap-y-2">
                                            {QUICK_LINKS.map((item) => (
                                                <motion.li
                                                    key={item.link}
                                                    variants={childVariants}
                                                >
                                                    <Link
                                                        to={item.link}
                                                        onClick={onClose}
                                                        className={`
                                                            group/link
                                                            flex items-center justify-between
                                                            py-1.5
                                                            text-[15px] font-medium 
                                                            ${item.isSale ? "text-[#BC0000] hover:text-[#a00000]" : "text-[#222222] hover:text-[#000000]"}
                                                            transition-colors duration-200
                                                        `}
                                                    >
                                                        <span>{item.name}</span>
                                                        <HugeiconsIcon
                                                            icon={ArrowRight01Icon}
                                                            size={14}
                                                            className="text-[#9a9a9a] -translate-x-1 opacity-0 group-hover/link:translate-x-0 group-hover/link:opacity-100 transition-[transform,opacity] duration-300"
                                                        />
                                                    </Link>
                                                </motion.li>
                                            ))}
                                        </ul>
                                    </motion.section>
                                </>
                            ) : (
                                <motion.section
                                    variants={childVariants}
                                    className="md:col-span-12"
                                    aria-labelledby="results-heading"
                                >
                                    <h3
                                        id="results-heading"
                                        className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#767676] mb-5"
                                    >
                                        {isSearching ? (
                                            "Searching…"
                                        ) : (
                                            <>
                                                {searchResults?.length ?? 0} result
                                                {searchResults?.length === 1 ? "" : "s"} for{" "}
                                                <span className="text-[#000000] normal-case tracking-normal font-medium">
                                                    “{trimmedTerm}”
                                                </span>
                                            </>
                                        )}
                                    </h3>

                                    {isSearching ? (
                                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3" aria-busy="true">
                                            {[1, 2, 3, 4].map((i) => (
                                                <li
                                                    key={i}
                                                    className="flex items-center gap-4 py-2"
                                                >
                                                    <span className="block h-16 w-16 bg-[#F7F7F7] animate-pulse rounded-sm" />
                                                    <div className="flex-1 space-y-2">
                                                        <span className="block h-3 w-3/4 bg-[#F7F7F7] animate-pulse" />
                                                        <span className="block h-3 w-1/4 bg-[#F7F7F7] animate-pulse" />
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : searchResults && searchResults.length > 0 ? (
                                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-1">
                                            {searchResults.map((product, i) => (
                                                <motion.li
                                                    key={product._id}
                                                    variants={childVariants}
                                                >
                                                    <Link
                                                        to={`/products/${product._id}`}
                                                        onClick={() => {
                                                            saveToHistory(product.title);
                                                            onClose();
                                                        }}
                                                        onMouseEnter={() => setFocusedIndex(i)}
                                                        className={`
                                                            group/result
                                                            flex items-center gap-4
                                                            py-3 px-2 -mx-2
                                                            border-b border-[#F0F0F0]
                                                            transition-colors duration-200
                                                            ${focusedIndex === i ? "bg-[#F7F7F7]" : "hover:bg-[#FAFAFA]"}
                                                        `}
                                                    >
                                                        <span className="block h-16 w-16 bg-[#F7F7F7] overflow-hidden rounded-sm shrink-0">
                                                            {product.imageUrl ? (
                                                                <img
                                                                    src={product.imageUrl}
                                                                    alt=""
                                                                    loading="lazy"
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            ) : null}
                                                        </span>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-[14px] font-medium text-[#222222] group-hover/result:text-[#000000] truncate">
                                                                {product.title}
                                                            </p>
                                                            <div className="mt-1">
                                                                {renderPrice(product)}
                                                            </div>
                                                        </div>
                                                        <HugeiconsIcon
                                                            icon={ArrowRight01Icon}
                                                            size={16}
                                                            className="text-[#9a9a9a] -translate-x-1 opacity-0 group-hover/result:translate-x-0 group-hover/result:opacity-100 transition-[transform,opacity] duration-300"
                                                        />
                                                    </Link>
                                                </motion.li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="py-6">
                                            <p className="text-[15px] text-[#222222]">
                                                No matches for{" "}
                                                <span className="font-medium">“{trimmedTerm}”</span>.
                                            </p>
                                            <p className="mt-1 text-[13px] text-[#767676]">
                                                Try a different word or browse our{" "}
                                                <Link
                                                    to="/new-arrivals"
                                                    onClick={onClose}
                                                    className="underline underline-offset-4 hover:text-[#000000]"
                                                >
                                                    new arrivals
                                                </Link>
                                                .
                                            </p>
                                        </div>
                                    )}
                                </motion.section>
                            )}
                        </div>

                        {/* Footer hint */}
                        <motion.div
                            variants={childVariants}
                            className="
                                mt-10 pt-4
                                flex flex-wrap items-center gap-x-6 gap-y-2
                                text-[11px] font-medium uppercase tracking-[0.12em] text-[#9a9a9a]
                            "
                        >
                            <span className="flex items-center gap-1.5">
                                <kbd className="px-1.5 py-0.5 border border-[#E5E5E5] rounded-sm text-[10px] text-[#222222]">
                                    ↑↓
                                </kbd>
                                Navigate
                            </span>
                            <span className="flex items-center gap-1.5">
                                <kbd className="px-1.5 py-0.5 border border-[#E5E5E5] rounded-sm text-[10px] text-[#222222]">
                                    ↵
                                </kbd>
                                Select
                            </span>
                            <span className="flex items-center gap-1.5">
                                <kbd className="px-1.5 py-0.5 border border-[#E5E5E5] rounded-sm text-[10px] text-[#222222]">
                                    Esc
                                </kbd>
                                Close
                            </span>
                            <span className="ml-auto inline-flex items-center gap-1.5 text-[#9a9a9a]">
                                <HugeiconsIcon icon={Camera01Icon} size={12} />
                                Try visual search
                            </span>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SearchMenu;
