import CardSlider from "../../components/ui/CardSlider";
import { useHomeRecommendations } from "../../hooks/useHomeRecommendations";
import { useProducts } from "../../hooks/products/useProducts";
import { useAuth } from "../../context/authContext";
import { HugeiconsIcon } from "@hugeicons/react";
import { Loading03Icon } from "@hugeicons/core-free-icons";

/**
 * TrendingProducts — Displays globally trending products.
 * Uses personalized API data for logged-in users, generic products for guests.
 */
const TrendingProducts = () => {
    const { isAuthenticated } = useAuth();

    // For authenticated users, pull trending from the recommendation API
    const { data: recData, isLoading: recLoading } = useHomeRecommendations();

    // Fallback: generic products for guests
    const { data: genericProducts, isLoading: genericLoading } = useProducts({ limit: 8 });

    const isLoading = isAuthenticated ? recLoading : genericLoading;
    
    const trendingModule = recData?.find(m => m.type === 'trending');
    const products = isAuthenticated ? (trendingModule?.products || []) : (genericProducts || []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-28 min-h-[400px]">
                <HugeiconsIcon icon={Loading03Icon} size={32} className="animate-spin text-[#86868b]" />
            </div>
        );
    }

    if (!products || products.length === 0) return null;

    return (
        <section className="py-28 bg-[#f5f5f7] font-sans relative overflow-hidden">
            <CardSlider
                title={trendingModule?.title || "Trending Now"}
                subtitle={trendingModule?.subtitle || "What everyone's loving right now."}
                items={products}
                viewAllLink="/shop"
                viewAllText="See All"
                className="bg-[#f5f5f7]"
            />
        </section>
    );
};

export default TrendingProducts;
