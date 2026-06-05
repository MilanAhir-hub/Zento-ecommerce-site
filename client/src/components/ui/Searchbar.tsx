import { useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, Camera01Icon } from "@hugeicons/core-free-icons";
import { useNavigate } from "react-router-dom";
import { performVisualSearch } from "../../services/visualSearch.api";
import toast from "react-hot-toast";

const Searchbar = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [isVisualSearching, setIsVisualSearching] = useState(false);
    const [value, setValue] = useState("");

    const submit = (term: string) => {
        const trimmed = term.trim();
        if (!trimmed) return;
        navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") submit(value);
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

    return (
        <div
            className="
                group
                flex items-center w-full
                h-11 md:h-11
                bg-white
                border border-[#E5E5E5]
                rounded-none
                transition-[border-color,background-color] duration-200
                focus-within:border-[#000000]
            "
        >
            <label htmlFor="site-search" className="sr-only">
                Search products
            </label>

            <HugeiconsIcon
                icon={Search01Icon}
                size={18}
                aria-hidden="true"
                className="ml-3 md:ml-4 text-[#767676] shrink-0"
            />

            <input
                ref={inputRef}
                id="site-search"
                type="search"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search an item…"
                autoComplete="off"
                spellCheck={false}
                className="
                    flex-1 min-w-0
                    h-full
                    px-3
                    bg-transparent
                    border-0 outline-none
                    text-[13px] md:text-[14px]
                    text-[#000000]
                    placeholder:text-[#767676]
                "
            />

            <div aria-hidden="true" className="h-5 w-px bg-[#E5E5E5] mx-1" />

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
                    shrink-0
                    h-11 w-11
                    inline-flex items-center justify-center
                    text-[#767676] hover:text-[#000000]
                    transition-colors duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed
                    focus-visible:outline focus-visible:outline-1
                    focus-visible:outline-offset-[-1px] focus-visible:outline-[#000000]
                "
            >
                {isVisualSearching ? (
                    <span
                        aria-hidden="true"
                        className="block h-4 w-4 border border-[#E5E5E5] border-t-[#000000] rounded-full animate-spin"
                    />
                ) : (
                    <HugeiconsIcon icon={Camera01Icon} size={18} />
                )}
            </button>
        </div>
    );
};

export default Searchbar;
