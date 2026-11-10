import React, { useState } from 'react';
import { FoodItem } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { FoodOptionModal } from './FoodOptionModal';
import { formatCurrency } from '../../utils/formatters';
import { Heart, Plus, Minus, Star, Flame } from 'lucide-react';

export interface FoodCardProps {
  food: FoodItem;
  layout?: 'horizontal' | 'vertical';
}

export const FoodCard: React.FC<FoodCardProps> = ({ food, layout = 'horizontal' }) => {
  const { items, addItem, updateQuantity } = useCart();
  const { isFoodFavorited, toggleFavoriteFood } = useWishlist();
  const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);

  const favorited = isFoodFavorited(food.id);

  // Check if item is in cart (matching without specific options for quick counter)
  const cartEntries = items.filter((item) => item.food.id === food.id);
  const totalInCart = cartEntries.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddClick = () => {
    if (food.options && food.options.length > 0) {
      setIsOptionModalOpen(true);
    } else {
      addItem(food);
    }
  };

  const handleIncrement = () => {
    if (food.options && food.options.length > 0) {
      setIsOptionModalOpen(true);
    } else if (cartEntries.length > 0) {
      updateQuantity(cartEntries[0].id, cartEntries[0].quantity + 1);
    } else {
      addItem(food);
    }
  };

  const handleDecrement = () => {
    if (cartEntries.length > 0) {
      const target = cartEntries[0];
      updateQuantity(target.id, target.quantity - 1);
    }
  };

  if (layout === 'vertical') {
    return (
      <>
        <div className="group relative flex flex-col justify-between rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-sm hover:shadow-card-hover transition-all duration-300 overflow-hidden">
          {/* Food Image */}
          <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
            <img
              src={food.image}
              alt={food.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
              <Badge variant={food.isVeg ? 'veg' : 'non-veg'} size="sm">
                {food.isVeg ? 'Veg' : 'Non-Veg'}
              </Badge>
              {food.isBestseller && (
                <Badge variant="warning" size="sm">
                  ★ Bestseller
                </Badge>
              )}
            </div>

            <button
              onClick={() => toggleFavoriteFood(food)}
              aria-label="Save to Wishlist"
              className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-700 dark:text-slate-200 hover:text-rose-500 dark:hover:text-rose-500 shadow-sm transition-colors"
            >
              <Heart
                className={`w-4 h-4 ${
                  favorited ? 'fill-rose-500 text-rose-500' : 'text-slate-600 dark:text-slate-300'
                }`}
              />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                <span>{food.restaurantName}</span>
                <span className="flex items-center gap-1 font-semibold text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {food.rating} ({food.reviewsCount})
                </span>
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-orange-500 transition-colors">
                {food.name}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                {food.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-base font-extrabold text-slate-900 dark:text-white">
                  {formatCurrency(food.price)}
                </div>
                {food.originalPrice && (
                  <span className="text-xs text-slate-400 line-through">
                    {formatCurrency(food.originalPrice)}
                  </span>
                )}
              </div>

              {totalInCart > 0 ? (
                <div className="flex items-center border border-orange-500 rounded-xl bg-orange-50 dark:bg-orange-950/40 p-0.5">
                  <button
                    onClick={handleDecrement}
                    className="w-7 h-7 flex items-center justify-center text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/60 rounded-lg transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center text-xs font-bold text-orange-600 dark:text-orange-400">
                    {totalInCart}
                  </span>
                  <button
                    onClick={handleIncrement}
                    className="w-7 h-7 flex items-center justify-center text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/60 rounded-lg transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <Button onClick={handleAddClick} size="sm" variant="primary">
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              )}
            </div>
          </div>
        </div>

        <FoodOptionModal
          food={food}
          isOpen={isOptionModalOpen}
          onClose={() => setIsOptionModalOpen(false)}
          onAddToCart={addItem}
        />
      </>
    );
  }

  // Default horizontal layout (standard food listing)
  return (
    <>
      <div className="group relative flex items-start justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-sm hover:shadow-card-hover transition-all duration-300">
        <div className="flex-1 pr-2">
          {/* Header Badges */}
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <Badge variant={food.isVeg ? 'veg' : 'non-veg'} size="sm">
              {food.isVeg ? 'Veg' : 'Non-Veg'}
            </Badge>
            {food.isBestseller && (
              <Badge variant="warning" size="sm">
                ★ Bestseller
              </Badge>
            )}
            {food.calories && (
              <span className="text-[11px] text-slate-400 flex items-center gap-0.5">
                <Flame className="w-3 h-3 text-orange-400" />
                {food.calories} kcal
              </span>
            )}
          </div>

          <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors">
            {food.name}
          </h4>

          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-base font-extrabold text-slate-900 dark:text-white">
              {formatCurrency(food.price)}
            </span>
            {food.originalPrice && (
              <span className="text-xs text-slate-400 line-through">
                {formatCurrency(food.originalPrice)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
            <span className="flex items-center gap-0.5 font-bold text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              {food.rating}
            </span>
            <span>•</span>
            <span>{food.reviewsCount} reviews</span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-2 leading-relaxed">
            {food.description}
          </p>
        </div>

        {/* Right side image & Action button */}
        <div className="relative shrink-0 flex flex-col items-center">
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-inner">
            <img
              src={food.image}
              alt={food.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <button
              onClick={() => toggleFavoriteFood(food)}
              aria-label="Save to Wishlist"
              className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-700 dark:text-slate-200 hover:text-rose-500 shadow-sm transition-colors"
            >
              <Heart
                className={`w-3.5 h-3.5 ${
                  favorited ? 'fill-rose-500 text-rose-500' : 'text-slate-600 dark:text-slate-300'
                }`}
              />
            </button>
          </div>

          {/* Overlapping Add Button / Quantity Counter */}
          <div className="-mt-4 z-10">
            {totalInCart > 0 ? (
              <div className="flex items-center border border-orange-500 rounded-xl bg-white dark:bg-slate-900 shadow-md p-0.5">
                <button
                  onClick={handleDecrement}
                  className="w-7 h-7 flex items-center justify-center text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-6 text-center text-xs font-bold text-orange-600 dark:text-orange-400">
                  {totalInCart}
                </span>
                <button
                  onClick={handleIncrement}
                  className="w-7 h-7 flex items-center justify-center text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Button
                onClick={handleAddClick}
                size="sm"
                variant="primary"
                className="shadow-md shadow-orange-500/30 px-5"
              >
                Add {food.options && food.options.length > 0 && '+'}
              </Button>
            )}
          </div>
          {food.options && food.options.length > 0 && (
            <span className="text-[10px] text-slate-400 mt-1">Customizable</span>
          )}
        </div>
      </div>

      <FoodOptionModal
        food={food}
        isOpen={isOptionModalOpen}
        onClose={() => setIsOptionModalOpen(false)}
        onAddToCart={addItem}
      />
    </>
  );
};

