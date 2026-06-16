import { Link } from "react-router-dom";

interface LogoProps {
    to?: string;
    className?: string;
    variant?: "default" | "light";
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

const Logo = ({ to = "/", className = "", variant = "default", onClick }: LogoProps) => {
    const colorClass =
        variant === "light" ? "text-white" : "text-[#000000]";

    return (
        <Link
            to={to}
            aria-label="Novara — Home"
            onClick={onClick}
            className={`inline-flex items-baseline ${colorClass} ${className}`}
        >
            <span
                className="
                    font-sans text-[20px] font-medium uppercase
                    tracking-[0.28em] leading-none
                    select-none
                "
            >
                Novara
            </span>
        </Link>
    );
};

export default Logo;
