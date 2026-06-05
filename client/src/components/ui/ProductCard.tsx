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
        (item) => item.product?._id === product._id
    );
    const inWishlist = isInWishlist(product._id);

    const handleProductClick = () => {
        log({
            productId: product._id,
            action: "view",
            price: product.price,
        });
    };

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            navigate("/auth/login");
            return;
        }

        log({
            productId: product._id,
            action: "add_to_cart",
            price: product.price,
            quantity: 1,
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

    const priceFormatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(product.price);

    return (
        <Link
            to={`/products/${product._id}`}
            onClick={handleProductClick}
            className="group block relative focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#000000]"
            aria-label={`${product.title}, ${priceFormatted}`}
        >
            {/* Image Container */}
            <div
                className="
<<<<<<< HEAD
                    relative w-full
                    bg-[#F9F9F9]
                    overflow-hidden
                "
            >
                <BlurImage
                    src={getCloudinaryUrl(product.imageUrl, {
                        width: 600,
                        quality: "auto",
                        format: "auto",
                    })}
                    alt={product.title}
                    width={600}
                    height={800}
                    aspectRatio="3/4"
                    wrapperClassName="aspect-[3/4]"
                    className="
                        object-cover
                        transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
                        group-hover:scale-[1.04]
                    "
                />

                {/* Wishlist Heart Button */}
                <button
                    type="button"
                    onClick={handleWishlistToggle}
                    aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                    aria-pressed={inWishlist}
                    className={`
                        absolute top-3 right-3
                        w-9 h-9
                        inline-flex items-center justify-center
                        bg-white border border-[#E5E5E5]
                        rounded-full
                        opacity-0 translate-y-1
                        group-hover:opacity-100 group-hover:translate-y-0
                        focus-visible:opacity-100 focus-visible:translate-y-0
                        transition-[opacity,transform,background-color] duration-200
                        hover:bg-[#000000] hover:border-[#000000]
                        active:scale-95
                    `}
                >
                    <HugeiconsIcon
                        icon={FavouriteIcon}
                        size={16}
                        aria-hidden="true"
                        className={
                            inWishlist
                                ? "text-[#BC0000] fill-[#BC0000]"
                                : "text-[#222222] group-hover:text-white"
                        }
                    />
                </button>
            </div>

            {/* Title & Price */}
            <div className="mt-4 px-1">
                <h3
                    className="
                        text-[14px] font-normal tracking-[0.02em]
                        text-[#000000]
                        leading-snug
                        line-clamp-2
                        underline-offset-4
                        group-hover:underline
                        transition-colors duration-200
=======
                flex flex-col items-center text-center pb-8
                transition-all duration-400
                border border-[#e5e5e5] rounded-[24px]
                hover:border-[#d2d2d7] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]
                ease-out
                overflow-hidden
                bg-white
                p-5
            "
                >
                    <div className="w-full aspect-square bg-[#f5f5f7] rounded-[20px] overflow-hidden p-5 flex items-center justify-center relative">
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

                        <button
                            onClick={handleWishlistToggle}
                            className={`
                            absolute top-3 right-3 p-2.5 rounded-full 
                            bg-white/90 backdrop-blur-md shadow-[0_2px_8px_rgba(0,0,0,0.08)]
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
                                className={`transition-colors duration-300 ${isInWishlist(product._id) ? "text-[#ff2d55] fill-[#ff2d55]" : "text-[#86868b] group-hover:text-[#1d1d1f]"
                                    }`}
                            />
                        </button>
                    </div>

                    <div className="mt-6 w-full flex flex-col items-center justify-start h-[72px] px-1">
                        <h3 className="
                        text-[15px] font-medium text-[#1d1d1f]
                        line-clamp-2 leading-[1.4]
                        transition-colors duration-300
                        group-hover:text-[#0071e3]
                    ">
                            {product.title}
                        </h3>

                        <p className="
                        mt-2 text-[16px] font-semibold text-[#1d1d1f]
                        transition-colors duration-300
                    ">
                            ₹{product.price.toLocaleString("en-IN")}
                        </p>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={isAddingToCart}
                        className="
                        mt-5 w-full bg-[#0071e3] text-white text-[14px] font-semibold
                        py-3 px-6 rounded-[980px]
                        transition-all duration-300
                        hover:bg-[#0077ed] hover:shadow-[0_4px_12px_rgba(0,113,227,0.3)]
                        active:scale-[0.98]
                        disabled:opacity-50
                        cursor-pointer
>>>>>>> origin/main
                    "
                    >
                        {product.title}
                </h3>

                <p
                    className="
                        mt-1.5
                        text-[14px] font-medium tabular-nums
                        text-[#222222]
                    "
                >
                    {priceFormatted}
                </p>
            </div>

            {/* Add to Bag */}
            <button
                type="button"
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="
                    mt-4 w-full h-11
                    inline-flex items-center justify-center
                    bg-[#000000] text-white
                    border border-[#000000]
                    rounded-none
                    text-[11px] font-medium uppercase tracking-[0.12em]
                    hover:bg-white hover:text-[#000000]
                    active:scale-[0.98]
                    disabled:opacity-40 disabled:cursor-not-allowed
                    transition-[background-color,color] duration-200
                    focus-visible:outline focus-visible:outline-1
                    focus-visible:outline-offset-2 focus-visible:outline-[#000000]
                "
            >
                {isProductInCart ? "Added to Bag" : isAddingToCart ? "Adding…" : "Add to Bag"}
            </button>
        </Link>
    );
};
