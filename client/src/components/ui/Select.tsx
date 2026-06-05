import { useState, useRef, useEffect, useId } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon, Tick02Icon } from "@hugeicons/core-free-icons";

interface Option {
    value: string;
    label: string;
}

interface SelectProps {
    value: string;
    onChange: (value: string) => void;
    options: string[] | Option[];
    placeholder?: string;
    label?: string;
    disabled?: boolean;
    className?: string;
    triggerClassName?: string;
    required?: boolean;
    name?: string;
}

const Select = ({
    value,
    onChange,
    options,
    placeholder = "Select an option",
    label,
    disabled = false,
    className = "",
    triggerClassName = "",
    required = false,
    name,
}: SelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const listboxId = useId();

    const normalizedOptions: Option[] = options.map((opt) =>
        typeof opt === "string" ? { value: opt, label: opt } : opt
    );

    const selectedOption = normalizedOptions.find((opt) => opt.value === value);
    const selectedIndex = normalizedOptions.findIndex((opt) => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    return (
        <div className={`w-full space-y-1.5 ${className}`} ref={containerRef}>
            {label && (
                <label className="block text-[11px] font-medium uppercase tracking-[0.1em] text-[#222222]">
                    {label}
                    {required && (
                        <span className="text-[#BC0000] ml-0.5" aria-hidden="true">
                            *
                        </span>
                    )}
                </label>
            )}

            {name && <input type="hidden" name={name} value={value} />}

            <div className="relative">
                <button
                    type="button"
                    disabled={disabled}
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                    aria-controls={listboxId}
                    onClick={() => !disabled && setIsOpen((prev) => !prev)}
                    className={[
                        "w-full h-11 px-4",
                        "bg-white",
                        "border",
                        isOpen ? "border-[#000000]" : "border-[#E5E5E5]",
                        "rounded-none",
                        "flex items-center justify-between text-left",
                        "transition-[border-color,background-color] duration-200",
                        disabled
                            ? "bg-[#F9F9F9] text-[#767676] cursor-not-allowed"
                            : "hover:border-[#000000] cursor-pointer",
                        "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#000000]",
                        triggerClassName,
                    ].join(" ")}
                >
                    <span
                        className={[
                            "text-[14px] font-normal tracking-[0.01em] truncate",
                            selectedOption ? "text-[#000000]" : "text-[#767676]",
                        ].join(" ")}
                    >
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <HugeiconsIcon
                        icon={ArrowDown01Icon}
                        size={16}
                        aria-hidden="true"
                        className={[
                            "text-[#767676] shrink-0",
                            "transition-transform duration-200",
                            isOpen ? "rotate-180" : "rotate-0",
                        ].join(" ")}
                    />
                </button>

                {isOpen && !disabled && (
                    <ul
                        id={listboxId}
                        role="listbox"
                        aria-activedescendant={
                            selectedIndex >= 0 ? `${listboxId}-opt-${selectedIndex}` : undefined
                        }
                        className={[
                            "absolute z-50 mt-1 w-full",
                            "bg-white",
                            "border border-[#E5E5E5]",
                            "rounded-none",
                            "max-h-[280px] overflow-y-auto",
                            "py-1",
                            "overscroll-contain",
                        ].join(" ")}
                    >
                        {normalizedOptions.length > 0 ? (
                            normalizedOptions.map((option, idx) => {
                                const isSelected = option.value === value;
                                return (
                                    <li
                                        key={option.value}
                                        id={`${listboxId}-opt-${idx}`}
                                        role="option"
                                        aria-selected={isSelected}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => handleSelect(option.value)}
                                            className={[
                                                "w-full px-4 py-2.5",
                                                "text-left text-[14px] font-normal",
                                                "flex items-center justify-between gap-3",
                                                "transition-colors duration-150",
                                                isSelected
                                                    ? "bg-[#000000] text-white"
                                                    : "text-[#222222] hover:bg-[#F9F9F9]",
                                                "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-[-1px] focus-visible:outline-[#000000]",
                                            ].join(" ")}
                                        >
                                            <span className="truncate">{option.label}</span>
                                            {isSelected && (
                                                <HugeiconsIcon
                                                    icon={Tick02Icon}
                                                    size={14}
                                                    aria-hidden="true"
                                                    className="text-white shrink-0"
                                                />
                                            )}
                                        </button>
                                    </li>
                                );
                            })
                        ) : (
                            <li className="px-4 py-3 text-[13px] text-[#767676] text-center italic">
                                No options available
                            </li>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Select;
