import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./models/User";
import { Product } from "./models/Product";

dotenv.config();

const categories = [
    "Electronics", "Fashion", "Footwear", "Beauty", "Home",
    "Furniture", "Sports", "Toys", "Groceries", "Automotive", "Accessories"
];

const pexelsImages = [
    "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/279906/pexels-photo-279906.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/335257/pexels-photo-335257.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/2836486/pexels-photo-2836486.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/380954/pexels-photo-380954.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/331584/pexels-photo-331584.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1032110/pexels-photo-1032110.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/2080076/pexels-photo-2080076.jpeg?auto=compress&cs=tinysrgb&w=800"
];

const generateProducts = () => {
    const products: any[] = [];

    categories.forEach((category) => {
        for (let i = 1; i <= 15; i++) {
            const randomImage = pexelsImages[Math.floor(Math.random() * pexelsImages.length)];
            const price = parseFloat(((Math.random() * 500) + 10).toFixed(2));

            // 70% chance to have an old price (discount)
            const oldPrice = Math.random() > 0.3 ? parseFloat((price * (1 + (Math.random() * 0.5 + 0.1))).toFixed(2)) : undefined;

            products.push({
                title: `${category} Premium Item ${i}`,
                category: category,
                price: price,
                oldPrice: oldPrice,
                imageUrl: randomImage
            });
        }
    });
    return products;
};

const productsData = generateProducts();

const seedDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error("MONGO_URI is missing from .env");
            process.exit(1);
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        // Clear existing products to avoid massive duplication during testing
        await Product.deleteMany({});
        console.log("Cleared existing products from database.");

        // Create or find a vendor user
        let vendor = await User.findOne({ email: "premium.vendor@zento.com" });

        if (!vendor) {
            vendor = new User({
                name: "Zento Premium Vendor",
                email: "premium.vendor@zento.com",
                password: "Password123!", // In a real app this would go through schema pre-save hook
                role: "vendor",
                storeName: "Zento Official Store",
                storeDescription: "Curated premium products for everyday life."
            });
            await vendor.save();
            console.log("Created vendor account");
        } else {
            console.log("Vendor account already exists");
        }

        console.log(`Adding ${productsData.length} products...`);

        let addedCount = 0;
        const productsToInsert = productsData.map(item => ({
            title: item.title,
            description: `Experience the finest quality with our ${item.title}. Perfectly crafted for everyday use, combining modern aesthetics with exceptional functionality. Limited stock available.`,
            price: item.price,
            oldPrice: item.oldPrice,
            stock: Math.floor(Math.random() * 50) + 10,
            category: item.category,
            vendorId: vendor._id,
            imageUrl: item.imageUrl
        }));

        await Product.insertMany(productsToInsert);
        addedCount = productsToInsert.length;

        console.log(`Successfully added ${addedCount} products!`);
        process.exit(0);

    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedDB();
