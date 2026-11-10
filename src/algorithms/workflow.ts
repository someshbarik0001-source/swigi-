/**
 * Course: Design and Analysis of Algorithms (DAA)
 * Institution: SRM University AP
 * Feature: Complete Food Delivery System Workflow Engine
 *
 * Implements the 6-stage algorithmic workflow pipeline:
 * Stage 1: Customer opens website (Search restaurants and food items)
 * Stage 2: KMP (Search matching food)  ||  BFS (Find nearby restaurants)
 * Stage 3: Merge Sort (Sort restaurants by price, rating or preparation time)
 * Stage 4: Customer places an order
 * Stage 5: Dijkstra (Shortest delivery route)  ||  TSP (Multiple delivery stops)
 * Stage 6: Order delivered to customer
 */

import { kmpSearch, kmpSearchFoods, KMPSearchResult, KMPFoodMatch } from './kmp';
import { bfsExplore, BFSResult, NearbyRestaurantBFS } from './bfs';
import { mergeSort, MergeSortResult } from './mergesort';
import { dijkstra, DijkstraResult, SRM_CAMPUS_NODES, SRM_CAMPUS_EDGES } from './dijkstra';
import { solveTSP, TSPResult } from './tsp';
import { mockRestaurants } from '../data/mockRestaurants';
import { mockFoods } from '../data/mockFoods';
import { FoodItem, Restaurant } from '../types';

export interface WorkflowSimulationInput {
  searchQuery: string;
  customerHostelNode: string; // e.g., 'GANGA_HOSTEL'
  sortCriterion: 'rating' | 'price' | 'prepTime';
  deliveryMode: 'single_dijkstra' | 'multi_tsp';
  multiStops?: string[]; // for TSP batch delivery
}

export interface WorkflowSimulationResult {
  input: WorkflowSimulationInput;

  // Stage 1
  stage1: {
    status: 'completed';
    title: 'Customer opens website';
    subtitle: 'Search restaurants and food items';
    totalAvailableRestaurants: number;
    totalAvailableDishes: number;
  };

  // Stage 2: KMP + BFS
  stage2: {
    status: 'completed';
    kmp: {
      algorithm: 'KMP (Knuth-Morris-Pratt)';
      purpose: 'Search matching food';
      query: string;
      matchedFoods: KMPFoodMatch[];
      kmpTraceSample: KMPSearchResult;
      timeComplexity: 'O(N + M)';
    };
    bfs: {
      algorithm: 'BFS (Breadth-First Search)';
      purpose: 'Find nearby restaurants';
      customerLocation: string;
      customerLocationName: string;
      bfsResult: BFSResult;
      nearbyRestaurantsByHops: NearbyRestaurantBFS[];
      timeComplexity: 'O(V + E)';
    };
  };

  // Stage 3: Merge Sort
  stage3: {
    status: 'completed';
    algorithm: 'Merge Sort';
    purpose: 'Sort restaurants by price, rating or preparation time';
    sortCriterion: 'rating' | 'price' | 'prepTime';
    direction: 'asc' | 'desc';
    mergeSortResult: MergeSortResult<Restaurant>;
    topRankedRestaurant: Restaurant;
    timeComplexity: 'O(N log N)';
  };

  // Stage 4: Order Placement
  stage4: {
    status: 'completed';
    title: 'Customer places an order';
    orderId: string;
    restaurantName: string;
    itemsOrdered: string[];
    totalAmount: number;
    destinationNode: string;
    destinationName: string;
  };

  // Stage 5: Routing (Dijkstra or TSP)
  stage5: {
    status: 'completed';
    deliveryMode: 'single_dijkstra' | 'multi_tsp';
    dijkstra: {
      algorithm: 'Dijkstra';
      purpose: 'Shortest delivery route';
      sourceNode: string;
      sourceName: string;
      destNode: string;
      destName: string;
      dijkstraResult: DijkstraResult;
      timeComplexity: 'O((V + E) log V)';
    };
    tsp: {
      algorithm: 'TSP (Traveling Salesperson Problem)';
      purpose: 'Multiple delivery stops';
      hubNode: string;
      hubName: string;
      stops: string[];
      tspResult: TSPResult;
      timeComplexity: 'O(n^2 * 2^n)';
    };
  };

  // Stage 6: Delivery Completion
  stage6: {
    status: 'completed';
    title: 'Order delivered to customer';
    finalDistanceMeters: number;
    finalEstimatedMinutes: number;
    deliveredTimestamp: string;
    verifiedSignature: string;
  };

  totalPipelineRuntimeMs: number;
}

/**
 * Runs the end-to-end algorithmic workflow simulation.
 */
export function runWorkflowSimulation(input: WorkflowSimulationInput): WorkflowSimulationResult {
  const startTime = performance.now();

  // ----------------------------------------------------
  // Stage 1: Customer opens website
  // ----------------------------------------------------
  const totalAvailableRestaurants = mockRestaurants.length;
  const totalAvailableDishes = mockFoods.length;

  // ----------------------------------------------------
  // Stage 2: Parallel Algorithms (KMP & BFS)
  // ----------------------------------------------------
  // KMP: Search matching food
  const kmpMatchedFoods = kmpSearchFoods(mockFoods, input.searchQuery || 'Biryani');
  const sampleDish = mockFoods[0]?.name || 'Special Biryani';
  const kmpTraceSample = kmpSearch(sampleDish, input.searchQuery || 'Biryani');

  // BFS: Find nearby restaurants from customer's campus node
  const customerNode = input.customerHostelNode || 'GANGA_HOSTEL';
  const bfsResult = bfsExplore(customerNode);

  // ----------------------------------------------------
  // Stage 3: Merge Sort
  // Sort restaurants by price, rating or preparation time
  // ----------------------------------------------------
  let sortKeySelector: (r: Restaurant) => number;
  let sortDirection: 'asc' | 'desc' = 'desc';

  if (input.sortCriterion === 'price') {
    sortKeySelector = (r) => r.minOrder;
    sortDirection = 'asc'; // Low to high
  } else if (input.sortCriterion === 'prepTime') {
    sortKeySelector = (r) => r.deliveryTime;
    sortDirection = 'asc'; // Fastest first
  } else {
    // Default rating
    sortKeySelector = (r) => r.rating;
    sortDirection = 'desc'; // Highest rating first
  }

  const mergeSortResult = mergeSort(
    mockRestaurants,
    sortKeySelector,
    sortDirection,
    (r) => r.name,
    (r) => r.id
  );

  const topRankedRestaurant = mergeSortResult.sortedArray[0] || mockRestaurants[0];

  // ----------------------------------------------------
  // Stage 4: Customer places an order
  // ----------------------------------------------------
  const orderId = `ORD-SRM-${Math.floor(1000 + Math.random() * 9000)}`;
  const sampleItems = kmpMatchedFoods.slice(0, 2).map((m) => m.food.name);
  const totalAmount = kmpMatchedFoods.slice(0, 2).reduce((sum, m) => sum + m.food.price, 0) || 320;

  // ----------------------------------------------------
  // Stage 5: Routing (Dijkstra & TSP)
  // ----------------------------------------------------
  // Dijkstra shortest path from top restaurant / canteen to customer hostel
  const restaurantCampusNode = 'SRM_CANTEEN';
  const dijkstraResult = dijkstra(restaurantCampusNode, customerNode, SRM_CAMPUS_EDGES);

  // TSP multi-stop delivery: canteen -> customer hostel + other hostel blocks
  const defaultTspStops = input.multiStops && input.multiStops.length > 0
    ? input.multiStops
    : [customerNode, 'KRISHNA_HOSTEL', 'YAMUNA_HOSTEL', 'SAC_BUILDING'];

  const tspResult = solveTSP(restaurantCampusNode, defaultTspStops, true, SRM_CAMPUS_EDGES);

  // ----------------------------------------------------
  // Stage 6: Order delivered to customer
  // ----------------------------------------------------
  const isMulti = input.deliveryMode === 'multi_tsp';
  const finalDistanceMeters = isMulti ? tspResult.totalDistanceMeters : dijkstraResult.totalDistanceMeters;
  const finalEstimatedMinutes = isMulti ? tspResult.totalEstimatedMinutes : Math.ceil(dijkstraResult.estimatedTransitSeconds / 60);

  const totalPipelineRuntimeMs = Math.round((performance.now() - startTime) * 100) / 100;

  return {
    input,
    stage1: {
      status: 'completed',
      title: 'Customer opens website',
      subtitle: 'Search restaurants and food items',
      totalAvailableRestaurants,
      totalAvailableDishes,
    },
    stage2: {
      status: 'completed',
      kmp: {
        algorithm: 'KMP (Knuth-Morris-Pratt)',
        purpose: 'Search matching food',
        query: input.searchQuery || 'Biryani',
        matchedFoods: kmpMatchedFoods,
        kmpTraceSample,
        timeComplexity: 'O(N + M)',
      },
      bfs: {
        algorithm: 'BFS (Breadth-First Search)',
        purpose: 'Find nearby restaurants',
        customerLocation: customerNode,
        customerLocationName: SRM_CAMPUS_NODES[customerNode]?.name || customerNode,
        bfsResult,
        nearbyRestaurantsByHops: bfsResult.nearbyRestaurants,
        timeComplexity: 'O(V + E)',
      },
    },
    stage3: {
      status: 'completed',
      algorithm: 'Merge Sort',
      purpose: 'Sort restaurants by price, rating or preparation time',
      sortCriterion: input.sortCriterion,
      direction: sortDirection,
      mergeSortResult,
      topRankedRestaurant,
      timeComplexity: 'O(N log N)',
    },
    stage4: {
      status: 'completed',
      title: 'Customer places an order',
      orderId,
      restaurantName: topRankedRestaurant.name,
      itemsOrdered: sampleItems.length > 0 ? sampleItems : ['Special Chicken Biryani', 'Butter Naan'],
      totalAmount,
      destinationNode: customerNode,
      destinationName: SRM_CAMPUS_NODES[customerNode]?.name || customerNode,
    },
    stage5: {
      status: 'completed',
      deliveryMode: input.deliveryMode,
      dijkstra: {
        algorithm: 'Dijkstra',
        purpose: 'Shortest delivery route',
        sourceNode: restaurantCampusNode,
        sourceName: SRM_CAMPUS_NODES[restaurantCampusNode]?.name || restaurantCampusNode,
        destNode: customerNode,
        destName: SRM_CAMPUS_NODES[customerNode]?.name || customerNode,
        dijkstraResult,
        timeComplexity: 'O((V + E) log V)',
      },
      tsp: {
        algorithm: 'TSP (Traveling Salesperson Problem)',
        purpose: 'Multiple delivery stops',
        hubNode: restaurantCampusNode,
        hubName: SRM_CAMPUS_NODES[restaurantCampusNode]?.name || restaurantCampusNode,
        stops: defaultTspStops,
        tspResult,
        timeComplexity: 'O(n^2 * 2^n)',
      },
    },
    stage6: {
      status: 'completed',
      title: 'Order delivered to customer',
      finalDistanceMeters,
      finalEstimatedMinutes,
      deliveredTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      verifiedSignature: `SRM-AP-DELIVERY-OTP-VERIFIED-#${Math.floor(100000 + Math.random() * 900000)}`,
    },
    totalPipelineRuntimeMs,
  };
}

