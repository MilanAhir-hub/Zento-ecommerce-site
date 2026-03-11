import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import CardSlider from "../../components/ui/CardSlider";
import { ChevronRight, Heart, ShoppingCart, ShieldCheck, Truck, RefreshCcw, Sparkles, Send, Star } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// --- API Fetchers ---
const fetchProduct = async (id: string) => {
    const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
    return data.data;
};

const fetchCategoryProducts = async (category: string) => {
    const { data } = await axios.get(`http://localhost:5000/api/products/category/${category}?limit=15`);
    return data.data;
};

const submitReview = async (_data: { productId: string, reviewText: string, rating: number }) => {
    // In a real app, you'd send the JWT token here. For dummy UI purposes right now, we'll mock the submission delay.
    return new Promise(resolve => setTimeout(resolve, 800));
};

const ProductDetail = () => {
    const { id } = useParams<{ id: string }>();
    const queryClient = useQueryClient();

    // UI State
    const [activeImage, setActiveImage] = useState(0);
    const [showReviewInput, setShowReviewInput] = useState(false);
    const [reviewText, setReviewText] = useState("");
    const [selectedRating, setSelectedRating] = useState(5);

    // Queries
    const { data: product, isLoading, isError } = useQuery({
        queryKey: ['product', id],
        queryFn: () => fetchProduct(id!),
        enabled: !!id,
    });

    const { data: relatedProducts } = useQuery({
        queryKey: ['products', 'category', product?.category],
        queryFn: () => fetchCategoryProducts(product!.category),
        enabled: !!product?.category,
    });

    // Mutation
    const reviewMutation = useMutation({
        mutationFn: submitReview,
        onSuccess: () => {
            setShowReviewInput(false);
            setReviewText("");
            alert("Review submitted successfully! (Mocked)");
            queryClient.invalidateQueries({ queryKey: ['product', id] });
        }
    });

    if (isLoading) {
        return (
            <div className="bg-stone-50 min-h-screen py-20 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-500"></div>
            </div>
        );
    }

    if (isError || !product) {
        return (
            <div className="bg-stone-50 min-h-screen py-20 flex flex-col items-center gap-4 text-stone-500">
                <ShieldCheck className="w-12 h-12 text-red-500 opacity-50" />
                <p className="font-medium text-xl">Product not found.</p>
                <Link to="/" className="text-stone-500 hover:underline">Return to Home</Link>
            </div>
        );
    }

    // Map backend data to UI requirements. Use fallbacks for complex arrays the standard backend model doesn't have yet.
    const price = product.price || 0;
    const oldPrice = product.oldPrice || 0;
    const discountPercent = oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

    // We only have one image URL from the Pexels seed, so duplicate it for the gallery mock
    const images = [product.imageUrl, product.imageUrl, product.imageUrl, product.imageUrl];

    const mappedRelatedItems = relatedProducts?.filter((p: any) => p._id !== product._id).map((p: any) => ({
        ...p,
        id: p._id
    })) || [];

    return (
        <div className="bg-white min-h-screen py-8 font-sans">
            <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Breadcrumbs */}
                <nav className="flex items-center text-sm text-stone-500 mb-8 font-medium">
                    <Link to="/" className="hover:text-stone-900 transition-colors">Home</Link>
                    <ChevronRight className="w-4 h-4 mx-2" />
                    <Link to={`/category/${product.category}`} className="hover:text-stone-900 transition-colors">{product.category}</Link>
                    <ChevronRight className="w-4 h-4 mx-2" />
                    <span className="text-stone-900 truncate max-w-[200px] sm:max-w-xs">{product.title}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 pb-16 border-b border-stone-100">

                    {/* LEFT COLUMN: Media Gallery */}
                    <div className="flex flex-col">
                        <div className="lg:sticky lg:top-24">

                            {/* Main Image */}
                            <div className="relative aspect-square bg-white border border-stone-100 rounded-lg overflow-hidden mb-4 flex items-center justify-center group">
                                <img
                                    src={images[activeImage]}
                                    alt={product.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                {/* Action Buttons Overlay */}
                                <div className="absolute top-4 right-4 z-10">
                                    <button className="bg-white/80 backdrop-blur-sm rounded-full p-3 text-stone-400 hover:text-stone-900 hover:bg-stone-50 transition-all border border-stone-200 active:scale-95">
                                        <Heart className="w-6 h-6 transition-colors" />
                                    </button>
                                </div>
                                {/* Discount Badge */}
                                {discountPercent > 0 && (
                                    <div className="absolute top-4 left-4 z-10 bg-red-500 text-white font-bold text-xs px-3 py-1.5 rounded shadow-sm tracking-wide">
                                        {discountPercent}% OFF
                                    </div>
                                )}
                            </div>

                            {/* Thumbnails Row */}
                            <div className="flex gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(idx)}
                                        className={`shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all p-1 bg-white ${activeImage === idx ? 'border-stone-500 shadow-sm' : 'border-stone-200 hover:border-stone-300 opacity-70 hover:opacity-100'}`}
                                    >
                                        <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-contain" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>


                    {/* RIGHT COLUMN: Product Details */}
                    <div className="flex flex-col pt-6 lg:pt-0">

                        {/* Brand & Title */}
                        <div className="mb-2">
                            <span className="text-blue-700 font-bold text-sm uppercase tracking-wider">{product.category}</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 leading-tight mb-4">
                            {product.title}
                        </h1>

                        {/* Ratings (Mock) */}
                        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-stone-100">
                            <div className="flex items-center bg-stone-100 text-stone-800 px-2 py-1 rounded text-sm font-bold">
                                4.5 ★
                            </div>
                            <span className="text-sm text-stone-500 hover:text-stone-900 cursor-pointer transition-colors">
                                214 Ratings & Reviews
                            </span>
                        </div>

                        {/* Pricing Section */}
                        <div className="mb-8">
                            <div className="flex items-end gap-3 mb-2">
                                <span className="text-4xl font-extrabold text-stone-900">
                                    ₹{price.toFixed(2)}
                                </span>
                                {oldPrice > price && (
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-lg text-stone-400 line-through">
                                            ₹{oldPrice.toFixed(2)}
                                        </span>
                                        <span className="text-sm font-bold text-green-600">
                                            You Save ₹{(oldPrice - price).toFixed(2)}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-stone-500">Inclusive of all taxes</p>
                        </div>

                        {/* Actions (Add to Cart / Buy Now) */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <button className="flex-1 flex items-center justify-center border border-stone-900 gap-2 text-stone-900 font-bold text-lg py-4 px-8 rounded-full transition-all hover:bg-stone-50 active:scale-[0.98]">
                                <ShoppingCart className="w-5 h-5" />
                                Add to Cart
                            </button>
                            <button className="flex-1 flex items-center justify-center border bg-stone-900 gap-2 text-white font-bold text-lg py-4 px-8 rounded-full transition-all hover:bg-black shadow-md active:scale-[0.98]">
                                Buy Now
                            </button>
                        </div>

                        {/* Delivery & Services Snippet */}
                        <div className="mb-8 space-y-4 py-4 border-y border-stone-100">
                            <div className="flex items-start gap-4">
                                <div className="bg-stone-50 flex items-center justify-center w-10 h-10 border border-stone-200 rounded-full shrink-0">
                                    <Truck className="w-5 h-5 text-stone-700" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-stone-900 text-sm mt-0.5">Free Delivery</h4>
                                    <p className="text-sm text-stone-500 mt-0.5">Order within 2 hrs for delivery by tomorrow</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-stone-50 flex items-center justify-center w-10 h-10 border border-stone-200 rounded-full shrink-0">
                                    <RefreshCcw className="w-5 h-5 text-stone-700" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-stone-900 text-sm mt-0.5">7 Days Replacement</h4>
                                    <p className="text-sm text-stone-500 mt-0.5">Easy returns if the product is defective</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-stone-50 flex items-center justify-center w-10 h-10 border border-stone-200 rounded-full shrink-0">
                                    <ShieldCheck className="w-5 h-5 text-stone-700" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-stone-900 text-sm mt-0.5">1 Year Warranty</h4>
                                    <p className="text-sm text-stone-500 mt-0.5">Brand warranty against manufacturing defects</p>
                                </div>
                            </div>
                        </div>

                        {/* Product Key Features */}
                        <div className="mb-8 border-b border-stone-100 pb-8">
                            <h3 className="text-lg font-bold text-stone-900 mb-4 pb-2">Key Features</h3>
                            <ul className="space-y-3">
                                {(product.features || [
                                    "Premium build quality for long-lasting durability.",
                                    "Designed with modern aesthetics and functionality in mind.",
                                    "Lightweight and optimized for everyday use.",
                                    "Manufactured using eco-friendly materials.",
                                    "1-Year comprehensive warranty included."
                                ]).map((feature: string, idx: number) => (
                                    <li key={idx} className="flex items-start">
                                        <span className="text-stone-400 mr-2 mt-2 min-w-[6px] h-1.5 rounded-full bg-stone-300"></span>
                                        <span className="text-stone-700 text-sm leading-relaxed">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Description */}
                        <div className="mb-8 border-b border-stone-100 pb-8">
                            <h3 className="text-lg font-bold text-stone-900 mb-4 pb-2">Description</h3>
                            <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-line">
                                {product.description}
                            </p>
                        </div>

                        {/* Specifications Table */}
                        <div className="pb-4">
                            <h3 className="text-lg font-bold text-stone-900 mb-4 pb-2">Specifications</h3>
                            <div className="border-t border-stone-100">
                                {(product.specifications || [
                                    { label: "Category", value: product.category },
                                    { label: "Availability", value: product.stock && product.stock > 0 ? "In Stock" : "Out of Stock" },
                                    { label: "Delivery", value: "Standard / Express" },
                                    { label: "Return Policy", value: "7 Days Easy Return" },
                                    { label: "Condition", value: "Brand New" }
                                ]).map((spec: any, idx: number) => (
                                    <div key={idx} className="flex py-3 text-sm border-b border-stone-100">
                                        <span className="w-1/3 text-stone-500 font-medium">{spec.label}</span>
                                        <span className="w-2/3 text-stone-900 font-medium">{spec.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

                {/* AI Q&A Section */}
                <div className="py-16 border-b border-stone-100">
                    <h3 className="text-xl font-bold text-stone-900 mb-2 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-stone-500" />
                        Get answers of your question
                    </h3>
                    <p className="text-stone-500 text-sm mb-6">Ask our AI chatbot anything about this product.</p>

                    <div className="flex items-center gap-3">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="E.g., Is this bag water resistant?"
                                className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-full text-base focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 transition-all placeholder:text-stone-400 text-stone-900"
                            />
                        </div>
                        <button className="bg-stone-900 hover:bg-black text-white font-bold px-8 py-4 rounded-full cursor-pointer transition-colors active:scale-95 flex items-center gap-2 shadow-sm">
                            <span>Ask AI</span>
                            <Send className="w-4 h-4 ml-1" />
                        </button>
                    </div>
                </div>

                {/* Ratings & Reviews Section */}
                <div className="py-16 border-b border-stone-100">
                    <h3 className="text-xl font-bold text-stone-900 mb-8 pb-4">Ratings & Reviews</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
                        {/* Left Column: Rating Distribution */}
                        <div>
                            <div className="flex items-center gap-6 mb-8">
                                <div className="text-6xl font-extrabold text-stone-900 tracking-tighter">4.5</div>
                                <div className="flex flex-col gap-1">
                                    <div className="flex text-stone-900">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star key={star} className="w-5 h-5 fill-current" />
                                        ))}
                                    </div>
                                    <p className="text-stone-500 text-sm font-medium">Based on 214 ratings</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {[
                                    { stars: 5, width: '65%' },
                                    { stars: 4, width: '20%' },
                                    { stars: 3, width: '8%' },
                                    { stars: 2, width: '4%' },
                                    { stars: 1, width: '3%' }
                                ].map((bar) => (
                                    <div key={bar.stars} className="flex items-center text-sm gap-3">
                                        <div className="w-4 text-stone-900 font-bold text-right">{bar.stars}</div>
                                        <Star className="w-3.5 h-3.5 text-stone-900 fill-current" />
                                        <div className="flex-1 bg-stone-100 h-1.5 rounded-full overflow-hidden">
                                            <div className="bg-stone-900 h-full rounded-full" style={{ width: bar.width }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Column: Write a Review */}
                        <div className="border-t md:border-t-0 md:border-l border-stone-100 pt-8 md:pt-0 md:pl-16 flex flex-col justify-center h-full">
                            <h4 className="text-2xl font-bold text-stone-900 mb-2">Review this product</h4>
                            <p className="text-base text-stone-500 mb-8">Help others make an informed decision!</p>

                            <div className="flex gap-3 mb-8">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        onClick={() => setSelectedRating(star)}
                                        className={`w-10 h-10 cursor-pointer transition-colors ${star <= selectedRating
                                            ? "text-stone-900 fill-stone-900 hover:scale-105"
                                            : "text-stone-200 hover:text-stone-400 hover:fill-stone-400 hover:scale-105"
                                            }`}
                                    />
                                ))}
                            </div>

                            {!showReviewInput ? (
                                <button
                                    onClick={() => setShowReviewInput(true)}
                                    className="bg-stone-900 hover:bg-black text-white font-bold py-3.5 px-8 rounded-full transition-colors w-max active:scale-95"
                                >
                                    Write a Review
                                </button>
                            ) : (
                                <div className="space-y-5 animate-in fade-in duration-300 w-full">
                                    <textarea
                                        rows={4}
                                        value={reviewText}
                                        onChange={(e) => setReviewText(e.target.value)}
                                        placeholder="Put your honest review here..."
                                        className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-2xl text-base text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 transition-all resize-none"
                                    ></textarea>
                                    <button
                                        disabled={reviewMutation.isPending || !reviewText.trim()}
                                        onClick={() => reviewMutation.mutate({ productId: id!, reviewText, rating: selectedRating })}
                                        className="bg-stone-900 hover:bg-black active:bg-stone-800 text-white font-bold py-3.5 px-8 rounded-full transition-colors w-max disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {reviewMutation.isPending ? "Submitting..." : "Submit Review"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>

            {/* You May Also Like Slider */}
            {mappedRelatedItems.length > 0 && (
                <div className="pt-16 pb-8">
                    <CardSlider
                        title="You may also like"
                        subtitle="Similar products you might be interested in."
                        items={mappedRelatedItems}
                    />
                </div>
            )}
        </div>
    );
};

export default ProductDetail;