import { useState, useEffect, useId } from "react";
import { useParams, Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { Alert01Icon, ArrowRight01Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { useProducts } from "../../hooks/products/useProducts";
import { ProductCard, Product } from "../../components/ui/ProductCard";

interface EditorialAssets {
    heroImage: string;
    campaignImage: string;
    campaignTitle: string;
    campaignSub: string;
    collectionImg1: string; // Portrait
    collectionImg2: string; // Detail landscape
    collectionQuote: string;
    storytellingText: string;
    lookbookImage: string;
    lookbookQuote: string;
}

const DEFAULT_EDITORIAL: EditorialAssets = {
    heroImage: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1200&q=80",
    campaignImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=80",
    campaignTitle: "Mindful Proportions",
    campaignSub: "THE AW26 ESSENTIALS / Refined cuts and luxurious fabrications designed for lasting style.",
    collectionImg1: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80",
    collectionImg2: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80",
    collectionQuote: "“Sartorial precision meets effortless utility.”",
    storytellingText: "A collection built on modern essentials. Re-imagined silhouettes tailored with architectural precision and constructed in premium natural materials.",
    lookbookImage: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&q=80",
    lookbookQuote: "“Contrast structural tailoring with fluid, draped elements.”"
};

const CATEGORY_EDITORIALS: Record<string, EditorialAssets> = {
    women: {
        heroImage: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80",
        campaignImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80",
        campaignTitle: "Soft Structural Form",
        campaignSub: "THE WOMEN'S EDIT / Sculptural tailoring, lightweight linen, and fluid silhouettes.",
        collectionImg1: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80",
        collectionImg2: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80",
        collectionQuote: "“A clean silhouette is the foundation of luxury.”",
        storytellingText: "Designed for the modern woman. Sophisticated shapes crafted in fine wool, silk, and structured organic cotton, balancing soft drape with crisp tailoring.",
        lookbookImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
        lookbookQuote: "“Monochromatic layers define the summer wardrobe.”"
    },
    men: {
        heroImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80",
        campaignImage: "https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?auto=format&fit=crop&w=1600&q=80",
        campaignTitle: "Architectural Lines",
        campaignSub: "THE MEN'S EDIT / Relaxed proportions, structured wool coats, and refined textures.",
        collectionImg1: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
        collectionImg2: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80",
        collectionQuote: "“True luxury lies in structural simplicity.”",
        storytellingText: "Redefining contemporary menswear. Clean-cut shirts, oversized blazers, and premium knits constructed with close attention to drape and fit.",
        lookbookImage: "https://images.unsplash.com/photo-1505022610485-0249ba5b3675?auto=format&fit=crop&w=800&q=80",
        lookbookQuote: "“Layer structured outerwear over clean, fine-knit gauge wool.”"
    },
    footwear: {
        heroImage: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80",
        campaignImage: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1600&q=80",
        campaignTitle: "Sculpted Steps",
        campaignSub: "FOOTWEAR ARCHIVE / Italian-crafted leather shoes and architectural silhouettes.",
        collectionImg1: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
        collectionImg2: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=80",
        collectionQuote: "“Comfort meets structural artistry.”",
        storytellingText: "Hand-finished leather boots, precise loafers, and minimal trainers. Made in Italy using vegetable-tanned hides and custom-developed supportive insoles.",
        lookbookImage: "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?auto=format&fit=crop&w=800&q=80",
        lookbookQuote: "“Constructed on custom sculptural lasts for refined heel drape.”"
    },
    accessories: {
        heroImage: "https://images.unsplash.com/photo-1509319117193-57bab727e09d?auto=format&fit=crop&w=1200&q=80",
        campaignImage: "https://images.unsplash.com/photo-1509319117193-57bab727e09d?auto=format&fit=crop&w=1600&q=80",
        campaignTitle: "Tactile Accents",
        campaignSub: "SCULPTURAL PIECES / Recycled sterling silver jewelry and calfskin leather bags.",
        collectionImg1: "https://images.unsplash.com/photo-1509319117193-57bab727e09d?auto=format&fit=crop&w=800&q=80",
        collectionImg2: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
        collectionQuote: "“Details that define the space around them.”",
        storytellingText: "Subtle enhancements for the everyday. Hand-cast silver rings, modular leather accessories, and clean-framed luxury sunglasses designed to stand out.",
        lookbookImage: "https://images.unsplash.com/photo-1509319117193-57bab727e09d?auto=format&fit=crop&w=800&q=80",
        lookbookQuote: "“Minimalist styling requires striking, high-contrast hardware.”"
    }
};

const FocusProductCard = ({ product }: { product: Product }) => {
    return (
        <div className="lg:col-span-6 md:col-span-2 bg-[#F9F9F9] border border-[#E5E5E5] p-6 lg:p-8 flex flex-col justify-between h-full group relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center h-full">
                {/* Left: ProductCard */}
                <div className="h-full flex flex-col justify-center">
                    <ProductCard product={product} />
                </div>
                {/* Right: Editorial Quote & Styling */}
                <div className="flex flex-col justify-between h-full py-4 pl-0 md:pl-6 border-t md:border-t-0 md:border-l border-[#E5E5E5]">
                    <div>
                        <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-400 block mb-2">
                            Key Silhouette
                        </span>
                        <h3 className="text-[20px] font-light uppercase tracking-wider text-black leading-snug mb-4">
                            Selected Drape
                        </h3>
                        <p className="text-[13px] text-gray-600 leading-relaxed font-medium mb-6">
                            Architecturally patterned for a relaxed yet intentional shape. Crafted in a refined, breathable fabric blend that moves with ease.
                        </p>
                    </div>
                    
                    <div className="pt-4 border-t border-[#E5E5E5]">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-black block mb-2">
                            Styling Notes
                        </span>
                        <p className="text-[12px] text-gray-500 italic font-medium leading-relaxed">
                            "Contrast the structural shape with soft leather footwear and sculptural silver accessories for an effortless, modern uniform."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FullWidthProductCard = ({ product }: { product: Product }) => {
    return (
        <div className="lg:col-span-12 bg-[#F9F9F9] border border-[#E5E5E5] p-6 lg:p-10 flex flex-col md:flex-row gap-8 items-center justify-between group">
            <div className="flex-1 max-w-lg">
                <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-400 block mb-2">
                    Seasonal Highlight
                </span>
                <h3 className="text-[24px] font-light uppercase tracking-wider text-black mb-3">
                    The Editorial Statement
                </h3>
                <p className="text-[13px] text-gray-600 leading-relaxed font-medium mb-6">
                    An uncompromising focus on form and movement. Crafted from a premium organic blend, featuring a relaxed silhouette and architectural seam detailing.
                </p>
                <div className="text-[12px] text-gray-400 font-medium italic">
                    “Designed to stand alone or act as the grounding layer under structured seasonal coats.”
                </div>
            </div>
            <div className="w-full md:w-[320px] bg-white p-4 border border-[#E5E5E5] shrink-0">
                <ProductCard product={product} />
            </div>
        </div>
    );
};

const CategoryPage = () => {
    const { name } = useParams<{ name: string }>();
    const [searchInput, setSearchInput] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const searchInputId = useId();

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchInput);
        }, 600);
        return () => clearTimeout(handler);
    }, [searchInput]);

    const { data: products = [], isLoading, isError } = useProducts({ 
        category: name, 
        keyword: debouncedSearch, 
        limit: 50 
    });

    if (isError) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6 bg-white">
                <HugeiconsIcon icon={Alert01Icon} size={48} className="text-gray-300 mb-6" />
                <h2 className="text-2xl font-semibold text-gray-900">Something went wrong.</h2>
                <p className="mt-2 text-gray-500 max-w-sm mb-8">We couldn't load the products for this category. Please try again later.</p>
                <Link to="/" className="text-black font-semibold hover:underline flex items-center gap-1 uppercase tracking-wider text-xs">
                    Go back to home
                    <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
                </Link>
            </div>
        );
    }

    const hasSearchActive = debouncedSearch.trim().length > 0;
    const categoryKey = name?.toLowerCase() || "";
    
    // Retrieve curated images/texts
    const editorial = CATEGORY_EDITORIALS[categoryKey] || {
        ...DEFAULT_EDITORIAL,
        campaignTitle: `${name} Edit`,
        campaignSub: `THE ${name?.toUpperCase()} SELECTION / Refined essentials crafted for lasting style.`
    };

    const heroImg = CATEGORY_HERO_IMAGES[categoryKey] || editorial.heroImage;

    // Slices for Luxury Layout
    // Featured mosaic: up to 6 products
    const featuredProducts = products.slice(0, Math.min(products.length, 6));
    let nextIndex = featuredProducts.length;

    // Product Grid 1: up to 12 products
    const grid1Products = products.slice(nextIndex, Math.min(products.length, nextIndex + 12));
    nextIndex += grid1Products.length;

    // Editor's picks: up to 4 products
    const editorsPicks = products.slice(nextIndex, Math.min(products.length, nextIndex + 4));
    nextIndex += editorsPicks.length;

    // Complete the Look: up to 2 products
    const lookbookProducts = products.slice(nextIndex, Math.min(products.length, nextIndex + 2));
    nextIndex += lookbookProducts.length;

    // Product Grid 2 / Trending: up to 12 products
    const grid2Products = products.slice(nextIndex, Math.min(products.length, nextIndex + 12));
    nextIndex += grid2Products.length;

    // Remaining
    const remainingProducts = products.slice(nextIndex);

    // Layout configuration
    const showEditorialLayout = products.length >= 4 && !hasSearchActive;

    return (
        <div className="w-full bg-white min-h-screen font-sans">
            
            {/* Category Hero Block */}
            <header className="max-w-[1440px] mx-auto px-4 md:px-10 py-12 md:py-16 border-b border-[#E5E5E5]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                    
                    {/* Hero Info (Left Column) */}
                    <div>
                        {/* Breadcrumbs */}
                        <nav className="flex items-center text-[11px] font-semibold text-gray-400 mb-4 tracking-[0.1em] uppercase">
                            <Link to="/" className="hover:text-black transition-colors">Home</Link>
                            <HugeiconsIcon icon={ArrowRight01Icon} size={10} className="mx-2 opacity-40" />
                            <span className="text-black font-medium">{name}</span>
                        </nav>

                        <h1 className="text-[36px] md:text-[56px] font-light leading-tight text-black uppercase tracking-[0.05em] mb-4">
                            {name}
                        </h1>

                        <p className="text-[14px] text-[#767676] max-w-lg leading-relaxed mb-8 font-medium">
                            {editorial.storytellingText}
                        </p>

                        {/* Search Input & Item Count */}
                        <div className="flex flex-wrap items-center gap-6 pt-2">
                            <div className="relative w-full max-w-xs group">
                                <div className="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none">
                                    <HugeiconsIcon icon={Search01Icon} size={15} className="text-gray-400 group-focus-within:text-black transition-colors" />
                                </div>
                                <label htmlFor={searchInputId} className="sr-only">Search products</label>
                                <input
                                    id={searchInputId}
                                    type="text"
                                    placeholder={`Search in ${name}...`}
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    className="w-full pl-7 pr-3 py-2 bg-transparent border-0 border-b border-gray-200 text-black placeholder:text-gray-300 focus:outline-none focus:border-black transition-colors font-medium text-xs tracking-wider"
                                />
                            </div>

                            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.15em] shrink-0">
                                {isLoading ? (
                                    <span className="block w-4 h-4 border-2 border-stone-200 border-t-black rounded-full animate-spin" />
                                ) : (
                                    `${products.length} ${products.length === 1 ? 'Item' : 'Items'}`
                                )}
                            </span>
                        </div>
                    </div>

                    {/* Hero Image Banner (Right Column) */}
                    <div className="relative h-[260px] sm:h-[350px] lg:h-[400px] bg-stone-100 overflow-hidden group select-none">
                        <img
                            src={heroImg}
                            alt={`${name} collection cover`}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-102"
                        />
                        <div className="absolute inset-0 bg-black/10" />
                    </div>

                </div>
            </header>

            {/* Main Product / Editorial Content Area */}
            <main className="w-full py-12">
                {isLoading ? (
                    /* Skeleton Loading States */
                    <div className="max-w-[1440px] mx-auto px-4 md:px-10">
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-12">
                            {[...Array(10)].map((_, i) => (
                                <div key={i} className="flex flex-col gap-3">
                                    <div className="aspect-[3/4] bg-stone-100 animate-pulse" />
                                    <div className="h-4 bg-stone-100 animate-pulse w-3/4" />
                                    <div className="h-4 bg-stone-100 animate-pulse w-1/3" />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : products.length === 0 ? (
                    /* No results */
                    <div className="text-center py-24 px-6 max-w-md mx-auto">
                        <p className="text-[18px] text-[#767676] font-medium italic mb-4">No results found for your search.</p>
                        <button
                            onClick={() => setSearchInput("")}
                            className="text-[13px] font-semibold text-black underline underline-offset-8 uppercase tracking-widest"
                        >
                            View all items
                        </button>
                    </div>
                ) : showEditorialLayout ? (
                    /* ---------------------------------------------------- */
                    /* LUXURY EDITORIAL SHOPPING LAYOUT                    */
                    /* ---------------------------------------------------- */
                    <div className="space-y-24">
                        
                        {/* Section 1: Featured Products Mosaic */}
                        <section className="max-w-[1440px] mx-auto px-4 md:px-10">
                            <h2 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#767676] mb-8 text-center md:text-left">
                                Featured Mosaic
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
                                {featuredProducts.length > 0 && (
                                    <FocusProductCard product={featuredProducts[0]} />
                                )}

                                <div className="lg:col-span-6 md:col-span-2 grid grid-cols-2 gap-6 lg:gap-8">
                                    {featuredProducts.slice(1, 5).map((product) => (
                                        <ProductCard key={product._id} product={product} />
                                    ))}
                                </div>

                                {featuredProducts.length === 6 && (
                                    <FullWidthProductCard product={featuredProducts[5]} />
                                )}
                            </div>
                        </section>

                        {/* Section 2: Campaign Banner */}
                        <section className="w-full relative h-[380px] md:h-[500px] bg-stone-900 overflow-hidden select-none group">
                            <img
                                src={editorial.campaignImage}
                                alt={`${name} Campaign`}
                                className="absolute inset-0 w-full h-full object-cover opacity-85 transition-transform duration-[2s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-102"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                            <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6">
                                <span className="text-[11px] font-semibold uppercase tracking-[0.35em] text-white/80 mb-4">
                                    Campaign Editorial
                                </span>
                                <h2 className="text-[32px] md:text-[52px] font-light tracking-[0.1em] text-white uppercase max-w-2xl leading-tight mb-4">
                                    {editorial.campaignTitle}
                                </h2>
                                <p className="text-[11px] md:text-[13px] font-semibold text-white/90 uppercase tracking-[0.2em] max-w-lg border-t border-white/20 pt-4">
                                    {editorial.campaignSub}
                                </p>
                            </div>
                        </section>

                        {/* Section 3: Product Grid 1 (New Arrivals) */}
                        {grid1Products.length > 0 && (
                            <section className="max-w-[1440px] mx-auto px-4 md:px-10">
                                <div className="border-b border-[#E5E5E5] pb-4 mb-8 flex items-baseline justify-between">
                                    <h2 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-black">
                                        New Arrivals
                                    </h2>
                                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
                                        Collection Edit
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                                    {grid1Products.map((product) => (
                                        <ProductCard key={product._id} product={product} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Section 4: Collection Inter-row Storytelling */}
                        <section className="max-w-[1440px] mx-auto px-4 md:px-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
                                {/* Left Portrait Image */}
                                <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden group select-none">
                                    <img
                                        src={editorial.collectionImg1}
                                        alt="Refined detail collection"
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-102"
                                    />
                                    <div className="absolute inset-0 bg-black/5" />
                                    <div className="absolute bottom-6 left-6 right-6 text-white">
                                        <span className="text-white text-[10px] font-semibold uppercase tracking-[0.25em] block mb-1 opacity-70">
                                            Detail Focus
                                        </span>
                                        <p className="text-white text-[18px] font-light tracking-wide uppercase leading-tight">
                                            Art of Drape
                                        </p>
                                    </div>
                                </div>
                                {/* Right Detail Column */}
                                <div className="flex flex-col justify-between h-full py-6 md:py-8">
                                    <div className="max-w-md mb-8">
                                        <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-400 block mb-3">
                                            Material & Context
                                        </span>
                                        <blockquote className="text-[22px] md:text-[26px] font-light italic leading-snug text-black mb-6">
                                            {editorial.collectionQuote}
                                        </blockquote>
                                        <p className="text-[13px] text-gray-500 leading-relaxed font-medium mb-8">
                                            {editorial.storytellingText}
                                        </p>
                                    </div>
                                    
                                    <div className="relative aspect-[16/10] bg-stone-100 overflow-hidden group w-full select-none">
                                        <img
                                            src={editorial.collectionImg2}
                                            alt="Refined materials detail"
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-102"
                                        />
                                        <div className="absolute inset-0 bg-black/5" />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section 5: Editor's Picks (Side-by-Side display) */}
                        {editorsPicks.length > 0 && (
                            <section className="w-full bg-[#F9F9F9] border-y border-[#E5E5E5] py-20">
                                <div className="max-w-[1440px] mx-auto px-4 md:px-10">
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
                                        
                                        {/* Editor's Note Column */}
                                        <div className="lg:col-span-4 flex flex-col justify-between min-h-[350px]">
                                            <div>
                                                <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#767676] mb-3 block">
                                                    Curated Selection
                                                </span>
                                                <h3 className="text-[28px] font-light tracking-[0.05em] text-black uppercase mb-6 leading-tight">
                                                    Editor's Picks
                                                </h3>
                                                <p className="text-[14px] text-[#222222] leading-relaxed mb-6 font-medium">
                                                    “A study in architectural form, modern drape, and subtle tonality. Our creative director hand-selects the season's most essential wardrobe pillars.”
                                                </p>
                                            </div>
                                            <div className="pt-6 border-t border-[#E5E5E5] mt-auto">
                                                <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-black block mb-1">
                                                    Sartorial Direction
                                                </span>
                                                <p className="text-[12px] text-gray-500 font-medium">
                                                    Focusing on structural integrity, sustainable fiber source, and clean shapes.
                                                </p>
                                            </div>
                                        </div>

                                        {/* Products Column */}
                                        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
                                            {editorsPicks.slice(0, 3).map((product) => (
                                                <div key={product._id} className="bg-white p-4 border border-[#E5E5E5] relative group">
                                                    <div className="absolute top-6 left-6 z-10 bg-black text-white text-[9px] font-semibold uppercase tracking-widest px-2 py-0.5">
                                                        Editor's Choice
                                                    </div>
                                                    <ProductCard product={product} />
                                                </div>
                                            ))}
                                        </div>

                                    </div>

                                    {/* Render 4th editor's choice if available */}
                                    {editorsPicks.length === 4 && (
                                        <div className="mt-8 border-t border-[#E5E5E5] pt-8 flex justify-end">
                                            <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 items-center bg-white p-6 border border-[#E5E5E5]">
                                                <div>
                                                    <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-400 block mb-1">
                                                        Featured Core Choice
                                                    </span>
                                                    <h4 className="text-[18px] font-light uppercase tracking-wider text-black mb-3">
                                                        The Tailoring Icon
                                                    </h4>
                                                    <p className="text-[13px] text-gray-500 leading-relaxed font-medium">
                                                        This item stands as the quintessential center point of our styling atelier's daily wardrobe coordinates.
                                                    </p>
                                                </div>
                                                <ProductCard product={editorsPicks[3]} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        {/* Section 6: Lookbook / Complete-The-Look Block */}
                        {lookbookProducts.length > 0 && (
                            <section className="max-w-[1440px] mx-auto px-4 md:px-10">
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-stretch">
                                    
                                    {/* Lookbook Campaign Image */}
                                    <div className="lg:col-span-5 relative min-h-[450px] bg-stone-100 overflow-hidden group select-none">
                                        <img
                                            src={editorial.lookbookImage}
                                            alt="Styling Atelier Lookbook"
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black/10 transition-opacity duration-500 group-hover:bg-black/15" />
                                        <div className="absolute bottom-8 left-8 right-8 text-white">
                                            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] block mb-2 opacity-80">
                                                Styling Atelier
                                            </span>
                                            <p className="text-lg font-light italic leading-relaxed text-white/95 max-w-sm">
                                                {editorial.lookbookQuote}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Shoppable Products */}
                                    <div className="lg:col-span-7 flex flex-col justify-between py-2">
                                        <div className="mb-8 border-b border-[#E5E5E5] pb-6 flex items-baseline justify-between">
                                            <div>
                                                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#767676] block mb-1">
                                                    Complete the Look
                                                </span>
                                                <h3 className="text-[24px] font-light tracking-[0.05em] text-black uppercase">
                                                    Sartorial Styling
                    </h3>
                                            </div>
                                            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest hidden sm:inline">
                                                Outfit Coordinates
                                            </span>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
                                            {lookbookProducts.map((product, idx) => (
                                                <div key={product._id} className="relative">
                                                    <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-sm text-black text-[9px] font-semibold uppercase tracking-widest px-2 py-0.5 border border-[#E5E5E5]">
                                                        Piece {idx === 0 ? "One" : "Two"}
                                                    </div>
                                                    <ProductCard product={product} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                </div>
                            </section>
                        )}

                        {/* Section 7: Product Grid 2 (Trending Products) */}
                        {grid2Products.length > 0 && (
                            <section className="max-w-[1440px] mx-auto px-4 md:px-10">
                                <div className="border-b border-[#E5E5E5] pb-4 mb-8 flex items-baseline justify-between">
                                    <h2 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-black">
                                        Trending Now
                                    </h2>
                                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
                                        High Demand
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                                    {grid2Products.map((product) => (
                                        <ProductCard key={product._id} product={product} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Section 8: Seasonal Banner */}
                        <section className="w-full relative h-[280px] md:h-[350px] bg-stone-950 overflow-hidden select-none flex items-center justify-center border-y border-[#E5E5E5]">
                            <div className="absolute inset-0 bg-[#F9F9F9]" />
                            <div className="relative text-center px-6 max-w-xl">
                                <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-gray-400 block mb-4">
                                    Novara Capsule
                                </span>
                                <h2 className="text-[24px] md:text-[36px] font-light tracking-[0.1em] text-black uppercase leading-tight mb-4">
                                    Seasonal Refinements
                                </h2>
                                <p className="text-[13px] text-gray-500 font-medium leading-relaxed mb-6">
                                    A conscious curation of shapes and shades, blending structural rigidity with fluid forms. Entirely crafted from responsible organic fibers.
                                </p>
                                <div className="inline-block border-b border-black text-[11px] font-semibold uppercase tracking-[0.2em] text-black hover:border-transparent transition-colors cursor-pointer pb-0.5">
                                    Discover the Material Philosophy
                                </div>
                            </div>
                        </section>

                        {/* Section 9: Remaining Products */}
                        {remainingProducts.length > 0 && (
                            <section className="max-w-[1440px] mx-auto px-4 md:px-10">
                                <div className="border-b border-[#E5E5E5] pb-4 mb-8">
                                    <h2 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#767676]">
                                        More to Discover
                                    </h2>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                                    {remainingProducts.map((product) => (
                                        <ProductCard key={product._id} product={product} />
                                    ))}
                                </div>
                            </section>
                        )}

                    </div>
                ) : (
                    /* ---------------------------------------------------- */
                    /* STANDARD FALLBACK GRID (Fewer products / Search active)*/
                    /* ---------------------------------------------------- */
                    <div className="max-w-[1440px] mx-auto px-4 md:px-10">
                        {hasSearchActive && (
                            <div className="border-b border-[#E5E5E5] pb-4 mb-8">
                                <h2 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gray-400">
                                    Search Results for "{debouncedSearch}"
                                </h2>
                            </div>
                        )}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12">
                            {products.map((product) => (
                                <ProductCard
                                    key={product._id}
                                    product={product}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </main>

            {/* Footer Pagination / All Items Loaded Indicator */}
            {!isLoading && products.length > 0 && (
                <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-12 border-t border-[#E5E5E5] text-center">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#767676]">
                        All {products.length} {products.length === 1 ? 'Item' : 'Items'} Loaded
                    </span>
                </div>
            )}

            {/* Final Divider */}
            <div className="w-full h-px bg-gray-100" />
        </div>
    );
};

const CATEGORY_HERO_IMAGES: Record<string, string> = {
    women: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80",
    men: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80",
    footwear: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80",
    accessories: "https://images.unsplash.com/photo-1509319117193-57bab727e09d?auto=format&fit=crop&w=1200&q=80",
    streetwear: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1200&q=80",
    luxury: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1200&q=80",
    "casual wear": "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=1200&q=80",
    "formal wear": "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1200&q=80"
};

export default CategoryPage;

