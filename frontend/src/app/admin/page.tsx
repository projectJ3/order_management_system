'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        const user = userData ? JSON.parse(userData) : null;

        // Quick MVP auth check
        if (!token || user?.role !== 'ADMIN') {
            // router.push('/login'); // Uncomment for stricter MVP locking
        }
        fetchData(token || '');
    }, []);

    const fetchData = async (token: string) => {
        try {
            const res = await fetch('http://localhost:5000/api/orders/admin', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) setOrders(await res.json());
        } catch (e) {
            console.error('Failed fetching admin data');
        }
        setLoading(false);
    };

    const handleExport = () => {
        const token = localStorage.getItem('token');
        window.location.href = `http://localhost:5000/api/orders/admin/export?token=${token}`;
    };

    if (loading) return <div className="p-10">Loading Admin Portal...</div>;

    return (
        <div className="py-8 w-full max-w-6xl mx-auto">
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white">Admin Headquarters</h2>
                    <p className="text-slate-500 mt-2">Overview of deliveries and orders</p>
                </div>
                <button
                    onClick={handleExport}
                    className="btn-primary shadow-indigo-500/30 font-medium"
                >
                    ⬇️ Export Daily Excel
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <div className="premium-card p-6 border-l-4 border-l-blue-500">
                    <p className="text-slate-500 text-sm font-medium">Total Orders (Today)</p>
                    <h3 className="text-3xl font-bold mt-2">{orders.length}</h3>
                </div>
                <div className="premium-card p-6 border-l-4 border-l-green-500">
                    <p className="text-slate-500 text-sm font-medium">WhatsApp Orders</p>
                    <h3 className="text-3xl font-bold mt-2">{orders.filter(o => o.source === 'WHATSAPP').length}</h3>
                </div>
                <div className="premium-card p-6 border-l-4 border-l-purple-500">
                    <p className="text-slate-500 text-sm font-medium">Delivered</p>
                    <h3 className="text-3xl font-bold mt-2">{orders.filter(o => o.status === 'DELIVERED').length}</h3>
                </div>
            </div>

            <div className="premium-card overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                    <h3 className="font-bold text-lg">All Recent Orders</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-800">
                            <tr>
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Phone</th>
                                <th className="px-6 py-4">Product</th>
                                <th className="px-6 py-4">Delivery Date</th>
                                <th className="px-6 py-4">Source</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((o: any) => (
                                <tr key={o.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs text-slate-500">{o.id.substring(0, 8)}</td>
                                    <td className="px-6 py-4 font-medium">{o.user?.name || o.name || '-'}</td>
                                    <td className="px-6 py-4 text-slate-500">{o.user?.phone || o.phone || '-'}</td>
                                    <td className="px-6 py-4 font-medium text-blue-600">{o.product} ({o.quantity}L)</td>
                                    <td className="px-6 py-4">{new Date(o.deliveryDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${o.source === 'WHATSAPP' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {o.source}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-slate-600">{o.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
