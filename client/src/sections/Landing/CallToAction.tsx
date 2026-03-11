import { Link } from "react-router-dom";
import { ArrowRight, Mail } from "lucide-react";

const CallToAction = () => {
    return (
        <section className="py-24 bg-stone-900 font-sans relative overflow-hidden">
            {/* Background Decoration Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[70%] rounded-full bg-stone-800/50 blur-[120px]" />
                <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[70%] rounded-full bg-stone-800/30 blur-[100px]" />
            </div>

            <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center justify-center p-3 bg-stone-800 rounded-2xl mb-8 shadow-inner">
                        <Mail className="w-8 h-8 text-stone-100" />
                    </div>

                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6">
                        Unlock Exclusive Perks
                    </h2>

                    <p className="text-xl text-stone-300 font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
                        Join our community today and get 15% off your first order.
                        Enjoy member-only discounts, early access to new arrivals, and a seamless shopping experience.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/signup"
                            className="w-full sm:w-auto px-8 py-4 bg-white text-stone-900 font-bold rounded-full hover:bg-stone-100 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95"
                        >
                            Create an Account
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                        <Link
                            to="/login"
                            className="w-full sm:w-auto px-8 py-4 bg-transparent text-white font-bold rounded-full border border-stone-600 hover:border-stone-400 hover:bg-stone-800 transition-all duration-300 flex items-center justify-center active:scale-95"
                        >
                            Sign In
                        </Link>
                    </div>

                    <p className="mt-8 text-sm text-stone-400 font-medium">
                        By signing up, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default CallToAction;
