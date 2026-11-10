import React from 'react';
import { Link } from 'react-router-dom';
import { Restaurant } from '../../types';
import { useWishlist } from '../../context/WishlistContext';
import { Star, Clock, Heart, Bike, MapPin } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export interface RestaurantCardProps {
  restaurant: Restaurant;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  const { isRestaurantFavorited, toggleFavoriteRestaurant } = useWishlist();
  const favorited = isRestaurantFavorited(restaurant.id);

  return (
    <div className="group relative flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-sm hover:shadow-card-hover transition-all duration-300 overflow-hidden">
      {/* Top Banner Image */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Promo / Discount Ribbon */}
        {restaurant.discountText && (
          <div className="absolute bottom-3 left-3 bg-gradient-to-r from-orange-600 to-amber-500 text-white text-xs font-bold px-3 py-1 rounded-xl shadow-md">
            {restaurant.discountText}
          </div>
        )}

        {/* Delivery Time Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-800 dark:text-slate-100 text-xs font-bold px-2.5 py-1 rounded-xl shadow-sm">
          <Clock className="w-3.5 h-3.5 text-orange-500" />
          <span>{restaurant.deliveryTime} mins</span>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavoriteRestaurant(restaurant);
          }}
          aria-label="Save Restaurant"
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-700 dark:text-slate-200 hover:text-rose-500 shadow-sm transition-colors"
        >
          <Heart
            className={`w-4 h-4 ${
              favorited ? 'fill-rose-500 text-rose-500' : 'text-slate-600 dark:text-slate-300'
            }`}
          />
        </button>
      </div>

      {/* Info Body */}
      <Link
        to={`/restaurants/${restaurant.id}`}
        className="p-4 flex-1 flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors line-clamp-1">
              {restaurant.name}
            </h3>
            <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-bold px-2 py-0.5 rounded-lg border border-emerald-200/60 dark:border-emerald-800/40 shrink-0">
              <Star className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
              <span>{restaurant.rating}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-orange-600 dark:text-orange-400 font-semibold mt-1">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="line-clamp-1">{restaurant.areaZone || 'Campus Delivery Zone'}</span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
            {restaurant.cuisines.join(' • ')}
          </p>
        </div>

        <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
          <div className="flex items-center gap-1.5">
            <Bike className="w-3.5 h-3.5 text-slate-400" />
            <span>{restaurant.deliveryFee === 0 ? 'Free delivery' : formatCurrency(restaurant.deliveryFee)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>{restaurant.distanceKm} km</span>
            <span>•</span>
            <span className="truncate max-w-[120px]">{restaurant.serviceModes ? restaurant.serviceModes.split(';')[0] : `Min ${formatCurrency(restaurant.minOrder)}`}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

