import { Truck, RefreshCw, ShieldCheck, Users } from "lucide-react";

const features = [
    {
        icon: Truck,
        title: "Free Delivery",
        description: "Enjoy complimentary shipping on all orders above ₹99.",
    },
    {
        icon: RefreshCw,
        title: "Easy Returns",
        description: "Hassle-free 30-day return policy for your peace of mind.",
    },
    {
        icon: ShieldCheck,
        title: "Secure Payment",
        description: "Your transactions are protected with military-grade encryption.",
    },
    {
        icon: Users,
        title: "10k+ Customers",
        description: "Join our growing community of satisfied shoppers worldwide.",
    },
];

const Trust = () => {
    return (
        <section className="py-20 bg-stone-50 font-sans overflow-hidden">
            <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
                        Why Choose Us
                    </h2>
                    <p className="mt-4 text-stone-500 font-medium max-w-2xl mx-auto">
                        We are committed to providing you with the best shopping experience possible, backed by our core guarantees.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="group relative bg-white p-8 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-stone-100 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-stone-200 transition-all duration-300 transform hover:-translate-y-1"
                            >
                                {/* Icon Container */}
                                <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-stone-100 text-stone-900 group-hover:bg-stone-900 group-hover:text-white transition-colors duration-300">
                                    <Icon className="w-6 h-6" strokeWidth={2} />
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold text-stone-900 mb-3 tracking-tight">
                                    {feature.title}
                                </h3>
                                <p className="text-stone-500 leading-relaxed font-medium">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Trust;