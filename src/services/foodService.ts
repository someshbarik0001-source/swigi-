import { FoodItem, FoodFilterState } from '../types';
import { mockFoods } from '../data/mockFoods';
import { simulateNetworkDelay, ApiResponse } from './api';
import { kmpSearchFoods } from '../algorithms/kmp';
import { mergeSort } from '../algorithms/mergesort';

const STORAGE_KEY = 'foodhub_foods_db_v3';

function getStoredFoods(): FoodItem[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockFoods));
    return mockFoods;
  }
  try {
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed) || parsed.length === 0 || !parsed[0].id?.startsWith('food-r')) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockFoods));
      return mockFoods;
    }
    return parsed;
  } catch {
    return mockFoods;
  }
}

function saveStoredFoods(foods: FoodItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(foods));
}

export const foodService = {
  /**
   * GET /api/foods
   * Future Backend: return await apiClient.get('/foods', { params });
   */
  async getFoods(filters?: Partial<FoodFilterState>): Promise<ApiResponse<FoodItem[]>> {
    await simulateNetworkDelay(200);
    let list = [...getStoredFoods()];

    if (filters) {
      if (filters.searchQuery && filters.searchQuery.trim()) {
        // DAA Knuth-Morris-Pratt (KMP) string pattern matching
        const matchedResults = kmpSearchFoods(list, filters.searchQuery);
        list = matchedResults.map((res) => res.food);
      }
      if (filters.category && filters.category !== 'all') {
        list = list.filter(
          (f) =>
            f.categoryId === filters.category ||
            f.categoryName.toLowerCase() === filters.category?.toLowerCase()
        );
      }
      if (filters.isVegOnly) {
        list = list.filter((f) => f.isVeg);
      }
      if (filters.isBestsellerOnly) {
        list = list.filter((f) => f.isBestseller);
      }
      if (filters.priceRange) {
        list = list.filter(
          (f) => f.price >= filters.priceRange![0] && f.price <= filters.priceRange![1]
        );
      }
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'priceLow':
            list = mergeSort(list, (f) => f.price, 'asc').sortedArray;
            break;
          case 'priceHigh':
            list = mergeSort(list, (f) => f.price, 'desc').sortedArray;
            break;
          case 'rating':
            list = mergeSort(list, (f) => f.rating, 'desc').sortedArray;
            break;
          case 'popular':
          default:
            list = mergeSort(list, (f) => f.reviewsCount, 'desc').sortedArray;
        }
      }
    }

    return {
      success: true,
      data: list,
    };
  },

  /**
   * GET /api/restaurants/:restaurantId/foods
   * Future Backend: return await apiClient.get(`/restaurants/${restaurantId}/foods`);
   */
  async getFoodsByRestaurant(restaurantId: string): Promise<ApiResponse<FoodItem[]>> {
    await simulateNetworkDelay(150);
    const list = getStoredFoods().filter((f) => f.restaurantId === restaurantId);
    return {
      success: true,
      data: list,
    };
  },

  /**
   * GET /api/foods/search-suggestions?q=...
   * Future Backend: return await apiClient.get('/foods/search-suggestions', { params: { q } });
   */
  async getSearchSuggestions(query: string): Promise<string[]> {
    if (!query || query.trim().length === 0) return [];
    await simulateNetworkDelay(100);
    const q = query.toLowerCase();
    const foods = getStoredFoods();
    const suggestions = new Set<string>();

    foods.forEach((f) => {
      if (f.name.toLowerCase().includes(q)) suggestions.add(f.name);
      if (f.categoryName.toLowerCase().includes(q)) suggestions.add(f.categoryName);
      if (f.restaurantName.toLowerCase().includes(q)) suggestions.add(f.restaurantName);
    });

    return Array.from(suggestions).slice(0, 6);
  },

  /**
   * POST /api/foods
   * Future Backend: return await apiClient.post('/foods', foodData);
   */
  async createFood(foodData: Omit<FoodItem, 'id'>): Promise<ApiResponse<FoodItem>> {
    await simulateNetworkDelay(250);
    const list = getStoredFoods();
    const newFood: FoodItem = {
      ...foodData,
      id: `food-${Date.now()}`,
    };
    list.unshift(newFood);
    saveStoredFoods(list);
    return {
      success: true,
      data: newFood,
      message: 'Menu item created successfully',
    };
  },

  /**
   * PUT /api/foods/:id
   * Future Backend: return await apiClient.put(`/foods/${id}`, foodData);
   */
  async updateFood(id: string, foodData: Partial<FoodItem>): Promise<ApiResponse<FoodItem>> {
    await simulateNetworkDelay(200);
    const list = getStoredFoods();
    const index = list.findIndex((f) => f.id === id);
    if (index === -1) throw new Error('Menu item not found');
    list[index] = { ...list[index], ...foodData };
    saveStoredFoods(list);
    return {
      success: true,
      data: list[index],
      message: 'Menu item updated successfully',
    };
  },

  /**
   * DELETE /api/foods/:id
   * Future Backend: return await apiClient.delete(`/foods/${id}`);
   */
  async deleteFood(id: string): Promise<ApiResponse<boolean>> {
    await simulateNetworkDelay(200);
    let list = getStoredFoods();
    list = list.filter((f) => f.id !== id);
    saveStoredFoods(list);
    return {
      success: true,
      data: true,
      message: 'Menu item deleted successfully',
    };
  },
};

