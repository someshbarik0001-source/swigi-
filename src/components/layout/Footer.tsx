import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Send, Heart, ShieldCheck, Sparkles, Award } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const { success } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    success('Thank you for subscribing to Swigi gourmet updates!', 'Subscribed');
    setEmail('');
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0 border border-orange-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Regional Dining Hub</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Mangalagiri, Chinnakakani & Vijayawada partner kitchens.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0 border border-orange-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">FSSAI Certified</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Hygiene verified student kitchens & contactless hostel handoffs.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0 border border-orange-500/20">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Hostel Express Delivery</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Direct to Ganga, Yamuna & Krishna hostels within 20 mins.
              </p>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 py-12 border-b border-slate-800">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/swigi-logo.png"
                alt="Swigi"
                className="h-12 w-auto object-contain shrink-0"
              />
              <span className="text-3xl font-black tracking-tight text-white leading-none">
                Swigi
              </span>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Swigi SRM AP connects students, faculty, and campus residents with the best food around
              SRM University AP, Neerukonda. Integrated with DAA 2026-27 scratch algorithmic optimization modules.
            </p>

            {/* Newsletter */}
            <form onSubmit={handleSubscribe} className="pt-2">
              <span className="block text-xs font-semibold text-slate-200 mb-2">
                Get campus midnight deals & exam week discounts
              </span>
              <div className="flex gap-2 max-w-sm">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="bg-slate-800/80 border border-slate-700 text-xs text-white rounded-xl px-3.5 py-2.5 outline-none focus:border-orange-500 flex-1"
                />
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-4 py-2.5 text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Join</span>
                </button>
              </div>
            </form>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/restaurants" className="hover:text-orange-400 transition-colors">
                  All Restaurants
                </Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-orange-400 transition-colors">
                  Popular Dishes
                </Link>
              </li>
              <li>
                <Link to="/track/ord-live-001" className="hover:text-orange-400 transition-colors">
                  Live Order Tracker
                </Link>
              </li>
              <li>
                <Link to="/algorithms" className="text-orange-400 hover:text-orange-300 font-bold transition-colors flex items-center gap-1">
                  <span>DAA Lab 🔬</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* DAA Algorithm Suite Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400 mb-4">
              DAA Algorithms
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300 font-medium">
              <li>
                <Link to="/algorithms" className="hover:text-orange-400 transition-colors">
                  Dijkstra Routing O((V+E)logV)
                </Link>
              </li>
              <li>
                <Link to="/algorithms" className="hover:text-orange-400 transition-colors">
                  0/1 Knapsack O(n·W)
                </Link>
              </li>
              <li>
                <Link to="/algorithms" className="hover:text-orange-400 transition-colors">
                  Huffman Coding O(n log n)
                </Link>
              </li>
              <li>
                <Link to="/algorithms" className="hover:text-orange-400 transition-colors">
                  Quick Sort Avg O(n log n)
                </Link>
              </li>
            </ul>
          </div>

          {/* Top Cuisines */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Campus Cuisines
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/restaurants?cuisine=Biryani%20%26%20Pulao" className="hover:text-orange-400 transition-colors">
                  Biryani & Pulao
                </Link>
              </li>
              <li>
                <Link to="/restaurants?cuisine=South%20Indian" className="hover:text-orange-400 transition-colors">
                  Dosa & South Tiffins
                </Link>
              </li>
              <li>
                <Link to="/restaurants?cuisine=Andhra" className="hover:text-orange-400 transition-colors">
                  Andhra Meals & Thali
                </Link>
              </li>
              <li>
                <Link to="/restaurants?cuisine=North%20Indian" className="hover:text-orange-400 transition-colors">
                  North Indian & Roti
                </Link>
              </li>
            </ul>
          </div>

          {/* Administration & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Administration
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/admin" className="text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1">
                  <span>Admin Dashboard</span>
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-orange-400 transition-colors">
                  Partner Portal
                </Link>
              </li>
              <li>
                <Link to="/algorithms" className="text-emerald-400 hover:text-emerald-300 font-semibold">
                  Algorithm Analysis Lab
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Swigi SRM AP. Neerukonda, Amaravati, AP 522240. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>for SRM University AP students & campus food lovers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

