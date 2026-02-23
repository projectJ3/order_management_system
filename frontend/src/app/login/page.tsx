'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
    const router = useRouter();
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, password })
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
        <div className="min-h-[80vh] flex items-center justify-center">
            <div className="premium-card w-full max-w-md p-8 relative">
                {/* Glow accent */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-b-full shadow-[0_0_20px_rgba(59,130,246,0.5)]"></div>

                <h2 className="text-3xl font-bold mb-2 text-center">Welcome Back</h2>
                <p className="text-slate-500 text-center mb-8">Login to manage your milk deliveries</p>

                {error && <div className="p-3 mb-6 bg-red-100 text-red-600 rounded-lg text-sm text-center font-medium animate-pulse">{error}</div>}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium mb-1">Phone Number</label>
                        <input
                            type="tel"
                            required
                            placeholder="e.g. 9876543210"
                            className="input-rich"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input
                            type="password"
                            required
                            placeholder="••••••••"
                            className="input-rich"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn-primary w-full mt-4">
                        Sign In
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-500">
                    New to Goodmilk?{' '}
                    <Link href="/register" className="text-blue-600 font-semibold hover:underline">
                        Create an account
                    </Link>
                </div>
            </div>
        </div>
    );
}
