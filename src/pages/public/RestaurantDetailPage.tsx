import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { restaurantService } from '../../services/restaurantService';
import { foodService } from '../../services/foodService';
import { mockReviews } from '../../data/mockReviews';
import { Restaurant, FoodItem, Review } from '../../types';
import { FoodCard } from '../../components/food/FoodCard';
import { FoodCardSkeleton } from '../../components/common/Skeleton';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useCart } from '../../context/CartContext';
import { solve01Knapsack, quickSort } from '../../algorithms';
import { CUISINES } from '../../utils/constants';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  Star,
  Clock,
  Bike,
  Heart,
  MapPin,
  Phone,
  Sparkles,
  Info,
  MessageSquarePlus,
  ThumbsUp,
  ArrowLeft,
  UtensilsCrossed,
  AlertCircle,
  FileText,
  Search,
  X,
  Boxes,
  Zap,
  CheckCircle2,
  ShoppingBag,
  SlidersHorizontal,
  ArrowUpDown,
  RotateCcw,
  Check,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const RestaurantDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'menu' | 'reviews' | 'about'>('menu');
  const [menuSearch, setMenuSearch] = useState('');
  const [vegOnlyFilter, setVegOnlyFilter] = useState(false);

  // Review Modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const { isRestaurantFavorited, toggleFavoriteRestaurant } = useWishlist();
  const { user } = useAuth();
  const { success, warning } = useToast();
  const { addItem, openCartDrawer } = useCart();

  // DAA 0/1 Knapsack Smart Combo State
  const [isKnapsackModalOpen, setIsKnapsackModalOpen] = useState(false);
  const [knapsackBudget, setKnapsackBudget] = useState(350);

  // Restaurant Menu Filter & Sort state (matching user's filter modal)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [minRating, setMinRating] = useState<number>(0);
  const [maxTime, setMaxTime] = useState<number>(60);
  const [offersOnly, setOffersOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'recommended' | 'rating' | 'deliveryTime' | 'costLow' | 'costHigh'>('recommended');

  const handleResetFilters = () => {
    setSelectedCuisine('All');
    setMinRating(0);
    setMaxTime(60);
    setOffersOnly(false);
    setSortBy('recommended');
    setMenuSearch('');
    setActiveCategory('all');
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCuisine !== 'All') count++;
    if (minRating > 0) count++;
    if (maxTime < 60) count++;
    if (offersOnly) count++;
    if (sortBy !== 'recommended') count++;
    if (activeCategory !== 'all') count++;
    return count;
  }, [selectedCuisine, minRating, maxTime, offersOnly, sortBy, activeCategory]);

  const hasActiveFilters = activeFilterCount > 0 || Boolean(menuSearch);

  // Category pill track horizontal scrolling ref and handlers
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  const handleScrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const scrollAmount = 260;
      categoryScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const knapsackSolution = useMemo(() => {
    if (!foods || foods.length === 0) return null;
    const items = foods.map((f) => ({
      id: f.id,
      name: f.name,
      cost: f.price,
      rating: f.rating,
      value: Math.round(f.rating * 10),
      category: f.categoryName,
      image: f.image,
      isVeg: f.isVeg,
      restaurantId: f.restaurantId,
      restaurantName: f.restaurantName,
    }));
    return solve01Knapsack(items, knapsackBudget);
  }, [foods, knapsackBudget]);

  const handleAddKnapsackCombo = () => {
    if (!knapsackSolution || knapsackSolution.selectedItems.length === 0) return;
    knapsackSolution.selectedItems.forEach((item) => {
      const orig = foods.find((f) => f.id === item.id);
      if (orig) addItem(orig);
    });
    setIsKnapsackModalOpen(false);
    success(`Added ${knapsackSolution.selectedItems.length} DAA optimal combo items (Total: ₹${knapsackSolution.totalCost}) to your cart!`);
    openCartDrawer();
  };

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    Promise.all([
      restaurantService.getRestaurantById(id),
      foodService.getFoodsByRestaurant(id),
    ]).then(([restRes, foodsRes]) => {
      if (restRes.data) {
        setRestaurant(restRes.data);
      }
      setFoods(foodsRes.data);
      // Filter mock reviews for this restaurant or fallback to general reviews
      const matchingReviews = mockReviews.filter((r) => r.restaurantId === id);
      setReviews(matchingReviews.length > 0 ? matchingReviews : mockReviews);
      setLoading(false);
    });
  }, [id]);

  const categories = useMemo(() => {
    const map = new Map<string, { id: string; name: string; count: number }>();
    foods.forEach((f) => {
      const existing = map.get(f.categoryId);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(f.categoryId, { id: f.categoryId, name: f.categoryName, count: 1 });
      }
    });
    return Array.from(map.values());
  }, [foods]);

  const filteredFoods = useMemo(() => {
    let list = [...foods];

    // Category filter
    if (activeCategory !== 'all') {
      list = list.filter((f) => f.categoryId === activeCategory);
    }

    // Cuisine filter (from modal)
    if (selectedCuisine !== 'All') {
      if (selectedCuisine === 'Pure Vegetarian') {
        list = list.filter((f) => f.isVeg);
      } else {
        const q = selectedCuisine.toLowerCase();
        list = list.filter(
          (f) =>
            f.categoryName.toLowerCase().includes(q) ||
            f.name.toLowerCase().includes(q) ||
            f.description.toLowerCase().includes(q) ||
            f.ingredients?.some((ing) => ing.toLowerCase().includes(q))
        );
      }
    }

    // Rating filter
    if (minRating > 0) {
      list = list.filter((f) => f.rating >= minRating);
    }

    // Delivery / Preparation speed filter
    if (maxTime < 60) {
      list = list.filter((f) => (f.preparationTime || 20) <= maxTime);
    }

    // Offers & Bestsellers toggle
    if (offersOnly) {
      list = list.filter((f) => f.isBestseller || f.rating >= 4.7);
    }

    // Search query
    if (menuSearch.trim()) {
      const q = menuSearch.toLowerCase();
      list = list.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q) ||
          f.categoryName.toLowerCase().includes(q) ||
          f.ingredients?.some((ing) => ing.toLowerCase().includes(q))
      );
    }

    // Sorting via DAA Quick Sort
    if (sortBy === 'rating') {
      list = quickSort(list, (f) => f.rating, 'desc', 'median_of_three').sortedArray;
    } else if (sortBy === 'deliveryTime') {
      list = quickSort(list, (f) => f.preparationTime || 20, 'asc', 'median_of_three').sortedArray;
    } else if (sortBy === 'costLow') {
      list = quickSort(list, (f) => f.price, 'asc', 'median_of_three').sortedArray;
    } else if (sortBy === 'costHigh') {
      list = quickSort(list, (f) => f.price, 'desc', 'median_of_three').sortedArray;
    } else {
      // Recommended: Bestsellers first
      list = quickSort(list, (f) => (f.isBestseller ? 1 : 0), 'desc', 'median_of_three').sortedArray;
    }

    return list;
  }, [foods, activeCategory, selectedCuisine, minRating, maxTime, offersOnly, menuSearch, sortBy]);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      warning('Please enter your review feedback.');
      return;
    }

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      restaurantId: restaurant?.id,
      userId: user?.id || 'guest',
      userName: user?.name || 'Happy Foodie',
      userAvatar: user?.avatar,
      rating: reviewRating,
      comment: reviewComment.trim(),
      date: new Date().toISOString(),
      likes: 1,
    };

    setReviews((prev) => [newRev, ...prev]);
    setIsReviewModalOpen(false);
    setReviewComment('');
    success('Thank you! Your verified review has been posted.');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="h-64 sm:h-80 w-full rounded-3xl bg-slate-200 dark:bg-slate-800 skeleton-shimmer" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FoodCardSkeleton />
          <FoodCardSkeleton />
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold">Restaurant not found</h2>
        <Link to="/restaurants">
          <Button variant="primary" className="mt-4">
            Back to Restaurants
          </Button>
        </Link>
      </div>
    );
  }

  const isFavorited = isRestaurantFavorited(restaurant.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Back breadcrumb */}
      <Link
        to="/restaurants"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-orange-500 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to all restaurants</span>
      </Link>

      {/* Hero Banner & Details Card */}
      <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md">
        {/* Banner Image */}
        <div className="relative h-60 sm:h-80 w-full">
          <img
            src={restaurant.bannerImage}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Floating Action Buttons */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={() => toggleFavoriteRestaurant(restaurant)}
              aria-label="Wishlist"
              className="p-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-700 dark:text-slate-200 hover:text-rose-500 shadow-md transition-colors"
            >
              <Heart
                className={`w-5 h-5 ${
                  isFavorited ? 'fill-rose-500 text-rose-500' : 'text-slate-600 dark:text-slate-200'
                }`}
              />
            </button>
          </div>

          {/* Discount Tag */}
          {restaurant.discountText && (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-600 to-amber-500 text-white text-xs font-black px-3.5 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>{restaurant.discountText}</span>
            </div>
          )}

          {/* Restaurant Title & Info in Banner Bottom */}
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="success" size="sm" className="bg-emerald-500 text-white border-none font-bold">
                Open Now
              </Badge>
              {restaurant.areaZone && (
                <Badge variant="primary" size="sm" className="bg-orange-500 text-white border-none font-bold">
                  {restaurant.areaZone}
                </Badge>
              )}
              {restaurant.menuCollectionStatus && (
                <Badge variant="neutral" size="sm" className="bg-white/20 text-white border-white/20">
                  {restaurant.menuCollectionStatus}
                </Badge>
              )}
              {restaurant.tags.map((t) => (
                <span
                  key={t}
                  className="text-[11px] bg-black/40 backdrop-blur-sm px-2.5 py-0.5 rounded-lg border border-white/10"
                >
                  {t}
                </span>
              ))}
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {restaurant.name}
            </h1>

            <p className="text-xs sm:text-sm text-slate-200">
              {restaurant.cuisines.join(' • ')}
            </p>
          </div>
        </div>

        {/* Info Strip */}
        <div className="p-5 sm:p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <div className="text-base font-extrabold text-slate-900 dark:text-white">
                {restaurant.rating} ★
              </div>
              <span className="text-xs text-slate-400">{restaurant.reviewsCount}+ ratings</span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:pl-4">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-orange-500 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-extrabold text-slate-900 dark:text-white">
                {restaurant.deliveryTime} Mins
              </div>
              <span className="text-xs text-slate-400">Doorstep delivery</span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-3 sm:pt-0 sm:pl-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center shrink-0">
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-extrabold text-slate-900 dark:text-white">
                {restaurant.deliveryFee === 0 ? 'FREE' : formatCurrency(restaurant.deliveryFee)}
              </div>
              <span className="text-xs text-slate-400">Delivery fee</span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-3 sm:pt-0 sm:pl-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-500 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-extrabold text-slate-900 dark:text-white">
                {restaurant.distanceKm} km
              </div>
              <span className="text-xs text-slate-400">Min {formatCurrency(restaurant.minOrder)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs navigation: Menu | Reviews | Restaurant Info */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-8 text-sm font-bold">
          <button
            onClick={() => setActiveTab('menu')}
            className={`pb-3 relative transition-colors ${
              activeTab === 'menu'
                ? 'text-orange-500 border-b-2 border-orange-500'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Order Online Menu ({foods.length})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 relative transition-colors flex items-center gap-1.5 ${
              activeTab === 'reviews'
                ? 'text-orange-500 border-b-2 border-orange-500'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <span>Reviews</span>
            <Badge variant="neutral" size="sm">
              {reviews.length}
            </Badge>
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`pb-3 relative transition-colors ${
              activeTab === 'about'
                ? 'text-orange-500 border-b-2 border-orange-500'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Restaurant Details
          </button>
        </div>
      </div>

      {/* TAB 1: MENU */}
      {activeTab === 'menu' && (
        <div className="space-y-6">
          {/* Student Budget Optimizer Banner */}
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
            <h3 className="font-extrabold text-base sm:text-lg">
              Student Budget Optimizer: "Best Meal Combo"
            </h3>

            <Button
              variant="outline"
              size="md"
              onClick={() => setIsKnapsackModalOpen(true)}
              className="bg-white text-emerald-700 hover:bg-emerald-50 border-white shrink-0 font-extrabold shadow-sm"
              leftIcon={<Boxes className="w-4 h-4 text-emerald-600" />}
            >
              Optimize Meal Combo ⚡
            </Button>
          </div>

          {/* Menu Search, Filter & Sort Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
            {/* Dish Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={menuSearch}
                onChange={(e) => setMenuSearch(e.target.value)}
                placeholder={`Search dishes in ${restaurant?.name || 'menu'} (e.g. Biryani, Soup, Paneer, Naan...)`}
                className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              />
              {menuSearch && (
                <button
                  onClick={() => setMenuSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Primary Filter Button */}
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

              {/* Quick Sort Dropdown */}
              <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 px-3 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs shrink-0">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent font-semibold text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
                >
                  <option value="recommended">Recommended</option>
                  <option value="rating">Top Rated</option>
                  <option value="deliveryTime">Fastest</option>
                  <option value="costLow">Price: Low to High</option>
                  <option value="costHigh">Price: High to Low</option>
                </select>
              </div>

              {/* Reset shortcut */}
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  title="Reset all filters"
                  className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-500 hover:border-rose-300 transition-colors bg-white dark:bg-slate-900 shrink-0 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              <span className="text-xs font-bold text-slate-500 mr-1">
                Active ({filteredFoods.length} items):
              </span>

              {selectedCuisine !== 'All' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
                  Cuisine: {selectedCuisine}
                  <button onClick={() => setSelectedCuisine('All')} className="hover:opacity-75 ml-1">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {minRating > 0 && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                  {minRating}+ ★
                  <button onClick={() => setMinRating(0)} className="hover:opacity-75 ml-1">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {maxTime < 60 && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  &lt; {maxTime} mins
                  <button onClick={() => setMaxTime(60)} className="hover:opacity-75 ml-1">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {offersOnly && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                  Special Offers / Bestsellers
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
                className="text-xs text-rose-500 font-bold hover:underline ml-2"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Category filter pills with Left & Right Arrow buttons */}
          {categories.length > 1 && (
            <div className="flex items-center gap-2 w-full pt-1">
              {/* Left Arrow Button */}
              <button
                type="button"
                onClick={() => handleScrollCategories('left')}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-orange-500 hover:border-orange-300 dark:hover:border-orange-500/50 shadow-xs flex items-center justify-center shrink-0 transition-all active:scale-95 cursor-pointer"
                title="Scroll categories left"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Scrollable pill container with NO visible scrollbar */}
              <div
                ref={categoryScrollRef}
                className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth flex-1 py-1"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                    activeCategory === 'all'
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  Full Menu ({foods.length})
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveCategory(c.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                      activeCategory === c.id
                        ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {c.name} ({c.count})
                  </button>
                ))}
              </div>

              {/* Right Arrow Button */}
              <button
                type="button"
                onClick={() => handleScrollCategories('right')}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-orange-500 hover:border-orange-300 dark:hover:border-orange-500/50 shadow-xs flex items-center justify-center shrink-0 transition-all active:scale-95 cursor-pointer"
                title="Scroll categories right"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Foods grid or Missing Menu notice */}
          {filteredFoods.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredFoods.map((food) => (
                <FoodCard key={food.id} food={food} layout="horizontal" />
              ))}
            </div>
          ) : (
            <div className="p-8 sm:p-12 rounded-3xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
                <AlertCircle className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Menu Collection Status: {restaurant.menuCollectionStatus || 'Menu not yet captured'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
                {restaurant.sourceOrVerificationNote || 'Business listing; verify directly with the outlet.'}
                <br />
                <span className="inline-block mt-2 font-medium bg-white dark:bg-slate-900 px-3 py-1 rounded-xl border border-slate-200 dark:border-slate-800">
                  Service Modes: <span className="font-bold text-orange-600 dark:text-orange-400">{restaurant.serviceModes}</span>
                </span>
              </p>
              {restaurant.phone && restaurant.phone !== 'Not confirmed' && (
                <div className="pt-2">
                  <a href={`tel:${restaurant.phone}`} className="inline-block">
                    <Button variant="primary" size="md" leftIcon={<Phone className="w-4 h-4" />}>
                      Call {restaurant.phone} to Order
                    </Button>
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: REVIEWS */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Customer Feedback & Ratings
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Authentic reviews submitted by verified diner orders.
              </p>
            </div>
            <Button
              onClick={() => setIsReviewModalOpen(true)}
              variant="primary"
              size="sm"
              leftIcon={<MessageSquarePlus className="w-4 h-4" />}
            >
              Write Review
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        rev.userAvatar ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                      }
                      alt={rev.userName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {rev.userName}
                      </h4>
                      <span className="text-[10px] text-slate-400">{formatDate(rev.date)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 text-xs font-bold px-2 py-0.5 rounded-lg border border-amber-200/60 dark:border-amber-800/40">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{rev.rating}.0</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  "{rev.comment}"
                </p>

                <div className="flex items-center gap-2 pt-2 text-slate-400 text-xs">
                  <button className="flex items-center gap-1 hover:text-orange-500 transition-colors">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Helpful ({rev.likes})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ABOUT RESTAURANT */}
      {activeTab === 'about' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              About {restaurant.name}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Renowned for authentic culinary traditions and sustainably sourced seasonal ingredients.
              Every meal is prepared to order following rigorous culinary standards and packaged in
              biodegradable heat-retaining containers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-slate-900 dark:text-white">Address & Area Zone</span>
                <span className="text-slate-500 dark:text-slate-400">{restaurant.address}</span>
                {restaurant.areaZone && (
                  <span className="block text-orange-600 dark:text-orange-400 font-semibold mt-0.5">
                    Zone: {restaurant.areaZone}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-slate-900 dark:text-white">Phone & Ordering</span>
                <span className="text-slate-500 dark:text-slate-400">{restaurant.phone}</span>
                {restaurant.phone && restaurant.phone !== 'Not confirmed' && (
                  <a
                    href={`tel:${restaurant.phone}`}
                    className="block text-orange-600 dark:text-orange-400 font-semibold mt-0.5 underline"
                  >
                    Click to Call
                  </a>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Bike className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-slate-900 dark:text-white">Service Modes</span>
                <span className="text-slate-500 dark:text-slate-400">{restaurant.serviceModes || 'Dine-in; takeaway; delivery'}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FileText className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-slate-900 dark:text-white">Database Verification Note</span>
                <span className="text-slate-500 dark:text-slate-400">
                  {restaurant.sourceOrVerificationNote || 'Business listing verified for SRM AP regional coverage'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WRITE A REVIEW MODAL */}
      <Modal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        title="Share Your Experience"
        description={`How was your dining experience at ${restaurant.name}?`}
        size="md"
      >
        <form onSubmit={handleAddReview} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Select Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setReviewRating(star)}
                  className="p-1 text-amber-400 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-2">
                {reviewRating} of 5 Stars
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Your Review
            </label>
            <textarea
              rows={4}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Tell others about the food flavor, packaging, delivery speed..."
              required
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 text-xs text-slate-900 dark:text-white outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsReviewModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Submit Review
            </Button>
          </div>
        </form>
      </Modal>

      {/* Menu Combo Optimizer Modal */}
      <Modal
        isOpen={isKnapsackModalOpen}
        onClose={() => setIsKnapsackModalOpen(false)}
        title="Menu Combo Optimizer"
        size="lg"
      >
        <div className="space-y-5">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
              <span>Your Target Budget Capacity (W):</span>
              <span className="text-base text-emerald-600 font-extrabold">₹{knapsackBudget}</span>
            </div>
            <input
              type="range"
              min="80"
              max="900"
              step="10"
              value={knapsackBudget}
              onChange={(e) => setKnapsackBudget(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>₹80</span>
              <span>₹250</span>
              <span>₹450</span>
              <span>₹700</span>
              <span>₹900</span>
            </div>
          </div>

          {knapsackSolution && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-medium block">Total Cost</span>
                  <span className="text-sm font-black text-emerald-600">₹{knapsackSolution.totalCost}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-medium block">Rating Score</span>
                  <span className="text-sm font-black text-amber-500">{knapsackSolution.totalRatingScore} pts</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-medium block">Budget Utilized</span>
                  <span className="text-sm font-black text-indigo-600">{knapsackSolution.budgetUtilizationPct}%</span>
                </div>
              </div>

              <div>
                <h5 className="text-xs font-bold text-slate-800 mb-2">
                  Optimal Selected Items ({knapsackSolution.selectedItems.length}):
                </h5>
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {knapsackSolution.selectedItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        <span className="font-bold text-slate-900 truncate">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-amber-500 font-bold">★ {item.rating}</span>
                        <span className="font-extrabold text-emerald-600">₹{item.cost}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsKnapsackModalOpen(false)}
                >
                  Close
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleAddKnapsackCombo}
                  leftIcon={<ShoppingBag className="w-4 h-4" />}
                  className="bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25 font-bold"
                >
                  Add Optimal Combo (₹{knapsackSolution.totalCost}) to Cart
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* RESTAURANT MENU FILTER MODAL (Matching User Screenshot) */}
      <Modal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        title="Filter Menu & Dishes"
        description={`Refine items from ${restaurant?.name || 'this kitchen'} by cuisine, customer rating, delivery time, and offers.`}
        size="lg"
      >
        <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-1">
          {/* 1. CUISINE SELECTION */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4 text-orange-500" />
              <span>CUISINE</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {CUISINES.map((cuisine) => {
                const isSelected = selectedCuisine === cuisine;
                return (
                  <button
                    key={cuisine}
                    type="button"
                    onClick={() => setSelectedCuisine(cuisine)}
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

          {/* 2. CUSTOMER RATING & DELIVERY TIME */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            {/* Rating */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                <span>CUSTOMER RATING</span>
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
                <span>DELIVERY TIME</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Any', value: 60 },
                  { label: '< 30 min', value: 30 },
                  { label: '< 25 min', value: 25 },
                ].map((t) => {
                  const isSelected = maxTime === t.value;
                  return (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setMaxTime(t.value)}
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

          {/* 3. OFFERS ONLY TOGGLE & SORTING */}
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

            {/* Sort Outlets By options */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                <ArrowUpDown className="w-4 h-4 text-orange-500" />
                <span>SORT OUTLETS BY</span>
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
              className="text-xs font-semibold text-slate-500 hover:text-rose-500 transition-colors"
            >
              Reset All
            </button>
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={() => setIsFilterModalOpen(false)}
              className="bg-orange-500 hover:bg-orange-600 shadow-orange-500/25 px-6 font-bold"
            >
              Apply Filters ({filteredFoods.length} Places)
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

