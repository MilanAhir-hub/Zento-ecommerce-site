import { Outlet } from "react-router-dom";
import CategoryBar from "../components/category/CategoryBar";
import PublicNavbar from "../components/navbar/PublicNavbar";

const PublicLayout = () => {
    return (
        <>
            <PublicNavbar />
            <CategoryBar />
            <Outlet />
        </>
    );
};

export default PublicLayout;