import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, ShoppingBag, Heart, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export const MobileBottomNav: React.FC = () => {
  const { cartCount, openCartDrawer } = useCart();
  const { favoriteFoods, favoriteRestaurants } = useWishlist();
  const wishlistCount = favoriteFoods.length + favoriteRestaurants.length;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-3 py-2 flex items-center justify-around">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-[10px] font-bold transition-colors ${
            isActive ? 'text-orange-500' : 'text-slate-500 dark:text-slate-400'
          }`
        }
      >
        <Home className="w-5 h-5" />
        <span>Home</span>
      </NavLink>

      <NavLink
        to="/search"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-[10px] font-bold transition-colors ${
            isActive ? 'text-orange-500' : 'text-slate-500 dark:text-slate-400'
          }`
        }
      >
        <Search className="w-5 h-5" />
        <span>Search</span>
      </NavLink>

      {/* Center Cart Trigger */}
      <button
        onClick={openCartDrawer}
        className="flex flex-col items-center gap-1 text-[10px] font-bold text-orange-500 relative"
      >
        <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center -mt-5 shadow-lg shadow-orange-500/30">
          <ShoppingBag className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-6 right-0 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </div>
        <span>Cart</span>
      </button>

      <NavLink
        to="/wishlist"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-[10px] font-bold transition-colors relative ${
            isActive ? 'text-orange-500' : 'text-slate-500 dark:text-slate-400'
          }`
        }
      >
        <Heart className="w-5 h-5" />
        <span>Saved</span>
        {wishlistCount > 0 && (
          <span className="absolute top-0 right-2 w-2 h-2 rounded-full bg-rose-500" />
        )}
      </NavLink>

      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-[10px] font-bold transition-colors ${
            isActive ? 'text-orange-500' : 'text-slate-500 dark:text-slate-400'
          }`
        }
      >
        <User className="w-5 h-5" />
        <span>Profile</span>
      </NavLink>
    </div>
  );
};

