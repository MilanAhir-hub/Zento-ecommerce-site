import FeaturedProducts from "../../sections/Landing/FeaturedProducts";
import Hero from "../../sections/Landing/Hero";
import Trust from "../../sections/Landing/Trust";
import CallToAction from "../../sections/Landing/CallToAction";
import CategorySliders from "../../sections/Landing/CategorySliders";

const GuestLandingPage = () => {
    return (
        <>
            <Hero />
            <CategorySliders />
            <FeaturedProducts />
            <Trust />
            <CallToAction />
        </>
    );
};

export default GuestLandingPage;