import { HugeiconsIcon } from "@hugeicons/react";
import { Settings01Icon, Shield01Icon } from "@hugeicons/core-free-icons";

const AdminSettings = () => {
    return (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col h-full min-h-[500px]">
            <div className="px-6 py-5 border-b border-stone-100 flex items-center shrink-0">
                <h2 className="text-xl font-bold text-stone-900 flex items-center gap-3">
                    <HugeiconsIcon icon={Settings01Icon} size={24} className="text-stone-400" />
                    Platform Settings
                </h2>
            </div>
            <div className="p-8 flex-1 flex flex-col items-center justify-center bg-stone-50/50 text-center">
                <HugeiconsIcon icon={Shield01Icon} size={64} className="text-stone-200 mb-4" />
                <h3 className="text-lg font-bold text-stone-900 mb-1">System Configuration</h3>
                <p className="text-stone-400 font-medium max-w-sm">Update platform variables, site settings, and administrative permissions here.</p>
            </div>
        </div>
    );
};

export default AdminSettings;
