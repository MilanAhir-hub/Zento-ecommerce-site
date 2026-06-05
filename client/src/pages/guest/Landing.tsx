import Hero from "../../sections/Landing/Hero";
import BrandTicker from "../../sections/Landing/BrandTicker";
import CategoryGrid from "../../sections/Landing/CategoryGrid";
import FashionFilm from "../../sections/Landing/FashionFilm";
import EditorialGrid from "../../sections/Landing/EditorialGrid";
import { useLenis } from "../../hooks/motion/useLenis";
import { useScrollTriggerSync } from "../../hooks/motion/useScrollTriggerSync";

/**
 * Home Page (Guest Landing).
 *
 * Initializes Lenis smooth scrolling and the GSAP/ScrollTrigger sync loop
 * for the duration of this page only. When the user navigates away the
 * hooks tear down cleanly so the rest of the app retains native scrolling.
 */
const GuestLandingPage = () => {
    useLenis();
    useScrollTriggerSync();

    return (
        <>
            <Hero />
            <BrandTicker />
            <CategoryGrid />
            <FashionFilm />
            <EditorialGrid />
        </>
    );
};

export default GuestLandingPage;
