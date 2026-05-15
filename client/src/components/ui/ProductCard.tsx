import { Link, useNavigate } from "react-router-dom";
import { getCloudinaryUrl } from "../../utils/cloudinaryImage";
import { useCart } from "../../hooks/cart/useCart";
import { useAuth } from "../../context/authContext";
import { useInteractionLogger } from "../../hooks/useInteractionLogger";
import { useWishlist } from "../../hooks/useWishlist";
import { HugeiconsIcon } from "@hugeicons/react";
import { FavouriteIcon } from "@hugeicons/core-free-icons";
import BlurImage from "./BlurImage";

export interface Product {
    _id: string;
    title: string;
    price: number;
    imageUrl: string;
}

export const ProductCard = ({ product }: { product: Product }) => {
    const { cart, addToCart, isAddingToCart } = useCart();
    const { isAuthenticated } = useAuth();
    const { log } = useInteractionLogger();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const navigate = useNavigate();

    const isProductInCart = cart?.items?.some(
        (item) => item.product._id === product._id
    );

    const handleProductClick = () => {
        log({
            productId: product._id,
            action: 'view',
            price: product.price
        });
    };

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation(); //without this when button click, parent will click automatically

        if (!isAuthenticated) {
            navigate("/auth/login");
            return;
        }

        // Log the interaction
        log({
            productId: product._id,
            action: 'add_to_cart',
            price: product.price,
            quantity: 1
        });

        await addToCart({ productId: product._id });
    };

    const handleWishlistToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            navigate("/auth/login");
            return;
        }

        await toggleWishlist(product._id);
    };

    return (
        <Link
            to={`/products/${product._id}`}
            onClick={handleProductClick}
            className="group block relative"
        >
            <div
                className="
                flex flex-col items-center text-center pb-6
                transition-all duration-300
                border-3 border-gray-200 rounded-4xl
                hover:border-gray-300
                ease-out
                overflow-hidden
                bg-white
                p-4
            "
            >
                {/* Image Container with Consistent Padding for Centering */}
                <div className="w-full aspect-square bg-[#fafafa] rounded-[28px] overflow-hidden p-6 flex items-center justify-center">
                    <BlurImage
                        src={getCloudinaryUrl(product.imageUrl, {
                            width: 600,
                            quality: "auto",
                            format: "auto",
                        })}
                        alt={product.title}
                        wrapperClassName="w-full h-full bg-transparent"
                        className="
                            object-contain
                            transition-transform duration-700 
                            ease-[cubic-bezier(0.22,1,0.36,1)]
                            group-hover:scale-105
                        "
                    />

                    {/* Wishlist Heart Button - Visible on Hover */}
                    <button
                        onClick={handleWishlistToggle}
                        className={`
                            absolute top-4 right-4 p-2.5 rounded-full 
                            bg-white/70 backdrop-blur-md shadow-sm
                            transition-all duration-300 transform
                            opacity-0 translate-y-2
                            group-hover:opacity-100 group-hover:translate-y-0
                            hover:bg-white hover:scale-110 active:scale-95
                            z-10
                        `}
                        aria-label={isInWishlist(product._id) ? "Remove from wishlist" : "Add to wishlist"}
                    >
                        <HugeiconsIcon
                            icon={FavouriteIcon}
                            size={18}
                            className={`transition-colors duration-300 ${isInWishlist(product._id) ? "text-[#ff2d55] fill-[#ff2d55]" : "text-gray-400 group-hover:text-gray-600"
                                }`}
                        />
                    </button>
                </div>
                {/* Title and Price Container (Fixed height for alignment) */}
                <div className="mt-5 w-full flex flex-col items-center justify-start h-[75px] px-2">
                    <h3 className="
                        text-[15px] font-medium text-neutral-900
                        line-clamp-2 leading-snug
                        transition-colors duration-300
                        group-hover:text-neutral-700
                    ">
                        {product.title}
                    </h3>

                    <p className="
                        mt-1.5 text-[15px] text-neutral-600
                        transition-colors duration-300
                    ">
                        ₹{product.price.toLocaleString("en-IN")}
                    </p>
                </div>

                {/* CTA */}
                <button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className="
                        mt-6 w-full bg-[#0071e3] text-white text-[14px] font-semibold
                        py-3 px-6 rounded-full
                        transition-all duration-300
                        hover:bg-[#005bb5] hover:shadow-lg hover:shadow-[#0071e3]/20
                        active:scale-[0.98]
                        disabled:opacity-50
                        cursor-pointer
                    "
                >
                    {isProductInCart ? "Added" : isAddingToCart ? "Adding..." : "Add to Bag"}
                </button>

            </div>
        </Link>
    );
};