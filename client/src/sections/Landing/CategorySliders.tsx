import CardSlider from "../../components/ui/CardSlider";
import { categories } from "../../constants/categories";
import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";

// Interface based on backend model
interface Product {
    _id: string;
    title: string;
    price: number;
    oldPrice?: number;
    category: string;
    imageUrl: string;
}

type Category = (typeof categories)[number];

const CategorySection = ({ category }: { category: Category }) => {
    const { data: products, isLoading, error } = useQuery({
        queryKey: ['products', 'category', category.name],
        queryFn: async () => {
            const res = await api.get(`/products/category/${category.name}?limit=15`);
            return res.data.data; // Server returns { success, count, data }
        },
        staleTime: 1000 * 60 * 5, // 5 minutes cache
        refetchOnWindowFocus: false, // Prevent bursts
        retry: 1,
    });

    // Map MongoDB _id to id for the generic CardSlider component
    const mappedItems = products?.map((p: Product) => ({
        ...p,
        id: p._id
    })) || [];

    if (isLoading) {
        return (
            <div className="bg-[#fbfbfd] py-16 flex justify-center items-center h-80">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0071e3]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white py-10 px-4 text-center">
                <p className="text-red-500 font-medium">Failed to load {category.name} products.</p>
            </div>
        );
    }

    if (mappedItems.length === 0) return null;

    return (
        <div className="bg-white">
            <CardSlider
                title={`Top Deals on ${category.name}`}
                subtitle={`Discover the best curated ${category.name.toLowerCase()} selected just for you.`}
                items={mappedItems}
                viewAllLink={`/category/${category.name}`}
                viewAllText={`View All ${category.name}`}
            />
        </div>
    );
};

const CategorySliders = () => {
    return (
        <div className="flex flex-col gap-0 bg-[#fbfbfd]">
            {categories.map((category) => (
                <CategorySection key={category.id} category={category} />
            ))}
        </div>
    );
};

export default CategorySliders;
