import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    ShoppingBag01Icon,
    SentIcon,
    Loading03Icon,
    FavouriteIcon,
    ArrowRight01Icon,
    MinusSignIcon,
    PlusSignIcon,
    ArrowDown01Icon,
} from "@hugeicons/core-free-icons";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "../../hooks/cart/useCart";
import { useWishlist } from "../../hooks/useWishlist";
import { useInteractionLogger } from "../../hooks/useInteractionLogger";
import { useProductRecommendations } from "../../hooks/useProductRecommendations";
import { getCloudinaryUrl } from "../../utils/cloudinaryImage";
import api from "../../services/api";
import BlurImage from "../../components/ui/BlurImage";
import { ProductCard } from "../../components/ui/ProductCard";

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1560393464-5c69a73c5770?q=80&w=800&auto=format&fit=crop";
const STALE_TIME = 5 * 60 * 1000;

interface ChatMessage {
    role: "user" | "ai";
    content: string;
    timestamp: number;
}

const fetchProduct = async (id: string) => {
    const { data } = await api.get(`/products/${id}`);
    return data.data;
};

const ProductDetailSkeleton = () => (
    <div className="bg-white min-h-screen">
        <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                <div className="aspect-[3/4] bg-[#F9F9F9] animate-pulse" />
                <div className="space-y-6 py-8">
                    <div className="h-3 bg-[#F9F9F9] animate-pulse w-20" />
                    <div className="h-8 bg-[#F9F9F9] animate-pulse w-3/4" />
                    <div className="h-6 bg-[#F9F9F9] animate-pulse w-24" />
                    <div className="h-px bg-gray-200 my-8" />
                    <div className="h-4 bg-[#F9F9F9] animate-pulse w-full" />
                    <div className="h-4 bg-[#F9F9F9] animate-pulse w-2/3" />
                </div>
            </div>
        </div>
    </div>
);

const AccordionItem = ({
    title,
    children,
    defaultOpen = false,
}: {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-gray-200">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between py-5 text-left"
            >
                <span className="text-[13px] font-medium uppercase tracking-[0.12em] text-black">
                    {title}
                </span>
                <HugeiconsIcon
                    icon={ArrowDown01Icon}
                    size={16}
                    className={`text-gray-400 transition-transform duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? "rotate-180" : ""}`}
                />
            </button>
            <div
                className={`overflow-hidden transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? "max-h-96 pb-5" : "max-h-0"}`}
            >
                {children}
            </div>
        </div>
    );
};

const ProductDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { addToCart, isAddingToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { log } = useInteractionLogger();
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const [activeImage, setActiveImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [aiQuestion, setAiQuestion] = useState("");
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
        const saved = localStorage.getItem(`chat_history_${id}`);
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        if (id && chatHistory.length > 0) {
            localStorage.setItem(`chat_history_${id}`, JSON.stringify(chatHistory));
        }
    }, [chatHistory, id]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [chatHistory]);

    const { data: product, isLoading, isError } = useQuery({
        queryKey: ["product", id],
        queryFn: () => fetchProduct(id!),
        enabled: !!id,
        staleTime: STALE_TIME,
    });

    useEffect(() => {
        if (product?._id) {
            log({ productId: product._id, action: 'view' });
        }
    }, [product?._id, log]);

    const { data: recModules } = useProductRecommendations(id);

    const handleAddToCart = async () => {
        if (!product || isAddingToCart) return;
        log({ productId: product._id, action: 'add_to_cart', quantity });
        await addToCart({ productId: product._id, quantity });
    };

    const handleAskAI = async () => {
        if (!aiQuestion.trim() || !product || isAiLoading) return;

        const newUserMessage: ChatMessage = {
            role: "user",
            content: aiQuestion,
            timestamp: Date.now(),
        };

        setChatHistory((prev) => [...prev, newUserMessage]);
        setAiQuestion("");
        setIsAiLoading(true);

        try {
            const response = await api.post("/ai/product-chat", {
                productId: product._id,
                question: aiQuestion,
                context: {
                    title: product.title,
                    description: product.description,
                    features: product.features,
                    category: product.category,
                    price: product.price,
                },
            });

            if (response.data.success) {
                const aiMessage: ChatMessage = {
                    role: "ai",
                    content: response.data.answer,
                    timestamp: Date.now(),
                };
                setChatHistory((prev) => [...prev, aiMessage]);
            }
        } catch {
            const errorMessage: ChatMessage = {
                role: "ai",
                content: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
                timestamp: Date.now(),
            };
            setChatHistory((prev) => [...prev, errorMessage]);
        } finally {
            setIsAiLoading(false);
        }
    };

    if (isLoading) return <ProductDetailSkeleton />;

    if (isError || !product) {
        return (
            <div className="bg-white min-h-screen flex flex-col items-center justify-center text-center px-4">
                <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-gray-400 mb-4">
                    Error
                </span>
                <h1 className="text-[28px] font-light text-black mb-4">Product Not Found</h1>
                <p className="text-[14px] text-gray-500 mb-10 max-w-sm">
                    The product you're looking for is currently unavailable or doesn't exist.
                </p>
                <Link
                    to="/products"
                    className="text-[11px] font-medium uppercase tracking-[0.15em] text-black pb-2 border-b border-black hover:border-transparent transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]"
                >
                    Continue Shopping
                </Link>
            </div>
        );
    }

    const price = product.price || 0;
    const oldPrice = product.oldPrice || 0;
    const isOutOfStock = !product.stock || product.stock === 0;

    const rawImages: string[] = product.images?.length
        ? product.images.map((img: { url: string } | string) => (typeof img === "string" ? img : img.url))
        : product.imageUrl
        ? [product.imageUrl]
        : [PLACEHOLDER_IMAGE];

    const vendorId = product.vendorId && typeof product.vendorId === "object" ? product.vendorId._id : product.vendorId;

    return (
        <div className="bg-white min-h-screen font-sans">
            {/* Breadcrumb */}
            <div className="max-w-[1440px] mx-auto px-4 md:px-10 pt-8">
                <nav className="flex items-center text-[11px] font-medium text-gray-400 tracking-[0.12em] uppercase">
                    <Link to="/" className="hover:text-black transition-colors duration-200">Home</Link>
                    <HugeiconsIcon icon={ArrowRight01Icon} size={10} className="mx-2 opacity-40" />
                    <Link to="/products" className="hover:text-black transition-colors duration-200">Discover</Link>
                    <HugeiconsIcon icon={ArrowRight01Icon} size={10} className="mx-2 opacity-40" />
                    {product.category && (
                        <>
                            <Link to={`/category/${product.category.toLowerCase()}`} className="hover:text-black transition-colors duration-200">
                                {product.category}
                            </Link>
                            <HugeiconsIcon icon={ArrowRight01Icon} size={10} className="mx-2 opacity-40" />
                        </>
                    )}
                    <span className="text-black truncate max-w-[120px] sm:max-w-[200px]">{product.title}</span>
                </nav>
            </div>

            {/* Main Product Section */}
            <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-10 md:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
                    
                    {/* Left: Gallery */}
                    <div className="lg:sticky lg:top-28 lg:self-start">
                        {/* Main Image */}
                        <div className="relative aspect-[3/4] bg-[#F9F9F9] overflow-hidden group">
                            <BlurImage
                                src={getCloudinaryUrl(rawImages[activeImage], { width: 1200, quality: "auto", format: "auto" })}
                                alt={product.title}
                                wrapperClassName="w-full h-full"
                                className="object-cover transition-opacity duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:opacity-90"
                            />
                            {/* Wishlist */}
                            <button
                                type="button"
                                onClick={() => {
                                    const isCurrentlyInWishlist = isInWishlist(product._id);
                                    log({ productId: product._id, action: isCurrentlyInWishlist ? 'wishlist_remove' : 'wishlist_add' });
                                    toggleWishlist(product._id);
                                }}
                                aria-label={isInWishlist(product._id) ? "Remove from wishlist" : "Add to wishlist"}
                                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur-sm border border-gray-200 hover:bg-black hover:border-black transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]"
                            >
                                <HugeiconsIcon
                                    icon={FavouriteIcon}
                                    size={16}
                                    className={isInWishlist(product._id) ? "text-[#BC0000] fill-[#BC0000]" : "text-black"}
                                />
                            </button>
                        </div>

                        {/* Thumbnails */}
                        {rawImages.length > 1 && (
                            <div className="grid grid-cols-5 gap-2 mt-2">
                                {rawImages.slice(0, 5).map((img, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setActiveImage(idx)}
                                        aria-label={`View image ${idx + 1}`}
                                        className={`aspect-square bg-[#F9F9F9] overflow-hidden border transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                                            activeImage === idx ? "border-black" : "border-transparent opacity-60 hover:opacity-100"
                                        }`}
                                    >
                                        <BlurImage
                                            src={getCloudinaryUrl(img, { width: 200, quality: "auto", format: "auto" })}
                                            alt=""
                                            wrapperClassName="w-full h-full"
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Product Info */}
                    <div className="flex flex-col">
                        {/* Category */}
                        {product.category && (
                            <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-gray-400 mb-4">
                                {product.category}
                            </span>
                        )}

                        {/* Title */}
                        <h1 className="text-[28px] md:text-[36px] font-light text-black tracking-[0.02em] leading-tight mb-4">
                            {product.title}
                        </h1>

                        {/* Price */}
                        <div className="flex items-baseline gap-3 mb-8">
                            <span className="text-[20px] font-medium text-black tabular-nums">
                                ₹{price.toLocaleString("en-IN")}
                            </span>
                            {oldPrice > price && (
                                <span className="text-[16px] text-gray-400 line-through tabular-nums">
                                    ₹{oldPrice.toLocaleString("en-IN")}
                                </span>
                            )}
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-gray-200 mb-8" />

                        {/* Description */}
                        {product.description && (
                            <p className="text-[14px] text-gray-600 leading-relaxed font-normal mb-8 whitespace-pre-line">
                                {product.description}
                            </p>
                        )}

                        {/* Stock Status */}
                        {product.stock > 0 && product.stock <= 5 && (
                            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#BC0000] mb-6">
                                Only {product.stock} left in stock
                            </p>
                        )}

                        {/* Quantity */}
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-[13px] font-medium text-black">Quantity</span>
                            <div className="flex items-center border border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    disabled={quantity <= 1}
                                    className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] disabled:opacity-30 disabled:cursor-not-allowed"
                                    aria-label="Decrease quantity"
                                >
                                    <HugeiconsIcon icon={MinusSignIcon} size={12} />
                                </button>
                                <span className="w-12 h-10 flex items-center justify-center text-[13px] font-medium border-x border-gray-200 tabular-nums">
                                    {quantity}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                                    disabled={quantity >= (product.stock || 99)}
                                    className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] disabled:opacity-30 disabled:cursor-not-allowed"
                                    aria-label="Increase quantity"
                                >
                                    <HugeiconsIcon icon={PlusSignIcon} size={12} />
                                </button>
                            </div>
                        </div>

                        {/* Add to Bag */}
                        <button
                            type="button"
                            onClick={handleAddToCart}
                            disabled={isOutOfStock || isAddingToCart}
                            className="w-full h-14 flex items-center justify-center gap-2 bg-black text-white text-[11px] font-medium uppercase tracking-[0.15em] hover:bg-gray-900 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]"
                        >
                            {isAddingToCart ? (
                                <HugeiconsIcon icon={Loading03Icon} size={16} className="animate-spin" />
                            ) : (
                                <HugeiconsIcon icon={ShoppingBag01Icon} size={16} />
                            )}
                            {isOutOfStock ? "Currently Unavailable" : "Add to Bag"}
                        </button>

                        {/* Accordion Details */}
                        <div className="mt-10">
                            <AccordionItem title="Key Features" defaultOpen>
                                <ul className="space-y-3">
                                    {(product.features?.length > 0
                                        ? product.features
                                        : [
                                              "Premium craftsmanship carefully tuned for perfect balance.",
                                              "Tested to ensure long-lasting durability.",
                                              "Seamless integration with your daily life.",
                                          ]
                                    ).map((f: string, i: number) => (
                                        <li key={i} className="text-[14px] text-gray-600 flex items-start leading-relaxed">
                                            <span className="mr-3 text-gray-300">•</span>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            </AccordionItem>

                            <AccordionItem title="Materials & Care">
                                <p className="text-[14px] text-gray-600 leading-relaxed">
                                    Hand wash cold with like colors. Do not bleach. Lay flat to dry. Cool iron if needed. Professional dry clean recommended.
                                </p>
                            </AccordionItem>

                            <AccordionItem title="Shipping & Returns">
                                <div className="space-y-3 text-[14px] text-gray-600 leading-relaxed">
                                    <p>Complimentary shipping on orders above ₹50,000.</p>
                                    <p>Standard delivery: 5-7 business days.</p>
                                    <p>Returns accepted within 14 days of delivery.</p>
                                </div>
                            </AccordionItem>
                        </div>

                        {/* Seller Info */}
                        {product.vendorId && typeof product.vendorId === "object" && (
                            <div className="mt-10 pt-8 border-t border-gray-200">
                                <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-gray-400 block mb-4">
                                    Sold By
                                </span>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-[#F9F9F9] flex items-center justify-center shrink-0 overflow-hidden">
                                        {product.vendorId.logo ? (
                                            <BlurImage
                                                src={getCloudinaryUrl(product.vendorId.logo, { width: 200, quality: "auto" })}
                                                alt={product.vendorId.storeName || "Store"}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-[16px] font-medium text-black">
                                                {(product.vendorId.storeName || product.vendorId.name || "S").charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-[14px] font-medium text-black truncate">
                                            {product.vendorId.storeName || product.vendorId.name}
                                        </h4>
                                        <p className="text-[12px] text-gray-500 truncate">
                                            {product.vendorId.storeDescription || "Verified premium seller"}
                                        </p>
                                    </div>
                                    <Link
                                        to={`/vendor/${vendorId}`}
                                        className="text-[11px] font-medium uppercase tracking-[0.12em] text-black pb-1 border-b border-black hover:border-transparent transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] shrink-0"
                                    >
                                        Visit Store
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* AI Concierge */}
                        <div className="mt-10 pt-8 border-t border-gray-200">
                            <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-gray-400 block mb-4">
                                Product Concierge
                            </span>

                            <div className="border border-gray-200 flex flex-col h-[400px]">
                                <div
                                    ref={chatContainerRef}
                                    className="flex-1 overflow-y-auto p-5 space-y-4"
                                >
                                    {chatHistory.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center text-center px-4">
                                            <p className="text-[14px] text-gray-400 font-normal leading-relaxed max-w-[280px]">
                                                Have questions about sizing, materials, or product details? Ask our concierge.
                                            </p>
                                        </div>
                                    ) : (
                                        chatHistory.map((msg, i) => (
                                            <div key={i} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                                                <div
                                                    className={`max-w-[85%] px-4 py-3 text-[14px] leading-relaxed ${
                                                        msg.role === "user"
                                                            ? "bg-black text-white"
                                                            : "bg-[#F9F9F9] text-black border border-gray-200"
                                                    }`}
                                                >
                                                    {msg.content}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                    {isAiLoading && (
                                        <div className="flex items-start">
                                            <div className="bg-[#F9F9F9] border border-gray-200 px-4 py-3">
                                                <div className="flex items-center gap-1.5 h-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={chatEndRef} />
                                </div>

                                <div className="p-4 border-t border-gray-200">
                                    <div className="flex items-center border border-gray-200 focus-within:border-black transition-colors duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]">
                                        <input
                                            type="text"
                                            value={aiQuestion}
                                            onChange={(e) => setAiQuestion(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && handleAskAI()}
                                            placeholder="Ask about this product..."
                                            className="flex-1 px-4 py-3 bg-transparent outline-none text-[13px] text-black placeholder:text-gray-400"
                                            autoComplete="off"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAskAI}
                                            disabled={isAiLoading || !aiQuestion.trim()}
                                            className="px-4 py-3 text-gray-400 hover:text-black disabled:opacity-30 transition-colors duration-200"
                                            aria-label="Send message"
                                        >
                                            <HugeiconsIcon icon={SentIcon} size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recommendation Modules */}
            {recModules && recModules.length > 0 && recModules.map((module) => {
                if (!module.products || module.products.length === 0) return null;
                return (
                    <section key={module.moduleId} className="border-t border-gray-200">
                        <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-16 md:py-24">
                            <div className="flex items-baseline justify-between mb-10">
                                <h2 className="text-[11px] font-medium uppercase tracking-[0.25em] text-black">
                                    {module.title}
                                </h2>
                                <span className="text-[11px] font-medium text-gray-400 uppercase tracking-[0.12em]">
                                    {module.subtitle}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
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
                    </section>
                );
            })}
        </div>
    );
};

export default ProductDetail;
