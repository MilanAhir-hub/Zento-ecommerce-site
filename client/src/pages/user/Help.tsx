import { HugeiconsIcon } from "@hugeicons/react";
import { Mail01Icon, Chat01Icon } from "@hugeicons/core-free-icons";

const faqs = [
    {
        question: "How do I place an order?",
        answer:
            "Browse products, add items to your cart, then proceed to checkout and complete the payment process.",
    },
    {
        question: "What payment methods are supported?",
        answer:
            "We support UPI, credit/debit cards, and major digital wallets.",
    },
    {
        question: "How can I track my order?",
        answer:
            "After placing an order, you can track delivery status from your account dashboard.",
    },
    {
        question: "Can I return a product?",
        answer:
            "Yes, most products can be returned within 7 days if they meet our return policy.",
    },
];

const Help = () => {
    return (
        <section className="max-w-5xl mx-auto px-4 py-14">

            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-stone-900 mb-3">
                    Help Center
                </h1>
                <p className="text-stone-600">
                    Find answers to common questions and get support.
                </p>
            </div>

            {/* FAQ List */}
            <div className="space-y-6">

                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className="border border-stone-200 rounded-xl p-6 bg-white"
                    >
                        <h3 className="text-lg font-semibold text-stone-900 mb-2">
                            {faq.question}
                        </h3>

                        <p className="text-stone-600 text-sm">
                            {faq.answer}
                        </p>
                    </div>
                ))}

            </div>

            {/* Contact Support */}
            <div className="mt-14 bg-stone-100 rounded-2xl p-8 text-center">

                <h2 className="text-2xl font-bold text-stone-900 mb-3">
                    Need More Help?
                </h2>

                <p className="text-stone-600 mb-6">
                    If your question isn't answered here, contact our support team.
                </p>

                <div className="flex justify-center gap-4 flex-wrap">

                    <button className="flex items-center gap-2 bg-stone-900 text-white px-6 py-3 rounded-lg hover:bg-black transition">
                        <HugeiconsIcon icon={Mail01Icon} size={16} />
                        Email Support
                    </button>

                    <button className="flex items-center gap-2 border border-stone-300 px-6 py-3 rounded-lg hover:bg-stone-200 transition">
                        <HugeiconsIcon icon={Chat01Icon} size={16} />
                        Live Chat
                    </button>

                </div>

            </div>

        </section>
    );
};

export default Help;