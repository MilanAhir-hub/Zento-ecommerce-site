import { useProducts } from "../../hooks/products/useProducts";
import CardSlider from "../../components/ui/CardSlider";
import { HugeiconsIcon } from "@hugeicons/react";
import { Alert01Icon } from "@hugeicons/core-free-icons";

const FeaturedProducts = () => {
    const { data: products = [], isLoading, isError } = useProducts({ limit: 10 });

    if (isLoading) {
        return (
            <section className="py-20 bg-white">
                <div className="max-w-[1200px] mx-auto px-6">
                    <div className="h-[400px] flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1d1d1f]"></div>
                    </div>
                </div>
            </section>
        );
    }

    if (isError) {
        return (
            <section className="py-20 bg-white">
                <div className="max-w-[1200px] mx-auto px-6">
                    <div className="h-[400px] flex flex-col items-center justify-center text-[#86868b] gap-4">
                        <HugeiconsIcon icon={Alert01Icon} className="w-12 h-12 text-red-500 opacity-50" />
                        <p className="font-medium text-lg">Failed to load featured products.</p>
                    </div>
                </div>
            </section>
        );
    }

    if (products.length === 0) return null;

    return (
        <CardSlider
            title="Featured Highlights"
            subtitle="Handpicked premium selections carefully curated just for you."
            items={products}
            viewAllLink="/products"
            viewAllText="View All Products"
        />
    );
};

export default FeaturedProducts;