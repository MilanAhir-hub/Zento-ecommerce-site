import { type ButtonHTMLAttributes, forwardRef } from "react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
}

const baseStyles = [
    "inline-flex items-center justify-center",
    "font-medium uppercase",
    "rounded-none",
    "select-none",
    "whitespace-nowrap",
    "transition-[background-color,color,border-color,opacity,transform]",
    "duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]",
    "disabled:opacity-40 disabled:cursor-not-allowed",
    "active:scale-[0.98]",
    "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#000000]",
].join(" ");

const variantStyles: Record<ButtonVariant, string> = {
    primary: [
        "bg-[#000000] text-white border border-[#000000]",
        "hover:bg-white hover:text-[#000000]",
    ].join(" "),
    secondary: [
        "bg-[#F9F9F9] text-[#222222] border border-transparent",
        "hover:bg-[#E5E5E5]",
    ].join(" "),
    outline: [
        "bg-transparent text-[#000000] border border-[#000000]",
        "hover:bg-[#000000] hover:text-white",
    ].join(" "),
    ghost: [
        "bg-transparent text-[#000000] border border-transparent",
        "hover:bg-[#F9F9F9]",
    ].join(" "),
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: "h-9 px-4 text-[11px] tracking-[0.1em]",
    md: "h-12 px-6 text-[12px] tracking-[0.12em]",
    lg: "h-[52px] px-8 text-[13px] tracking-[0.12em]",
    icon: "h-11 w-11 p-0 aspect-square",
};

// eslint-disable-next-line react-refresh/only-export-components
export const getButtonStyles = (
    variant: ButtonVariant = "primary",
    size: ButtonSize = "md",
    className: string = ""
) => {
    return [
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className,
    ]
        .filter(Boolean)
        .join(" ");
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            children,
            variant = "primary",
            size = "md",
            fullWidth = false,
            className = "",
            type = "button",
            ...props
        },
        ref
    ) => {
        const finalClassName = fullWidth
            ? `${getButtonStyles(variant, size, className)} w-full`
            : getButtonStyles(variant, size, className);

        return (
            <button
                ref={ref}
                type={type}
                className={finalClassName}
                {...props}
            >
                {children}
            </button>
        );
    }
);

Button.displayName = "Button";

export default Button;
