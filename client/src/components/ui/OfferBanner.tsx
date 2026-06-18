import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";

const STORAGE_KEY = "novara_offer_banner_closed";

const OfferBanner = () => {
    const [isVisible, setIsVisible] = useState<boolean>(() => {
        if (typeof window === "undefined") return false;
        return !sessionStorage.getItem(STORAGE_KEY);
    });

    const handleClose = () => {
        sessionStorage.setItem(STORAGE_KEY, "true");
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="relative w-full bg-[#000000] text-white">
            <div className="max-w-[1440px] mx-auto px-4 md:px-10">
                <div className="flex items-center justify-center h-[35px] text-[11px] font-medium uppercase tracking-[0.1em] text-center">
                    <span className="text-white/90">
                        Free shipping on orders over $50&nbsp;·&nbsp;Use code{" "}
                        <span className="font-semibold tracking-[0.12em]">NOVARA20</span>{" "}
                        for 20% off
                    </span>
                </div>
            </div>
            <button
                type="button"
                onClick={handleClose}
                aria-label="Close promotional banner"
                className="
                    absolute right-3 top-1/2 -translate-y-1/2
                    inline-flex items-center justify-center
                    w-6 h-6
                    text-white/70 hover:text-white
                    transition-colors duration-200
                    focus-visible:outline focus-visible:outline-1
                    focus-visible:outline-offset-2 focus-visible:outline-white
                "
            >
                <HugeiconsIcon icon={Cancel01Icon} size={12} />
            </button>
        </div>
    );
};

export default OfferBanner;
