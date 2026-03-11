import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { useAuth } from "../../context/authContext";

const MobilePersonalInfo = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#f8f8f8]">
            {/* Header */}
            <div className="p-4 flex items-center border-b border-stone-200 bg-white sticky top-0 z-10">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 mr-2 text-stone-600 hover:bg-stone-50 rounded-full transition-colors cursor-pointer">
                    <X className="h-6 w-6" />
                </button>
                <h1 className="text-[17px] font-bold text-stone-900">Personal Information</h1>
            </div>

            {/* Content Container */}
            <div className="p-4">
                <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-6 shadow-sm">
                    {/* Full Name */}
                    <div>
                        <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Full Name</p>
                        <p className="text-[15px] font-semibold text-stone-900">
                            {user?.name || "Milan Naranbhai Gagiya"}
                        </p>
                    </div>

                    <div className="h-px w-full bg-stone-100"></div>

                    {/* Email ID */}
                    <div>
                        <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Email ID</p>
                        <p className="text-[15px] font-semibold text-stone-900 break-all">
                            {user?.email || "9265201108@nomail.jiomart.com"}
                        </p>
                    </div>

                    <div className="h-px w-full bg-stone-100"></div>

                    {/* Mobile No */}
                    <div>
                        <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Mobile No</p>
                        <p className="text-[15px] font-semibold text-stone-900">
                            +91 9265201108
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobilePersonalInfo;
