import { Outlet } from "react-router-dom";
import CategoryBar from "../components/category/CategoryBar";
import PublicNavbar from "../components/navbar/PublicNavbar";
import Footer from "../components/ui/Footer";

const PublicLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <div className="sticky top-0 z-50 w-full bg-white border-b border-stone-200">
                <PublicNavbar />
                <CategoryBar />
            </div>
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default PublicLayout;