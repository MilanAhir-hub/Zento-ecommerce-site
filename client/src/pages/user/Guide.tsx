import { HugeiconsIcon } from "@hugeicons/react";
import { Book01Icon, ShoppingCart01Icon, CreditCardIcon, TruckIcon } from "@hugeicons/core-free-icons";
import { Link } from "react-router-dom";

const guides = [
    {
        icon: ShoppingCart01Icon,
        title: "How to Shop",
        description: "Learn how to browse products, add items to your cart, and place an order.",
    },
    {
        icon: CreditCardIcon,
        title: "Payment Methods",
        description: "Understand supported payment options like UPI, cards, and wallets.",
    },
    {
        icon: TruckIcon,
        title: "Shipping & Delivery",
        description: "Information about shipping times, tracking orders, and delivery policies.",
    },
    {
        icon: Book01Icon,
        title: "Account Management",
        description: "Learn how to manage your account, wishlist, and order history.",
    },
];

const Guide = () => {
    return (
        <section className="max-w-7xl mx-auto px-4 py-14">

            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-stone-900 mb-3">
                    Shopping Guide
                </h1>
                <p className="text-stone-600 max-w-xl mx-auto">
                    Everything you need to know about shopping on our platform.
                </p>
            </div>

            {/* Guide Cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

                {guides.map((guide, index) => {
                    const Icon = guide.icon;

                    return (
                        <div
                            key={index}
                            className="bg-white border border-stone-200 rounded-xl p-6 hover:shadow-lg transition cursor-pointer"
                        >
                            <div className="w-12 h-12 rounded-lg bg-stone-100 flex items-center justify-center mb-4">
                                <HugeiconsIcon icon={Icon} size={24} className="text-stone-700" />
                            </div>

                            <h3 className="text-lg font-semibold text-stone-900 mb-2">
                                {guide.title}
                            </h3>

                            <p className="text-sm text-stone-600">
                                {guide.description}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Bottom CTA */}
            <div className="text-center mt-14">
                <p className="text-stone-600 mb-4">
                    Still have questions?
                </p>

                <Link
                    to="/help"
                    className="inline-block bg-stone-900 text-white px-6 py-3 rounded-lg hover:bg-black transition"
                >
                    Visit Help Center
                </Link>
            </div>

        </section>
    );
};

export default Guide;