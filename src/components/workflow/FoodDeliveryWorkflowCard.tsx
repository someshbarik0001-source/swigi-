import React, { useState, useMemo } from 'react';
import {
  runWorkflowSimulation,
  WorkflowSimulationInput,
  WorkflowSimulationResult,
  kmpSearch,
  bfsExplore,
  mergeSort,
  dijkstra,
  solveTSP,
  SRM_CAMPUS_NODES,
} from '../../algorithms';
import {
  Search,
  Compass,
  ArrowUpDown,
  ShoppingBag,
  Navigation,
  CheckCircle2,
  Play,
  RotateCcw,
  Sparkles,
  Info,
  ChevronDown,
  Layers,
  Zap,
  MapPin,
  Clock,
  TrendingUp,
  Cpu,
} from 'lucide-react';

interface FoodDeliveryWorkflowCardProps {
  initialSearchQuery?: string;
  initialHostel?: string;
  className?: string;
  standalone?: boolean;
}

export const FoodDeliveryWorkflowCard: React.FC<FoodDeliveryWorkflowCardProps> = ({
  initialSearchQuery = 'Biryani',
  initialHostel = 'GANGA_HOSTEL',
  className = '',
  standalone = false,
}) => {
  // Simulation Inputs
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [customerHostel, setCustomerHostel] = useState(initialHostel);
  const [sortCriterion, setSortCriterion] = useState<'rating' | 'price' | 'prepTime'>('rating');
  const [deliveryMode, setDeliveryMode] = useState<'single_dijkstra' | 'multi_tsp'>('single_dijkstra');

  // Interactive Inspection state
  const [selectedAlgo, setSelectedAlgo] = useState<'kmp' | 'bfs' | 'mergesort' | 'dijkstra' | 'tsp' | null>('kmp');
  const [animatingStep, setAnimatingStep] = useState<number | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Compute live workflow execution
  const workflowInput: WorkflowSimulationInput = useMemo(
    () => ({
      searchQuery,
      customerHostelNode: customerHostel,
      sortCriterion,
      deliveryMode,
      multiStops: [customerHostel, 'KRISHNA_HOSTEL', 'YAMUNA_HOSTEL', 'SAC_BUILDING'],
    }),
    [searchQuery, customerHostel, sortCriterion, deliveryMode]
  );

  const result: WorkflowSimulationResult = useMemo(() => {
    return runWorkflowSimulation(workflowInput);
  }, [workflowInput]);

  // Handle animated playback
  const runLivePlayback = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setAnimatingStep(1);

    const steps = [1, 2, 3, 4, 5, 6];
    steps.forEach((step, index) => {
      setTimeout(() => {
        setAnimatingStep(step);
        if (step === 2) setSelectedAlgo('kmp');
        if (step === 3) setSelectedAlgo('mergesort');
        if (step === 5) setSelectedAlgo(deliveryMode === 'single_dijkstra' ? 'dijkstra' : 'tsp');

        if (index === steps.length - 1) {
          setTimeout(() => {
            setIsSimulating(false);
          }, 800);
        }
      }, index * 750);
    });
  };

  return (
    <div className={`bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl overflow-hidden ${className}`}>
      {/* Top Header matching user diagram */}
      <div className="bg-slate-950 text-white px-6 sm:px-8 py-5 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Food Delivery System Workflow
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            DAA Core Architecture • Interactive Pipeline Linking Real-Time Algorithmic Operations
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={runLivePlayback}
            disabled={isSimulating}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
              isSimulating
                ? 'bg-orange-500 text-white animate-pulse cursor-wait'
                : 'bg-orange-500 hover:bg-orange-600 active:scale-95 text-white'
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            {isSimulating ? `Executing Step ${animatingStep}/6...` : 'Run Pipeline Simulation'}
          </button>
        </div>
      </div>

      {/* Main Grid: Visual Workflow on Left, Live Algorithmic Inspector on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-slate-800">
        {/* ======================================================== */}
        {/* LEFT COLUMN: THE WORKFLOW DIAGRAM (Exact match to image) */}
        {/* ======================================================== */}
        <div className="lg:col-span-7 p-6 sm:p-8 space-y-4 bg-slate-900/[0.02] dark:bg-slate-950/40">
          {/* Controls Bar for live parameters */}
          <div className="bg-white dark:bg-slate-800/80 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-wrap items-center gap-3 text-xs mb-6">
            <div className="flex items-center gap-1.5 min-w-[170px]">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dish (e.g. Biryani)"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-800 dark:text-slate-100 font-semibold focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={customerHostel}
                onChange={(e) => setCustomerHostel(e.target.value)}
                className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-800 dark:text-slate-100 font-semibold focus:outline-none focus:ring-1 focus:ring-orange-500"
              >
                <option value="GANGA_HOSTEL">Ganga Boys Hostel</option>
                <option value="YAMUNA_HOSTEL">Yamuna Girls Hostel</option>
                <option value="KRISHNA_HOSTEL">Krishna Boys Hostel</option>
                <option value="SAC_BUILDING">SAC Student Lounge</option>
                <option value="ACADEMIC_TIER1">Academic Block Tier-1</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortCriterion}
                onChange={(e) => setSortCriterion(e.target.value as any)}
                className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-800 dark:text-slate-100 font-semibold focus:outline-none focus:ring-1 focus:ring-orange-500"
              >
                <option value="rating">Sort: Rating (High to Low)</option>
                <option value="price">Sort: Price (Low to High)</option>
                <option value="prepTime">Sort: Prep/Delivery Time</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 ml-auto">
              <span className="text-[11px] font-bold text-slate-500">Route:</span>
              <button
                onClick={() => setDeliveryMode(deliveryMode === 'single_dijkstra' ? 'multi_tsp' : 'single_dijkstra')}
                className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-2.5 py-1 rounded-lg font-bold transition-colors"
              >
                {deliveryMode === 'single_dijkstra' ? 'Dijkstra (1 Stop)' : 'TSP (Multi-Stop)'}
              </button>
            </div>
          </div>

          {/* ======================================================== */}
          {/* STEP 1: Customer opens website                           */}
          {/* ======================================================== */}
          <div
            className={`w-full text-center py-4 px-6 rounded-2xl border transition-all duration-300 ${
              animatingStep === 1
                ? 'bg-blue-100 border-blue-400 dark:bg-blue-950/70 dark:border-blue-500 ring-2 ring-blue-400 scale-[1.01]'
                : 'bg-[#e9f2fe] dark:bg-blue-950/40 border-blue-200/80 dark:border-blue-900/60'
            }`}
          >
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
              Customer opens website
            </h3>
            <p className="text-xs text-blue-700 dark:text-blue-300 font-medium mt-0.5">
              Search restaurants and food items
            </p>
          </div>

          {/* Down Arrow */}
          <div className="flex justify-center -my-1 text-slate-400">
            <span className={`text-base font-black transition-all ${animatingStep === 1 || animatingStep === 2 ? 'text-blue-500 scale-125' : ''}`}>
              ↓
            </span>
          </div>

          {/* ======================================================== */}
          {/* STEP 2: Parallel KMP & BFS                               */}
          {/* ======================================================== */}
          <div className="grid grid-cols-2 gap-4">
            {/* KMP Card */}
            <button
              onClick={() => setSelectedAlgo('kmp')}
              className={`text-center py-4 px-4 rounded-2xl border transition-all duration-300 text-left ${
                selectedAlgo === 'kmp' || animatingStep === 2
                  ? 'ring-2 ring-emerald-500 shadow-md'
                  : 'hover:border-emerald-300 dark:hover:border-emerald-700'
              } ${
                animatingStep === 2
                  ? 'bg-emerald-100 border-emerald-400 dark:bg-emerald-950/80 dark:border-emerald-500 scale-[1.02]'
                  : 'bg-[#eaf5ed] dark:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-900/60'
              }`}
            >
              <div className="text-center">
                <div className="inline-flex items-center gap-1.5">
                  <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                    KMP
                  </span>
                  <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                    O(N+M)
                  </span>
                </div>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium mt-0.5">
                  Search matching food
                </p>
              </div>
            </button>

            {/* BFS Card */}
            <button
              onClick={() => setSelectedAlgo('bfs')}
              className={`text-center py-4 px-4 rounded-2xl border transition-all duration-300 text-left ${
                selectedAlgo === 'bfs'
                  ? 'ring-2 ring-emerald-500 shadow-md'
                  : 'hover:border-emerald-300 dark:hover:border-emerald-700'
              } ${
                animatingStep === 2
                  ? 'bg-emerald-100 border-emerald-400 dark:bg-emerald-950/80 dark:border-emerald-500 scale-[1.02]'
                  : 'bg-[#eaf5ed] dark:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-900/60'
              }`}
            >
              <div className="text-center">
                <div className="inline-flex items-center gap-1.5">
                  <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                    BFS
                  </span>
                  <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                    O(V+E)
                  </span>
                </div>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium mt-0.5">
                  Find nearby restaurants
                </p>
              </div>
            </button>
          </div>

          {/* Down Arrow */}
          <div className="flex justify-center -my-1 text-slate-400">
            <span className={`text-base font-black transition-all ${animatingStep === 2 || animatingStep === 3 ? 'text-amber-500 scale-125' : ''}`}>
              ↓
            </span>
          </div>

          {/* ======================================================== */}
          {/* STEP 3: Merge Sort                                       */}
          {/* ======================================================== */}
          <button
            onClick={() => setSelectedAlgo('mergesort')}
            className={`w-full text-center py-4 px-6 rounded-2xl border transition-all duration-300 ${
              selectedAlgo === 'mergesort' || animatingStep === 3
                ? 'ring-2 ring-amber-500 shadow-md'
                : 'hover:border-amber-300 dark:hover:border-amber-700'
            } ${
              animatingStep === 3
                ? 'bg-amber-100 border-amber-400 dark:bg-amber-950/80 dark:border-amber-500 scale-[1.01]'
                : 'bg-[#fef1e5] dark:bg-amber-950/40 border-amber-200/80 dark:border-amber-900/60'
            }`}
          >
            <div className="inline-flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                Merge Sort
              </span>
              <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-200">
                O(N log N)
              </span>
            </div>
            <p className="text-xs text-amber-800 dark:text-amber-300 font-medium mt-0.5">
              Sort restaurants by price, rating or preparation time
            </p>
          </button>

          {/* Down Arrow */}
          <div className="flex justify-center -my-1 text-slate-400">
            <span className={`text-base font-black transition-all ${animatingStep === 3 || animatingStep === 4 ? 'text-blue-500 scale-125' : ''}`}>
              ↓
            </span>
          </div>

          {/* ======================================================== */}
          {/* STEP 4: Customer places an order                         */}
          {/* ======================================================== */}
          <div
            className={`w-full text-center py-4 px-6 rounded-2xl border transition-all duration-300 ${
              animatingStep === 4
                ? 'bg-blue-100 border-blue-400 dark:bg-blue-950/70 dark:border-blue-500 ring-2 ring-blue-400 scale-[1.01]'
                : 'bg-[#e9f2fe] dark:bg-blue-950/40 border-blue-200/80 dark:border-blue-900/60'
            }`}
          >
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
              Customer places an order
            </h3>
          </div>

          {/* Down Arrow */}
          <div className="flex justify-center -my-1 text-slate-400">
            <span className={`text-base font-black transition-all ${animatingStep === 4 || animatingStep === 5 ? 'text-purple-500 scale-125' : ''}`}>
              ↓
            </span>
          </div>

          {/* ======================================================== */}
          {/* STEP 5: Parallel Dijkstra & TSP                          */}
          {/* ======================================================== */}
          <div className="grid grid-cols-2 gap-4">
            {/* Dijkstra Card */}
            <button
              onClick={() => {
                setSelectedAlgo('dijkstra');
                setDeliveryMode('single_dijkstra');
              }}
              className={`text-center py-4 px-4 rounded-2xl border transition-all duration-300 text-left ${
                selectedAlgo === 'dijkstra'
                  ? 'ring-2 ring-purple-500 shadow-md'
                  : 'hover:border-purple-300 dark:hover:border-purple-700'
              } ${
                animatingStep === 5 && deliveryMode === 'single_dijkstra'
                  ? 'bg-purple-100 border-purple-400 dark:bg-purple-950/80 dark:border-purple-500 scale-[1.02]'
                  : 'bg-[#f3edf9] dark:bg-purple-950/40 border-purple-200/80 dark:border-purple-900/60'
              }`}
            >
              <div className="text-center">
                <div className="inline-flex items-center gap-1.5">
                  <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                    Dijkstra
                  </span>
                  <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                    O((V+E)logV)
                  </span>
                </div>
                <p className="text-xs text-purple-700 dark:text-purple-300 font-medium mt-0.5">
                  Shortest delivery route
                </p>
              </div>
            </button>

            {/* TSP Card */}
            <button
              onClick={() => {
                setSelectedAlgo('tsp');
                setDeliveryMode('multi_tsp');
              }}
              className={`text-center py-4 px-4 rounded-2xl border transition-all duration-300 text-left ${
                selectedAlgo === 'tsp'
                  ? 'ring-2 ring-purple-500 shadow-md'
                  : 'hover:border-purple-300 dark:hover:border-purple-700'
              } ${
                animatingStep === 5 && deliveryMode === 'multi_tsp'
                  ? 'bg-purple-100 border-purple-400 dark:bg-purple-950/80 dark:border-purple-500 scale-[1.02]'
                  : 'bg-[#f3edf9] dark:bg-purple-950/40 border-purple-200/80 dark:border-purple-900/60'
              }`}
            >
              <div className="text-center">
                <div className="inline-flex items-center gap-1.5">
                  <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                    TSP
                  </span>
                  <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                    O(n² 2ⁿ)
                  </span>
                </div>
                <p className="text-xs text-purple-700 dark:text-purple-300 font-medium mt-0.5">
                  Multiple delivery stops
                </p>
              </div>
            </button>
          </div>

          {/* Down Arrow */}
          <div className="flex justify-center -my-1 text-slate-400">
            <span className={`text-base font-black transition-all ${animatingStep === 5 || animatingStep === 6 ? 'text-emerald-500 scale-125' : ''}`}>
              ↓
            </span>
          </div>

          {/* ======================================================== */}
          {/* STEP 6: Order delivered to customer                      */}
          {/* ======================================================== */}
          <div
            className={`w-full text-center py-4 px-6 rounded-2xl border transition-all duration-300 ${
              animatingStep === 6
                ? 'bg-emerald-100 border-emerald-400 dark:bg-emerald-950/80 dark:border-emerald-500 ring-2 ring-emerald-500 scale-[1.01]'
                : 'bg-[#eaf5ed] dark:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-900/60'
            }`}
          >
            <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-600 text-white mb-1 shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
              Order delivered to customer
            </h3>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: INTERACTIVE ALGORITHM INSPECTOR & EVIDENCE */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-white dark:bg-slate-900">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">
                  Real-time Algorithm Inspector
                </span>
                <h4 className="text-lg font-black text-slate-900 dark:text-white capitalize">
                  {selectedAlgo === 'kmp' && 'KMP: Pattern Matching'}
                  {selectedAlgo === 'bfs' && 'BFS: Level-Order Exploration'}
                  {selectedAlgo === 'mergesort' && 'Merge Sort: Divide & Conquer'}
                  {selectedAlgo === 'dijkstra' && "Dijkstra's Shortest Path"}
                  {selectedAlgo === 'tsp' && 'TSP: Held-Karp Multi-Stop DP'}
                </h4>
              </div>

              {/* Algorithm Quick Switcher Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                {(['kmp', 'bfs', 'mergesort', 'dijkstra', 'tsp'] as const).map((key) => (
                  <button
                    key={key}
                    onClick={() => setSelectedAlgo(key)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${
                      selectedAlgo === key
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {key}
                  </button>
                ))}
              </div>
            </div>

            {/* TAB CONTENT: KMP */}
            {selectedAlgo === 'kmp' && (
              <div className="mt-5 space-y-4">
                <div className="bg-emerald-50 dark:bg-emerald-950/30 p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-900 dark:text-emerald-200">
                  <p className="font-bold">Knuth-Morris-Pratt (KMP) Algorithm</p>
                  <p className="text-[11px] mt-1 text-emerald-800 dark:text-emerald-300">
                    Precomputes the Longest Proper Prefix which is also Suffix (LPS/π) array to search for food items without backtracking the text index.
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    LPS Table for Query: "{result.stage2.kmp.query}"
                  </span>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-center text-xs border border-slate-200 dark:border-slate-700 rounded-lg">
                      <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        <tr>
                          <th className="px-2 py-1 border-r border-slate-200 dark:border-slate-700">Char</th>
                          {result.stage2.kmp.query.split('').map((c, i) => (
                            <th key={i} className="px-2 py-1 border-r border-slate-200 dark:border-slate-700 font-mono">
                              {c}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="bg-white dark:bg-slate-900 font-mono">
                          <td className="px-2 py-1 border-r border-slate-200 dark:border-slate-700 font-bold text-slate-500">π[i]</td>
                          {result.stage2.kmp.kmpTraceSample.lpsArray.map((val, i) => (
                            <td key={i} className="px-2 py-1 border-r border-slate-200 dark:border-slate-700 font-bold text-emerald-600 dark:text-emerald-400">
                              {val}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      Top Food Matches ({result.stage2.kmp.matchedFoods.length} items found)
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      Comparisons: {result.stage2.kmp.kmpTraceSample.comparisonsCount} (Saved {result.stage2.kmp.kmpTraceSample.comparisonsSaved})
                    </span>
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {result.stage2.kmp.matchedFoods.slice(0, 4).map((match, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            {match.food.name}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            {match.food.restaurantName} • ₹{match.food.price}
                          </p>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                          Matched via {match.matchedField}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: BFS */}
            {selectedAlgo === 'bfs' && (
              <div className="mt-5 space-y-4">
                <div className="bg-emerald-50 dark:bg-emerald-950/30 p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-900 dark:text-emerald-200">
                  <p className="font-bold">Breadth-First Search (BFS) Traversal</p>
                  <p className="text-[11px] mt-1 text-emerald-800 dark:text-emerald-300">
                    Discovers campus dining outlets in radial wave order (level 1, level 2, etc.) from the customer's selected hostel.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Start Node</span>
                    <span className="font-bold text-slate-900 dark:text-white truncate block">
                      {result.stage2.bfs.customerLocationName}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Total Visited</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {result.stage2.bfs.bfsResult.nodesVisitedCount} Campus Vertices
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Discovered Campus Restaurants By BFS Hops
                  </span>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {result.stage2.bfs.nearbyRestaurantsByHops.map((r, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-4 h-4 rounded-full bg-emerald-500 text-white text-[10px] font-black flex items-center justify-center">
                              {r.hops}
                            </span>
                            <p className="text-xs font-bold text-slate-900 dark:text-white">
                              {r.name}
                            </p>
                          </div>
                          <p className="text-[10px] text-slate-500 ml-5.5">
                            Path: {r.pathNodeNames.join(' → ')}
                          </p>
                        </div>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          {r.totalDistanceMeters}m
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: MERGE SORT */}
            {selectedAlgo === 'mergesort' && (
              <div className="mt-5 space-y-4">
                <div className="bg-amber-50 dark:bg-amber-950/30 p-3.5 rounded-xl border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200">
                  <p className="font-bold">Merge Sort (Divide & Conquer)</p>
                  <p className="text-[11px] mt-1 text-amber-800 dark:text-amber-300">
                    Guarantees stable O(N log N) ordering across all customer filters (price, rating, prep time) without quadratic degradation.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Sorted By</span>
                    <span className="font-bold text-slate-900 dark:text-white capitalize">
                      {result.stage3.sortCriterion}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Comparisons</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">
                      {result.stage3.mergeSortResult.comparisonCount}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Tree Depth</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {result.stage3.mergeSortResult.recursionDepth} Levels
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Ranked Restaurant Stream
                  </span>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {result.stage3.mergeSortResult.sortedArray.slice(0, 4).map((rest, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-amber-600">#{i + 1}</span>
                          <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white">
                              {rest.name}
                            </p>
                            <p className="text-[10px] text-slate-500">
                              ⭐ {rest.rating} • {rest.deliveryTime} mins • Min ₹{rest.minOrder}
                            </p>
                          </div>
                        </div>
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                          {sortCriterion === 'rating' && `⭐ ${rest.rating}`}
                          {sortCriterion === 'price' && `₹${rest.minOrder}`}
                          {sortCriterion === 'prepTime' && `${rest.deliveryTime}m`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: DIJKSTRA */}
            {selectedAlgo === 'dijkstra' && (
              <div className="mt-5 space-y-4">
                <div className="bg-purple-50 dark:bg-purple-950/30 p-3.5 rounded-xl border border-purple-200 dark:border-purple-900 text-xs text-purple-900 dark:text-purple-200">
                  <p className="font-bold">Dijkstra's Algorithm (Greedy Routing)</p>
                  <p className="text-[11px] mt-1 text-purple-800 dark:text-purple-300">
                    Finds the single-destination shortest delivery route over the SRM AP campus road network with priority min-heap relaxation.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Shortest Distance</span>
                    <span className="font-bold text-purple-700 dark:text-purple-400 text-sm">
                      {result.stage5.dijkstra.dijkstraResult.totalDistanceMeters} meters
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Transit Estimate</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      {Math.ceil(result.stage5.dijkstra.dijkstraResult.estimatedTransitSeconds / 60)} mins
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Optimal Waypoint Traversal
                  </span>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-xs space-y-1.5">
                    {result.stage5.dijkstra.dijkstraResult.path.map((nodeId, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 font-bold text-[10px] flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {SRM_CAMPUS_NODES[nodeId]?.name || nodeId}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: TSP */}
            {selectedAlgo === 'tsp' && (
              <div className="mt-5 space-y-4">
                <div className="bg-purple-50 dark:bg-purple-950/30 p-3.5 rounded-xl border border-purple-200 dark:border-purple-900 text-xs text-purple-900 dark:text-purple-200">
                  <p className="font-bold">Traveling Salesperson Problem (TSP)</p>
                  <p className="text-[11px] mt-1 text-purple-800 dark:text-purple-300">
                    Solves multi-order batch delivery for a delivery rider visiting multiple hostel stops in minimal tour distance via Held-Karp dynamic programming.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Optimal Tour</span>
                    <span className="font-bold text-purple-700 dark:text-purple-400">
                      {result.stage5.tsp.tspResult.totalDistanceMeters}m
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Naive Order</span>
                    <span className="font-bold text-slate-500 line-through">
                      {result.stage5.tsp.tspResult.naiveDistanceMeters}m
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Distance Saved</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {result.stage5.tsp.tspResult.percentageSaved}%
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Batch Delivery Tour Sequence ({result.stage5.tsp.tspResult.tour.length} Stops)
                  </span>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {result.stage5.tsp.tspResult.legs.map((leg, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between text-xs"
                      >
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-200">
                            Leg {leg.legIndex}: {leg.fromName.split(' ')[0]} → {leg.toName.split(' ')[0]}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            Road segment: {leg.distanceMeters}m (~{Math.round(leg.estimatedDurationSec / 60)} min)
                          </p>
                        </div>
                        <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                          +{leg.distanceMeters}m
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Execution Bar */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Full Pipeline Runtime: <strong className="text-slate-800 dark:text-slate-200">{result.totalPipelineRuntimeMs}ms</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span className="font-mono text-[11px]">{result.stage6.verifiedSignature.slice(0, 22)}...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

