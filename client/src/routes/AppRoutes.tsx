import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import UserHome from "../pages/user/UserHome";
import ForgotPassword from "../pages/auth/ForgotPassword";
import VerifyOTP from "../pages/auth/VerifyOTP";
import ResetPassword from "../pages/auth/ResetPassword";
import GuestLandingPage from "../pages/guest/Landing";

import CategoryPage from "../pages/category/CategoryPage";
import MobileUserSettings from "../pages/user/MobileUserSettings";
import MobilePersonalInfo from "../pages/user/MobilePersonalInfo";
import Listing from "../pages/products/Listing";
import ProductDetail from "../pages/products/ProductDetail";
import Cart from "../pages/cart/Cart";
import Checkout from "../pages/checkout/Checkout";
import PublicLayout from "../layouts/PublicLayout";
import ProfileLayout from "../layouts/ProfileLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import WishList from "../pages/user/WishList";
import DeliveryAddress from "../pages/user/DeliveryAddress";
import Help from "../pages/user/Help";
import Guide from "../pages/user/Guide";
import About from "../pages/user/About";
import MyNotification from "../pages/user/MyNotification";
import MyOrders from "../pages/user/MyOrders";
import UserProfile from "../pages/user/UserProfile";
import VendorDashboard from "../pages/vendor-dashboard/VendorDashboard";

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public layout matches routes that get both the Navbar and Category bar */}
            <Route element={<PublicLayout />}>
                <Route path="/" element={<GuestLandingPage />} />
                <Route path="/category/:name/:subCategory" element={<CategoryPage />} />
                <Route path="/category/:name" element={<CategoryPage />} />
                <Route path="/products" element={<Listing />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/help" element={<Help />} />
                <Route path="/guide" element={<Guide />} />
                <Route path="/about" element={<About />} />
                <Route path="/apply-seller" element={<UserProfile />} />
            </Route>

            {/* Profile layout matches user-specific dashboard routes with just the Navbar */}
            <Route element={<ProfileLayout />}>
                <Route path="/user/home" element={<UserHome />} />
                <Route path="/user/orders" element={<MyOrders />} />
                <Route path="/user/settings" element={<MobileUserSettings />} />
                <Route path="/user/personal-info" element={<MobilePersonalInfo />} />
                <Route path="/user/wishlist" element={<WishList />} />
                <Route path="/user/addresses" element={<DeliveryAddress />} />
                <Route path="/user/notifications" element={<MyNotification />} />
                <Route path="/user/profile" element={<UserProfile />} />
            </Route>

            {/* Auth routes don't inherit navigation layouts */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Admin routes (Full Screen Layout) */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            {/* Vendor routes (Modular Layout) */}
            <Route path="/vendor/*" element={<VendorDashboard />} />
        </Routes>
    )

}

export default AppRoutes