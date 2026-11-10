import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { foodService } from '../../services/foodService';
import { FoodItem } from '../../types';
import { FoodCard } from '../../components/food/FoodCard';
import { FoodCardSkeleton } from '../../components/common/Skeleton';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { computeLPSArray } from '../../algorithms/kmp';
import { Search, Sparkles, SlidersHorizontal, Flame, ArrowUpDown, Cpu, ChevronDown, ChevronUp } from 'lucide-react';

export const FoodSearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [isVegOnly, setIsVegOnly] = useState(false);
  const [isBestsellerOnly, setIsBestsellerOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'popular' | 'priceLow' | 'priceHigh' | 'rating'>('popular');
  const [showKmpDetails, setShowKmpDetails] = useState(false);

  const kmpLpsData = useMemo(() => {
    if (!query.trim()) return null;
    return computeLPSArray(query.trim());
  }, [query]);

  // Fetch suggestions as query changes
  useEffect(() => {
    if (query.trim().length > 1) {
      foodService.getSearchSuggestions(query).then(setSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  // Fetch foods with filters
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    foodService
      .getFoods({
        searchQuery: query,
        isVegOnly,
        isBestsellerOnly,
        sortBy,
      })
      .then((res) => {
        if (isMounted) {
          setFoods(res.data);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [query, isVegOnly, isBestsellerOnly, sortBy]);

  const handleSelectSuggestion = (suggested: string) => {
    setQuery(suggested);
    setSuggestions([]);
    setSearchParams({ q: suggested });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Search Header */}
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-orange-500">
          Global Menu Search
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Craving something specific?
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Search verified dishes across Mangalagiri, Chinnakakani, and Vijayawada outlets.
        </p>

        {/* Global Search Bar with Autocomplete Suggestions */}
        <div className="relative text-left">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search biryani, prawn fry, butter chicken, apollo fish, paneer tikka..."
              leftIcon={<Search className="w-5 h-5 text-orange-500" />}
              className="py-3 text-base rounded-2xl shadow-lg shadow-orange-500/5"
            />
          </form>

          {/* Autocomplete dropdown */}
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 p-2 z-30">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3 py-1 block">
                Recommended Queries
              </span>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {suggestions.map((sug) => (
                  <button
                    key={sug}
                    onClick={() => handleSelectSuggestion(sug)}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-slate-800 hover:text-orange-600 rounded-xl transition-colors flex items-center gap-2"
                  >
                    <Search className="w-3.5 h-3.5 text-slate-400" />
                    <span>{sug}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filter and sorting toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          {/* Veg Only Toggle */}
          <button
            onClick={() => setIsVegOnly((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isVegOnly
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Pure Veg Only</span>
          </button>

          {/* Bestseller Toggle */}
          <button
            onClick={() => setIsBestsellerOnly((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isBestsellerOnly
                ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Bestsellers</span>
          </button>
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 flex items-center gap-1 font-semibold">
            <ArrowUpDown className="w-3.5 h-3.5" />
            Sort:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold px-3 py-1.5 rounded-xl border border-transparent outline-none focus:border-orange-500 cursor-pointer"
          >
            <option value="popular">Most Popular</option>
            <option value="rating">Top Rated</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Results Count & KMP Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
        <div>
          Found <b className="text-slate-900 dark:text-white">{foods.length}</b> delicious dishes
          {query && (
            <span>
              {' '}
              matching "<span className="text-orange-500 font-bold">{query}</span>"
            </span>
          )}
        </div>

        {kmpLpsData && (
          <button
            onClick={() => setShowKmpDetails(!showKmpDetails)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors"
          >
            <Cpu className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>KMP Pattern Matching O(N+M) Active</span>
            {showKmpDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        )}
      </div>

      {/* Expandable KMP LPS Table */}
      {showKmpDetails && kmpLpsData && (
        <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
              Knuth-Morris-Pratt (KMP) Longest Proper Prefix-Suffix (LPS / π) Table
            </h4>
            <span className="text-[10px] font-mono font-bold bg-emerald-200/80 dark:bg-emerald-900 px-2 py-0.5 rounded text-emerald-900 dark:text-emerald-100">
              Query Pattern: "{query}" (Length M = {query.length})
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="text-center text-xs border border-emerald-300 dark:border-emerald-800 rounded-lg overflow-hidden bg-white dark:bg-slate-900">
              <thead>
                <tr className="bg-emerald-100/70 dark:bg-emerald-900/50 text-slate-700 dark:text-slate-200">
                  <th className="px-3 py-1 font-bold border-r border-emerald-200 dark:border-emerald-800">Index i</th>
                  {query.split('').map((_, i) => (
                    <th key={i} className="px-3 py-1 font-mono border-r border-emerald-200 dark:border-emerald-800">
                      {i}
                    </th>
                  ))}
                </tr>
                <tr className="bg-emerald-50/50 dark:bg-emerald-900/30 text-slate-700 dark:text-slate-200">
                  <th className="px-3 py-1 font-bold border-r border-emerald-200 dark:border-emerald-800">Pattern[i]</th>
                  {query.split('').map((char, i) => (
                    <th key={i} className="px-3 py-1 font-mono font-bold text-emerald-700 dark:text-emerald-300 border-r border-emerald-200 dark:border-emerald-800">
                      {char}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="font-mono">
                  <td className="px-3 py-1.5 font-bold text-slate-600 dark:text-slate-400 border-r border-emerald-200 dark:border-emerald-800 bg-emerald-50/30">
                    LPS π[i]
                  </td>
                  {kmpLpsData.lps.map((val, i) => (
                    <td key={i} className="px-3 py-1.5 font-bold text-emerald-600 dark:text-emerald-400 border-r border-emerald-200 dark:border-emerald-800">
                      {val}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
            KMP shifts the pattern using the precomputed π table without moving the text index backwards, guaranteeing linear O(N + M) matching time across 50+ menu dishes.
          </p>
        </div>
      )}

      {/* Food Cards Grid / Loading / Empty */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <FoodCardSkeleton key={i} />
          ))}
        </div>
      ) : foods.length === 0 ? (
        <EmptyState
          icon={<SlidersHorizontal className="w-8 h-8" />}
          title="No dishes found"
          description="We couldn't find any dishes matching your keywords or filter combinations."
          actionText="Clear Filters"
          onAction={() => {
            setQuery('');
            setIsVegOnly(false);
            setIsBestsellerOnly(false);
            setSortBy('popular');
            setSearchParams({});
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {foods.map((food) => (
            <FoodCard key={food.id} food={food} layout="horizontal" />
          ))}
        </div>
      )}
    </div>
  );
};

