/**
 * FoodHub Mock API Client
 * 
 * In a production architecture with a Node.js/Express/Nest.js backend,
 * this file would wrap axios or fetch with base URLs, interceptors for JWT auth headers,
 * request retry logic, and standard response transformers.
 * 
 * Example production replacement:
 * export const apiClient = axios.create({
 *   baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.foodhub.internal/v1',
 *   timeout: 10000,
 *   headers: { 'Content-Type': 'application/json' }
 * });
 */

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const SIMULATED_LATENCY_MS = 250;

export async function simulateNetworkDelay(ms: number = SIMULATED_LATENCY_MS): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

