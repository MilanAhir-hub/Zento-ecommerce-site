import { useEffect, useState } from "react";

interface UseScrolledOptions {
    /** Distance (px) past which the hook flips to true. Default 8. */
    threshold?: number;
}

/**
 * Returns true once the window has scrolled past `threshold` pixels.
 * Used by the public navbar to switch into its condensed state.
 */
const useScrolled = ({ threshold = 8 }: UseScrolledOptions = {}) => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > threshold);
        };

        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [threshold]);

    return scrolled;
};

export default useScrolled;
