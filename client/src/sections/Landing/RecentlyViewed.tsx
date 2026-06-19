import CardSlider from "../../components/ui/CardSlider";
import { useHomeRecommendations } from "../../hooks/useHomeRecommendations";
import { useAuth } from "../../context/authContext";
import { HugeiconsIcon } from "@hugeicons/react";
import { Loading03Icon } from "@hugeicons/core-free-icons";

/**
 * RecentlyViewed — Shows the user's recently viewed products.
 * Only renders for authenticated users who have browsing history.
 */
const RecentlyViewed = () => {
    const { isAuthenticated } = useAuth();
    const { data: recData, isLoading } = useHomeRecommendations();

    // Don't render at all for guests
    if (!isAuthenticated) return null;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-28 min-h-[400px]">
                <HugeiconsIcon icon={Loading03Icon} size={32} className="animate-spin text-[#86868b]" />
            </div>
        );
    }

    const recentlyViewedModule = recData?.find(m => m.type === 'recently_viewed');
    const products = recentlyViewedModule?.products || [];

    if (products.length === 0) return null;

    return (
        <section className="py-28 bg-white font-sans relative overflow-hidden">
            <CardSlider
                title={recentlyViewedModule?.title || "Recently Viewed"}
                subtitle={recentlyViewedModule?.subtitle || "Pick up where you left off."}
                items={products}
                viewAllLink="/shop"
                viewAllText="View All"
            />
        </section>
    );
};

export default RecentlyViewed;
