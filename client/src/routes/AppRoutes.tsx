import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import UserHome from "../pages/user/UserHome";
import ForgotPassword from "../pages/auth/ForgotPassword";
import VerifyOTP from "../pages/auth/VerifyOTP";
import ResetPassword from "../pages/auth/ResetPassword";
import GuestLandingPage from "../pages/guest/Landing";

import CategoryPage from "../pages/category/CategoryPage";
import UserProfile from "../pages/user/UserProfile";
import PublicLayout from "../layouts/PublicLayout";
import ProfileLayout from "../layouts/ProfileLayout";

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public layout matches routes that get both the Navbar and Category bar */}
            <Route element={<PublicLayout />}>
                <Route path="/" element={<GuestLandingPage />} />
                <Route path="/category/:name" element={<CategoryPage />} />
            </Route>

            {/* Profile layout matches user-specific dashboard routes with just the Navbar */}
            <Route element={<ProfileLayout />}>
                <Route path="/user/home" element={<UserHome />} />
                <Route path="/user/profile" element={<UserProfile />} />
            </Route>

            {/* Auth routes don't inherit navigation layouts */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
    )

}

export default AppRoutes