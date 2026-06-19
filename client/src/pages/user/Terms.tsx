import React from "react";

const Terms = () => {
    return (
        <section className="max-w-4xl mx-auto px-4 py-16 font-sans">
            <h1 className="text-4xl font-black text-stone-900 mb-8">Terms of Service</h1>
            
            <div className="prose prose-stone max-w-none space-y-8 text-stone-600 leading-relaxed">
                <div>
                    <h2 className="text-2xl font-bold text-stone-900 mb-4">1. Agreement to Terms</h2>
                    <p>
                        By accessing or using Novara, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-stone-900 mb-4">2. Use License</h2>
                    <p>
                        Permission is granted to temporarily download one copy of the materials (information or software) on Novara's website for personal, non-commercial transitory viewing only.
                    </p>
                    <p className="mt-2">This is the grant of a license, not a transfer of title, and under this license you may not:</p>
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                        <li>Modify or copy the materials.</li>
                        <li>Use the materials for any commercial purpose, or for any public display (commercial or non-commercial).</li>
                        <li>Attempt to decompile or reverse engineer any software contained on Novara's website.</li>
                        <li>Remove any copyright or other proprietary notations from the materials.</li>
                    </ul>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-stone-900 mb-4">3. Disclaimer</h2>
                    <p>
                        The materials on Novara's website are provided on an 'as is' basis. Novara makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-stone-900 mb-4">4. Limitations</h2>
                    <p>
                        In no event shall Novara or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Novara's website.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-stone-900 mb-4">5. Governing Law</h2>
                    <p>
                        These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
                    </p>
                </div>

                <div className="pt-8 border-t border-stone-200">
                    <p className="text-sm">Last updated: June 18, 2026</p>
                    <p className="text-sm">If you have any questions about these Terms, please contact us at support@novara.com</p>
                </div>
            </div>
        </section>
    );
};

export default Terms;
