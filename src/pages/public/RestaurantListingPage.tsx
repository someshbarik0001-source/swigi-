import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { restaurantService } from '../../services/restaurantService';
import { Restaurant, RestaurantFilterState } from '../../types';
import { RestaurantCard } from '../../components/restaurant/RestaurantCard';
import { RestaurantCardSkeleton } from '../../components/common/Skeleton';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';
import { CUISINES, ZONES } from '../../utils/constants';
import {
  Search,
  SlidersHorizontal,
  Star,
  Clock,
  ArrowUpDown,
  Sparkles,
  RotateCcw,
  MapPin,
  X,
  Check,
  UtensilsCrossed,
} from 'lucide-react';

export const RestaurantListingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCuisine = searchParams.get('cuisine') || 'All';

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState(initialCuisine);
  const [selectedZone, setSelectedZone] = useState('All Zones');
  const [minRating, setMinRating] = useState<number>(0);
  const [maxDeliveryTime, setMaxDeliveryTime] = useState<number>(60);
  const [sortBy, setSortBy] = useState<RestaurantFilterState['sortBy']>('recommended');
  const [offersOnly, setOffersOnly] = useState(false);

  useEffect(() => {
    const cuisineParam = searchParams.get('cuisine');
    if (cuisineParam) {
      setSelectedCuisine(cuisineParam);
    }
  }, [searchParams]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    restaurantService
      .getRestaurants({
        searchQuery,
        cuisine: selectedCuisine,
        zone: selectedZone,
        minRating: minRating > 0 ? minRating : undefined,
        maxDeliveryTime: maxDeliveryTime < 60 ? maxDeliveryTime : undefined,
        sortBy,
        offersOnly,
      })
      .then((res) => {
        if (isMounted) {
          setRestaurants(res.data);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [searchQuery, selectedCuisine, selectedZone, minRating, maxDeliveryTime, sortBy, offersOnly]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCuisine('All');
    setSelectedZone('All Zones');
    setMinRating(0);
    setMaxDeliveryTime(60);
    setSortBy('recommended');
    setOffersOnly(false);
    setSearchParams({});
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedZone !== 'All Zones') count++;
    if (selectedCuisine !== 'All') count++;
    if (minRating > 0) count++;
    if (maxDeliveryTime < 60) count++;
    if (offersOnly) count++;
    if (sortBy !== 'recommended') count++;
    return count;
  }, [selectedZone, selectedCuisine, minRating, maxDeliveryTime, offersOnly, sortBy]);

  const hasActiveFilters = activeFilterCount > 0 || Boolean(searchQuery);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Title & Search Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-orange-500">
            SRM AP Regional Dining • 29 Outlets
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Explore Restaurants & Dhabas
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Order from verified kitchens across Chinnakakani, Mangalagiri, and Vijayawada.
          </p>
        </div>

        {/* Toolbar: Search + Filter Button + Sort */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full md:w-auto">
          {/* Search Box */}
          <div className="w-full sm:w-64">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search restaurant or dish..."
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          {/* Primary FILTER BUTTON */}
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all shrink-0 cursor-pointer ${
              activeFilterCount > 0
                ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/25 ring-2 ring-orange-500/20'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-orange-500 dark:hover:border-orange-500'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filter</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-white text-orange-600 text-[11px] font-black flex items-center justify-center shadow-sm">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Quick Sort Dropdown (Powered by Merge Sort) */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs shrink-0">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent font-semibold text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
            >
              <option value="recommended">Recommended (Merge Sort)</option>
              <option value="rating">Top Rated (Merge Sort)</option>
              <option value="deliveryTime">Fastest Prep (Merge Sort)</option>
              <option value="costLow">Price: Low to High</option>
              <option value="costHigh">Price: High to Low</option>
            </select>
          </div>

          {/* Quick Reset Button */}
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              title="Reset all filters"
              className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-500 hover:border-rose-300 dark:hover:border-rose-800 transition-colors bg-white dark:bg-slate-900 shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Active Filter Chips (if any are active) */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-1 pb-1">
          <span className="text-[11px] uppercase font-bold text-slate-400">
            Active Filters:
          </span>

          {selectedZone !== 'All Zones' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800/60">
              <MapPin className="w-3 h-3" />
              Zone: {selectedZone}
              <button
                onClick={() => setSelectedZone('All Zones')}
                className="hover:opacity-75 ml-1"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedCuisine !== 'All' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800/60">
              <UtensilsCrossed className="w-3 h-3" />
              {selectedCuisine}
              <button
                onClick={() => {
                  setSelectedCuisine('All');
                  setSearchParams({});
                }}
                className="hover:opacity-75 ml-1"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {minRating > 0 && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
              <Star className="w-3 h-3 fill-amber-400" />
              {minRating}+ Stars
              <button onClick={() => setMinRating(0)} className="hover:opacity-75 ml-1">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {maxDeliveryTime < 60 && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60">
              <Clock className="w-3 h-3" />
              &lt; {maxDeliveryTime} mins
              <button onClick={() => setMaxDeliveryTime(60)} className="hover:opacity-75 ml-1">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {offersOnly && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
              <Sparkles className="w-3 h-3" />
              Offers Only
              <button onClick={() => setOffersOnly(false)} className="hover:opacity-75 ml-1">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {sortBy !== 'recommended' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              Sort: {sortBy}
              <button onClick={() => setSortBy('recommended')} className="hover:opacity-75 ml-1">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            onClick={handleResetFilters}
            className="text-xs text-orange-500 hover:text-orange-600 font-bold ml-1 underline cursor-pointer"
          >
            Clear all
          </button>
        </div>
      )}

      {/* FILTER MODAL (Contains all features from the user's screenshot) */}
      <Modal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        title="Filter Restaurants"
        description="Filter outlets by area zone, cuisine, ratings, delivery speed, and special deals."
        size="lg"
      >
        <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-1">
          {/* 1. AREA / ZONE FILTER */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-500" />
              <span>Area Zone</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {ZONES.map((zone) => {
                const isSelected = selectedZone === zone;
                return (
                  <button
                    key={zone}
                    type="button"
                    onClick={() => setSelectedZone(zone)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md ring-2 ring-slate-900/10'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {zone}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. CUISINE SELECTION */}
          <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4 text-orange-500" />
              <span>Cuisine</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {CUISINES.map((cuisine) => {
                const isSelected = selectedCuisine === cuisine;
                return (
                  <button
                    key={cuisine}
                    type="button"
                    onClick={() => {
                      setSelectedCuisine(cuisine);
                      if (cuisine !== 'All') {
                        setSearchParams({ cuisine });
                      } else {
                        setSearchParams({});
                      }
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25 font-bold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {cuisine}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. RATING & DELIVERY TIME */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            {/* Rating */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                <span>Customer Rating</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'All', value: 0 },
                  { label: '4.0+ ★', value: 4.0 },
                  { label: '4.5+ ★', value: 4.5 },
                ].map((r) => {
                  const isSelected = minRating === r.value;
                  return (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setMinRating(r.value)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25 font-bold'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {r.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Delivery Time */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>Delivery Time</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Any', value: 60 },
                  { label: '< 30 min', value: 30 },
                  { label: '< 25 min', value: 25 },
                ].map((t) => {
                  const isSelected = maxDeliveryTime === t.value;
                  return (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setMaxDeliveryTime(t.value)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 font-bold'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 4. OFFERS ONLY TOGGLE & SORTING */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200/60 dark:border-orange-800/40">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                    Special Offers & Student Deals
                  </h5>
                  <p className="text-[11px] text-slate-500">
                    Only display restaurants with active promo codes or flat discounts
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOffersOnly((v) => !v)}
                className={`w-12 h-6 rounded-full transition-colors p-1 cursor-pointer flex items-center ${
                  offersOnly ? 'bg-orange-500 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
              </button>
            </div>

            {/* Sort By options */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                <ArrowUpDown className="w-4 h-4 text-orange-500" />
                <span>Sort Outlets By</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'recommended', label: 'Recommended' },
                  { id: 'rating', label: 'Highest Rating' },
                  { id: 'deliveryTime', label: 'Fastest Delivery' },
                  { id: 'costLow', label: 'Min Order: Low to High' },
                  { id: 'costHigh', label: 'Min Order: High to Low' },
                ].map((s) => {
                  const isSelected = sortBy === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSortBy(s.id as any)}
                      className={`p-2.5 rounded-xl text-xs font-semibold border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 font-bold ring-1 ring-orange-500'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* MODAL FOOTER */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs font-bold text-slate-500 hover:text-rose-500 transition-colors cursor-pointer px-2 py-1"
            >
              Reset All
            </button>
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={() => setIsFilterModalOpen(false)}
              className="shadow-lg shadow-orange-500/20"
            >
              Apply Filters ({restaurants.length} Places)
            </Button>
          </div>
        </div>
      </Modal>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium px-1">
        <span>
          Showing <b className="text-slate-900 dark:text-white">{restaurants.length}</b> places
        </span>
        {selectedCuisine !== 'All' && (
          <span>
            Filtered by cuisine: <b className="text-orange-500">{selectedCuisine}</b>
          </span>
        )}
      </div>

      {/* Restaurants Grid / Skeletons / Empty */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <RestaurantCardSkeleton key={i} />
          ))}
        </div>
      ) : restaurants.length === 0 ? (
        <EmptyState
          icon={<SlidersHorizontal className="w-8 h-8" />}
          title="No restaurants match your filters"
          description="Try relaxing your filters or searching for different dishes or cuisines."
          actionText="Reset Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      )}
    </div>
  );
};

