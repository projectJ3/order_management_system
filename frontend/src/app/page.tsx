import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <div className="animate-float mb-8">
        <span className="text-8xl drop-shadow-2xl">🥛</span>
      </div>

      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
        Fresh milk, <br />
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-500">
          delivered daily.
        </span>
      </h1>

      <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
        Experience the purest Cow, Buffalo, and Toned milk right at your doorstep. Subscribe dynamically via Web or WhatsApp.
      </p>

      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
        <Link href="/register">
          <button className="btn-primary flex items-center shadow-blue-500/50">
            Start Subscription
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </button>
        </Link>
        <Link href="/whatsapp">
          <button className="relative inline-flex items-center justify-center px-6 py-3 font-semibold text-slate-700 bg-white border border-slate-200 rounded-full shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 hover:-translate-y-1">
            Order via WhatsApp
            <span className="ml-2 text-xl text-green-500">💬</span>
          </button>
        </Link>
      </div>

      {/* Decorative metrics */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
        <div className="premium-card p-6 flex flex-col items-center">
          <span className="text-3xl mb-2">🐄</span>
          <h3 className="font-bold text-xl">Pure Sourced</h3>
          <p className="text-sm text-slate-500 mt-2">Farm to glass in 12 hours</p>
        </div>
        <div className="premium-card p-6 flex flex-col items-center">
          <span className="text-3xl mb-2">⚡</span>
          <h3 className="font-bold text-xl">Flexible Delivery</h3>
          <p className="text-sm text-slate-500 mt-2">Pause & resume anytime</p>
        </div>
        <div className="premium-card p-6 flex flex-col items-center">
          <span className="text-3xl mb-2">📱</span>
          <h3 className="font-bold text-xl">WhatsApp Native</h3>
          <p className="text-sm text-slate-500 mt-2">Check bill directly in DMs</p>
        </div>
      </div>
    </div>
  );
}
