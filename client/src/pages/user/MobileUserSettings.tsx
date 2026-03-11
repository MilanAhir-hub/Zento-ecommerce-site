import { useNavigate, Link } from "react-router-dom";
import { X, User, LogOut } from "lucide-react";
import { useAuth } from "../../context/authContext";

const getInitials = (name?: string) => {
    if (!name) return '';
    const nameParts = name.trim().split(' ');
    if (nameParts.length >= 2) {
        return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return nameParts[0].substring(0, 2).toUpperCase();
};

const MobileUserSettings = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Failed to logout", error);
        }
    };

    // Placeholder mask logic for mobile number until user model explicitly supports mobile numbers
    const phoneNumber = "9265201108";
    const maskedPhone = `${phoneNumber.substring(0, 2)}****${phoneNumber.substring(phoneNumber.length - 4)}`;

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Header */}
            <div className="p-4 flex items-center">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-stone-600 hover:bg-stone-50 rounded-full transition-colors cursor-pointer">
                    <X className="h-6 w-6" />
                </button>
            </div>

            {/* Profile Avatar & Name */}
            <div className="flex flex-col items-center mt-6">
                <div className="h-[100px] w-[100px] bg-stone-900 text-white rounded-full flex items-center justify-center text-3xl font-bold shadow-sm mb-4">
                    {user ? getInitials(user.name) : "MG"}
                </div>
                <h1 className="text-xl font-bold text-stone-900 mb-1">{user?.name || "Milan Naranbhai Gagiya"}</h1>
                <p className="text-stone-500 font-medium mb-10">+91 {maskedPhone}</p>
            </div>

            {/* Actions List */}
            <div className="w-full border-t border-stone-100 flex-1">
                <Link to="/user/personal-info" className="w-full flex items-center gap-4 px-6 py-5 hover:bg-stone-50 transition-colors border-b border-stone-100 group">
                    <User className="h-5 w-5 text-stone-400 group-hover:text-stone-600" />
                    <span className="text-[15px] font-semibold text-stone-700 group-hover:text-stone-900">Personal Info on Zento</span>
                </Link>

                <button onClick={handleLogout} className="w-full flex items-center gap-4 px-6 py-5 hover:bg-red-50 transition-colors group cursor-pointer text-left border-b border-stone-100">
                    <LogOut className="h-5 w-5 text-red-500" />
                    <span className="text-[15px] font-semibold text-red-600">Sign Out</span>
                </button>
            </div>
        </div>
    );
};

export default MobileUserSettings;
