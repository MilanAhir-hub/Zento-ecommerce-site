import CardSlider from "../../components/ui/CardSlider";
import { useRecommendations } from "../../hooks/useRecommendations";
import { useProducts } from "../../hooks/products/useProducts";
import { useAuth } from "../../context/authContext";
import { HugeiconsIcon } from "@hugeicons/react";
import { Loading03Icon } from "@hugeicons/core-free-icons";

const Recommended = () => {
    const { isAuthenticated } = useAuth();

    // Use personalized recommendations for logged-in users
    const { data: recData, isLoading: recLoading } = useRecommendations();

    // Fallback: generic products for guests
    const { data: genericProducts, isLoading: genericLoading } = useProducts({ limit: 8 });

    const isLoading = isAuthenticated ? recLoading : genericLoading;
    const products = isAuthenticated ? (recData?.recommended || []) : (genericProducts || []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-28 min-h-[400px]">
                <HugeiconsIcon icon={Loading03Icon} size={32} className="animate-spin text-[#86868b]" />
            </div>
        );
    }

    if (!products || products.length === 0) return null;

    return (
        <section className="py-28 bg-white font-sans relative overflow-hidden">
            <CardSlider
                title="Recommended For You"
                subtitle={isAuthenticated
                    ? "Personalized picks based on your activity."
                    : "Explore our curated collection."
                }
                items={products}
                viewAllLink="/shop"
                viewAllText="Explore More"
            />
        </section>
    );
};

export default Recommended;