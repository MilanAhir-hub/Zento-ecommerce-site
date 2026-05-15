import CardSlider from "../../components/ui/CardSlider";
import { useRecommendations } from "../../hooks/useRecommendations";
import { useAuth } from "../../context/authContext";
import { HugeiconsIcon } from "@hugeicons/react";
import { Loading03Icon } from "@hugeicons/core-free-icons";

/**
 * RecentlyViewed — Shows the user's recently viewed products.
 * Only renders for authenticated users who have browsing history.
 */
const RecentlyViewed = () => {
    const { isAuthenticated } = useAuth();
    const { data: recData, isLoading } = useRecommendations();

    // Don't render at all for guests
    if (!isAuthenticated) return null;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-24 min-h-[400px]">
                <HugeiconsIcon icon={Loading03Icon} size={32} className="animate-spin text-neutral-400" />
            </div>
        );
    }

    const products = recData?.recentlyViewed || [];

    // Don't render if no recently viewed products
    if (products.length === 0) return null;

    return (
        <section className="py-24 bg-white font-sans relative overflow-hidden">
            <CardSlider
                title="Recently Viewed"
                subtitle="Pick up where you left off."
                items={products}
                viewAllLink="/shop"
                viewAllText="View All"
            />
        </section>
    );
};

export default RecentlyViewed;
