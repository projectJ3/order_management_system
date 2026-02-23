import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';

// Using a premium display font 'Outfit'
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'Goodmilk | Premium Milk Delivery',
  description: 'Manage your milk subscriptions and one-time orders globally over WhatsApp and Web.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} font-sans pt-16`}>
        {/* Sleek Navigation Bar */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2 cursor-pointer">
              <span className="text-2xl">🥛</span>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Goodmilk
              </h1>
            </div>
            <div className="flex space-x-6">
              <a href="/login" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors font-medium">Login</a>
            </div>
          </div>
        </nav>

        <main className="min-h-screen relative overflow-hidden">
          {/* Subtle dynamic background blobs */}
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
          <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-indigo-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
