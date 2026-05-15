import { Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, Mail01Icon } from "@hugeicons/core-free-icons";

const CallToAction = () => {
    return (
        <section className="py-32 bg-[#000000] font-sans relative overflow-hidden">
            {/* Background Decoration Elements - Apple Style Gradient/Blur */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute -top-[30%] -right-[10%] w-[70%] h-full rounded-full bg-blue-600/10 blur-[150px]" />
                <div className="absolute -bottom-[30%] -left-[10%] w-[70%] h-full rounded-full bg-purple-600/10 blur-[150px]" />
            </div>

            <div className="max-w-[1200px] mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center justify-center mb-10 w-20 h-20 rounded-[22px] bg-[#1d1d1f] border border-white/5 shadow-2xl">
                        <HugeiconsIcon icon={Mail01Icon} size={40} className="text-white" strokeWidth={1.5} />
                    </div>

                    <h2 className="text-5xl sm:text-6xl lg:text-7xl font-semibold text-white tracking-tight mb-8">
                        Unlock Exclusive Perks
                    </h2>

                    <p className="text-xl lg:text-2xl text-[#86868b] font-medium mb-16 max-w-2xl mx-auto leading-relaxed">
                        Join our community today and get 15% off your first order.
                        Experience shopping as it should be.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link
                            to="/signup"
                            className="w-full sm:w-auto px-10 py-5 bg-[#f5f5f7] text-[#1d1d1f] text-lg font-semibold rounded-full hover:bg-white hover:scale-[1.02] transition-all duration-300 flex items-center justify-center shadow-lg active:scale-95"
                        >
                            Create an Account
                            <HugeiconsIcon icon={ArrowRight01Icon} size={22} className="ml-2" />
                        </Link>
                        <Link
                            to="/login"
                            className="w-full sm:w-auto px-10 py-5 bg-transparent text-white text-lg font-semibold rounded-full border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all duration-300 flex items-center justify-center active:scale-95"
                        >
                            Sign In
                        </Link>
                    </div>

                    <p className="mt-12 text-[#424245] text-sm font-medium">
                        By signing up, you agree to our <span className="text-[#86868b] cursor-pointer hover:underline">Terms of Service</span> and <span className="text-[#86868b] cursor-pointer hover:underline">Privacy Policy</span>.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default CallToAction;
