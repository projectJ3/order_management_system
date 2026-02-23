'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Register() {
    const router = useRouter();
    const [formData, setFormData] = useState({ name: '', phone: '', address: '', password: '' });
    const [error, setError] = useState('');

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                router.push('/dashboard');
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('Failed to connect to server.');
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-10">
            <div className="premium-card w-full max-w-lg p-8 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-b-full shadow-[0_0_20px_rgba(59,130,246,0.5)]"></div>

                <h2 className="text-3xl font-bold mb-2 text-center">Join Goodmilk</h2>
                <p className="text-slate-500 text-center mb-8">Start your daily fresh milk subscription</p>

                {error && <div className="p-3 mb-6 bg-red-100 text-red-600 rounded-lg text-sm text-center font-medium animate-pulse">{error}</div>}

                <form onSubmit={handleRegister} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium mb-1">Full Name</label>
                            <input
                                type="text" required placeholder="John Doe" className="input-rich"
                                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Phone Number</label>
                            <input
                                type="tel" required placeholder="9876543210" className="input-rich"
                                value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Delivery Address</label>
                        <textarea
                            required placeholder="123 Farm Lane, City" rows={2} className="input-rich resize-none"
                            value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input
                            type="password" required placeholder="••••••••" className="input-rich"
                            value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <button type="submit" className="btn-primary w-full mt-6 py-4">
                        Create Account
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-500">
                    Already have an account?{' '}
                    <Link href="/login" className="text-blue-600 font-semibold hover:underline">
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
}
