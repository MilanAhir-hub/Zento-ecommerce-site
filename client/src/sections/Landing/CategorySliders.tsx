import CardSlider from "../../components/ui/CardSlider";
import { categories } from "../../constants/categories";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Interface based on backend model
interface Product {
    _id: string;
    title: string;
    price: number;
    oldPrice?: number;
    category: string;
    imageUrl: string;
}

const CategorySection = ({ category }: { category: { id: number; name: string; image: string } }) => {
    const { data: products, isLoading } = useQuery({
        queryKey: ['products', 'category', category.name],
        queryFn: async () => {
            const res = await axios.get(`http://localhost:5000/api/products/category/${category.name}?limit=15`);
            return res.data.data; // Server returns { success, count, data }
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    // Map MongoDB _id to id for the generic CardSlider component
    const mappedItems = products?.map((p: Product) => ({
        ...p,
        id: p._id
    })) || [];

    if (isLoading) {
        return (
            <div className="bg-white py-20 flex justify-center items-center h-80">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
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
        <div className="flex flex-col gap-0 bg-stone-50 min-h-screen">
            {categories.map((category) => (
                <CategorySection key={category.id} category={category} />
            ))}
        </div>
    );
};

export default CategorySliders;
