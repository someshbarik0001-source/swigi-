import React, { useState, useMemo } from 'react';
import {
  dijkstra,
  SRM_CAMPUS_NODES,
  SRM_CAMPUS_EDGES,
  solve01Knapsack,
  KnapsackItem,
  huffmanCompress,
  quickSort,
  PivotStrategy,
  kmpSearch,
  computeLPSArray,
  bfsExplore,
  mergeSort,
  solveTSP,
} from '../../algorithms';
import { FoodDeliveryWorkflowCard } from '../../components/workflow/FoodDeliveryWorkflowCard';
import { mockRestaurants } from '../../data/mockRestaurants';
import { mockFoods } from '../../data/mockFoods';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import {
  GitBranch,
  Boxes,
  Binary,
  ArrowUpDown,
  Navigation,
  Clock,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Sliders,
  RotateCcw,
  Zap,
  ShoppingBag,
  Info,
  Layers,
  ArrowRight,
  Code2,
  Workflow,
  Search,
  Compass,
  MapPin,
  Route,
} from 'lucide-react';

export const AlgorithmLabPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'workflow' | 'kmp' | 'bfs' | 'mergesort' | 'dijkstra' | 'tsp' | 'knapsack' | 'huffman' | 'quicksort'
  >('workflow');
  const { addItem, openCartDrawer } = useCart();
  const { success } = useToast();

  // ==========================================
  // 1. DIJKSTRA STATE
  // ==========================================
  const [dijkstraSource, setDijkstraSource] = useState<string>('LITTLE_VILLAGE');
  const [dijkstraDest, setDijkstraDest] = useState<string>('GANGA_HOSTEL');

  const dijkstraResult = useMemo(() => {
    return dijkstra(dijkstraSource, dijkstraDest, SRM_CAMPUS_EDGES);
  }, [dijkstraSource, dijkstraDest]);

  // ==========================================
  // 2. 0/1 KNAPSACK STATE
  // ==========================================
  const [knapsackBudget, setKnapsackBudget] = useState<number>(350);
  const [knapsackVegOnly, setKnapsackVegOnly] = useState<boolean>(false);

  // Prepare knapsack items from Little Village & campus foods
  const availableKnapsackItems: KnapsackItem[] = useMemo(() => {
    let pool = mockFoods.filter((f) => f.restaurantId === 'R001'); // Hotel Little Village menu
    if (pool.length === 0) pool = mockFoods;
    if (knapsackVegOnly) {
      pool = pool.filter((f) => f.isVeg);
    }
    // Take a curated selection of 14 representative dishes for crystal-clear DP table visualization
    return pool.slice(0, 14).map((f) => ({
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
  }, [knapsackVegOnly]);

  const knapsackResult = useMemo(() => {
    return solve01Knapsack(availableKnapsackItems, knapsackBudget);
  }, [availableKnapsackItems, knapsackBudget]);

  const handleAddKnapsackComboToCart = () => {
    knapsackResult.selectedItems.forEach((item) => {
      const originalFood = mockFoods.find((f) => f.id === item.id);
      if (originalFood) {
        addItem(originalFood);
      }
    });
    success(`Added ${knapsackResult.selectedItems.length} optimal items (Total: ₹${knapsackResult.totalCost}) to your cart!`);
    openCartDrawer();
  };

  // ==========================================
  // 3. HUFFMAN CODING STATE
  // ==========================================
  const defaultReceipt = `SRM UNIVERSITY AP - CAMPUS DINING TICKET
Order ID: ORD-SRM-2026-9481
Restaurant: Hotel Little Village (R001)
Delivery Destination: Ganga Boys Hostel (Room 412)
Items:
- 1x Special Mutton Biryani (₹360)
- 1x Butter Naan (₹50)
- 1x Veg Manchow Soup (₹155)
Subtotal: ₹565 | GST (5%): ₹28 | Total: ₹593
Estimated Delivery Route: Dijkstra Shortest Path via Academic Tier-1`;

  const [huffmanInput, setHuffmanInput] = useState<string>(defaultReceipt);

  const huffmanResult = useMemo(() => {
    return huffmanCompress(huffmanInput);
  }, [huffmanInput]);

  // ==========================================
  // 4. QUICK SORT STATE
  // ==========================================
  const [quickSortTarget, setQuickSortTarget] = useState<'restaurants' | 'foods'>('restaurants');
  const [quickSortKey, setQuickSortKey] = useState<string>('rating');
  const [quickSortDirection, setQuickSortDirection] = useState<'asc' | 'desc'>('desc');
  const [quickSortPivot, setQuickSortPivot] = useState<PivotStrategy>('median_of_three');

  const quickSortResult = useMemo(() => {
    if (quickSortTarget === 'restaurants') {
      const keyExtractor = (r: (typeof mockRestaurants)[0]) => {
        if (quickSortKey === 'rating') return r.rating;
        if (quickSortKey === 'deliveryTime') return r.deliveryTime;
        if (quickSortKey === 'name') return r.name;
        return r.rating;
      };
      return quickSort(mockRestaurants, keyExtractor, quickSortDirection, quickSortPivot);
    } else {
      const foods = mockFoods.slice(0, 30);
      const keyExtractor = (f: (typeof mockFoods)[0]) => {
        if (quickSortKey === 'price') return f.price;
        if (quickSortKey === 'rating') return f.rating;
        if (quickSortKey === 'name') return f.name;
        return f.price;
      };
      return quickSort(foods, keyExtractor, quickSortDirection, quickSortPivot);
    }
  }, [quickSortTarget, quickSortKey, quickSortDirection, quickSortPivot]);

  // ==========================================
  // 5. KMP (KNUTH-MORRIS-PRATT) STATE
  // ==========================================
  const [kmpSearchText, setKmpSearchText] = useState<string>(
    'Hotel Little Village Special Chicken Biryani with Mirchi ka Salan and Hyderabadi Dum Biryani'
  );
  const [kmpPattern, setKmpPattern] = useState<string>('Biryani');
  const kmpResult = useMemo(() => {
    return kmpSearch(kmpSearchText, kmpPattern);
  }, [kmpSearchText, kmpPattern]);

  // ==========================================
  // 6. BFS (BREADTH-FIRST SEARCH) STATE
  // ==========================================
  const [bfsStartNode, setBfsStartNode] = useState<string>('GANGA_HOSTEL');
  const bfsResult = useMemo(() => {
    return bfsExplore(bfsStartNode);
  }, [bfsStartNode]);

  // ==========================================
  // 7. MERGE SORT STATE
  // ==========================================
  const [mergeSortTarget, setMergeSortTarget] = useState<'restaurants' | 'foods'>('restaurants');
  const [mergeSortKey, setMergeSortKey] = useState<'rating' | 'price' | 'deliveryTime'>('rating');
  const [mergeSortDir, setMergeSortDir] = useState<'asc' | 'desc'>('desc');
  const mergeSortResult = useMemo(() => {
    if (mergeSortTarget === 'restaurants') {
      const keyFn = (r: (typeof mockRestaurants)[0]) => {
        if (mergeSortKey === 'rating') return r.rating;
        if (mergeSortKey === 'deliveryTime') return r.deliveryTime;
        if (mergeSortKey === 'price') return r.minOrder;
        return r.rating;
      };
      return mergeSort(mockRestaurants, keyFn, mergeSortDir, (r) => r.name, (r) => r.id);
    } else {
      const foods = mockFoods.slice(0, 24);
      const keyFn = (f: (typeof mockFoods)[0]) => {
        if (mergeSortKey === 'price') return f.price;
        if (mergeSortKey === 'rating') return f.rating;
        if (mergeSortKey === 'deliveryTime') return f.reviewsCount;
        return f.price;
      };
      return mergeSort(foods, keyFn, mergeSortDir, (f) => f.name, (f) => f.id);
    }
  }, [mergeSortTarget, mergeSortKey, mergeSortDir]);

  // ==========================================
  // 8. TSP (TRAVELING SALESPERSON PROBLEM) STATE
  // ==========================================
  const [tspHub, setTspHub] = useState<string>('SRM_CANTEEN');
  const [tspStops, setTspStops] = useState<string[]>([
    'GANGA_HOSTEL',
    'KRISHNA_HOSTEL',
    'YAMUNA_HOSTEL',
    'SAC_BUILDING',
  ]);
  const tspResult = useMemo(() => {
    return solveTSP(tspHub, tspStops, true, SRM_CAMPUS_EDGES);
  }, [tspHub, tspStops]);

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Academic Course Banner */}
        <div className="mb-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-orange-500 text-white shadow-sm">
                  DAA 2026-27
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-slate-200 border border-white/10">
                  SRM University AP • Department of Computer Science
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Scratch Implementations Verified
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                Swigi: Algorithm Analysis & Interactive Lab
              </h1>
              <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
                Interactive evaluator suite demonstrating 4 core algorithmic paradigms implemented strictly from scratch without standard library helpers: Dijkstra's Shortest Path, 0/1 Knapsack Dynamic Programming, Huffman Greedy Compression, and Divide & Conquer Quick Sort.
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 shrink-0">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                <span className="block text-xs text-slate-400 font-medium">Campus Graph</span>
                <span className="text-lg font-black text-orange-400">14 Nodes, 20 Edges</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                <span className="block text-xs text-slate-400 font-medium">DP Solver</span>
                <span className="text-lg font-black text-emerald-400">O(n · W) Exact</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                <span className="block text-xs text-slate-400 font-medium">Compression</span>
                <span className="text-lg font-black text-amber-400">Lossless Prefix</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                <span className="block text-xs text-slate-400 font-medium">Sorting</span>
                <span className="text-lg font-black text-cyan-400">3 Pivot Modes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Showcase: Food Delivery System Workflow */}
        <div className="mb-6">
          <button
            onClick={() => setActiveTab('workflow')}
            className={`w-full p-5 rounded-3xl text-left transition-all border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm ${
              activeTab === 'workflow'
                ? 'bg-slate-950 text-white border-orange-500 ring-2 ring-orange-500 shadow-xl'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-md">
                <Workflow className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-lg font-black tracking-tight">
                    Food Delivery System Workflow
                  </span>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                    End-to-End Pipeline
                  </span>
                </div>
                <p className={`text-xs mt-0.5 ${activeTab === 'workflow' ? 'text-slate-300' : 'text-slate-500'}`}>
                  Customer Search (KMP & BFS) → Ranking (Merge Sort) → Order Placement → Routing (Dijkstra & TSP) → Delivery
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 text-xs font-bold">
              <span className={`px-3 py-1.5 rounded-xl border ${
                activeTab === 'workflow'
                  ? 'bg-orange-500/20 border-orange-500/50 text-orange-400'
                  : 'bg-slate-100 border-slate-200 text-slate-600'
              }`}>
                Interactive Live Flow
              </span>
            </div>
          </button>
        </div>

        {/* Algorithm Paradigm Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-2.5 mb-8">
          {/* KMP */}
          <button
            onClick={() => setActiveTab('kmp')}
            className={`p-3 rounded-2xl text-left transition-all border flex flex-col justify-between ${
              activeTab === 'kmp'
                ? 'bg-white border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                : 'bg-white border-slate-200/80 hover:border-slate-300 text-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-[10px]">
                1
              </span>
              <span className="text-[9px] uppercase font-bold text-slate-400">Strings</span>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-xs">KMP</h3>
              <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">Search food</p>
            </div>
            <span className="mt-1.5 text-[10px] font-mono font-bold text-emerald-600">
              O(N + M)
            </span>
          </button>

          {/* BFS */}
          <button
            onClick={() => setActiveTab('bfs')}
            className={`p-3 rounded-2xl text-left transition-all border flex flex-col justify-between ${
              activeTab === 'bfs'
                ? 'bg-white border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                : 'bg-white border-slate-200/80 hover:border-slate-300 text-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-[10px]">
                2
              </span>
              <span className="text-[9px] uppercase font-bold text-slate-400">Graph BFS</span>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-xs">BFS</h3>
              <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">Nearby places</p>
            </div>
            <span className="mt-1.5 text-[10px] font-mono font-bold text-emerald-600">
              O(V + E)
            </span>
          </button>

          {/* Merge Sort */}
          <button
            onClick={() => setActiveTab('mergesort')}
            className={`p-3 rounded-2xl text-left transition-all border flex flex-col justify-between ${
              activeTab === 'mergesort'
                ? 'bg-white border-amber-500 shadow-md ring-2 ring-amber-500/20'
                : 'bg-white border-slate-200/80 hover:border-slate-300 text-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-black text-[10px]">
                3
              </span>
              <span className="text-[9px] uppercase font-bold text-slate-400">Divide & Conq</span>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-xs">Merge Sort</h3>
              <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">Sort outlets</p>
            </div>
            <span className="mt-1.5 text-[10px] font-mono font-bold text-amber-600">
              O(N log N)
            </span>
          </button>

          {/* Dijkstra */}
          <button
            onClick={() => setActiveTab('dijkstra')}
            className={`p-3 rounded-2xl text-left transition-all border flex flex-col justify-between ${
              activeTab === 'dijkstra'
                ? 'bg-white border-purple-500 shadow-md ring-2 ring-purple-500/20'
                : 'bg-white border-slate-200/80 hover:border-slate-300 text-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-black text-[10px]">
                4
              </span>
              <span className="text-[9px] uppercase font-bold text-slate-400">Greedy Path</span>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-xs">Dijkstra</h3>
              <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">1-Stop route</p>
            </div>
            <span className="mt-1.5 text-[10px] font-mono font-bold text-purple-600">
              O((V+E)logV)
            </span>
          </button>

          {/* TSP */}
          <button
            onClick={() => setActiveTab('tsp')}
            className={`p-3 rounded-2xl text-left transition-all border flex flex-col justify-between ${
              activeTab === 'tsp'
                ? 'bg-white border-purple-500 shadow-md ring-2 ring-purple-500/20'
                : 'bg-white border-slate-200/80 hover:border-slate-300 text-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-black text-[10px]">
                5
              </span>
              <span className="text-[9px] uppercase font-bold text-slate-400">Bitmask DP</span>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-xs">TSP</h3>
              <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">Multi-stops</p>
            </div>
            <span className="mt-1.5 text-[10px] font-mono font-bold text-purple-600">
              O(n² 2ⁿ)
            </span>
          </button>

          {/* Knapsack */}
          <button
            onClick={() => setActiveTab('knapsack')}
            className={`p-3 rounded-2xl text-left transition-all border flex flex-col justify-between ${
              activeTab === 'knapsack'
                ? 'bg-white border-orange-500 shadow-md ring-2 ring-orange-500/20'
                : 'bg-white border-slate-200/80 hover:border-slate-300 text-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-black text-[10px]">
                6
              </span>
              <span className="text-[9px] uppercase font-bold text-slate-400">Dynamic P.</span>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-xs">0/1 Knapsack</h3>
              <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">Combo opt</p>
            </div>
            <span className="mt-1.5 text-[10px] font-mono font-bold text-emerald-600">
              O(n · W)
            </span>
          </button>

          {/* Huffman */}
          <button
            onClick={() => setActiveTab('huffman')}
            className={`p-3 rounded-2xl text-left transition-all border flex flex-col justify-between ${
              activeTab === 'huffman'
                ? 'bg-white border-orange-500 shadow-md ring-2 ring-orange-500/20'
                : 'bg-white border-slate-200/80 hover:border-slate-300 text-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-black text-[10px]">
                7
              </span>
              <span className="text-[9px] uppercase font-bold text-slate-400">Greedy Prefix</span>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-xs">Huffman</h3>
              <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">Compress</p>
            </div>
            <span className="mt-1.5 text-[10px] font-mono font-bold text-amber-600">
              O(n log n)
            </span>
          </button>

          {/* Quick Sort */}
          <button
            onClick={() => setActiveTab('quicksort')}
            className={`p-3 rounded-2xl text-left transition-all border flex flex-col justify-between ${
              activeTab === 'quicksort'
                ? 'bg-white border-cyan-500 shadow-md ring-2 ring-cyan-500/20'
                : 'bg-white border-slate-200/80 hover:border-slate-300 text-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="w-6 h-6 rounded-lg bg-cyan-100 text-cyan-600 flex items-center justify-center font-black text-[10px]">
                8
              </span>
              <span className="text-[9px] uppercase font-bold text-slate-400">Partition</span>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-xs">Quick Sort</h3>
              <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">Pivot sort</p>
            </div>
            <span className="mt-1.5 text-[10px] font-mono font-bold text-cyan-600">
              O(n log n)
            </span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 0: FOOD DELIVERY SYSTEM WORKFLOW (FEATURED END-TO-END PIPELINE)       */}
        {/* ========================================================================= */}
        {activeTab === 'workflow' && (
          <div className="space-y-6 animate-fade-in">
            <FoodDeliveryWorkflowCard />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: KMP (KNUTH-MORRIS-PRATT) PATTERN MATCHING                             */}
        {/* ========================================================================= */}
        {activeTab === 'kmp' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Search className="w-5 h-5 text-emerald-600" />
                    KMP String Pattern Matching: Search Matching Food
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Precomputes the Longest Proper Prefix which is also Suffix (LPS / π array) to achieve strictly linear O(N + M) search time without backtracking text characters.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800">
                    O(N + M) Time • O(M) Space
                  </span>
                </div>
              </div>

              {/* Live Test Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Search Pattern P (Length M = {kmpPattern.length})
                  </label>
                  <input
                    type="text"
                    value={kmpPattern}
                    onChange={(e) => setKmpPattern(e.target.value)}
                    placeholder="e.g. Biryani"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Target Menu Text T (Length N = {kmpSearchText.length})
                  </label>
                  <input
                    type="text"
                    value={kmpSearchText}
                    onChange={(e) => setKmpSearchText(e.target.value)}
                    placeholder="e.g. Hotel Little Village Special Chicken Biryani..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Metrics Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Matches Found</span>
                  <span className="text-xl font-black text-emerald-600">{kmpResult.matchCount}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">KMP Comparisons</span>
                  <span className="text-xl font-black text-slate-900">{kmpResult.comparisonsCount}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Naive Comparisons</span>
                  <span className="text-xl font-black text-slate-400 line-through">{kmpResult.naiveComparisonsCount}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Comparisons Saved</span>
                  <span className="text-xl font-black text-emerald-600">+{kmpResult.comparisonsSaved}</span>
                </div>
              </div>

              {/* LPS Table Display */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Computed Longest Proper Prefix-Suffix (π / LPS) Array
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-center text-xs border border-slate-200 rounded-xl overflow-hidden bg-white">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-3 py-1.5 border-r border-slate-200 font-bold text-slate-500">Index j</th>
                        {kmpPattern.split('').map((_, i) => (
                          <th key={i} className="px-3 py-1.5 border-r border-slate-200 font-mono text-slate-600">
                            {i}
                          </th>
                        ))}
                      </tr>
                      <tr>
                        <th className="px-3 py-1.5 border-r border-slate-200 font-bold text-slate-500">Pattern[j]</th>
                        {kmpPattern.split('').map((c, i) => (
                          <th key={i} className="px-3 py-1.5 border-r border-slate-200 font-mono font-bold text-emerald-700 bg-emerald-50/50">
                            {c}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="font-mono">
                        <td className="px-3 py-1.5 border-r border-slate-200 font-bold text-slate-700">LPS[j]</td>
                        {kmpResult.lpsArray.map((val, i) => (
                          <td key={i} className="px-3 py-1.5 border-r border-slate-200 font-bold text-emerald-600">
                            {val}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* KMP Search Execution Step Log */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  KMP Execution Trace Log ({kmpResult.searchSteps.length} transitions)
                </h3>
                <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1 font-mono text-[11px]">
                  {kmpResult.searchSteps.slice(0, 30).map((step) => (
                    <div
                      key={step.step}
                      className={`p-2 rounded-lg border flex items-center justify-between ${
                        step.action === 'pattern_found'
                          ? 'bg-emerald-100 border-emerald-300 text-emerald-900 font-bold'
                          : step.isMatch
                          ? 'bg-emerald-50 border-emerald-100 text-emerald-800'
                          : 'bg-slate-50 border-slate-100 text-slate-600'
                      }`}
                    >
                      <span>
                        Step {step.step}: text[{step.textIndex}]('{step.textChar}') vs pat[{step.patternIndex}]('{step.patternChar}')
                      </span>
                      <span>{step.explanation}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: BFS (BREADTH-FIRST SEARCH) DISCOVERY                                  */}
        {/* ========================================================================= */}
        {activeTab === 'bfs' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Compass className="w-5 h-5 text-emerald-600" />
                    BFS Campus Exploration: Find Nearby Restaurants
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Queue-based level-order traversal from the student's hostel across the SRM AP campus graph to discover food outlets ordered by graph hop distance.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800">
                    O(V + E) Time • FIFO Queue
                  </span>
                </div>
              </div>

              {/* Start Node Selector */}
              <div className="max-w-md">
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Select Customer Residence / Starting Node
                </label>
                <select
                  value={bfsStartNode}
                  onChange={(e) => setBfsStartNode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="GANGA_HOSTEL">Ganga Boys Hostel (Blocks 1-4)</option>
                  <option value="YAMUNA_HOSTEL">Yamuna Girls Hostel (Towers A & B)</option>
                  <option value="KRISHNA_HOSTEL">Krishna Boys Hostel</option>
                  <option value="SAC_BUILDING">Student Activity Centre (SAC)</option>
                  <option value="ACADEMIC_TIER1">Academic Block Tier-1 Reception</option>
                </select>
              </div>

              {/* Discovered Restaurants Ranked by BFS Hops */}
              <div>
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  Campus Restaurants Discovered in Level Order ({bfsResult.nearbyRestaurants.length} Outlets)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {bfsResult.nearbyRestaurants.map((rest, i) => (
                    <div
                      key={rest.restaurantId}
                      className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/60 hover:bg-slate-50 transition-all flex flex-col justify-between space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-600 text-white">
                              Level {rest.hops} ({rest.hops} Hops)
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 mt-1">{rest.name}</h4>
                          <p className="text-xs text-slate-500 line-clamp-1">{rest.description}</p>
                        </div>
                        <span className="text-xs font-bold text-emerald-600 shrink-0">
                          {rest.totalDistanceMeters}m
                        </span>
                      </div>

                      <div className="pt-2 border-t border-slate-200/60 text-[11px] text-slate-600 font-medium">
                        <span className="text-slate-400">Path:</span> {rest.pathNodeNames.join(' → ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* BFS Queue Traces */}
              <div>
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  BFS FIFO Queue States
                </h3>
                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 font-mono text-[11px]">
                  {bfsResult.stepTraces.map((trace) => (
                    <div key={trace.step} className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <span className="font-bold text-slate-800">
                        Step {trace.step}: Dequeued {trace.currentNodeName} (Level {trace.currentLevel})
                      </span>
                      <span className="text-slate-500">
                        Queue: [{trace.queueSnapshot.map((id) => id.split('_')[0]).join(', ')}]
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: MERGE SORT                                                            */}
        {/* ========================================================================= */}
        {activeTab === 'mergesort' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <ArrowUpDown className="w-5 h-5 text-amber-500" />
                    Merge Sort: Divide & Conquer Restaurant Ranking
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Recursively divides the restaurant array into halves, sorts each half, and performs a stable two-pointer merge with auxiliary buffer.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-100 text-amber-800">
                    O(N log N) Guaranteed • Stable
                  </span>
                </div>
              </div>

              {/* Sort Controls */}
              <div className="flex flex-wrap items-center gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Target</label>
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                    <button
                      onClick={() => setMergeSortTarget('restaurants')}
                      className={`px-3 py-1.5 rounded-lg ${mergeSortTarget === 'restaurants' ? 'bg-white shadow-xs text-amber-600' : 'text-slate-600'}`}
                    >
                      Restaurants ({mockRestaurants.length})
                    </button>
                    <button
                      onClick={() => setMergeSortTarget('foods')}
                      className={`px-3 py-1.5 rounded-lg ${mergeSortTarget === 'foods' ? 'bg-white shadow-xs text-amber-600' : 'text-slate-600'}`}
                    >
                      Food Items (24)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Sort Criterion</label>
                  <select
                    value={mergeSortKey}
                    onChange={(e) => setMergeSortKey(e.target.value as any)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-900"
                  >
                    <option value="rating">Rating (Stars)</option>
                    <option value="price">Price / Min Order (₹)</option>
                    <option value="deliveryTime">Preparation & Delivery Time</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Direction</label>
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                    <button
                      onClick={() => setMergeSortDir('desc')}
                      className={`px-3 py-1.5 rounded-lg ${mergeSortDir === 'desc' ? 'bg-white shadow-xs text-amber-600' : 'text-slate-600'}`}
                    >
                      Descending (High → Low)
                    </button>
                    <button
                      onClick={() => setMergeSortDir('asc')}
                      className={`px-3 py-1.5 rounded-lg ${mergeSortDir === 'asc' ? 'bg-white shadow-xs text-amber-600' : 'text-slate-600'}`}
                    >
                      Ascending (Low → High)
                    </button>
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Comparisons</span>
                  <span className="text-xl font-black text-amber-600">{mergeSortResult.comparisonCount}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Inversion Count</span>
                  <span className="text-xl font-black text-slate-900">{mergeSortResult.inversionCount}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Tree Depth</span>
                  <span className="text-xl font-black text-slate-900">{mergeSortResult.recursionDepth} Levels</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Runtime</span>
                  <span className="text-xl font-black text-emerald-600">{mergeSortResult.durationMs}ms</span>
                </div>
              </div>

              {/* Sorted Output Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {mergeSortResult.sortedArray.slice(0, 9).map((item: any, idx) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-amber-500 text-white font-black text-xs flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                        <span className="text-[10px] text-slate-500">
                          ⭐ {item.rating} • {item.deliveryTime || 20}m • ₹{item.minOrder || item.price}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: TSP (TRAVELING SALESPERSON PROBLEM)                                   */}
        {/* ========================================================================= */}
        {activeTab === 'tsp' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Route className="w-5 h-5 text-purple-600" />
                    TSP: Multiple Delivery Stops Batch Routing
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Solves multi-order delivery tour over the SRM AP campus road network using exact Held-Karp Dynamic Programming with Bitmask (O(n² 2ⁿ)) over a Dijkstra distance matrix.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-100 text-purple-800">
                    O(n² 2ⁿ) Exact DP
                  </span>
                </div>
              </div>

              {/* Waypoint Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Central Kitchen / Pickup Hub Node
                  </label>
                  <select
                    value={tspHub}
                    onChange={(e) => setTspHub(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="SRM_CANTEEN">Central Food Court Complex (SRM Canteen)</option>
                    <option value="LITTLE_VILLAGE">Hotel Little Village (R001)</option>
                    <option value="BAKERY_CAFE">Campus Artisan Bakery Corner</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Active Hostel Dropoff Stops ({tspStops.length} Waypoints)
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {['GANGA_HOSTEL', 'KRISHNA_HOSTEL', 'YAMUNA_HOSTEL', 'SAC_BUILDING', 'LIBRARY_PLAZA'].map((nodeId) => {
                      const isSelected = tspStops.includes(nodeId);
                      return (
                        <button
                          key={nodeId}
                          onClick={() => {
                            if (isSelected) {
                              if (tspStops.length > 2) setTspStops(tspStops.filter((s) => s !== nodeId));
                            } else {
                              setTspStops([...tspStops, nodeId]);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                            isSelected
                              ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {SRM_CAMPUS_NODES[nodeId]?.name?.split(' ')[0] || nodeId}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Tour Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-100 text-center">
                  <span className="text-[10px] font-bold text-purple-600 uppercase block">Optimal Tour</span>
                  <span className="text-xl font-black text-purple-700">{tspResult.totalDistanceMeters}m</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Naive Order</span>
                  <span className="text-xl font-black text-slate-400 line-through">{tspResult.naiveDistanceMeters}m</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase block">Distance Saved</span>
                  <span className="text-xl font-black text-emerald-600">{tspResult.percentageSaved}%</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Est. Tour Time</span>
                  <span className="text-xl font-black text-slate-900">{tspResult.totalEstimatedMinutes} mins</span>
                </div>
              </div>

              {/* Reconstructed Tour Legs */}
              <div>
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Optimal Multi-Stop Tour Sequence
                </h3>
                <div className="space-y-2">
                  {tspResult.legs.map((leg) => (
                    <div
                      key={leg.legIndex}
                      className="p-3 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-purple-600 text-white font-black text-[10px] flex items-center justify-center">
                          {leg.legIndex}
                        </span>
                        <span className="font-bold text-slate-900">
                          {leg.fromName} → {leg.toName}
                        </span>
                      </div>
                      <span className="font-mono font-bold text-purple-700">
                        {leg.distanceMeters} meters (~{Math.round(leg.estimatedDurationSec / 60)} min)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 1: DIJKSTRA'S SHORTEST PATH                                            */}
        {/* ========================================================================= */}
        {activeTab === 'dijkstra' && (
          <div className="space-y-6 animate-fade-in">
            {/* Control Bar */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-orange-500" />
                    SRM AP Campus Delivery Routing: Dijkstra's Algorithm
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Computes minimum distance on campus road graph using scratch array-based MinHeap with O(log V) sift-up/sift-down and early exit on destination extract.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                      Origin Restaurant (Source):
                    </label>
                    <select
                      value={dijkstraSource}
                      onChange={(e) => setDijkstraSource(e.target.value)}
                      className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="LITTLE_VILLAGE">Hotel Little Village (R001)</option>
                      <option value="SRM_CANTEEN">Central Food Court Complex</option>
                      <option value="MAGGI_HOTSPOT">Late-Night Maggi Hotspot</option>
                      <option value="AMUL_PARLOUR">Amul Ice Cream & Dairy Hub</option>
                      <option value="BAKERY_CAFE">Campus Bakery Corner</option>
                      <option value="MAIN_GATE1">Campus Main Gate 1</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                      Hostel / Drop-off (Destination):
                    </label>
                    <select
                      value={dijkstraDest}
                      onChange={(e) => setDijkstraDest(e.target.value)}
                      className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="GANGA_HOSTEL">Ganga Boys Hostel (Room 412)</option>
                      <option value="YAMUNA_HOSTEL">Yamuna Girls Hostel (Tower B)</option>
                      <option value="KRISHNA_HOSTEL">Krishna Boys Hostel</option>
                      <option value="SAC_BUILDING">Student Activity Centre (SAC)</option>
                      <option value="ACADEMIC_TIER1">Academic Block Tier-1</option>
                      <option value="GATE2_CIRCLE">Transit Circle Gate 2</option>
                      <option value="LIBRARY_PLAZA">Central Library Plaza</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Path Solution Metric Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-2">
                <div className="p-3 rounded-2xl bg-orange-50 border border-orange-100">
                  <span className="text-[11px] text-orange-600 font-semibold block">Total Shortest Distance</span>
                  <span className="text-xl font-black text-orange-700">{dijkstraResult.totalDistanceMeters} meters</span>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <span className="text-[11px] text-emerald-600 font-semibold block">Estimated Delivery ETA</span>
                  <span className="text-xl font-black text-emerald-700">
                    {Math.ceil(dijkstraResult.estimatedTransitSeconds / 60)} mins ({dijkstraResult.estimatedTransitSeconds}s)
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-100">
                  <span className="text-[11px] text-indigo-600 font-semibold block">Visited Nodes / Relaxations</span>
                  <span className="text-xl font-black text-indigo-700">
                    {dijkstraResult.visitedNodesCount} / {dijkstraResult.edgesRelaxedCount} relaxed
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-100 border border-slate-200">
                  <span className="text-[11px] text-slate-600 font-semibold block">Guaranteed Path Hops</span>
                  <span className="text-xl font-black text-slate-800">{dijkstraResult.path.length} nodes</span>
                </div>
              </div>

              {/* Waypoint Sequence */}
              <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-xs font-bold text-slate-700 block mb-2">
                  Optimal Path Waypoint Sequence:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {dijkstraResult.path.map((nodeId, idx) => (
                    <React.Fragment key={nodeId}>
                      <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-slate-900 border border-slate-200 shadow-sm flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] font-black flex items-center justify-center">
                          {idx + 1}
                        </span>
                        {SRM_CAMPUS_NODES[nodeId]?.name}
                      </span>
                      {idx < dijkstraResult.path.length - 1 && (
                        <ArrowRight className="w-4 h-4 text-orange-500 shrink-0" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive Campus Graph Map Visualization */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4 text-orange-500" />
                  SRM University AP Campus Road Network Topology (SVG Graph View)
                </h3>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-orange-500 inline-block" /> Active Shortest Path
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-slate-300 inline-block" /> Campus Roads
                  </span>
                </div>
              </div>

              <div className="relative w-full overflow-x-auto bg-slate-900 rounded-2xl p-4 border border-slate-800">
                <svg
                  viewBox="0 0 920 540"
                  className="w-full min-w-[700px] h-auto select-none"
                >
                  {/* Background grid */}
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.8" />
                    </pattern>
                  </defs>
                  <rect width="920" height="540" fill="url(#grid)" />

                  {/* Draw All Edges */}
                  {SRM_CAMPUS_EDGES.map((edge, i) => {
                    const u = SRM_CAMPUS_NODES[edge.from];
                    const v = SRM_CAMPUS_NODES[edge.to];
                    if (!u || !v) return null;

                    // Check if edge is part of the shortest path
                    const pathIndexU = dijkstraResult.path.indexOf(edge.from);
                    const pathIndexV = dijkstraResult.path.indexOf(edge.to);
                    const isShortestPathEdge =
                      pathIndexU !== -1 &&
                      pathIndexV !== -1 &&
                      Math.abs(pathIndexU - pathIndexV) === 1;

                    const midX = (u.x + v.x) / 2;
                    const midY = (u.y + v.y) / 2;

                    return (
                      <g key={`edge-${i}`}>
                        <line
                          x1={u.x}
                          y1={u.y}
                          x2={v.x}
                          y2={v.y}
                          stroke={isShortestPathEdge ? '#f97316' : '#334155'}
                          strokeWidth={isShortestPathEdge ? 4 : 1.5}
                          strokeDasharray={isShortestPathEdge ? undefined : '4 3'}
                        />
                        {/* Distance Label */}
                        <rect
                          x={midX - 18}
                          y={midY - 8}
                          width={36}
                          height={16}
                          rx={4}
                          fill={isShortestPathEdge ? '#c2410c' : '#0f172a'}
                          stroke={isShortestPathEdge ? '#ea580c' : '#334155'}
                        />
                        <text
                          x={midX}
                          y={midY + 3.5}
                          fill={isShortestPathEdge ? '#ffffff' : '#94a3b8'}
                          fontSize={9}
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {edge.distanceMeters}m
                        </text>
                      </g>
                    );
                  })}

                  {/* Draw Nodes */}
                  {Object.values(SRM_CAMPUS_NODES).map((node) => {
                    const isInPath = dijkstraResult.path.includes(node.id);
                    const isSource = node.id === dijkstraSource;
                    const isDest = node.id === dijkstraDest;

                    let fillColor = '#1e293b';
                    let strokeColor = '#475569';
                    let radius = 10;

                    if (isSource) {
                      fillColor = '#16a34a'; // Green for origin
                      strokeColor = '#ffffff';
                      radius = 14;
                    } else if (isDest) {
                      fillColor = '#ef4444'; // Red for destination
                      strokeColor = '#ffffff';
                      radius = 14;
                    } else if (isInPath) {
                      fillColor = '#f97316'; // Orange for path nodes
                      strokeColor = '#ffffff';
                      radius = 12;
                    }

                    return (
                      <g key={node.id} className="cursor-pointer">
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={radius}
                          fill={fillColor}
                          stroke={strokeColor}
                          strokeWidth={2.5}
                        />
                        {isInPath && (
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r={radius + 6}
                            fill="none"
                            stroke={isSource ? '#16a34a' : isDest ? '#ef4444' : '#f97316'}
                            strokeWidth={1.5}
                            opacity={0.6}
                          />
                        )}
                        <text
                          x={node.x}
                          y={node.y - 15}
                          fill="#f8fafc"
                          fontSize={10}
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {node.name.split('(')[0]}
                        </text>
                        <text
                          x={node.x}
                          y={node.y + 22}
                          fill="#94a3b8"
                          fontSize={8}
                          textAnchor="middle"
                        >
                          {node.id}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Step-by-Step Edge Relaxation Trace */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    DAA Evaluation Log: MinHeap Step-by-Step Relaxation Trace
                  </h3>
                  <p className="text-xs text-slate-500">
                    Explicit record of edge relaxation tests (d[u] + w(u,v) &lt; d[v]) and custom MinHeap state transitions.
                  </p>
                </div>
                <Badge variant="primary" size="sm">
                  {dijkstraResult.stepTraces.length} Steps Logged
                </Badge>
              </div>

              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 sticky top-0 text-[11px] font-bold text-slate-500 uppercase border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Step</th>
                      <th className="py-2.5 px-3">Current u</th>
                      <th className="py-2.5 px-3">Edge Evaluated (u → v)</th>
                      <th className="py-2.5 px-3">Old d[v]</th>
                      <th className="py-2.5 px-3">Tentative d[u]+w</th>
                      <th className="py-2.5 px-3">Relaxed?</th>
                      <th className="py-2.5 px-3">MinHeap State Snapshot</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {dijkstraResult.stepTraces.map((trace) => (
                      <tr key={trace.step} className={trace.relaxed ? 'bg-orange-50/40' : 'hover:bg-slate-50'}>
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-500">#{trace.step}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900">{trace.currentNodeName}</td>
                        <td className="py-2.5 px-3 font-mono">
                          {trace.edgeEvaluated ? `${trace.edgeEvaluated.from} → ${trace.edgeEvaluated.to} (${trace.edgeEvaluated.weight}m)` : '— (Root Init)'}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-500">
                          {trace.oldDistance === -1 ? '∞' : `${trace.oldDistance}m`}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-orange-600">
                          {trace.newDistance}m
                        </td>
                        <td className="py-2.5 px-3">
                          {trace.relaxed ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px]">
                              YES (Relaxed)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px]">
                              NO
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[10px] text-slate-600 max-w-xs truncate">
                          [{trace.minHeapState.map((h) => `${h.node}:${h.priority}m`).join(', ')}]
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: 0/1 KNAPSACK MENU COMBO OPTIMIZER                                   */}
        {/* ========================================================================= */}
        {activeTab === 'knapsack' && (
          <div className="space-y-6 animate-fade-in">
            {/* Control & Budget Selector */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Boxes className="w-5 h-5 text-emerald-600" />
                    DAA 0/1 Knapsack: "Best Combo" Menu Optimizer
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Maximizes aggregate student dish rating scores without exceeding budget W. Solved via 2D DP matrix DP[i][w] = max(DP[i-1][w], DP[i-1][w-c] + v) and backtracked from (n, W).
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setKnapsackVegOnly(!knapsackVegOnly)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                      knapsackVegOnly
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {knapsackVegOnly ? '🌱 Pure Veg Only' : '🍽️ All Dishes (Veg & Non-Veg)'}
                  </button>

                  <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                    {[150, 250, 350, 500, 750].map((preset) => (
                      <button
                        key={preset}
                        onClick={() => setKnapsackBudget(preset)}
                        className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${
                          knapsackBudget === preset
                            ? 'bg-white text-emerald-600 shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        ₹{preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Slider for custom budget */}
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Student Budget Capacity (W):</span>
                    <span className="text-base text-emerald-600 font-extrabold">₹{knapsackBudget}</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="1000"
                    step="10"
                    value={knapsackBudget}
                    onChange={(e) => setKnapsackBudget(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                    <span>₹50</span>
                    <span>₹250</span>
                    <span>₹500</span>
                    <span>₹750</span>
                    <span>₹1,000</span>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="md"
                  onClick={handleAddKnapsackComboToCart}
                  leftIcon={<ShoppingBag className="w-4 h-4" />}
                  className="bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25 shrink-0"
                >
                  Add Optimal Combo (₹{knapsackResult.totalCost}) to Cart
                </Button>
              </div>

              {/* Solved Optimal Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <span className="text-[11px] text-emerald-600 font-semibold block">Total Combo Cost</span>
                  <span className="text-xl font-black text-emerald-700">₹{knapsackResult.totalCost}</span>
                  <span className="text-[10px] text-emerald-600 block mt-0.5">
                    (₹{knapsackResult.remainingBudget} leftover budget)
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-100">
                  <span className="text-[11px] text-amber-600 font-semibold block">Total Rating Score</span>
                  <span className="text-xl font-black text-amber-700">{knapsackResult.totalRatingScore} pts</span>
                  <span className="text-[10px] text-amber-600 block mt-0.5">
                    Avg Rating: {knapsackResult.averageRating} ★
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-100">
                  <span className="text-[11px] text-indigo-600 font-semibold block">Budget Utilization</span>
                  <span className="text-xl font-black text-indigo-700">{knapsackResult.budgetUtilizationPct}%</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-100 border border-slate-200">
                  <span className="text-[11px] text-slate-600 font-semibold block">Items Selected</span>
                  <span className="text-xl font-black text-slate-800">{knapsackResult.selectedItems.length} dishes</span>
                </div>
              </div>
            </div>

            {/* Selected Optimal Dishes Cards */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
              <h3 className="font-bold text-slate-900 text-sm mb-3">
                Mathematically Optimal Combo Chosen by Backtracking:
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {knapsackResult.selectedItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3"
                  >
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=150&q=80'}
                      alt={item.name}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        <h4 className="font-bold text-xs text-slate-900 truncate">{item.name}</h4>
                      </div>
                      <span className="text-[10px] text-slate-500 block truncate">{item.category}</span>
                      <div className="flex items-center justify-between mt-1">
                        <span className="font-extrabold text-xs text-emerald-600">₹{item.cost}</span>
                        <span className="text-[11px] font-bold text-amber-500">★ {item.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Subproblem 2D DP Matrix Visualizer */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-emerald-600" />
                    2D Dynamic Programming Table: DP[i][w]
                  </h3>
                  <p className="text-xs text-slate-500">
                    Subproblem matrix with row i representing item choices and column w representing sampled capacity intervals (sampled in steps of 25 for readable evaluation).
                  </p>
                </div>
                <Badge variant="primary" size="sm">
                  {knapsackResult.spaceComplexity}
                </Badge>
              </div>

              {/* Sampled DP Table for clean display */}
              <div className="overflow-x-auto max-h-80 border border-slate-200 rounded-2xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 sticky top-0 text-[10px] font-bold text-slate-600 uppercase border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3 sticky left-0 bg-slate-100 z-10">i \ w (₹)</th>
                      <th className="py-2 px-3 sticky left-24 bg-slate-100 z-10">Dish Name (Weight)</th>
                      {/* Sample weight columns */}
                      {Array.from({ length: Math.min(15, Math.floor(knapsackBudget / 25) + 1) }, (_, idx) => idx * 25).map(
                        (sampledWeight) => (
                          <th key={sampledWeight} className="py-2 px-2 text-center font-mono">
                            ₹{sampledWeight}
                          </th>
                        )
                      )}
                      <th className="py-2 px-2 text-center font-mono text-emerald-600 bg-emerald-50">
                        ₹{knapsackBudget} (W)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                    {availableKnapsackItems.map((item, rowIdx) => {
                      const i = rowIdx + 1;
                      const isPicked = knapsackResult.selectedItems.some((sel) => sel.id === item.id);

                      return (
                        <tr key={item.id} className={isPicked ? 'bg-emerald-50/50' : 'hover:bg-slate-50'}>
                          <td className="py-2 px-3 sticky left-0 bg-white font-bold text-slate-500 border-r border-slate-100">
                            i={i}
                          </td>
                          <td className="py-2 px-3 sticky left-24 bg-white font-bold text-slate-800 border-r border-slate-100 max-w-[140px] truncate">
                            {item.name} (₹{item.cost})
                          </td>

                          {Array.from({ length: Math.min(15, Math.floor(knapsackBudget / 25) + 1) }, (_, idx) => idx * 25).map(
                            (w) => (
                              <td key={w} className="py-2 px-2 text-center text-slate-600">
                                {knapsackResult.dpTable[i] ? knapsackResult.dpTable[i][w] : 0}
                              </td>
                            )
                          )}

                          <td className="py-2 px-2 text-center font-bold text-emerald-700 bg-emerald-50">
                            {knapsackResult.dpTable[i] ? knapsackResult.dpTable[i][knapsackBudget] : 0}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Backtracking Log */}
              <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold text-slate-700 block mb-1">
                  Backtracking Reconstruction Trace:
                </span>
                <div className="space-y-1 max-h-36 overflow-y-auto font-mono text-[11px] text-slate-600">
                  {knapsackResult.backtrackPath.map((step, idx) => (
                    <div key={idx} className={step.itemAdded ? 'text-emerald-700 font-bold' : ''}>
                      • {step.action}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: HUFFMAN CODING PAYLOAD COMPRESSION                                  */}
        {/* ========================================================================= */}
        {activeTab === 'huffman' && (
          <div className="space-y-6 animate-fade-in">
            {/* Control & Input */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Binary className="w-5 h-5 text-amber-500" />
                    DAA Huffman Coding: Lossless Menu & Receipt Compression
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Greedy prefix coding constructing an optimal binary tree via custom MinHeap of frequencies. Used for fast order transmission on SRM AP campus Wi-Fi.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setHuffmanInput(defaultReceipt)}
                  >
                    Campus Receipt Preset
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setHuffmanInput(
                        JSON.stringify(
                          {
                            campus: 'SRM University AP',
                            restaurant: 'Hotel Little Village',
                            bestsellers: ['Potlam Biryani', 'Mutton Bone Soup', 'Natu Kodi Pulusu'],
                            deliveryZone: 'Ganga & Yamuna Hostels',
                          },
                          null,
                          2
                        )
                      )
                    }
                  >
                    Menu JSON Preset
                  </Button>
                </div>
              </div>

              {/* Editable Text Area */}
              <div className="mt-4">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Input String / Order Payload to Compress:
                </label>
                <textarea
                  value={huffmanInput}
                  onChange={(e) => setHuffmanInput(e.target.value)}
                  rows={4}
                  className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Type or paste text to compress..."
                />
              </div>

              {/* Compression Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-100">
                  <span className="text-[11px] text-amber-600 font-semibold block">Compression Ratio</span>
                  <span className="text-xl font-black text-amber-700">{huffmanResult.compressionRatioPct}%</span>
                  <span className="text-[10px] text-amber-600 block mt-0.5">Bandwidth saved</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-100 border border-slate-200">
                  <span className="text-[11px] text-slate-600 font-semibold block">Original Size (8-bit)</span>
                  <span className="text-xl font-black text-slate-800">{huffmanResult.originalBits} bits</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">({huffmanResult.originalBytes} bytes)</span>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <span className="text-[11px] text-emerald-600 font-semibold block">Compressed Size</span>
                  <span className="text-xl font-black text-emerald-700">{huffmanResult.compressedBits} bits</span>
                  <span className="text-[10px] text-emerald-600 block mt-0.5">({huffmanResult.compressedBytes} bytes)</span>
                </div>
                <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-100">
                  <span className="text-[11px] text-indigo-600 font-semibold block">Lossless Proof</span>
                  <span className="text-sm font-black text-indigo-700 flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    D(E(T)) === T
                  </span>
                  <span className="text-[10px] text-indigo-600 block mt-0.5">100% Exact Match</span>
                </div>
              </div>
            </div>

            {/* Generated Huffman Prefix Code Table */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 text-sm">
                  Generated Prefix Code Dictionary (Left='0', Right='1')
                </h3>
                <span className="text-xs text-slate-500 font-mono">
                  {huffmanResult.codeTable.length} Unique Symbols
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {huffmanResult.codeTable.map((entry) => (
                  <div
                    key={entry.char}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs bg-white px-2 py-0.5 rounded border border-slate-200">
                        {entry.displayChar}
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold">f={entry.frequency}</span>
                    </div>
                    <div className="mt-2">
                      <span className="font-mono text-xs font-black text-amber-600 block">
                        {entry.code}
                      </span>
                      <span className="text-[9px] text-slate-400 block">
                        {entry.bits} bits (vs 8 bits)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Encoded Bitstream & Lossless Verification Display */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">
                  Encoded Binary Bitstream Transmitted across Campus Network:
                </h3>
                <div className="p-3.5 rounded-2xl bg-slate-900 text-amber-400 font-mono text-xs break-all max-h-36 overflow-y-auto leading-relaxed border border-slate-800">
                  {huffmanResult.encodedBitstring}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Decompressed & Losslessly Reconstructed String:
                </h3>
                <pre className="p-3.5 rounded-2xl bg-slate-50 text-slate-800 font-mono text-xs whitespace-pre-wrap max-h-36 overflow-y-auto border border-slate-200">
                  {huffmanResult.decodedText}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: QUICK SORT (DIVIDE & CONQUER)                                       */}
        {/* ========================================================================= */}
        {activeTab === 'quicksort' && (
          <div className="space-y-6 animate-fade-in">
            {/* Control Bar */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <ArrowUpDown className="w-5 h-5 text-cyan-600" />
                    DAA Quick Sort: Divide-and-Conquer Ranking Engine
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    In-place Lomuto partitioning with support for 3 pivot selection strategies (Randomized, Median of Three, and Last Element) demonstrating recurrence relation T(n) = 2T(n/2) + Θ(n).
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                      Dataset:
                    </label>
                    <select
                      value={quickSortTarget}
                      onChange={(e) => setQuickSortTarget(e.target.value as any)}
                      className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none"
                    >
                      <option value="restaurants">29 Campus Restaurants</option>
                      <option value="foods">30 Little Village Dishes</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                      Sort Key:
                    </label>
                    <select
                      value={quickSortKey}
                      onChange={(e) => setQuickSortKey(e.target.value)}
                      className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none"
                    >
                      {quickSortTarget === 'restaurants' ? (
                        <>
                          <option value="rating">Customer Rating</option>
                          <option value="deliveryTime">Delivery Speed (mins)</option>
                          <option value="name">Alphabetical Name</option>
                        </>
                      ) : (
                        <>
                          <option value="price">Price (₹)</option>
                          <option value="rating">Rating</option>
                          <option value="name">Dish Name</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                      Pivot Strategy:
                    </label>
                    <select
                      value={quickSortPivot}
                      onChange={(e) => setQuickSortPivot(e.target.value as PivotStrategy)}
                      className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none ring-1 ring-cyan-500"
                    >
                      <option value="median_of_three">Median-of-Three (Balanced Partition)</option>
                      <option value="random">Randomized Pivot (Avoids Worst-Case)</option>
                      <option value="last">Last Element (Lomuto Canonical)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                      Direction:
                    </label>
                    <button
                      onClick={() => setQuickSortDirection(quickSortDirection === 'asc' ? 'desc' : 'asc')}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800"
                    >
                      {quickSortDirection === 'desc' ? 'High to Low (Desc ▾)' : 'Low to High (Asc ▴)'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Execution Statistics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                <div className="p-3 rounded-2xl bg-cyan-50 border border-cyan-100">
                  <span className="text-[11px] text-cyan-700 font-semibold block">Execution Time</span>
                  <span className="text-xl font-black text-cyan-800">{quickSortResult.executionTimeMs} ms</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-100 border border-slate-200">
                  <span className="text-[11px] text-slate-600 font-semibold block">Total Comparisons</span>
                  <span className="text-xl font-black text-slate-800">{quickSortResult.totalComparisons}</span>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <span className="text-[11px] text-emerald-600 font-semibold block">In-Place Swaps</span>
                  <span className="text-xl font-black text-emerald-700">{quickSortResult.totalSwaps}</span>
                </div>
                <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-100">
                  <span className="text-[11px] text-indigo-600 font-semibold block">Recursion Stack Depth</span>
                  <span className="text-xl font-black text-indigo-700">Level {quickSortResult.maxRecursionDepth}</span>
                </div>
              </div>
            </div>

            {/* Partition Steps Trace */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 text-sm">
                  Recursive Partition Trace Log (Divide-and-Conquer Subarray Steps)
                </h3>
                <span className="text-xs text-slate-500 font-mono">
                  {quickSortResult.partitionSteps.length} Partitions Executed
                </span>
              </div>

              <div className="overflow-x-auto max-h-72 border border-slate-200 rounded-2xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 sticky top-0 text-[10px] font-bold text-slate-600 uppercase border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Call #</th>
                      <th className="py-2.5 px-3">Depth</th>
                      <th className="py-2.5 px-3">Subarray [low .. high]</th>
                      <th className="py-2.5 px-3">Pivot Chosen</th>
                      <th className="py-2.5 px-3">Final Pivot Index</th>
                      <th className="py-2.5 px-3">Comparisons</th>
                      <th className="py-2.5 px-3">Swaps</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                    {quickSortResult.partitionSteps.map((step) => (
                      <tr key={step.step} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-bold text-slate-500">#{step.step}</td>
                        <td className="py-2 px-3 text-cyan-700 font-bold">d={step.depth}</td>
                        <td className="py-2 px-3 text-slate-700">[{step.low} .. {step.high}]</td>
                        <td className="py-2 px-3 font-bold text-orange-600">
                          {String(step.pivotValue)} (index: {step.pivotIndexChosen})
                        </td>
                        <td className="py-2 px-3 text-emerald-700 font-bold">{step.finalPivotIndex}</td>
                        <td className="py-2 px-3 text-slate-600">{step.comparisonsCount}</td>
                        <td className="py-2 px-3 text-slate-600">{step.swapsCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sorted Results Preview */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
              <h3 className="font-bold text-slate-900 text-sm mb-3">
                Final Sorted Array Output (using {quickSortPivot} pivot):
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {quickSortResult.sortedArray.map((item: any, idx: number) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-6 h-6 rounded-full bg-cyan-600 text-white text-xs font-black flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div className="truncate">
                        <h4 className="font-bold text-xs text-slate-900 truncate">{item.name}</h4>
                        <span className="text-[10px] text-slate-500 block truncate">
                          {quickSortTarget === 'restaurants' ? item.cuisines?.slice(0, 2).join(', ') : item.categoryName}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      {quickSortKey === 'rating' && (
                        <span className="font-black text-amber-500 text-xs">★ {item.rating}</span>
                      )}
                      {quickSortKey === 'deliveryTime' && (
                        <span className="font-bold text-emerald-600 text-xs">{item.deliveryTime} mins</span>
                      )}
                      {quickSortKey === 'price' && (
                        <span className="font-black text-emerald-600 text-xs">₹{item.price}</span>
                      )}
                      {quickSortKey === 'name' && (
                        <span className="font-mono text-slate-400 text-[10px]">A-Z</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
