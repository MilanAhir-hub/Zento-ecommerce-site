import { Outlet } from "react-router-dom";
import PublicNavbar from "../components/navbar/PublicNavbar";

const ProfileLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <PublicNavbar />
            <main className="flex-1">
                <div className="max-w-[1440px] mx-auto px-6 py-12">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default ProfileLayout;