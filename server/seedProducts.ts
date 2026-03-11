import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./models/User";
import { Product } from "./models/Product";

dotenv.config();

const categories = [
    "Electronics", "Fashion", "Footwear", "Beauty", "Home",
    "Furniture", "Sports", "Toys", "Groceries", "Automotive", "Accessories"
];

const productsData = [
    { title: "Sony Noise Cancelling Headphones", category: "Electronics", price: 299.99, imageUrl: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=800" },
    { title: "Minimalist Men's Watch", category: "Accessories", price: 149.00, imageUrl: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=800" },
    { title: "Leather Crossbody Bag", category: "Fashion", price: 89.50, imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800" },
    { title: "Running Sneakers", category: "Footwear", price: 120.00, imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800" },
    { title: "Hydrating Face Serum", category: "Beauty", price: 35.00, imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800" },
    { title: "Ceramic Coffee Mug Set", category: "Home", price: 24.99, imageUrl: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=800" },
    { title: "Mid-Century Lounge Chair", category: "Furniture", price: 450.00, imageUrl: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=800" },
    { title: "Yoga Mat with Alignment Lines", category: "Sports", price: 45.00, imageUrl: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&q=80&w=800" },
    { title: "Wooden Montessori Blocks", category: "Toys", price: 30.00, imageUrl: "https://images.unsplash.com/photo-1618844514210-9c10427b5e43?auto=format&fit=crop&q=80&w=800" },
    { title: "Organic Arabica Coffee Beans", category: "Groceries", price: 18.50, imageUrl: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=800" },
    { title: "Car Vacuum Cleaner", category: "Automotive", price: 49.99, imageUrl: "https://images.unsplash.com/photo-1609340244793-1eb5b2d2dbca?auto=format&fit=crop&q=80&w=800" },
    { title: "4K Action Camera", category: "Electronics", price: 199.99, imageUrl: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=800" },
    { title: "Stainless Steel Water Bottle", category: "Sports", price: 22.00, imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=800" },
    { title: "Vintage Denim Jacket", category: "Fashion", price: 75.00, imageUrl: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&q=80&w=800" },
    { title: "Smart Home Security Camera", category: "Electronics", price: 129.99, imageUrl: "https://images.unsplash.com/photo-1557324232-b8917d3c3d82?auto=format&fit=crop&q=80&w=800" },
    { title: "Premium Matcha Powder", category: "Groceries", price: 28.00, imageUrl: "https://images.unsplash.com/photo-1582791694770-bdc8e441c888?auto=format&fit=crop&q=80&w=800" },
    { title: "Classic Aviator Sunglasses", category: "Accessories", price: 55.00, imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800" },
    { title: "Aromatherapy Diffuser", category: "Home", price: 34.00, imageUrl: "https://images.unsplash.com/photo-1608528577884-a10c28340156?auto=format&fit=crop&q=80&w=800" },
    { title: "Wireless Charging Pad", category: "Electronics", price: 29.99, imageUrl: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&q=80&w=800" },
    { title: "Adjustable Dumbbell Set", category: "Sports", price: 199.00, imageUrl: "https://images.unsplash.com/photo-1638202573216-24a91cf6d1d4?auto=format&fit=crop&q=80&w=800" }
];

const seedDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error("MONGO_URI is missing from .env");
            process.exit(1);
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

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

        console.log("Adding products...");

        let addedCount = 0;
        for (const item of productsData) {
            const newProduct = new Product({
                title: item.title,
                description: `Experience the finest quality with our ${item.title}. Perfectly crafted for everyday use, combining modern aesthetics with exceptional functionality. Limited stock available.`,
                price: item.price,
                stock: Math.floor(Math.random() * 50) + 10,
                category: item.category,
                vendorId: vendor._id,
                imageUrl: item.imageUrl
            });

            await newProduct.save();
            addedCount++;
        }

        console.log(`Successfully added ${addedCount} products!`);
        process.exit(0);

    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedDB();
