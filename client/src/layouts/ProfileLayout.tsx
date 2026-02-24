import { Outlet } from "react-router-dom";
import PublicNavbar from "../components/navbar/PublicNavbar";

const ProfileLayout = () => {
    return (
        <>
            <PublicNavbar />
            <Outlet />
        </>
    );
};

export default ProfileLayout;