import React, { createContext, useContext, useState, useEffect } from 'react';
import { FoodItem, Restaurant } from '../types';
import { STORAGE_KEYS } from '../utils/constants';
import { useToast } from './ToastContext';

interface WishlistContextType {
  favoriteFoods: FoodItem[];
  favoriteRestaurants: Restaurant[];
  isFoodFavorited: (foodId: string) => boolean;
  isRestaurantFavorited: (restaurantId: string) => boolean;
  toggleFavoriteFood: (food: FoodItem) => void;
  toggleFavoriteRestaurant: (restaurant: Restaurant) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favoriteFoods, setFavoriteFoods] = useState<FoodItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FAVORITE_FOODS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [favoriteRestaurants, setFavoriteRestaurants] = useState<Restaurant[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FAVORITE_RESTAURANTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const { success, info } = useToast();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAVORITE_FOODS, JSON.stringify(favoriteFoods));
  }, [favoriteFoods]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAVORITE_RESTAURANTS, JSON.stringify(favoriteRestaurants));
  }, [favoriteRestaurants]);

  const isFoodFavorited = (foodId: string) => favoriteFoods.some((f) => f.id === foodId);
  const isRestaurantFavorited = (restaurantId: string) => favoriteRestaurants.some((r) => r.id === restaurantId);

  const toggleFavoriteFood = (food: FoodItem) => {
    if (isFoodFavorited(food.id)) {
      setFavoriteFoods((prev) => prev.filter((f) => f.id !== food.id));
      info(`Removed "${food.name}" from favorites`);
    } else {
      setFavoriteFoods((prev) => [...prev, food]);
      success(`Saved "${food.name}" to favorites`);
    }
  };

  const toggleFavoriteRestaurant = (restaurant: Restaurant) => {
    if (isRestaurantFavorited(restaurant.id)) {
      setFavoriteRestaurants((prev) => prev.filter((r) => r.id !== restaurant.id));
      info(`Removed "${restaurant.name}" from favorites`);
    } else {
      setFavoriteRestaurants((prev) => [...prev, restaurant]);
      success(`Saved "${restaurant.name}" to favorites`);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        favoriteFoods,
        favoriteRestaurants,
        isFoodFavorited,
        isRestaurantFavorited,
        toggleFavoriteFood,
        toggleFavoriteRestaurant,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

