import CardSlider from "../../components/ui/CardSlider";
import { useRecommendations } from "../../hooks/useRecommendations";
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
    const { data: recData, isLoading: recLoading } = useRecommendations();

    // Fallback: generic products for guests
    const { data: genericProducts, isLoading: genericLoading } = useProducts({ limit: 8 });

    const isLoading = isAuthenticated ? recLoading : genericLoading;
    const products = isAuthenticated ? (recData?.trending || []) : (genericProducts || []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-24 min-h-[400px]">
                <HugeiconsIcon icon={Loading03Icon} size={32} className="animate-spin text-neutral-400" />
            </div>
        );
    }

    if (!products || products.length === 0) return null;

    return (
        <section className="py-24 bg-[#fafafa] font-sans relative overflow-hidden">
            <CardSlider
                title="Trending Now"
                subtitle="What everyone's loving right now."
                items={products}
                viewAllLink="/shop"
                viewAllText="See All"
                className="bg-[#fafafa]"
            />
        </section>
    );
};

export default TrendingProducts;
