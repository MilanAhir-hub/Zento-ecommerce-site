import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/cart/useCart";
import { useAuth } from "../../context/authContext";
import { useInteractionLogger } from "../../hooks/useInteractionLogger";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    MinusSignIcon,
    PlusSignIcon,
    Loading03Icon,
    Search01Icon,
    Delete02Icon,
    ShoppingBag01Icon,
    ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import Button from "../../components/ui/Button";
import BlurImage from "../../components/ui/BlurImage";
import { getCloudinaryUrl } from "../../utils/cloudinaryImage";
import type { CartItem } from "../../services/cart.api";
import { ProductCard } from "../../components/ui/ProductCard";
import { useCartRecommendations } from "../../hooks/useCartRecommendations";

const Cart = () => {
    const { cart, isCartLoading, updateCartItem, removeFromCart } = useCart();
    const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
    const { log } = useInteractionLogger();
    const { data: recModules } = useCartRecommendations();
    const navigate = useNavigate();

    const [searchItem, setSearchItem] = React.useState("");
    const [removingId, setRemovingId] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (!isAuthLoading && !isAuthenticated) {
            navigate("/login", { state: { returnTo: "/cart" } });
        }
    }, [isAuthenticated, isAuthLoading, navigate]);

    if (isAuthLoading || isCartLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <HugeiconsIcon icon={Loading03Icon} size={22} className="animate-spin text-black" />
                    <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-gray-400">
                        Loading your bag
                    </span>
                </div>
            </div>
        );
    }

    const items: CartItem[] = (cart?.items || []).filter(
        (item) => item && item.product
    );

    const filteredItems = items.filter(item =>
        item.product.title.toLowerCase().includes(searchItem.toLowerCase())
    );

    const subtotal = items.reduce((t, i) => t + i.product.price * i.quantity, 0);
    const shipping = subtotal > 50000 || subtotal === 0 ? 0 : 500;
    const total = subtotal + shipping;
    const itemCount = items.reduce((t, i) => t + i.quantity, 0);

    const handleQuantityChange = (id: string, qty: number, change: number) => {
        const newQty = qty + change;
        if (newQty < 1) return;
        updateCartItem({ productId: id, quantity: newQty });
    };

    const handleRemove = async (id: string) => {
        setRemovingId(id);
        log({ productId: id, action: 'remove_from_cart' });
        await removeFromCart(id);
        setRemovingId(null);
    };

    // EMPTY STATE
    if (items.length === 0) {
        return (
            <div className="max-w-[1200px] mx-auto px-4 md:px-10 py-16 md:py-24">
                <div className="flex flex-col items-center justify-center text-center mb-20 min-h-[40vh]">
                    <div className="w-16 h-16 border border-gray-200 flex items-center justify-center mb-8">
                        <HugeiconsIcon icon={ShoppingBag01Icon} size={24} className="text-gray-300" />
                    </div>
                    
                    <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-gray-400 mb-4">
                        Your Collection
                    </span>
                    
                    <h1 className="text-[28px] md:text-[36px] font-light text-black mb-4 tracking-[0.02em]">
                        Your bag is empty
                    </h1>
                    
                    <p className="text-[14px] text-gray-500 font-normal mb-10 max-w-sm">
                        Discover our curated selection and add pieces that speak to your personal aesthetic.
                    </p>

                    <Link
                        to="/products"
                        className="
                            group inline-flex items-center gap-3
                            text-[11px] font-medium uppercase tracking-[0.15em]
                            text-black pb-2
                            border-b border-black
                            hover:border-transparent
                            transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]
                        "
                    >
                        Begin Shopping
                        <HugeiconsIcon 
                            icon={ArrowRight01Icon} 
                            size={14} 
                            className="transition-transform duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-1" 
                        />
                    </Link>
                </div>

                {/* Empty Cart Recommendations */}
                {recModules && recModules.length > 0 && recModules.map((module) => {
                    if (!module.products || module.products.length === 0) return null;
                    return (
                        <div key={module.moduleId} className="border-t border-gray-100 pt-16">
                            <div className="flex items-baseline justify-between mb-10">
                                <h2 className="text-[11px] font-medium uppercase tracking-[0.25em] text-black">
                                    {module.title}
                                </h2>
                                <span className="text-[11px] font-medium text-gray-400 uppercase tracking-[0.12em]">
                                    {module.subtitle}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {module.products.slice(0, 4).map((item) => (
                                    <ProductCard
                                        key={item._id}
                                        product={{
                                            _id: item._id,
                                            title: item.title,
                                            price: item.price,
                                            imageUrl: item.imageUrl,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    return (
        <div className="max-w-[1200px] mx-auto px-4 md:px-10 py-12 md:py-16">
            
            {/* HEADER */}
            <header className="mb-12 md:mb-16">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        {/* Breadcrumb */}
                        <nav className="flex items-center text-[11px] font-medium text-gray-400 mb-6 tracking-[0.12em] uppercase">
                            <Link to="/" className="hover:text-black transition-colors duration-200">Home</Link>
                            <HugeiconsIcon icon={ArrowRight01Icon} size={10} className="mx-2 opacity-40" />
                            <span className="text-black">Bag</span>
                        </nav>
                        
                        {/* Editorial Divider */}
                        <div className="w-12 h-px bg-black mb-6" />
                        
                        <h1 className="text-[28px] sm:text-[36px] md:text-[48px] font-light text-black tracking-[0.02em] mb-2">
                            Your Bag
                        </h1>
                        <p className="text-[13px] text-gray-500 font-normal">
                            {itemCount} {itemCount === 1 ? 'piece' : 'pieces'} selected
                        </p>
                    </div>

                    {/* Search */}
                    <div className="relative w-full md:w-72">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400">
                            <HugeiconsIcon icon={Search01Icon} size={15} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search in bag"
                            className="w-full bg-transparent border-0 border-b border-gray-200 py-2 pl-6 pr-4 text-[13px] text-black placeholder:text-gray-300 focus:outline-none focus:border-black transition-colors duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] font-normal tracking-[0.02em]"
                            value={searchItem}
                            onChange={(e) => setSearchItem(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                
                {/* ITEMS COLUMN */}
                <div className="lg:col-span-8">
                    <div className="space-y-0">
                        {filteredItems.map((item, index) => (
                            <div 
                                key={item.product._id} 
                                className={`
                                    group py-8
                                    ${index !== filteredItems.length - 1 ? 'border-b border-gray-100' : ''}
                                    transition-opacity duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]
                                    ${removingId === item.product._id ? 'opacity-50' : 'opacity-100'}
                                `}
                            >
                                <div className="flex gap-6 md:gap-8">
                                    
                                    {/* IMAGE */}
                                    <Link
                                        to={`/products/${item.product._id}`}
                                        className="w-24 h-32 md:w-32 md:h-40 bg-[#F9F9F9] overflow-hidden shrink-0 block"
                                    >
                                        <BlurImage
                                            src={getCloudinaryUrl(item.product.imageUrl || "", { width: 400 })}
                                            alt={item.product.title}
                                            wrapperClassName="w-full h-full"
                                            className="object-cover transition-opacity duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:opacity-90"
                                        />
                                    </Link>

                                    {/* INFO */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                                        
                                        <div>
                                            {/* Title & Price Row */}
                                            <div className="flex justify-between items-start gap-4 mb-2">
                                                <Link
                                                    to={`/products/${item.product._id}`}
                                                    className="text-[15px] font-normal text-black line-clamp-2 tracking-[0.01em] hover:underline underline-offset-4 transition-all duration-200"
                                                >
                                                    {item.product.title}
                                                </Link>
                                                
                                                <span className="text-[15px] font-medium tabular-nums text-black shrink-0">
                                                    ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                                                </span>
                                            </div>

                                            {/* Category */}
                                            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-gray-400">
                                                {item.product.category}
                                            </p>
                                        </div>

                                        {/* ACTIONS */}
                                        <div className="flex items-center justify-between mt-6">
                                            
                                            {/* Quantity Control */}
                                            <div className="flex items-center border border-gray-200">
                                                <button
                                                    onClick={() => handleQuantityChange(item.product._id, item.quantity, -1)}
                                                    disabled={item.quantity <= 1}
                                                    className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] disabled:opacity-30 disabled:cursor-not-allowed"
                                                >
                                                    <HugeiconsIcon icon={MinusSignIcon} size={12} />
                                                </button>
                                                
                                                <span className="w-12 h-10 flex items-center justify-center text-[13px] font-medium border-x border-gray-200 tabular-nums">
                                                    {item.quantity}
                                                </span>
                                                
                                                <button
                                                    onClick={() => handleQuantityChange(item.product._id, item.quantity, 1)}
                                                    className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]"
                                                >
                                                    <HugeiconsIcon icon={PlusSignIcon} size={12} />
                                                </button>
                                            </div>

                                            {/* Remove */}
                                            <button
                                                onClick={() => handleRemove(item.product._id)}
                                                className="
                                                    group/remove
                                                    inline-flex items-center gap-2
                                                    text-[11px] font-medium uppercase tracking-[0.1em]
                                                    text-gray-400 hover:text-black
                                                    transition-colors duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]
                                                "
                                            >
                                                <HugeiconsIcon 
                                                    icon={Delete02Icon} 
                                                    size={14} 
                                                    className="transition-colors duration-200" 
                                                />
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Complete Your Order (Recommendation Widget) */}
                    {recModules && recModules.length > 0 && recModules.map((module) => {
                        if (!module.products || module.products.length === 0) return null;
                        return (
                            <div key={module.moduleId} className="mt-16 pt-12 border-t border-gray-100">
                                <div className="mb-8">
                                    <h3 className="text-[11px] font-medium uppercase tracking-[0.25em] text-black">
                                        {module.title}
                                    </h3>
                                    <p className="text-[12px] text-gray-400 mt-1 tracking-[0.02em]">
                                        {module.subtitle}
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                                    {module.products.slice(0, 3).map((item) => (
                                        <ProductCard
                                            key={item._id}
                                            product={{
                                                _id: item._id,
                                                title: item.title,
                                                price: item.price,
                                                imageUrl: item.imageUrl,
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })}

                    {/* Continue Shopping */}
                    <div className="mt-12 pt-8 border-t border-gray-100">
                        <Link
                            to="/products"
                            className="
                                group inline-flex items-center gap-3
                                text-[11px] font-medium uppercase tracking-[0.15em]
                                text-black pb-1
                                border-b border-black
                                hover:border-transparent
                                transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]
                            "
                        >
                            Continue Shopping
                            <HugeiconsIcon 
                                icon={ArrowRight01Icon} 
                                size={14} 
                                className="transition-transform duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-1" 
                            />
                        </Link>
                    </div>
                </div>

                {/* SUMMARY COLUMN */}
                <div className="lg:col-span-4">
                    <div className="lg:sticky lg:top-32">
                        
                        {/* Summary Header */}
                        <div className="mb-8">
                            <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-gray-400 block mb-3">
                                Order Summary
                            </span>
                            <div className="h-px bg-black w-8" />
                        </div>

                        {/* Summary Details */}
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-[13px]">
                                <span className="text-gray-500 font-normal">Subtotal</span>
                                <span className="font-medium tabular-nums">₹{subtotal.toLocaleString("en-IN")}</span>
                            </div>

                            <div className="flex justify-between text-[13px]">
                                <span className="text-gray-500 font-normal">Shipping</span>
                                <span className="font-medium">
                                    {shipping === 0 ? (
                                        <span className="text-black">Complimentary</span>
                                    ) : (
                                        <span className="tabular-nums">₹{shipping.toLocaleString("en-IN")}</span>
                                    )}
                                </span>
                            </div>

                            {shipping > 0 && (
                                <p className="text-[11px] text-gray-400 font-normal italic">
                                    Complimentary shipping on orders above ₹50,000
                                </p>
                            )}

                            {/* Divider */}
                            <div className="h-px bg-gray-200 my-6" />

                            <div className="flex justify-between items-baseline">
                                <span className="text-[14px] font-medium text-black uppercase tracking-[0.08em]">
                                    Total
                                </span>
                                <span className="text-[20px] font-medium tabular-nums text-black">
                                    ₹{total.toLocaleString("en-IN")}
                                </span>
                            </div>
                        </div>

                        {/* Checkout Button */}
                        <Button
                            onClick={() => navigate("/checkout")}
                            className="
                                w-full h-14
                                bg-black text-white
                                text-[11px] font-medium uppercase
                                tracking-[0.15em]
                                hover:bg-gray-900
                                active:scale-[0.98]
                                transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]
                            "
                        >
                            Proceed to Checkout
                        </Button>

                        {/* Trust Indicators */}
                        <div className="mt-8 pt-8 border-t border-gray-100 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 border border-gray-200 flex items-center justify-center shrink-0">
                                    <span className="text-[10px] font-medium">SSL</span>
                                </div>
                                <p className="text-[11px] text-gray-400 font-normal">
                                    Secure checkout with SSL encryption
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 border border-gray-200 flex items-center justify-center shrink-0">
                                    <span className="text-[10px] font-medium">RET</span>
                                </div>
                                <p className="text-[11px] text-gray-400 font-normal">
                                    14-day return policy on all items
                                </p>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
