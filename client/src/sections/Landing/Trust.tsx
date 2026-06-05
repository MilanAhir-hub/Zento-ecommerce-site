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
        description: "Complimentary shipping on all orders above ₹99.",
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
        <section className="py-28 bg-[#f5f5f7] font-sans">
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group bg-white rounded-[20px] p-7 transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:-translate-y-1"
                        >
                            <div className="w-12 h-12 rounded-[14px] bg-[#f5f5f7] flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-105">
                                <HugeiconsIcon icon={feature.icon} size={24} strokeWidth={1.5} className="text-[#1d1d1f]" />
                            </div>

                            <h3 className="text-[18px] font-semibold text-[#1d1d1f] mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-[14px] text-[#86868b] leading-[1.5]">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Trust;