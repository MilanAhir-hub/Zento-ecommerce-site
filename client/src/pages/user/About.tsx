import { Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { ShoppingBag01Icon, TruckIcon, Shield02Icon, SparklesIcon } from "@hugeicons/core-free-icons";
import { getButtonStyles } from "../../components/ui/Button";

const features = [
    {
        icon: ShoppingBag01Icon,
        title: "Premium Products",
        description:
            "Zento offers carefully selected high-quality products designed to enhance your lifestyle.",
    },
    {
        icon: TruckIcon,
        title: "Fast Delivery",
        description:
            "We ensure quick and reliable shipping so your products reach you without delay.",
    },
    {
        icon: Shield02Icon,
        title: "Secure Shopping",
        description:
            "Your payments and personal information are protected with modern security standards.",
    },
    {
        icon: SparklesIcon,
        title: "Curated Experience",
        description:
            "Our platform focuses on simplicity, style, and a seamless shopping experience.",
    },
];

const About = () => {
    return (
        <section className="max-w-7xl mx-auto px-4 py-16">

            {/* HERO SECTION */}

            <div className="text-center max-w-3xl mx-auto mb-16">
                <h1 className="text-4xl sm:text-5xl font-black text-stone-900 mb-6">
                    About <span className="text-stone-700">Zento</span>
                </h1>

                <p className="text-lg text-stone-600 leading-relaxed">
                    Zento is built to deliver a modern shopping experience where quality,
                    simplicity, and innovation come together. Our mission is to make
                    online shopping effortless while offering premium products you can
                    trust.
                </p>
            </div>

            {/* BRAND STORY */}

            <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">

                <div>
                    <h2 className="text-3xl font-bold text-stone-900 mb-4">
                        Our Story
                    </h2>

                    <p className="text-stone-600 leading-relaxed mb-4">
                        Zento started with a simple idea: online shopping should feel
                        effortless and enjoyable. Instead of overwhelming users with
                        endless choices, we focus on offering carefully selected products
                        that bring value to everyday life.
                    </p>

                    <p className="text-stone-600 leading-relaxed">
                        We believe great design, trusted service, and fast delivery are
                        essential to building a modern ecommerce experience. That's why
                        every feature in Zento is built with the customer in mind.
                    </p>
                </div>

                {/* Decorative Card */}
                <div className="bg-stone-100 rounded-2xl p-10 flex items-center justify-center text-center">
                    <p className="text-xl font-semibold text-stone-700">
                        “Making modern shopping simple and enjoyable.”
                    </p>
                </div>

            </div>

            {/* FEATURES */}

            <div className="mb-20">

                <h2 className="text-3xl font-bold text-center text-stone-900 mb-12">
                    Why Shop With Zento?
                </h2>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

                    {features.map((feature, index) => {
                        const Icon = feature.icon;

                        return (
                            <div
                                key={index}
                                className="bg-white border border-stone-200 rounded-xl p-6 hover:shadow-lg transition"
                            >
                                <div className="w-12 h-12 rounded-lg bg-stone-100 flex items-center justify-center mb-4">
                                    <HugeiconsIcon icon={Icon} size={24} className="text-stone-700" />
                                </div>

                                <h3 className="text-lg font-semibold text-stone-900 mb-2">
                                    {feature.title}
                                </h3>

                                <p className="text-sm text-stone-600">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}

                </div>

            </div>

            {/* CTA */}

            <div className="bg-stone-100 rounded-2xl p-12 text-center">

                <h2 className="text-3xl font-bold text-stone-900 mb-4">
                    Start Shopping with Zento
                </h2>

                <p className="text-stone-600 mb-8">
                    Explore our collection and discover products designed for your
                    lifestyle.
                </p>

                <Link
                    to="/products"
                    className={getButtonStyles(
                        "primary",
                        "lg",
                        "inline-flex items-center gap-2"
                    )}
                >
                    Shop Now
                </Link>

            </div>

        </section>
    );
};

export default About;