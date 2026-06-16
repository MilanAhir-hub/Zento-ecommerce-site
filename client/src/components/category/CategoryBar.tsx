import CategoryBadge from "./CategoryBadge";

export interface CategoryBarItem {
    name: string;
    image: string;
}

interface CategoryBarProps {
    title?: string;
    subtitle?: string;
    items: CategoryBarItem[];
    className?: string;
}

const CategoryBar = ({
    title = "Shop by Category",
    subtitle,
    items,
    className = "",
}: CategoryBarProps) => {
    if (!items || items.length === 0) {
        return null;
    }

    return (
        <section
            className={`
                w-full bg-white
                py-10 md:py-16
                ${className}
            `}
            aria-label={title}
        >
            <div className="max-w-[1440px] mx-auto px-4 md:px-10">
                {(title || subtitle) && (
                    <header className="mb-8 md:mb-10 text-center md:text-left">
                        <h2
                            className="
                                text-[20px] md:text-[24px]
                                font-medium uppercase
                                tracking-[0.12em]
                                text-[#000000]
                                leading-tight
                                text-balance
                            "
                        >
                            {title}
                        </h2>
                        {subtitle && (
                            <p
                                className="
                                    mt-2
                                    text-[14px] text-[#767676]
                                    max-w-xl
                                    leading-relaxed
                                    font-normal
                                "
                            >
                                {subtitle}
                            </p>
                        )}
                    </header>
                )}

                <ul
                    className="
                        grid
                        grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8
                        gap-2 md:gap-4
                    "
                >
                    {items.map((item) => (
                        <li key={item.name} className="min-w-0">
                            <CategoryBadge name={item.name} image={item.image} />
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default CategoryBar;
