import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";

const MobilePersonalInfo = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white">

            {/* HEADER */}
            <div className="sticky top-0 z-10 bg-white border-b border-[#f2f2f2]">
                <div className="flex items-center h-11 px-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="mr-2 text-[#0071e3] text-[13px]"
                    >
                        Cancel
                    </button>

                    <h1 className="text-[15px] font-semibold text-[#1d1d1f]">
                        Personal Information
                    </h1>
                </div>
            </div>

            {/* CONTENT */}
            <div className="px-4 divide-y divide-[#f2f2f2]">

                {/* NAME */}
                <div className="py-4">
                    <p className="text-[12px] text-[#86868b] mb-1">
                        Name
                    </p>
                    <p className="text-[15px] text-[#1d1d1f]">
                        {user?.name || "Milan Naranbhai Gagiya"}
                    </p>
                </div>

                {/* EMAIL */}
                <div className="py-4">
                    <p className="text-[12px] text-[#86868b] mb-1">
                        Email
                    </p>
                    <p className="text-[15px] text-[#1d1d1f] break-all">
                        {user?.email || "9265201108@nomail.jiomart.com"}
                    </p>
                </div>

                {/* PHONE */}
                <div className="py-4">
                    <p className="text-[12px] text-[#86868b] mb-1">
                        Phone
                    </p>
                    <p className="text-[15px] text-[#1d1d1f]">
                        +91 9265201108
                    </p>
                </div>

            </div>
        </div>
    );
};

export default MobilePersonalInfo;
