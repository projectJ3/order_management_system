'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [subs, setSubs] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        if (!token || !userData) {
            router.push('/login');
            return;
        }
        setUser(JSON.parse(userData));
        fetchData(token);
    }, []);

    const fetchData = async (token: string) => {
        try {
            const [subsRes, ordersRes] = await Promise.all([
                fetch('http://localhost:5000/api/subscriptions', { headers: { Authorization: `Bearer ${token}` } }),
                fetch('http://localhost:5000/api/orders', { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setSubs(await subsRes.json());
            setOrders(await ordersRes.json());
        } catch (e) {
            console.error('Failed fetching user data');
        }
        setLoading(false);
    };

    const toggleSubscription = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
        try {
            const res = await fetch(`http://localhost:5000/api/subscriptions/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) fetchData(localStorage.getItem('token')!);
        } catch (e) {
            console.error(e);
        }
    };

    if (loading) return <div className="min-h-[60vh] flex justify-center items-center"><div className="animate-pulse text-xl">Loading your fresh stats...</div></div>;

    return (
        <div className="py-8">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-3xl font-bold">Hello, {user?.name.split(' ')[0]} 👋</h2>
                    <p className="text-slate-500 mt-1">Manage your Goodmilk deliveries</p>
                </div>
                <button
                    onClick={() => { localStorage.clear(); router.push('/login'); }}
                    className="px-4 py-2 border border-red-200 text-red-600 rounded-full hover:bg-red-50 transition-colors"
                >
                    Logout
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Active Subscriptions */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-xl font-semibold flex items-center">
                        <span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">🔁</span>
                        Your Subscriptions
                    </h3>

                    {subs.length === 0 ? (
                        <div className="premium-card p-8 text-center bg-slate-50 dark:bg-slate-800/50 border-dashed">
                            <span className="text-4xl block mb-3">📦</span>
                            <p className="text-slate-500 mb-4">No active subscriptions yet.</p>
                            <button className="btn-primary py-2 px-4 shadow-none">Start New Plan</button>
                        </div>
                    ) : (
                        subs.map((sub: any) => (
                            <div key={sub.id} className="premium-card p-6 flex flex-col sm:flex-row sm:items-center justify-between group">
                                <div>
                                    <div className="flex items-center space-x-3 mb-2">
                                        <h4 className="font-bold text-lg">{sub.product}</h4>
                                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${sub.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                            {sub.status}
                                        </span>
                                    </div>
                                    <p className="text-slate-500 text-sm">
                                        {sub.quantity}L • {sub.frequency} • Started {new Date(sub.startDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="mt-4 sm:mt-0">
                                    <button
                                        onClick={() => toggleSubscription(sub.id, sub.status)}
                                        className={`px-5 py-2 rounded-full font-medium transition-all ${sub.status === 'ACTIVE' ? 'bg-orange-100 text-orange-600 hover:bg-orange-200' : 'bg-green-100 text-green-600 hover:bg-green-200'}`}
                                    >
                                        {sub.status === 'ACTIVE' ? 'Pause Delivery' : 'Resume Delivery'}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Order History */}
                <div>
                    <h3 className="text-xl font-semibold flex items-center mb-6">
                        <span className="bg-indigo-100 text-indigo-600 p-2 rounded-lg mr-3">🧾</span>
                        Recent Orders
                    </h3>

                    <div className="premium-card p-5 space-y-5">
                        {orders.length === 0 ? (
                            <p className="text-slate-500 text-sm italic text-center py-4">No recent orders</p>
                        ) : (
                            orders.slice(0, 5).map((order: any) => (
                                <div key={order.id} className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-4 last:border-0 last:pb-0">
                                    <div>
                                        <h4 className="font-medium text-sm">{order.product} ({order.quantity}L)</h4>
                                        <p className="text-xs text-slate-400 mt-1">{new Date(order.deliveryDate).toLocaleDateString()} • {order.source}</p>
                                    </div>
                                    <span className={`text-xs font-semibold ${order.status === 'DELIVERED' ? 'text-green-500' : 'text-blue-500'}`}>
                                        {order.status}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
