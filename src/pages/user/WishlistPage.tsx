import React, { useState } from 'react';
import { useWishlist } from '../../context/WishlistContext';
import { RestaurantCard } from '../../components/restaurant/RestaurantCard';
import { FoodCard } from '../../components/food/FoodCard';
import { EmptyState } from '../../components/common/EmptyState';
import { Heart, UtensilsCrossed, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const WishlistPage: React.FC = () => {
  const { favoriteFoods, favoriteRestaurants } = useWishlist();
  const [activeTab, setActiveTab] = useState<'foods' | 'restaurants'>('foods');
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-orange-500">
          Personal Bookmarks
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          Your Saved Favorites
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Instant access to your favorite dishes and trusted restaurant kitchens.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('foods')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'foods'
              ? 'text-orange-500 border-orange-500'
              : 'text-slate-500 border-transparent hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <UtensilsCrossed className="w-4 h-4" />
          <span>Favorite Dishes ({favoriteFoods.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('restaurants')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'restaurants'
              ? 'text-orange-500 border-orange-500'
              : 'text-slate-500 border-transparent hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Favorite Restaurants ({favoriteRestaurants.length})</span>
        </button>
      </div>

      {/* Content */}
      {activeTab === 'foods' ? (
        favoriteFoods.length === 0 ? (
          <EmptyState
            icon={<Heart className="w-10 h-10" />}
            title="No favorite dishes saved yet"
            description="Tap the heart icon on any mouth-watering food card to bookmark it here for quick ordering."
            actionText="Discover Delicious Foods"
            onAction={() => navigate('/search')}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteFoods.map((food) => (
              <FoodCard key={food.id} food={food} layout="horizontal" />
            ))}
          </div>
        )
      ) : favoriteRestaurants.length === 0 ? (
        <EmptyState
          icon={<Store className="w-10 h-10" />}
          title="No favorite restaurants saved"
          description="Browse top-rated kitchens in your neighborhood and save the ones you love."
          actionText="Explore Restaurants"
          onAction={() => navigate('/restaurants')}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {favoriteRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      )}
    </div>
  );
};

