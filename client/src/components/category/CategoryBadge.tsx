import { useNavigate } from "react-router-dom";

interface CategoryBadgeProps {
    name: string;
    image: string;
    onClick?: () => void;
}

const CategoryBadge = ({ name, image, onClick }: CategoryBadgeProps) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else {
            navigate(`/category/${name}`);
        }
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            aria-label={`Shop ${name}`}
            className="
                group
                flex flex-col items-center justify-center
                gap-2 md:gap-3
                w-full
                py-3 px-2
                bg-transparent
                border border-transparent
                rounded-none
                transition-[background-color,border-color] duration-200
                hover:bg-[#F9F9F9] hover:border-[#E5E5E5]
                focus-visible:outline focus-visible:outline-1
                focus-visible:outline-offset-2 focus-visible:outline-[#000000]
            "
        >
            <span
                className="
                    w-14 h-14 md:w-16 md:h-16
                    inline-flex items-center justify-center
                    bg-white
                    border border-[#E5E5E5]
                    rounded-full
                    transition-[transform,border-color] duration-200
                    group-hover:border-[#000000]
                    group-hover:scale-[1.04]
                "
            >
                <img
                    src={image}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    width={32}
                    height={32}
                    className="
                        w-7 h-7 md:w-8 md:h-8
                        object-contain
                        opacity-80
                        transition-[opacity,transform,filter] duration-200
                        group-hover:opacity-100
                    "
                />
            </span>

            <span
                className="
                    text-[11px] md:text-[12px]
                    font-medium uppercase
                    tracking-[0.1em]
                    text-[#222222] group-hover:text-[#000000]
                    text-center
                    leading-tight
                    line-clamp-1
                    transition-colors duration-200
                "
            >
                {name}
            </span>
        </button>
    );
};

export default CategoryBadge;
