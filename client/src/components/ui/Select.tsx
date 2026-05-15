import React, { useState, useRef, useEffect } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowDown01Icon, Tick02Icon } from '@hugeicons/core-free-icons';

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
}

const Select: React.FC<SelectProps> = ({
    value,
    onChange,
    options,
    placeholder = "Select an option",
    label,
    disabled = false,
    className = "",
    triggerClassName = "",
    required = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Normalize options to { value, label } format
    const normalizedOptions: Option[] = options.map(opt =>
        typeof opt === 'string' ? { value: opt, label: opt } : opt
    );

    const selectedOption = normalizedOptions.find(opt => opt.value === value);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    return (
        <div className={`space-y-1.5 w-full ${className}`} ref={containerRef}>
            {label && (
                <label className="text-[13px] font-semibold text-[#1d1d1f] ml-1 flex items-center gap-1">
                    {label}
                    {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <div className="relative">
                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => setIsOpen(!isOpen)}
                    className={`
                        w-full bg-[#f5f5f7] px-4 py-3 rounded-xl flex items-center justify-between 
                        text-left transition-all duration-300 outline-none
                        ${isOpen ? 'ring-4 ring-[#0071e3]/5 bg-white border border-black/5 shadow-sm' : 'border border-transparent'}
                        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#e8e8ed] cursor-pointer'}
                        ${triggerClassName}
                    `}
                >
                    <span className={`text-sm font-medium ${!selectedOption ? 'text-[#86868b]' : 'text-[#1d1d1f]'}`}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <HugeiconsIcon
                        icon={ArrowDown01Icon}
                        size={18}
                        className={`text-[#86868b] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    />
                </button>

                {/* Dropdown Menu */}
                {isOpen && !disabled && (
                    <div
                        className="absolute z-50 w-full mt-2 bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-black/5 overflow-hidden animate-in fade-in zoom-in duration-200 origin-top"
                    >
                        <div className="max-h-[280px] overflow-y-auto py-1.5 custom-scrollbar">
                            {normalizedOptions.length > 0 ? (
                                normalizedOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => handleSelect(option.value)}
                                        className={`
                                            w-full px-4 py-2.5 text-left text-sm font-medium flex items-center justify-between
                                            transition-colors duration-200
                                            ${option.value === value
                                                ? 'bg-[#0071e3] text-white'
                                                : 'text-[#1d1d1f] hover:bg-[#f5f5f7]'}
                                        `}
                                    >
                                        <span>{option.label}</span>
                                        {option.value === value && (
                                            <HugeiconsIcon icon={Tick02Icon} size={16} className="text-white" />
                                        )}
                                    </button>
                                ))
                            ) : (
                                <div className="px-4 py-3 text-sm text-[#86868b] text-center italic">
                                    No options available
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Select;
