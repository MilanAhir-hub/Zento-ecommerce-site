import React from 'react';
import { Link } from 'react-router-dom';

interface NavMegaMenuProps {
    category: {
        id: number;
        name: string;
        subcategories: string[];
    } | null;
    isVisible: boolean;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onItemClick: () => void;
}

const NavMegaMenu: React.FC<NavMegaMenuProps> = ({
    category,
    isVisible,
    onMouseEnter,
    onMouseLeave,
    onItemClick
}) => {
    if (!category) return null;

    return (
        <div
            className={`absolute left-0 right-0 top-[48px] w-full bg-white border-b border-gray-200 transition-all duration-300 ease-in-out z-40 overflow-hidden ${isVisible ? 'max-h-[500px] opacity-100 py-12' : 'max-h-0 opacity-0 py-0'
                }`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div className="max-w-[1300px] mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="col-span-1">
                        <h3 className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-6">
                            Shop {category.name}
                        </h3>
                        <Link
                            to={`/category/${category.name.toLowerCase()}`}
                            onClick={onItemClick}
                            className="block text-2xl font-bold text-gray-900 hover:text-black transition-colors"
                        >
                            All {category.name}
                        </Link>
                    </div>

                    <div className="col-span-3">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-8">
                            {category.subcategories.map((sub, index) => (
                                <Link
                                    key={index}
                                    to={`/category/${category.name.toLowerCase()}/${sub.toLowerCase().replace(/\s+/g, '-')}`}
                                    onClick={onItemClick}
                                    className="text-sm text-gray-600 hover:text-black transition-colors py-1"
                                >
                                    {sub}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100 flex gap-12">
                    <div>
                        <h4 className="text-[11px] font-medium text-gray-400 uppercase mb-4 tracking-widest">Featured</h4>
                        <div className="flex gap-8">
                            <Link to="/new-arrivals" onClick={onItemClick} className="text-sm font-medium hover:underline text-gray-900">New Arrivals</Link>
                            <Link to="/best-sellers" onClick={onItemClick} className="text-sm font-medium hover:underline text-gray-900">Best Sellers</Link>
                            <Link to="/offers" onClick={onItemClick} className="text-sm font-medium hover:underline text-rose-600">Special Offers</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NavMegaMenu;
