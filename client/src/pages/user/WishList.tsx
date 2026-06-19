import { Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    FavouriteIcon,
    ShoppingBag01Icon,
    Delete01Icon,
    Loading03Icon
} from "@hugeicons/core-free-icons";
import { useWishlist } from "../../hooks/useWishlist";
import { useCart } from "../../hooks/cart/useCart";
import { useInteractionLogger } from "../../hooks/useInteractionLogger";
import BlurImage from "../../components/ui/BlurImage";

const WishList = () => {
    const { wishlist, isWishlistLoading, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();
    const { log } = useInteractionLogger();

    const items = wishlist?.items || [];

    // LOADING
    if (isWishlistLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
                <HugeiconsIcon icon={Loading03Icon} size={22} className="animate-spin text-[#86868b]" />
                <p className="text-[#86868b] text-[13px]">Loading…</p>
            </div>
        );
    }

    // EMPTY
    if (items.length === 0) {
        return (
            <section className="max-w-4xl mx-auto px-4 py-20 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#f5f5f7] flex items-center justify-center mb-4">
                    <HugeiconsIcon icon={FavouriteIcon} size={24} className="text-[#c7c7cc]" />
                </div>

                <h1 className="text-[22px] font-semibold text-[#1d1d1f] mb-2">
                    Your wishlist is empty
                </h1>

                <p className="text-[#6e6e73] text-[14px] mb-6">
                    Save items to view them later.
                </p>

                <Link
                    to="/products"
                    className="
                        inline-flex items-center justify-center gap-2
                        bg-black text-white
                        text-[11px] font-semibold uppercase
                        tracking-[0.18em] px-8 h-12
                        rounded-none border border-black
                        hover:bg-transparent hover:text-black
                        transition-colors duration-200
                    "
                >
                    <HugeiconsIcon icon={ShoppingBag01Icon} size={16} />
                    Browse Products
                </Link>
            </section>
        );
    }

    return (
        <section className="max-w-5xl mx-auto px-4 py-12 space-y-8">

            {/* HEADER */}
            <div className="flex items-center justify-between">
                <h1 className="text-[22px] font-semibold text-[#1d1d1f]">
                    Wishlist
                </h1>
                <span className="text-[13px] text-[#86868b]">
                    {items.length} items
                </span>
            </div>

            {/* LIST */}
            <div className="divide-y divide-[#f2f2f2]">

                {items.map((item) => (
                    <div
                        key={item._id}
                        className="flex items-center gap-4 py-5"
                    >
                        {/* IMAGE */}
                        <Link to={`/products/${item._id}`}>
                            <div className="w-20 h-20 bg-[#f5f5f7] rounded-xl overflow-hidden flex items-center justify-center shrink-0">
                                <BlurImage
                                    src={item.imageUrl}
                                    alt={item.title}
                                    wrapperClassName="w-full h-full"
                                />
                            </div>
                        </Link>

                        {/* DETAILS */}
                        <div className="flex-1 min-w-0">
                            <Link to={`/products/${item._id}`}>
                                <p className="text-[14px] font-medium text-[#1d1d1f] line-clamp-2">
                                    {item.title}
                                </p>
                            </Link>

                            <p className="text-[13px] text-[#1d1d1f] mt-1">
                                ₹{item.price.toLocaleString()}
                            </p>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex items-center gap-3">

                            <button
                                onClick={() => addToCart({ productId: item._id })}
                                className="text-[13px] text-[#0071e3] font-medium hover:underline"
                            >
                                Add
                            </button>

                            <button
                                onClick={() => {
                                    log({ productId: item._id, action: 'wishlist_remove' });
                                    removeFromWishlist(item._id);
                                }}
                                className="text-[#86868b] hover:text-[#d60000]"
                            >
                                <HugeiconsIcon icon={Delete01Icon} size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default WishList;