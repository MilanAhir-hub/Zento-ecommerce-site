import { useEffect } from "react";
import { Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { Notification01Icon, ShoppingBag01Icon, TruckIcon, CheckmarkCircle02Icon, Loading03Icon } from "@hugeicons/core-free-icons";
import { useNotifications, useMarkNotificationsRead } from "../../hooks/user/useNotifications";

const getIcon = (type: string) => {
    switch (type) {
        case "order":
            return <HugeiconsIcon icon={ShoppingBag01Icon} size={20} className="text-blue-600" />;
        case "shipping":
            return <HugeiconsIcon icon={TruckIcon} size={20} className="text-orange-500" />;
        case "delivery":
            return <HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} className="text-green-600" />;
        default:
            return <HugeiconsIcon icon={Notification01Icon} size={20} className="text-[#0071e3]" />;
    }
};

const MyNotification = () => {
    const { data: notifications, isLoading } = useNotifications();
    const { mutate: markAsRead } = useMarkNotificationsRead();

    useEffect(() => {
        if (notifications && notifications.some((n: any) => !n.isRead)) {
            markAsRead();
        }
    }, [notifications, markAsRead]);

    if (isLoading) {
        return (
            <section className="max-w-4xl mx-auto px-4 py-20 text-center flex flex-col items-center">
                <HugeiconsIcon icon={Loading03Icon} size={40} className="text-[#0071e3] animate-spin mb-4" />
                <p className="text-stone-500">Loading your inbox...</p>
            </section>
        )
    }

    if (!notifications || notifications.length === 0) {
        return (
            <section className="max-w-4xl mx-auto px-4 py-20 text-center">

                <div className="w-20 h-20 mx-auto rounded-full bg-stone-100 flex items-center justify-center mb-6">
                    <HugeiconsIcon icon={Notification01Icon} size={32} className="text-stone-400" />
                </div>

                <h1 className="text-3xl font-bold text-stone-900 mb-3">
                    No Notifications Yet
                </h1>

                <p className="text-stone-500 mb-8">
                    When you place orders or receive updates, they will appear here.
                </p>

                <Link
                    to="/products"
                    className="bg-stone-900 text-white px-6 py-3 rounded-lg hover:bg-black transition"
                >
                    Browse Products
                </Link>

            </section>
        );
    }

    return (
        <section className="max-w-4xl mx-auto px-4 py-12">

            {/* Page Header */}
            <div className="flex items-center gap-3 mb-10">
                <HugeiconsIcon icon={Notification01Icon} size={24} className="text-stone-700" />
                <h1 className="text-3xl font-bold text-stone-900">
                    My Notifications
                </h1>
            </div>

            {/* Notification List */}
            <div className="space-y-4">

                {notifications.map((notification: any) => (
                    <div
                        key={notification._id}
                        className={`flex items-start gap-4 p-5 rounded-2xl border transition-all duration-300 shadow-sm
                            ${notification.isRead
                                ? "bg-white border-stone-200"
                                : "bg-[#fbfbfd] border-[#0071e3]/30"
                            }`}
                    >
                        {/* Icon */}
                        <div className="mt-1 w-10 h-10 rounded-full bg-white border border-stone-100 flex items-center justify-center shrink-0 shadow-sm">
                            {getIcon(notification.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            <h3 className="text-stone-900 font-bold mb-1">
                                {notification.title}
                            </h3>
                            <p className="text-stone-700 font-medium text-[15px] leading-relaxed">
                                {notification.message}
                            </p>

                            <p className="text-sm text-stone-400 mt-2 font-medium">
                                {new Date(notification.createdAt).toLocaleString(undefined, {
                                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                })}
                            </p>
                        </div>

                        {/* Unread Indicator */}
                        {!notification.isRead && (
                            <span className="w-2.5 h-2.5 bg-[#0071e3] rounded-full mt-2 shadow-[0_0_8px_rgba(0,113,227,0.5)] animate-pulse" />
                        )}
                    </div>
                ))}

            </div>

        </section>
    );
};

export default MyNotification;