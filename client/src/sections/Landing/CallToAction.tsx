import { Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, Mail01Icon } from "@hugeicons/core-free-icons";

const CallToAction = () => {
    return (
        <section className="py-40 bg-[#000000] font-sans relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute -top-[20%] -right-[5%] w-[50%] h-full rounded-full bg-[#2997ff]/15 blur-[180px]" />
                <div className="absolute -bottom-[20%] -left-[5%] w-[50%] h-full rounded-full bg-[#bf5af2]/10 blur-[180px]" />
            </div>

            <div className="max-w-[1200px] mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center justify-center mb-8 w-24 h-24 rounded-[28px] bg-[#1d1d1f] border border-white/[0.08] shadow-2xl">
                        <HugeiconsIcon icon={Mail01Icon} size={44} className="text-white" strokeWidth={1.5} />
                    </div>

                    <h2 className="text-[48px] sm:text-[56px] lg:text-[64px] font-semibold text-white tracking-tight leading-[1.05] mb-8">
                        Unlock Exclusive Perks
                    </h2>

                    <p className="text-[20px] lg:text-[22px] text-[#86868b] font-medium mb-14 max-w-2xl mx-auto leading-[1.5]">
                        Join our community today and get 15% off your first order.
                        Experience shopping as it should be.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                        <Link
                            to="/signup"
                            className="w-full sm:w-auto px-12 py-4.5 bg-[#f5f5f7] text-[#1d1d1f] text-[17px] font-semibold rounded-[980px] hover:bg-white hover:scale-[1.02] transition-all duration-300 flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.3)] active:scale-95"
                        >
                            Create an Account
                            <HugeiconsIcon icon={ArrowRight01Icon} size={20} className="ml-2" />
                        </Link>
                        <Link
                            to="/login"
                            className="w-full sm:w-auto px-12 py-4.5 bg-transparent text-white text-[17px] font-semibold rounded-[980px] border border-white/[0.2] hover:border-white/[0.4] hover:bg-white/[0.08] transition-all duration-300 flex items-center justify-center active:scale-95"
                        >
                            Sign In
                        </Link>
                    </div>

                    <p className="mt-14 text-[#636366] text-[13px] font-normal">
                        By signing up, you agree to our <span className="text-[#86868b] cursor-pointer hover:underline">Terms of Service</span> and <span className="text-[#86868b] cursor-pointer hover:underline">Privacy Policy</span>.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default CallToAction;
