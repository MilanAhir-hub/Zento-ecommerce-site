import React, { type ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

export const getButtonStyles = (
    variant: ButtonProps['variant'] = 'primary',
    size: ButtonProps['size'] = 'md',
    className: string = ''
) => {
    // Rectangular design based on the premium minimalist theme (no rounded borders)
    const baseStyles = "inline-flex items-center rounded-full justify-center font-bold tracking-wide transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none active:scale-95 group";

    const variants = {
        primary: "bg-stone-900 text-white hover:bg-stone-800",
        secondary: "bg-stone-100 text-stone-900 hover:bg-stone-200",
        outline: "bg-transparent text-stone-900 hover:bg-stone-900 hover:text-white border-2 border-stone-900",
        ghost: "bg-transparent text-stone-900 hover:bg-stone-100"
    };

    const sizes = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-10 py-4 text-lg"
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