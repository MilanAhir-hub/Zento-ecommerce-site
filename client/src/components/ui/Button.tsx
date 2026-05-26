import React, { type ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const getButtonStyles = (
    variant: ButtonProps['variant'] = 'primary',
    size: ButtonProps['size'] = 'md',
    className: string = ''
) => {
    const baseStyles = "inline-flex items-center justify-center rounded-[980px] font-medium tracking-normal transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 group";

    const variants = {
        primary: "bg-[#0071e3] text-white hover:bg-[#0077ed] focus-visible:ring-[#0071e3] shadow-sm",
        secondary: "bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e8e8ed] focus-visible:ring-[#d2d2d7]",
        outline: "bg-transparent text-[#1d1d1f] hover:bg-[#f5f5f7] border border-[#d2d2d7] focus-visible:ring-[#d2d2d7]",
        ghost: "bg-transparent text-[#1d1d1f] hover:bg-[#f5f5f7] focus-visible:ring-[#d2d2d7]"
    };

    const sizes = {
        sm: "px-4 py-2 text-[13px]",
        md: "px-5 py-2.5 text-[14px]",
        lg: "px-6 py-3 text-[15px]",
        icon: "p-2.5 aspect-square"
    };

    return `${baseStyles} ${variants[variant!]} ${sizes[size!]} ${className}`;
};

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    ...props
}) => {
    return (
        <button className={getButtonStyles(variant, size, className)} {...props}>
            {children}
        </button>
    );
};

export default Button;