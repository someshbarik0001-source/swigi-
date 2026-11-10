import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Header */}
      <header className="p-6 flex items-center justify-between max-w-7xl mx-auto w-full">
        <Link
          to="/"
          className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-orange-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Swigi</span>
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          {/* Logo center */}
          <div className="flex flex-col items-center mb-8">
            <Link to="/" className="flex items-center gap-2 mb-2">
              <img
                src="/swigi-logo.png"
                alt="Swigi"
                className="h-16 w-auto object-contain drop-shadow-md hover:scale-105 transition-transform shrink-0"
              />
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
                Swigi
              </h1>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Fresh & fast hostel meals delivered to your door
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Swigi Platform. Secure simulated session demo.
      </footer>
    </div>
  );
};

