import React from "react";
import { Link } from "react-router-dom";
import { Heart, Sparkles } from "lucide-react";
import Button, { getButtonStyles } from "./Button";

export interface Product {
    _id: string;
    title: string;
    description: string;
    price: number;
    oldPrice?: number;
    imageUrl: string;
    category: string;
    stock?: number;
}

export interface ProductCardProps {
    product: Product;

    // Action Handlers
    onAddToCart?: (productId: string) => void;
    isAddingToCart?: boolean;
    isAddedToCart?: boolean;

    onAddToWishlist?: (productId: string) => void;
    onAskAI?: (productId: string) => void;
}

export const ProductCard = ({
    product,
    onAddToCart,
    isAddingToCart = false,
    isAddedToCart = false,
    onAddToWishlist,
    onAskAI,
}: ProductCardProps) => {
    // Shared formatting
    const formattedPrice = product.price ? product.price.toLocaleString() : "0";

    return (
        <div className="group bg-white rounded-xl overflow-hidden border border-stone-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col h-full w-full">
            {/* Top Image Section */}
            <div className="relative aspect-[4/5] sm:aspect-[3/4] md:aspect-square bg-stone-100 overflow-hidden shrink-0 block">
                <Link to={`/products/${product._id}`} className="absolute inset-0 z-0 block">
                    <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 block"
                    />
                </Link>

                {/* Badge: Category */}
                <div className="absolute top-4 left-4 z-10 pointer-events-none">
                    <span className="bg-white/90 backdrop-blur-sm text-[10px] font-bold text-stone-900 px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                        {product.category}
                    </span>
                </div>

                {/* Floating Action Buttons */}
                <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover:translate-x-0">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (onAddToWishlist) onAddToWishlist(product._id);
                        }}
                        className="bg-white rounded-full shadow-md p-2 flex items-center justify-center hover:bg-red-50 hover:text-red-500 text-stone-400 transition-colors"
                    >
                        <Heart className="w-4 h-4 transition-colors" />
                    </button>

                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (onAskAI) onAskAI(product._id);
                        }}
                        className="bg-white rounded-full shadow-md p-2 flex items-center justify-center hover:bg-stone-50 hover:text-stone-500 text-stone-400 transition-colors"
                        title="Ask AI about this product"
                    >
                        <Sparkles className="w-4 h-4 transition-colors" />
                    </button>
                </div>
            </div>

            {/* Bottom Content Section */}
            <div className="p-4 md:p-5 flex flex-col flex-1 text-sm">
                <Link to={`/products/${product._id}`} className="block flex-1 group/link">
                    {/* Price */}
                    <div className="mb-1">
                        <span className="text-stone-900 text-[12px] md:text-[16px] font-bold">
                            ₹{formattedPrice}
                        </span>
                    </div>

                    <h3 className="font-bold text-stone-900 transition-colors line-clamp-2 group-hover/link:text-blue-700 text-[16px] my-1.5 leading-tight h-[2.5rem]">
                        {product.title}
                    </h3>

                    {/* Description text */}
                    <p className="text-stone-500 line-clamp-2 mt-1 mb-4 text-sm h-[2.5rem]">
                        {product.description || "Top-tier premium product curated specially for our featured section."}
                    </p>
                </Link>

                {/* Call To Actions */}
                <div className="mt-auto pt-2 grid grid-cols-2 gap-2 flex-none z-10 pointer-events-auto">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.stopPropagation();
                            e.preventDefault();
                            if (onAddToCart) onAddToCart(product._id);
                        }}
                        disabled={isAddingToCart}
                        className="w-full h-10 md:h-11"
                    >
                        {isAddedToCart ? 'Added' : isAddingToCart ? 'Adding...' : 'Add'}
                    </Button>
                    <Link
                        to={`/products/${product._id}`}
                        className={getButtonStyles('primary', 'sm', 'w-full h-10 md:h-11')}
                    >
                        Buy now
                    </Link>
                </div>
            </div>
        </div>
    );
};
