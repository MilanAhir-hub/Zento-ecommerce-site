
const Privacy = () => {
    return (
        <section className="max-w-4xl mx-auto px-4 py-16 font-sans">
            <h1 className="text-4xl font-black text-stone-900 mb-8">Privacy Policy</h1>
            
            <div className="prose prose-stone max-w-none space-y-8 text-stone-600 leading-relaxed">
                <div>
                    <h2 className="text-2xl font-bold text-stone-900 mb-4">1. Introduction</h2>
                    <p>
                        Welcome to Novara. We value your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-stone-900 mb-4">2. The Data We Collect</h2>
                    <p>
                        We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                        <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
                        <li><strong>Contact Data</strong> includes email address and telephone numbers.</li>
                        <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location.</li>
                        <li><strong>Usage Data</strong> includes information about how you use our website, products and services.</li>
                    </ul>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-stone-900 mb-4">3. How We Use Your Data</h2>
                    <p>
                        We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                        <li>To register you as a new customer.</li>
                        <li>To process and deliver your order.</li>
                        <li>To manage our relationship with you.</li>
                        <li>To improve our website, products/services, marketing or customer relationships.</li>
                    </ul>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-stone-900 mb-4">4. Data Security</h2>
                    <p>
                        We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-stone-900 mb-4">5. Your Legal Rights</h2>
                    <p>
                        Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, to object to processing, and the right to withdraw consent.
                    </p>
                </div>

                <div className="pt-8 border-t border-stone-200">
                    <p className="text-sm">Last updated: June 18, 2026</p>
                    <p className="text-sm">If you have any questions about this privacy policy, please contact us at support@novara.com</p>
                </div>
            </div>
        </section>
    );
};

export default Privacy;
