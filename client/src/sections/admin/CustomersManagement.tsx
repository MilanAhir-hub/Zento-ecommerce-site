import { Users, Loader2, ShieldAlert } from "lucide-react";
import { useAdminCustomers, useUpdateUserRole } from "../../hooks/admin/useAdmin";

const CustomersManagement = () => {
    const { data: customers, isLoading } = useAdminCustomers();
    const updateRole = useUpdateUserRole();

    return (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col h-full min-h-[500px]">
            <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between shrink-0">
                <h2 className="text-xl font-bold text-stone-900 flex items-center gap-3">
                    <Users className="w-6 h-6 text-stone-400" />
                    Customers
                </h2>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Search customers..."
                        className="text-sm px-4 py-2 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-400"
                    />
                </div>
            </div>
            <div className="p-6 flex-1 overflow-x-auto">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
                        <Loader2 className="w-8 h-8 text-stone-300 animate-spin mb-4" />
                        <p className="text-sm font-medium text-stone-500">Loading customers...</p>
                    </div>
                ) : !customers || customers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center">
                        <Users className="w-16 h-16 text-stone-200 mb-4" />
                        <h3 className="text-lg font-bold text-stone-900 mb-1">No Customers Found</h3>
                        <p className="text-stone-400 font-medium max-w-sm">There are no registered customers on the platform yet.</p>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-stone-100">
                                <th className="py-3 px-4 text-xs font-bold text-stone-400 uppercase tracking-wider">Customer</th>
                                <th className="py-3 px-4 text-xs font-bold text-stone-400 uppercase tracking-wider">Email</th>
                                <th className="py-3 px-4 text-xs font-bold text-stone-400 uppercase tracking-wider">Role</th>
                                <th className="py-3 px-4 text-xs font-bold text-stone-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((customer: any) => (
                                <tr key={customer._id} className="border-b border-stone-50 hover:bg-stone-50/50 transition-colors">
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-700 font-bold shrink-0">
                                                {customer.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <p className="font-bold text-sm text-stone-900">{customer.name}</p>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-sm font-medium text-stone-600">{customer.email}</td>
                                    <td className="py-4 px-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${customer.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                                customer.role === 'vendor' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-stone-100 text-stone-700'
                                            }`}>
                                            {customer.role.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <button
                                            onClick={() => {
                                                if (confirm(`Are you sure you want to promote ${customer.name} to Admin?`)) {
                                                    updateRole.mutate({ id: customer._id, role: 'admin' });
                                                }
                                            }}
                                            disabled={updateRole.isPending}
                                            className="text-xs font-bold text-stone-500 hover:text-stone-900 transition-colors flex items-center gap-1 ml-auto"
                                        >
                                            <ShieldAlert className="w-4 h-4" />
                                            Make Admin
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default CustomersManagement;
