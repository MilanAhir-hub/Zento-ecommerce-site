import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CardSlider from "../../components/ui/CardSlider";
import { HugeiconsIcon } from '@hugeicons/react';
import {
    ShoppingBag01Icon,
    SentIcon,
    Loading03Icon,
    FavouriteIcon,
    Store01Icon,
    ArrowRight01Icon
} from '@hugeicons/core-free-icons';
import { useQuery } from "@tanstack/react-query";
import { useCart } from "../../hooks/cart/useCart";
import { useWishlist } from "../../hooks/useWishlist";
import { getCloudinaryUrl } from "../../utils/cloudinaryImage";
import api from "../../services/api";
import Button from "../../components/ui/Button";
import BlurImage from "../../components/ui/BlurImage";

// --- Constants ---
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1560393464-5c69a73c5770?q=80&w=800&auto=format&fit=crop";
const STALE_TIME = 5 * 60 * 1000; // 5 minutes

// --- Types ---
interface ChatMessage {
    role: 'user' | 'ai';
    content: string;
    timestamp: number;
}

// --- API Fetchers ---
const fetchProduct = async (id: string) => {
    const { data } = await api.get(`/products/${id}`);
    return data.data;
};

const fetchCategoryProducts = async (category: string) => {
    const { data } = await api.get(`/products/category/${category}?limit=15`);
    return data.data;
};

const fetchVendorProducts = async (vendorId: string) => {
    const { data } = await api.get(`/products/vendor/${vendorId}?limit=15`);
    return data.data;
};

const ProductDetailSkeleton = () => (
    <div className="bg-white min-h-screen py-24 flex items-center justify-center">
        <HugeiconsIcon icon={Loading03Icon} size={32} className="animate-spin text-stone-300" />
    </div>
);

const ProductDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addToCart, isAddingToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const chatEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // UI State
    const [activeImage, setActiveImage] = useState(0);
    const [quantity, setQuantity] = useState(1);

    // AI Chat State
    const [aiQuestion, setAiQuestion] = useState("");
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);
    const scrollTimeoutRef = useRef<any>(null);
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
        const saved = localStorage.getItem(`chat_history_${id}`);
        return saved ? JSON.parse(saved) : [];
    });

    // Save chat history to localStorage
    useEffect(() => {
        if (id && chatHistory.length > 0) {
            localStorage.setItem(`chat_history_${id}`, JSON.stringify(chatHistory));
        }
    }, [chatHistory, id]);

    // Scroll to bottom of chat (Container only)
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: "smooth"
            });
        }
    }, [chatHistory]);

    const handleChatScroll = () => {
        setIsScrolling(true);
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = setTimeout(() => {
            setIsScrolling(false);
        }, 700);
    };


    // Queries
    const { data: product, isLoading, isError } = useQuery({
        queryKey: ['product', id],
        queryFn: () => fetchProduct(id!),
        enabled: !!id,
        staleTime: STALE_TIME,
    });

    const { data: relatedProducts } = useQuery({
        queryKey: ['products', 'category', product?.category],
        queryFn: () => fetchCategoryProducts(product!.category),
        enabled: !!product?.category,
        staleTime: STALE_TIME,
    });

    const vendorId = product?.vendorId && typeof product.vendorId === 'object' ? product.vendorId._id : product?.vendorId;

    const { data: vendorProducts } = useQuery({
        queryKey: ['products', 'vendor', vendorId],
        queryFn: () => fetchVendorProducts(vendorId as string),
        enabled: !!vendorId,
        staleTime: STALE_TIME,
    });

    const handleAddToCart = async () => {
        if (!product || isAddingToCart) return;
        await addToCart({ productId: product._id, quantity });
    };

    const handleAskAI = async () => {
        if (!aiQuestion.trim() || !product || isAiLoading) return;

        const newUserMessage: ChatMessage = {
            role: 'user',
            content: aiQuestion,
            timestamp: Date.now()
        };

        setChatHistory(prev => [...prev, newUserMessage]);
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
                    price: product.price
                }
            });

            if (response.data.success) {
                const aiMessage: ChatMessage = {
                    role: 'ai',
                    content: response.data.answer,
                    timestamp: Date.now()
                };
                setChatHistory(prev => [...prev, aiMessage]);
            }
        } catch (err) {
            console.error("Chat error:", err);
            const errorMessage: ChatMessage = {
                role: 'ai',
                content: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
                timestamp: Date.now()
            };
            setChatHistory(prev => [...prev, errorMessage]);
        } finally {
            setIsAiLoading(false);
        }
    };

    if (isLoading) return <ProductDetailSkeleton />;

    if (isError || !product) {
        return (
            <div className="bg-white min-h-screen py-32 flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-4xl font-semibold text-[#1d1d1f] mb-4">Product Not Found.</h1>
                <p className="text-[#86868b] mb-8 max-w-md mx-auto">The product you're looking for is currently unavailable or doesn't exist.</p>
                <Button onClick={() => navigate("/")} variant="primary" size="lg" className="rounded-full">
                    Continue Shopping
                </Button>
            </div>
        );
    }

    const price = product.price || 0;
    const oldPrice = product.oldPrice || 0;
    const isOutOfStock = !product.stock || product.stock === 0;

    const rawImages: string[] = product.images?.length
        ? product.images.map((img: { url: string } | string) => typeof img === 'string' ? img : img.url)
        : product.imageUrl ? [product.imageUrl] : [PLACEHOLDER_IMAGE];

    const mappedRelatedItems = relatedProducts?.filter((p: { _id: string }) => p._id !== product._id).map((p: { _id: string }) => ({
        ...p,
        id: p._id
    })) || [];

    const mappedVendorItems = vendorProducts?.filter((p: { _id: string }) => p._id !== product._id).map((p: { _id: string }) => ({
        ...p,
        id: p._id
    })) || [];

    return (
        <div className="bg-white min-h-screen font-sans selection:bg-[#0071e3] selection:text-white">

            {/* Minimalist Top Sticky Bar */}
            <div className="sticky top-[48px] z-40 bg-white/80 backdrop-blur-md border-b border-[#e5e5ea] transition-all">
                <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between">
                    <span className="text-[#1d1d1f] font-semibold text-sm truncate max-w-[200px] sm:max-w-md md:max-w-lg lg:max-w-xl">{product.title}</span>
                    <div className="flex items-center gap-4 shrink-0">
                        <span className="text-[#1d1d1f] text-sm hidden sm:block">₹{price.toLocaleString("en-IN")}</span>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={handleAddToCart}
                            disabled={isOutOfStock || isAddingToCart}
                            className="rounded-full text-xs font-medium px-4 bg-[#0071e3]! hover:bg-[#0077ed]!"
                        >
                            {isAddingToCart ? <HugeiconsIcon icon={Loading03Icon} size={14} className="animate-spin" /> : (isOutOfStock ? "Sold Out" : "Add")}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-6 py-10 lg:py-20 flex flex-col lg:flex-row gap-12 lg:gap-24">

                {/* Main Image Gallery (Left Column) */}
                <div className="w-full lg:w-[55%] flex flex-col gap-6">
                    {/* Main Image */}
                    <div className="aspect-4/5 bg-[#f5f5f7] rounded-4xl overflow-hidden relative group">
                        <BlurImage
                            src={getCloudinaryUrl(rawImages[activeImage], { width: 1200, quality: 'auto', format: 'auto' })}
                            alt={product.title}
                            wrapperClassName="w-full h-full"
                            className="mix-blend-multiply transform transition-transform duration-700 group-hover:scale-105"
                        />
                        <button
                            onClick={() => toggleWishlist(product._id)}
                            aria-label="Add to wishlist"
                            className="absolute top-6 right-6 p-3 rounded-full bg-white/50 hover:bg-white backdrop-blur-md transition-all text-[#86868b] hover:text-[#1d1d1f] active:scale-95 shadow-sm"
                        >
                            <HugeiconsIcon icon={FavouriteIcon} size={20} className={isInWishlist(product._id) ? "text-[#ff2d55] fill-[#ff2d55]" : ""} />
                        </button>
                    </div>

                    {/* Image Thumbnails (Standardized 4-column grid) */}
                    {rawImages.length > 1 && (
                        <div className="grid grid-cols-4 gap-4 mt-2">
                            {rawImages.slice(0, 8).map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(idx)}
                                    aria-label={`View image ${idx + 1}`}
                                    className={`aspect-square w-full rounded-2xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-[#0071e3] scale-100' : 'border-transparent opacity-60 hover:opacity-100 scale-95 hover:scale-100'} bg-[#f5f5f7] flex items-center justify-center p-2`}
                                >
                                    <BlurImage
                                        src={getCloudinaryUrl(img, { width: 200, quality: 'auto', format: 'auto' })}
                                        alt=""
                                        wrapperClassName="w-full h-full bg-transparent"
                                        className="object-contain mix-blend-multiply"
                                    />
                                </button>
                            ))}
                        </div>
                    )}

                    {/* AI Chat Interface (Moved to Left Column) */}
                    <div className="mt-8 border-t border-[#d2d2d7] pt-8">
                        <div className="flex items-center gap-3 mb-6 text-[17px] font-semibold text-[#1d1d1f]">
                            <HugeiconsIcon icon={ArrowRight01Icon} size={18} className="text-[#1d1d1f]" />
                            Ask Product Concierge
                        </div>

                        <div className="bg-[#f5f5f7] rounded-[32px] overflow-hidden flex flex-col h-[500px] shadow-sm border border-[#e5e5ea]">
                            <div
                                ref={chatContainerRef}
                                onScroll={handleChatScroll}
                                className={`flex-1 overflow-y-auto p-6 space-y-4 pb-[20px] whatsapp-chat-scrollbar ${isScrolling ? 'is-scrolling' : ''}`}
                            >
                                {chatHistory.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center px-4">
                                        <p className="text-[#86868b] text-[15px] font-medium leading-relaxed max-w-[280px]">
                                            Have questions about compatibility, sizing, or product details?
                                        </p>
                                    </div>
                                ) : (
                                    chatHistory.map((msg, i) => (
                                        <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-full`}>
                                            <div className={`relative max-w-[85%] rounded-[24px] px-5 py-3 text-[15px] leading-relaxed ${msg.role === 'user'
                                                ? 'bg-[#0071e3] text-white rounded-br-[4px]'
                                                : 'bg-white text-[#1d1d1f] rounded-bl-[4px] shadow-xs'
                                                }`}>
                                                {msg.content}
                                            </div>
                                        </div>
                                    ))
                                )}
                                {isAiLoading && (
                                    <div className="flex items-start">
                                        <div className="bg-white rounded-[24px] rounded-bl-[4px] px-5 py-4 shadow-xs">
                                            <div className="flex items-center gap-1.5 h-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#86868b] animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#86868b] animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#86868b] animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            <div className="p-4 bg-white border-t border-[#e5e5ea]">
                                <div className="flex items-center bg-[#f5f5f7] rounded-full px-5 py-3 focus-within:ring-2 ring-offset-1 focus-within:ring-[#0071e3]/30 transition-all border border-transparent focus-within:border-[#0071e3]/20">
                                    <input
                                        type="text"
                                        value={aiQuestion}
                                        onChange={(e) => setAiQuestion(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
                                        placeholder="Message Product Expert..."
                                        className="flex-1 bg-transparent outline-none text-[15px] text-[#1d1d1f] placeholder:text-[#86868b]"
                                        autoComplete="off"
                                    />
                                    <button
                                        onClick={handleAskAI}
                                        disabled={isAiLoading || !aiQuestion.trim()}
                                        className={`ml-2 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${aiQuestion.trim() ? 'bg-[#0071e3] text-white shadow-md' : 'bg-[#e9e9eb] text-[#86868b]'} disabled:opacity-50 active:scale-90`}
                                        aria-label="Send message"
                                    >
                                        <HugeiconsIcon icon={SentIcon} size={18} className={aiQuestion.trim() ? "-translate-x-px translate-y-px" : ""} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Info Section (Right Column) */}
                <div className="w-full lg:w-[45%] flex flex-col justify-start pb-12">
                    <p className="text-[#bf4800] font-semibold text-[11px] tracking-wide uppercase mb-3">{product.category}</p>
                    <h1 className="text-4xl lg:text-[40px] leading-tight font-semibold text-[#1d1d1f] tracking-tight mb-4">
                        {product.title}
                    </h1>
                    <div className="text-2xl text-[#1d1d1f] font-normal mb-8 flex items-end gap-3 tracking-tight">
                        <span>MRP ₹{price.toLocaleString("en-IN")}</span>
                        {oldPrice > price && (
                            <span className="text-lg text-[#86868b] line-through mb-0.5 font-light">₹{oldPrice.toLocaleString("en-IN")}</span>
                        )}
                    </div>

                    <div className="h-px w-full bg-[#d2d2d7] my-8"></div>

                    <div className="text-[#1d1d1f] text-base leading-relaxed mb-10 font-medium whitespace-pre-line">
                        {product.description}
                    </div>

                    {/* Shopping Actions */}
                    <div className="flex flex-col gap-6 mb-12">
                        <div className="flex items-center gap-4">
                            <span className="text-[#1d1d1f] font-medium text-[15px]">Quantity</span>
                            <div className="flex items-center bg-[#f5f5f7] rounded-full p-1 border border-[#e5e5ea]">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-[#1d1d1f] hover:bg-[#e8e8ed] transition text-xl font-light"
                                    disabled={quantity <= 1}
                                    aria-label="Decrease quantity"
                                >-</button>
                                <span className="w-10 text-center text-[15px] font-medium">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-[#1d1d1f] hover:bg-[#e8e8ed] transition text-xl font-light"
                                    disabled={quantity >= (product.stock || 99)}
                                    aria-label="Increase quantity"
                                >+</button>
                            </div>
                        </div>

                        <Button
                            variant="primary"
                            size="lg"
                            onClick={handleAddToCart}
                            disabled={isOutOfStock || isAddingToCart}
                            className="w-full rounded-2xl py-4 bg-[#0071e3]! hover:bg-[#0077ed]! text-white flex items-center justify-center gap-2 text-[17px] font-medium transition-all shadow-md active:scale-[0.98]"
                        >
                            {isAddingToCart ? <HugeiconsIcon icon={Loading03Icon} className="animate-spin" /> : <HugeiconsIcon icon={ShoppingBag01Icon} />}
                            {isOutOfStock ? "Currently Unavailable" : "Add to Bag"}
                        </Button>

                        {product.stock > 0 && product.stock <= 5 && (
                            <p className="text-xs text-[#bf4800] text-center font-medium mt-[-10px]">Only {product.stock} left in stock. Order soon.</p>
                        )}
                    </div>

                    {/* Collapsible Features & AI Chat Details */}
                    <div className="border-t border-[#d2d2d7] mt-8">
                        <div className="py-6 border-b border-[#d2d2d7]">
                            <h3 className="text-[17px] font-semibold text-[#1d1d1f] mb-4">Key Features</h3>
                            <ul className="space-y-3">
                                {(product.features?.length > 0 ? product.features : [
                                    "Premium craftsmanship carefully tuned for perfect balance.",
                                    "Tested to ensure long-lasting durability.",
                                    "Seamless integration with your daily life."
                                ]).map((f: string, i: number) => (
                                    <li key={i} className="text-[#1d1d1f] text-[15px] flex items-start leading-relaxed">
                                        <span className="mr-3 text-[#86868b]">•</span>
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Seller Information Section */}
                    {product.vendorId && typeof product.vendorId === 'object' && (
                        <div className="mt-10 pt-8 border-t border-[#d2d2d7]">
                            <div className="flex items-center gap-3 mb-6 text-[17px] font-semibold text-[#1d1d1f]">
                                <HugeiconsIcon icon={Store01Icon} size={20} className="text-[#1d1d1f]" />
                                Seller Information
                            </div>

                            <div className="bg-[#f5f5f7] rounded-[32px] p-6 border border-[#e5e5ea] flex flex-col sm:flex-row gap-6 items-start sm:items-center shadow-xs transition-all hover:shadow-sm">
                                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white flex items-center justify-center shrink-0 shadow-sm border border-[#d2d2d7]/30">
                                    {product.vendorId.logo ? (
                                        <BlurImage
                                            src={getCloudinaryUrl(product.vendorId.logo, { width: 200, quality: 'auto' })}
                                            alt={product.vendorId.storeName || "Store"}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="text-2xl font-bold text-[#0071e3]">
                                            {(product.vendorId.storeName || product.vendorId.name || "S").charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <h4 className="text-[19px] font-semibold text-[#1d1d1f] mb-1">
                                        {product.vendorId.storeName || product.vendorId.name}
                                    </h4>
                                    <p className="text-[#86868b] text-[14px] leading-relaxed line-clamp-2">
                                        {product.vendorId.storeDescription || "A verified premium seller on Zento, committed to delivering high-quality products and exceptional service."}
                                    </p>
                                    {product.vendorId.address && (
                                        <div className="mt-3 flex items-center gap-1.5 text-[13px] text-[#86868b] font-medium">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#32d74b]"></span>
                                            Ships from {product.vendorId.address.split(',').pop()?.trim() || product.vendorId.address}
                                        </div>
                                    )}
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-full border-[#d2d2d7] text-[#1d1d1f] hover:bg-white hover:border-[#0071e3] transition-all text-xs font-semibold px-5 h-9 shrink-0"
                                >
                                    Visit Store
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* More from this Seller */}
            {mappedVendorItems.length > 0 && (
                <div className="bg-white border-t border-[#e5e5ea]">
                    <div className="max-w-[1200px] mx-auto px-6 py-16 lg:py-24">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
                            <h2 className="text-3xl font-semibold text-[#1d1d1f] tracking-tight">More from this seller</h2>
                            {product.vendorId && typeof product.vendorId === 'object' && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-full border-[#d2d2d7] text-[#1d1d1f] hover:bg-white hover:border-[#0071e3] transition-all text-xs font-semibold px-6"
                                >
                                    View all from {product.vendorId.storeName || "this seller"}
                                </Button>
                            )}
                        </div>

                        <CardSlider
                            items={mappedVendorItems}
                            className="py-0!"
                        />
                    </div>
                </div>
            )}

            {/* Related Products */}
            {mappedRelatedItems.length > 0 && (
                <div className="bg-white border-t border-[#e5e5ea]">
                    <div className="max-w-[1200px] mx-auto px-6 py-16 lg:py-24">
                        <h2 className="text-3xl font-semibold text-[#1d1d1f] mb-12 tracking-tight text-center">You may also like</h2>
                        <CardSlider items={mappedRelatedItems} className="py-0!" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;