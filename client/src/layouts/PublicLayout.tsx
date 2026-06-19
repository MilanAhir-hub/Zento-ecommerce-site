import { Outlet, useLocation } from "react-router-dom";
import PublicNavbar from "../components/navbar/PublicNavbar";
import Footer from "../components/ui/Footer";
import OfferBanner from "../components/ui/OfferBanner";

const PublicLayout = () => {
    const { pathname } = useLocation();
    const isFullBleed = pathname === "/" || pathname.startsWith("/category/");

    return (
        <div className="flex flex-col min-h-screen">
            <OfferBanner />
            <PublicNavbar />
            <main className="flex-1">
                {isFullBleed ? (
                    <Outlet />
                ) : (
                    <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-6">
                        <Outlet />
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default PublicLayout;