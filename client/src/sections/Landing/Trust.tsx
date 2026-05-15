import { HugeiconsIcon } from "@hugeicons/react";
import {
    TruckIcon,
    Refresh01Icon,
    Shield01Icon,
    UserGroupIcon
} from "@hugeicons/core-free-icons";

const features = [
    {
        icon: TruckIcon,
        title: "Free Delivery",
        description: "Enjoy complimentary shipping on all orders above ₹99.",
    },
    {
        icon: Refresh01Icon,
        title: "Easy Returns",
        description: "Hassle-free 30-day return policy for your peace of mind.",
    },
    {
        icon: Shield01Icon,
        title: "Secure Payment",
        description: "Your transactions are protected with military-grade encryption.",
    },
    {
        icon: UserGroupIcon,
        title: "10k+ Customers",
        description: "Join our growing community of satisfied shoppers worldwide.",
    },
];

const Trust = () => {
    return (
        <section className="py-32 bg-[#F5F5F7] font-sans overflow-hidden">
            <div className="max-w-[1200px] mx-auto px-6">
                {/* Section Header */}
                <div className="text-center mb-20">
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#1d1d1f] tracking-tight mb-6">
                        Why Choose Us
                    </h2>
                    <p className="max-w-2xl mx-auto text-xl lg:text-2xl text-[#86868b] leading-relaxed">
                        Excellence in every detail, crafted for your ultimate shopping experience.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => {
                        return (
                            <div
                                key={index}
                                className="group relative bg-white p-10 rounded-[28px] transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)]"
                            >
                                {/* Icon Container */}
                                <div className="mb-8 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#F5F5F7] text-[#1d1d1f] transition-all duration-500 group-hover:scale-110">
                                    <HugeiconsIcon icon={feature.icon} size={32} strokeWidth={1.5} />
                                </div>

                                {/* Content */}
                                <h3 className="text-2xl font-semibold text-[#1d1d1f] mb-4 tracking-tight">
                                    {feature.title}
                                </h3>
                                <p className="text-[#86868b] text-lg leading-relaxed font-medium">
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