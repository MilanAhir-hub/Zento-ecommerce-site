import FeaturedProducts from "../../sections/Landing/FeaturedProducts";
import Hero from "../../sections/Landing/Hero";
import Trust from "../../sections/Landing/Trust";
import CallToAction from "../../sections/Landing/CallToAction";
import CategorySliders from "../../sections/Landing/CategorySliders";
import Recommended from "../../sections/Landing/Recommended";
import TrendingProducts from "../../sections/Landing/TrendingProducts";
import RecentlyViewed from "../../sections/Landing/RecentlyViewed";

const GuestLandingPage = () => {
    return (
        <>
            <Hero />
            <CategorySliders />
            <FeaturedProducts />
            <Recommended />
            <TrendingProducts />
            <RecentlyViewed />
            <Trust />
            <CallToAction />
        </>
    );
};

export default GuestLandingPage;