import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { mockCategories } from '../../data/mockCategories';
import { mockRestaurants } from '../../data/mockRestaurants';
import { mockFoods } from '../../data/mockFoods';
import { mockCoupons } from '../../data/mockCoupons';
import { RestaurantCard } from '../../components/restaurant/RestaurantCard';
import { FoodCard } from '../../components/food/FoodCard';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useToast } from '../../context/ToastContext';
import { useCart } from '../../context/CartContext';
import {
  Search,
  Sparkles,
  ArrowRight,
  Clock,
  ShieldCheck,
  Star,
  Copy,
  Check,
  MapPin,
  TrendingUp,
  Quote,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { success } = useToast();
  const { applyCoupon } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/restaurants');
    }
  };

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    applyCoupon(code);
    success(`Promo "${code}" copied & automatically activated in your cart!`, 'Coupon Applied');
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const featuredRestaurants = mockRestaurants.slice(0, 4);
  const popularFoods = mockFoods.filter((f) => f.isBestseller).slice(0, 6);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-20">
        {/* Subtle decorative glowing backgrounds */}
        <div className="absolute top-1/4 -left-40 w-96 h-96 bg-orange-500/10 dark:bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-amber-500/10 dark:bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.12]">
                Craving Biryani, Dosa or Midnight Maggi?
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Explore 29 verified partner restaurants across Mangalagiri, Chinnakakani, and Vijayawada.
              </p>

              {/* Search Bar Form */}
              <form
                onSubmit={handleSearchSubmit}
                className="relative max-w-xl mx-auto lg:mx-0 p-2 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col sm:flex-row gap-2"
              >
                <div className="flex-1 flex items-center px-3 gap-2.5">
                  <Search className="w-5 h-5 text-orange-500 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search dishes (e.g. Chicken Dum Biryani, Butter Chicken, Apollo Fish, Prawn Fry...)"
                    className="w-full text-sm bg-transparent outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
                  />
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="rounded-xl sm:rounded-2xl"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Find Food
                </Button>
              </form>

              {/* Trust badges */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <span>Fast Campus & Regional Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
                    ★
                  </div>
                  <span>4.9 / 5 Campus Student Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span>Late Night Canteen Delivery till 2 AM</span>
                </div>
              </div>
            </motion.div>

            {/* Right Visual Floating Elements */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Hero Image */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800">
                  <img
                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80"
                    alt="Delicious Dining Spread"
                    className="w-full h-80 sm:h-96 object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-xs uppercase tracking-wider font-extrabold text-orange-400">
                      SRM AP Student Favorite
                    </span>
                    <h3 className="text-lg font-bold">Hyderabadi Dum Biryani & Kebabs</h3>
                  </div>
                </div>

                {/* Floating Card 1: Fast ETA */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="absolute -top-6 -left-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 flex items-center gap-3 hidden sm:flex"
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/60 text-orange-500 flex items-center justify-center">
                    <Clock className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                      Campus Bicycle Courier
                    </span>
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                      10-15 Mins to Hostels
                    </span>
                  </div>
                </motion.div>

                {/* Floating Card 2: Top Rated Food */}
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="absolute -bottom-6 -right-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 flex items-center gap-3 hidden sm:flex"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center">
                    <Star className="w-5 h-5 fill-amber-400" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                      Campus Diners
                    </span>
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                      4,500+ SRM Students
                    </span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-orange-500">
              Explore Cravings
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Popular Categories
            </h2>
          </div>
          <Link
            to="/restaurants"
            className="text-xs sm:text-sm font-bold text-orange-500 hover:text-orange-600 flex items-center gap-1 group"
          >
            <span>See all cuisines</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-3 sm:gap-4">
          {mockCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate(`/restaurants?cuisine=${encodeURIComponent(cat.name.split(' ')[0])}`)}
              className="group flex flex-col items-center p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 hover:border-orange-500/50 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 text-center"
            >
              <div className="w-14 h-14 rounded-2xl overflow-hidden mb-2 bg-slate-100 dark:bg-slate-800 relative">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-orange-500 transition-colors line-clamp-1">
                {cat.name}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">
                {cat.itemCount}+ items
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. OFFERS BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white p-6 sm:p-10 shadow-2xl overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-3">
              <Badge variant="neutral" size="sm" className="bg-white/20 text-white border-white/30 font-bold">
                🔥 Exclusive App Promo Codes
              </Badge>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
                Get up to 20% OFF your delicious feast!
              </h3>
              <p className="text-xs sm:text-sm text-white/90 max-w-lg leading-relaxed">
                Click any voucher code below to activate instant deduction automatically in your cart.
              </p>
            </div>

            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {mockCoupons.map((coupon) => (
                <div
                  key={coupon.id}
                  onClick={() => handleCopyCoupon(coupon.code)}
                  className="bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl p-3.5 hover:bg-white/25 transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono font-black tracking-wider uppercase text-amber-200">
                      {coupon.code}
                    </span>
                    <button className="text-white hover:text-amber-200 transition-colors">
                      {copiedCode === coupon.code ? (
                        <Check className="w-4 h-4 text-emerald-300" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs font-bold leading-tight line-clamp-1">{coupon.title}</p>
                  <span className="text-[10px] text-white/80 mt-1">
                    Min order ₹{coupon.minOrder}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED RESTAURANTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-orange-500">
              Top Rated
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Featured Restaurants
            </h2>
          </div>
          <Link
            to="/restaurants"
            className="text-xs sm:text-sm font-bold text-orange-500 hover:text-orange-600 flex items-center gap-1 group"
          >
            <span>View all ({mockRestaurants.length})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </section>

      {/* 5. POPULAR FOODS / DISHES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-orange-500">
              Most Loved
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Trending Dishes Near You
            </h2>
          </div>
          <Link
            to="/search"
            className="text-xs sm:text-sm font-bold text-orange-500 hover:text-orange-600 flex items-center gap-1 group"
          >
            <span>Explore all dishes</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularFoods.map((food) => (
            <FoodCard key={food.id} food={food} layout="horizontal" />
          ))}
        </div>
      </section>

      {/* 6. TESTIMONIALS SECTION */}
      <section className="bg-slate-100/60 dark:bg-slate-900/40 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-orange-500">
              Campus Love
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Loved by SRM AP Students
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
              From late night hostel study sessions to quick lunch grabs between classes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-orange-200 dark:text-orange-950 mb-2" />
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                  "Butter Chicken and Prawn Fry from Biryanis and More (Chinnakakani) arrived at Ganga Hostel in 15 mins! The live GPS courier tracker lets you meet the rider right at the gate."
                </p>
              </div>
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80"
                  alt="Reviewer"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Karthik Raju</h4>
                  <p className="text-[11px] text-slate-400">Ganga Hostel, CSE 3rd Year</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-orange-200 dark:text-orange-950 mb-2" />
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                  "Apollo Fish and Dum Biryani from Besta Vijayawada made our hostel wing party epic. Student promo code SRMAP50 saved ₹50 instantly!"
                </p>
              </div>
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                  alt="Reviewer"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Abhishek Sharma</h4>
                  <p className="text-[11px] text-slate-400">Krishna Hostel, Mechanical</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-orange-200 dark:text-orange-950 mb-2" />
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                  "Bismillah Dum Biryani from Mangalagiri Trunk Road delivered right to Yamuna Girls Hostel reception hot and fresh. Super quick service!"
                </p>
              </div>
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
                  alt="Reviewer"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Sneha Reddy</h4>
                  <p className="text-[11px] text-slate-400">Yamuna Hostel, ECE 2nd Year</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

