import { Restaurant, RestaurantFilterState } from '../types';
import { mockRestaurants } from '../data/mockRestaurants';
import { simulateNetworkDelay, ApiResponse } from './api';
import { quickSort } from '../algorithms/quicksort';
import { mergeSort } from '../algorithms/mergesort';
import { bfsExplore } from '../algorithms/bfs';

const STORAGE_KEY = 'foodhub_restaurants_db_v3';

function getStoredRestaurants(): Restaurant[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockRestaurants));
    return mockRestaurants;
  }
  try {
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed) || parsed.length === 0 || !parsed[0].id?.startsWith('R0')) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockRestaurants));
      return mockRestaurants;
    }
    return parsed;
  } catch {
    return mockRestaurants;
  }
}

function saveStoredRestaurants(restaurants: Restaurant[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(restaurants));
}

export const restaurantService = {
  /**
   * GET /api/restaurants
   * Future Backend: return await apiClient.get('/restaurants', { params: filterState });
   */
  async getRestaurants(filters?: Partial<RestaurantFilterState>): Promise<ApiResponse<Restaurant[]>> {
    await simulateNetworkDelay(200);
    let list = [...getStoredRestaurants()];

    if (filters) {
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        list = list.filter(
          (r) =>
            r.name.toLowerCase().includes(q) ||
            r.cuisines.some((c) => c.toLowerCase().includes(q)) ||
            r.tags.some((t) => t.toLowerCase().includes(q))
        );
      }
      if (filters.cuisine && filters.cuisine !== 'All') {
        list = list.filter((r) =>
          r.cuisines.some((c) => c.toLowerCase() === filters.cuisine?.toLowerCase())
        );
      }
      if (filters.zone && filters.zone !== 'All Zones') {
        list = list.filter((r) =>
          r.areaZone?.toLowerCase().includes(filters.zone!.toLowerCase())
        );
      }
      if (filters.minRating) {
        list = list.filter((r) => r.rating >= filters.minRating!);
      }
      if (filters.maxDeliveryTime) {
        list = list.filter((r) => r.deliveryTime <= filters.maxDeliveryTime!);
      }
      if (filters.offersOnly) {
        list = list.filter((r) => Boolean(r.discountText));
      }
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'rating':
            // Custom DAA Merge Sort (Divide & Conquer O(N log N))
            list = mergeSort(list, (r) => r.rating, 'desc').sortedArray;
            break;
          case 'deliveryTime':
            // Custom DAA Merge Sort by preparation/delivery time
            list = mergeSort(list, (r) => r.deliveryTime, 'asc').sortedArray;
            break;
          case 'costLow':
            // Custom DAA Merge Sort by price (low to high)
            list = mergeSort(list, (r) => r.minOrder, 'asc').sortedArray;
            break;
          case 'costHigh':
            // Custom DAA Merge Sort by price (high to low)
            list = mergeSort(list, (r) => r.minOrder, 'desc').sortedArray;
            break;
          case 'recommended':
          default:
            list = mergeSort(list, (r) => (r.isFeatured ? 1 : 0), 'desc').sortedArray;
        }
      }
    }

    return {
      success: true,
      data: list,
    };
  },

  /**
   * GET /api/restaurants/:idOrSlug
   * Future Backend: return await apiClient.get(`/restaurants/${idOrSlug}`);
   */
  async getRestaurantById(idOrSlug: string): Promise<ApiResponse<Restaurant | null>> {
    await simulateNetworkDelay(150);
    const list = getStoredRestaurants();
    const found = list.find((r) => r.id === idOrSlug || r.slug === idOrSlug) || null;
    return {
      success: !!found,
      data: found,
      message: found ? 'Restaurant retrieved successfully' : 'Restaurant not found',
    };
  },

  /**
   * POST /api/restaurants
   * Future Backend: return await apiClient.post('/restaurants', data);
   */
  async createRestaurant(data: Omit<Restaurant, 'id'>): Promise<ApiResponse<Restaurant>> {
    await simulateNetworkDelay(300);
    const list = getStoredRestaurants();
    const newRestaurant: Restaurant = {
      ...data,
      id: `rest-${Date.now()}`,
    };
    list.unshift(newRestaurant);
    saveStoredRestaurants(list);
    return {
      success: true,
      data: newRestaurant,
      message: 'Restaurant created successfully',
    };
  },

  /**
   * PUT /api/restaurants/:id
   * Future Backend: return await apiClient.put(`/restaurants/${id}`, data);
   */
  async updateRestaurant(id: string, data: Partial<Restaurant>): Promise<ApiResponse<Restaurant>> {
    await simulateNetworkDelay(250);
    const list = getStoredRestaurants();
    const index = list.findIndex((r) => r.id === id);
    if (index === -1) {
      throw new Error('Restaurant not found');
    }
    list[index] = { ...list[index], ...data };
    saveStoredRestaurants(list);
    return {
      success: true,
      data: list[index],
      message: 'Restaurant updated successfully',
    };
  },

  /**
   * DELETE /api/restaurants/:id
   * Future Backend: return await apiClient.delete(`/restaurants/${id}`);
   */
  async deleteRestaurant(id: string): Promise<ApiResponse<boolean>> {
    await simulateNetworkDelay(200);
    let list = getStoredRestaurants();
    list = list.filter((r) => r.id !== id);
    saveStoredRestaurants(list);
    return {
      success: true,
      data: true,
      message: 'Restaurant deleted successfully',
    };
  },
};

