import { useNavigate } from 'react-router-dom';

interface CategoryBadgeProps {
    name: string;
    image: string;
}

const CategoryBadge = ({ name, image }: CategoryBadgeProps) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/category/${name}`)}
            className="flex flex-col md:flex-row items-center justify-center gap-1.5 md:gap-3 group cursor-pointer shrink-0 w-1/5 md:w-[14.28%] px-1 md:px-2 py-2 md:py-1.5 rounded-2xl md:rounded-full hover:bg-stone-900 transition-colors duration-300"
        >
            {/* Image Container */}
            <div className="w-[52px] h-[52px] md:w-[64px] md:h-[64px] rounded-full bg-[#f8f8f8] border border-transparent group-hover:bg-white/10 group-hover:border-white/10 transition-all duration-500 flex items-center justify-center shrink-0">
                <img
                    src={image}
                    alt={name}
                    className="w-6 h-6 md:w-8 md:h-8 object-contain opacity-80 group-hover:opacity-100 group-hover:scale-110 group-hover:brightness-0 group-hover:invert transition-all duration-500"
                />
            </div>

            {/* Name/Label */}
            <span className="text-[10px] md:text-[13px] font-medium text-stone-500 group-hover:text-white text-center md:text-left line-clamp-1 md:line-clamp-none w-full md:w-auto md:whitespace-nowrap leading-[1.1] md:leading-tight tracking-wide transition-colors duration-300">
                {name}
            </span>
        </div>
    );
};

export default CategoryBadge;