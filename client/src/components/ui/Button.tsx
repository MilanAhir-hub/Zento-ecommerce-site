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
    // Apple-inspired minimalist design
    const baseStyles = "inline-flex items-center justify-center rounded-full font-medium tracking-normal transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 group";

    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600 shadow-sm",
        secondary: "bg-stone-100 text-stone-900 hover:bg-stone-200 focus-visible:ring-stone-200",
        outline: "bg-transparent text-stone-900 hover:bg-stone-50 border border-stone-200 focus-visible:ring-stone-300",
        ghost: "bg-transparent text-stone-900 hover:bg-stone-100 focus-visible:ring-stone-200"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-5 py-2.5 text-sm",
        lg: "px-6 py-3 text-base",
        icon: "p-2 aspect-square"
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