import { HugeiconsIcon } from "@hugeicons/react";
import { Location01Icon, Home01Icon, User02Icon } from "@hugeicons/core-free-icons";
import Button from "../../components/ui/Button";

const DeliveryAddress = () => {
    return (
        <section className="max-w-5xl mx-auto px-4 py-12">

            {/* Page Header */}
            <div className="flex items-center gap-3 mb-8">
                <HugeiconsIcon icon={Location01Icon} size={24} className="text-stone-700" />
                <h1 className="text-3xl font-bold text-stone-900">
                    Delivery Address
                </h1>
            </div>

            {/* Address Form Card */}
            <div className="bg-white border border-stone-200 rounded-2xl shadow-sm p-6 sm:p-8">

                <form className="space-y-6">

                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                            Full Name
                        </label>
                        <div className="relative">
                            <HugeiconsIcon icon={User02Icon} size={16} className="absolute left-3 top-3.5 text-stone-400" />
                            <input
                                type="text"
                                placeholder="Enter your full name"
                                className="w-full border border-stone-300 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-stone-900"
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            placeholder="Enter phone number"
                            className="w-full border border-stone-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-stone-900"
                        />
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                            Address
                        </label>
                        <div className="relative">
                            <HugeiconsIcon icon={Home01Icon} size={16} className="absolute left-3 top-3.5 text-stone-400" />
                            <input
                                type="text"
                                placeholder="Street address"
                                className="w-full border border-stone-300 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-stone-900"
                            />
                        </div>
                    </div>

                    {/* City + State */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-2">
                                City
                            </label>
                            <input
                                type="text"
                                placeholder="City"
                                className="w-full border border-stone-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-stone-900"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-2">
                                State
                            </label>
                            <input
                                type="text"
                                placeholder="State"
                                className="w-full border border-stone-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-stone-900"
                            />
                        </div>

                    </div>

                    {/* Postal Code */}
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                            Postal Code
                        </label>
                        <input
                            type="text"
                            placeholder="PIN code"
                            className="w-full border border-stone-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-stone-900"
                        />
                    </div>

                    {/* Country */}
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                            Country
                        </label>
                        <input
                            type="text"
                            placeholder="Country"
                            defaultValue="India"
                            className="w-full border border-stone-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-stone-900"
                        />
                    </div>

                    {/* Save Button */}
                    <div className="pt-4">
                        <Button
                            variant="primary"
                            size="lg"
                            className="w-full sm:w-auto"
                        >
                            Save Address
                        </Button>
                    </div>

                </form>
            </div>
        </section>
    );
};

export default DeliveryAddress;