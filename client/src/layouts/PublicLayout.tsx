import { Outlet } from "react-router-dom";
import PublicNavbar from "../components/navbar/PublicNavbar";
import Footer from "../components/ui/Footer";

const PublicLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <PublicNavbar />
            <main className="flex-1">
                <div className="max-w-[1440px] mx-auto w-full px-6">
                    <Outlet />
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PublicLayout;