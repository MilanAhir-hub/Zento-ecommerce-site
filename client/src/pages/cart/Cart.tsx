import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/cart/useCart";
import { useAuth } from "../../context/authContext";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    MinusSignIcon,
    PlusSignIcon,
    Loading03Icon,
    Search01Icon
} from "@hugeicons/core-free-icons";
import Button from "../../components/ui/Button";
import BlurImage from "../../components/ui/BlurImage";
import { getCloudinaryUrl } from "../../utils/cloudinaryImage";
import type { CartItem } from "../../services/cart.api";

const Cart = () => {
    const { cart, isCartLoading, updateCartItem, removeFromCart } = useCart();
    const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
    const navigate = useNavigate();

    // Hooks must be called at the top level, before any early returns!
    const [searchItem, setSearchItem] = React.useState("");

    React.useEffect(() => {
        if (!isAuthLoading && !isAuthenticated) {
            navigate("/login", { state: { returnTo: "/cart" } });
        }
    }, [isAuthenticated, isAuthLoading, navigate]);

    if (isAuthLoading || isCartLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <HugeiconsIcon icon={Loading03Icon} size={22} className="animate-spin text-[#86868b]" />
            </div>
        );
    }

    const items: CartItem[] = cart?.items || [];

    // [STEP 2: Create your filtered items logic here]
    const filteredItems = items.filter(item =>
        item.product.title.toLowerCase().includes(searchItem.toLowerCase())
    );

    const subtotal = items.reduce((t, i) => t + i.product.price * i.quantity, 0);
    const shipping = subtotal > 50000 || subtotal === 0 ? 0 : 500;
    const total = subtotal + shipping;

    const handleQuantityChange = (id: string, qty: number, change: number) => {
        const newQty = qty + change;
        if (newQty < 1) return;
        updateCartItem({ productId: id, quantity: newQty });
    };

    // EMPTY
    if (items.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-[22px] font-semibold text-[#1d1d1f] mb-2">
                    Your bag is empty
                </h1>
                <p className="text-[14px] text-[#6e6e73] mb-6">
                    Add items to get started.
                </p>

                <Button
                    onClick={() => navigate("/products")}
                    className="px-5 py-2.5 rounded-full bg-[#0071e3]! text-white text-[13px]"
                >
                    Continue shopping
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-[900px] mx-auto px-4 py-10 space-y-10">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-[22px] font-semibold text-[#1d1d1f]">
                        Bag
                    </h1>
                    <p className="text-[13px] text-[#86868b] mt-1">
                        {items.length} items
                    </p>
                </div>

                <div className="relative w-full md:w-64">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <HugeiconsIcon icon={Search01Icon} size={16} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search in bag"
                        className="w-full bg-[#f5f5f7] border-none rounded-full py-2 pl-10 pr-4 text-[14px] text-[#1d1d1f] placeholder:text-[#86868b] focus:outline-none focus:ring-1 focus:ring-[#0071e3] transition-all"
                        value={searchItem}
                        onChange={(e) => setSearchItem(e.target.value)}
                    />
                </div>
            </div>

            {/* ITEMS */}
            <div className="divide-y divide-[#f2f2f2]">

                {filteredItems.map((item) => (
                    <div key={item.product._id} className="flex gap-4 py-6">

                        {/* IMAGE */}
                        <div className="w-20 h-20 bg-[#f5f5f7] rounded-xl overflow-hidden flex items-center justify-center shrink-0">
                            <BlurImage
                                src={getCloudinaryUrl(item.product.imageUrl || "", { width: 200 })}
                                alt={item.product.title}
                                wrapperClassName="w-full h-full"
                            />
                        </div>

                        {/* INFO */}
                        <div className="flex-1 min-w-0">

                            <div className="flex justify-between items-start">
                                <Link
                                    to={`/products/${item.product._id}`}
                                    className="text-[14px] font-medium text-[#1d1d1f] line-clamp-2"
                                >
                                    {item.product.title}
                                </Link>

                                <span className="text-[14px] font-medium">
                                    ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                                </span>
                            </div>

                            <p className="text-[12px] text-[#86868b] mt-1">
                                {item.product.category}
                            </p>

                            {/* ACTIONS */}
                            <div className="flex items-center justify-between mt-3">

                                {/* QTY */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleQuantityChange(item.product._id, item.quantity, -1)}
                                        className="w-6 h-6 flex items-center justify-center text-[#86868b]"
                                    >
                                        <HugeiconsIcon icon={MinusSignIcon} size={14} />
                                    </button>

                                    <span className="text-[13px] w-5 text-center">
                                        {item.quantity}
                                    </span>

                                    <button
                                        onClick={() => handleQuantityChange(item.product._id, item.quantity, 1)}
                                        className="w-6 h-6 flex items-center justify-center text-[#86868b]"
                                    >
                                        <HugeiconsIcon icon={PlusSignIcon} size={14} />
                                    </button>
                                </div>

                                {/* REMOVE */}
                                <button
                                    onClick={() => removeFromCart(item.product._id)}
                                    className="text-[13px] text-[#86868b] hover:text-[#1d1d1f]"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* SUMMARY (NO CARD ❌) */}
            <div className="border-t pt-6 space-y-3 text-[14px]">

                <div className="flex justify-between text-[#6e6e73]">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex justify-between text-[#6e6e73]">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                </div>

                <div className="flex justify-between font-medium text-[#1d1d1f] pt-2">
                    <span>Total</span>
                    <span>₹{total.toLocaleString("en-IN")}</span>
                </div>

                <Button
                    onClick={() => navigate("/checkout")}
                    className="w-full mt-4 rounded-full py-3 bg-[#0071e3]! text-white text-[14px]"
                >
                    Checkout
                </Button>
            </div>
        </div>
    );
};

export default Cart;