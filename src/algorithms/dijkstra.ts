/**
 * Course: Design and Analysis of Algorithms (DAA), 2026-27
 * Institution: SRM University AP
 * Algorithm: Dijkstra's Shortest Path Algorithm
 * Paradigm: Greedy / Graph
 * Module: Campus Delivery Routing
 * Time Complexity: O((V + E) log V)
 * Space Complexity: O(V)
 */

export interface CampusNode {
  id: string;
  name: string;
  category: 'restaurant' | 'hostel' | 'academic' | 'transit' | 'landmark';
  x: number; // Campus map coordinate (px)
  y: number; // Campus map coordinate (px)
  description: string;
}

export interface CampusEdge {
  from: string;
  to: string;
  distanceMeters: number;
  roadType: 'paved' | 'walking_path' | 'main_avenue' | 'service_lane';
  speedKmh: number; // Average delivery bike / EV speed
}

export interface DijkstraStepTrace {
  step: number;
  currentNode: string;
  currentNodeName: string;
  edgeEvaluated: {
    from: string;
    to: string;
    toName: string;
    weight: number;
  } | null;
  oldDistance: number;
  newDistance: number;
  relaxed: boolean;
  minHeapState: { node: string; priority: number }[];
  explanation: string;
}

export interface DijkstraResult {
  source: string;
  destination: string;
  path: string[];
  pathNodeNames: string[];
  totalDistanceMeters: number;
  estimatedTransitSeconds: number;
  distances: Record<string, number>;
  previous: Record<string, string | null>;
  stepTraces: DijkstraStepTrace[];
  visitedNodesCount: number;
  edgesRelaxedCount: number;
  timeComplexity: string;
  spaceComplexity: string;
}

/**
 * Custom MinHeap implementation from scratch.
 * No external heapq or library dependencies.
 * Satisfies parent(i) = floor((i - 1) / 2), left = 2i + 1, right = 2i + 2.
 */
export class MinHeap<T> {
  private heap: { item: T; priority: number }[] = [];

  constructor() {}

  public size(): number {
    return this.heap.length;
  }

  public isEmpty(): boolean {
    return this.heap.length === 0;
  }

  public insert(item: T, priority: number): void {
    this.heap.push({ item, priority });
    this.siftUp(this.heap.length - 1);
  }

  public extractMin(): { item: T; priority: number } | null {
    if (this.isEmpty()) return null;
    const min = this.heap[0];
    const last = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.siftDown(0);
    }
    return min;
  }

  public getSnapshot(): { node: string; priority: number }[] {
    return this.heap.map((entry) => ({
      node: String(entry.item),
      priority: Math.round(entry.priority),
    }));
  }

  private siftUp(index: number): void {
    let current = index;
    while (current > 0) {
      const parent = Math.floor((current - 1) / 2);
      if (this.heap[current].priority < this.heap[parent].priority) {
        // Swap
        const temp = this.heap[current];
        this.heap[current] = this.heap[parent];
        this.heap[parent] = temp;
        current = parent;
      } else {
        break;
      }
    }
  }

  private siftDown(index: number): void {
    let current = index;
    const length = this.heap.length;

    while (true) {
      const left = 2 * current + 1;
      const right = 2 * current + 2;
      let smallest = current;

      if (left < length && this.heap[left].priority < this.heap[smallest].priority) {
        smallest = left;
      }
      if (right < length && this.heap[right].priority < this.heap[smallest].priority) {
        smallest = right;
      }

      if (smallest !== current) {
        // Swap
        const temp = this.heap[current];
        this.heap[current] = this.heap[smallest];
        this.heap[smallest] = temp;
        current = smallest;
      } else {
        break;
      }
    }
  }
}

/**
 * SRM University AP Campus Graph Nodes
 */
export const SRM_CAMPUS_NODES: Record<string, CampusNode> = {
  SRM_CANTEEN: {
    id: 'SRM_CANTEEN',
    name: 'Central Food Court Complex',
    category: 'restaurant',
    x: 430,
    y: 290,
    description: 'Central dining complex housing multiple university eateries',
  },
  LITTLE_VILLAGE: {
    id: 'LITTLE_VILLAGE',
    name: 'Hotel Little Village (R001)',
    category: 'restaurant',
    x: 110,
    y: 200,
    description: 'Authentic Andhra & North Indian campus partner restaurant',
  },
  MAGGI_HOTSPOT: {
    id: 'MAGGI_HOTSPOT',
    name: 'Late-Night Maggi Hotspot',
    category: 'restaurant',
    x: 370,
    y: 180,
    description: '24/7 student late-night noodles and snack corner',
  },
  AMUL_PARLOUR: {
    id: 'AMUL_PARLOUR',
    name: 'Amul Ice Cream & Dairy Hub',
    category: 'restaurant',
    x: 520,
    y: 350,
    description: 'Dairy snacks, shakes, and cold beverages station',
  },
  BAKERY_CAFE: {
    id: 'BAKERY_CAFE',
    name: 'Campus Artisan Bakery Corner',
    category: 'restaurant',
    x: 310,
    y: 330,
    description: 'Fresh rolls, puffs, and artisanal coffee kiosk',
  },
  GANGA_HOSTEL: {
    id: 'GANGA_HOSTEL',
    name: 'Ganga Boys Hostel (Blocks 1-4)',
    category: 'hostel',
    x: 710,
    y: 130,
    description: 'Primary residential block for male undergraduate students',
  },
  YAMUNA_HOSTEL: {
    id: 'YAMUNA_HOSTEL',
    name: 'Yamuna Girls Hostel (Towers A & B)',
    category: 'hostel',
    x: 740,
    y: 410,
    description: 'Primary residential block for female undergraduate students',
  },
  KRISHNA_HOSTEL: {
    id: 'KRISHNA_HOSTEL',
    name: 'Krishna Boys Hostel',
    category: 'hostel',
    x: 640,
    y: 220,
    description: 'Senior boys residential hall',
  },
  SAC_BUILDING: {
    id: 'SAC_BUILDING',
    name: 'Student Activity Centre (SAC)',
    category: 'academic',
    x: 370,
    y: 220,
    description: 'Clubs, cultural events, student lounges, and recreation',
  },
  ACADEMIC_TIER1: {
    id: 'ACADEMIC_TIER1',
    name: 'Academic Block Tier-1 Reception',
    category: 'academic',
    x: 270,
    y: 260,
    description: 'Lecture halls, computer labs, and department offices',
  },
  LIBRARY_PLAZA: {
    id: 'LIBRARY_PLAZA',
    name: 'Central Library Plaza',
    category: 'landmark',
    x: 320,
    y: 140,
    description: '4-story modern campus library and quiet study zones',
  },
  MAIN_GATE1: {
    id: 'MAIN_GATE1',
    name: 'Campus Main Gate 1 Security',
    category: 'transit',
    x: 60,
    y: 360,
    description: 'Primary campus entrance on Mangalagiri-Amaravati road',
  },
  GATE2_CIRCLE: {
    id: 'GATE2_CIRCLE',
    name: 'Transit Circle Gate 2',
    category: 'transit',
    x: 840,
    y: 280,
    description: 'East gate pickup and auto-rickshaw transit circle',
  },
  SPORTS_COMPLEX: {
    id: 'SPORTS_COMPLEX',
    name: 'University Indoor Sports Arena',
    category: 'landmark',
    x: 580,
    y: 460,
    description: 'Badminton, gymnasium, and basketball courts',
  },
};

/**
 * SRM University AP Campus Interconnected Road Graph G = (V, E)
 * Bidirectional edges with accurate campus road measurements (in meters)
 */
export const SRM_CAMPUS_EDGES: CampusEdge[] = [
  // Outer Gate 1 connections
  { from: 'MAIN_GATE1', to: 'LITTLE_VILLAGE', distanceMeters: 190, roadType: 'main_avenue', speedKmh: 30 },
  { from: 'MAIN_GATE1', to: 'ACADEMIC_TIER1', distanceMeters: 280, roadType: 'main_avenue', speedKmh: 25 },
  { from: 'MAIN_GATE1', to: 'BAKERY_CAFE', distanceMeters: 240, roadType: 'paved', speedKmh: 20 },

  // Little Village connections
  { from: 'LITTLE_VILLAGE', to: 'LIBRARY_PLAZA', distanceMeters: 220, roadType: 'paved', speedKmh: 25 },
  { from: 'LITTLE_VILLAGE', to: 'ACADEMIC_TIER1', distanceMeters: 170, roadType: 'main_avenue', speedKmh: 25 },

  // Academic Core
  { from: 'ACADEMIC_TIER1', to: 'LIBRARY_PLAZA', distanceMeters: 140, roadType: 'walking_path', speedKmh: 15 },
  { from: 'ACADEMIC_TIER1', to: 'BAKERY_CAFE', distanceMeters: 90, roadType: 'paved', speedKmh: 20 },
  { from: 'ACADEMIC_TIER1', to: 'SAC_BUILDING', distanceMeters: 110, roadType: 'paved', speedKmh: 20 },

  // Library & SAC & Maggi
  { from: 'LIBRARY_PLAZA', to: 'MAGGI_HOTSPOT', distanceMeters: 80, roadType: 'walking_path', speedKmh: 15 },
  { from: 'SAC_BUILDING', to: 'MAGGI_HOTSPOT', distanceMeters: 50, roadType: 'walking_path', speedKmh: 15 },
  { from: 'SAC_BUILDING', to: 'SRM_CANTEEN', distanceMeters: 120, roadType: 'main_avenue', speedKmh: 25 },

  // Bakery to Food Court
  { from: 'BAKERY_CAFE', to: 'SRM_CANTEEN', distanceMeters: 130, roadType: 'main_avenue', speedKmh: 25 },
  { from: 'BAKERY_CAFE', to: 'AMUL_PARLOUR', distanceMeters: 200, roadType: 'paved', speedKmh: 20 },

  // Central Food Court connections
  { from: 'SRM_CANTEEN', to: 'AMUL_PARLOUR', distanceMeters: 80, roadType: 'paved', speedKmh: 20 },
  { from: 'SRM_CANTEEN', to: 'KRISHNA_HOSTEL', distanceMeters: 220, roadType: 'main_avenue', speedKmh: 25 },
  { from: 'SRM_CANTEEN', to: 'GANGA_HOSTEL', distanceMeters: 310, roadType: 'main_avenue', speedKmh: 30 },

  // Hostels interconnects
  { from: 'KRISHNA_HOSTEL', to: 'GANGA_HOSTEL', distanceMeters: 110, roadType: 'paved', speedKmh: 20 },
  { from: 'KRISHNA_HOSTEL', to: 'GATE2_CIRCLE', distanceMeters: 210, roadType: 'main_avenue', speedKmh: 30 },
  { from: 'GANGA_HOSTEL', to: 'GATE2_CIRCLE', distanceMeters: 180, roadType: 'main_avenue', speedKmh: 30 },

  // South Wing: Sports & Yamuna
  { from: 'AMUL_PARLOUR', to: 'SPORTS_COMPLEX', distanceMeters: 140, roadType: 'paved', speedKmh: 20 },
  { from: 'AMUL_PARLOUR', to: 'YAMUNA_HOSTEL', distanceMeters: 230, roadType: 'main_avenue', speedKmh: 25 },
  { from: 'SPORTS_COMPLEX', to: 'YAMUNA_HOSTEL', distanceMeters: 160, roadType: 'paved', speedKmh: 20 },
  { from: 'YAMUNA_HOSTEL', to: 'GATE2_CIRCLE', distanceMeters: 170, roadType: 'main_avenue', speedKmh: 25 },
];

/**
 * Builds adjacency list representation from undirected edges
 */
export function buildAdjacencyList(edges: CampusEdge[]): Record<string, { to: string; distance: number; speed: number }[]> {
  const adj: Record<string, { to: string; distance: number; speed: number }[]> = {};

  Object.keys(SRM_CAMPUS_NODES).forEach((nodeId) => {
    adj[nodeId] = [];
  });

  edges.forEach((edge) => {
    // Negative edge protection (DAA specification requirement)
    if (edge.distanceMeters < 0) {
      throw new Error(`Dijkstra invariant violated: negative edge weight ${edge.distanceMeters} detected`);
    }

    if (!adj[edge.from]) adj[edge.from] = [];
    if (!adj[edge.to]) adj[edge.to] = [];

    adj[edge.from].push({ to: edge.to, distance: edge.distanceMeters, speed: edge.speedKmh });
    adj[edge.to].push({ to: edge.from, distance: edge.distanceMeters, speed: edge.speedKmh });
  });

  return adj;
}

/**
 * Dijkstra's Shortest Path Algorithm
 * Implements scratch MinHeap, edge relaxation, early exit, and step tracing.
 */
export function dijkstra(
  sourceId: string,
  destId: string,
  customEdges: CampusEdge[] = SRM_CAMPUS_EDGES
): DijkstraResult {
  const adj = buildAdjacencyList(customEdges);
  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const visited = new Set<string>();
  const stepTraces: DijkstraStepTrace[] = [];

  const minHeap = new MinHeap<string>();

  // Initialize distance table: d[v] = Infinity, pi[v] = null
  Object.keys(SRM_CAMPUS_NODES).forEach((nodeId) => {
    distances[nodeId] = Infinity;
    previous[nodeId] = null;
  });

  // Source initialization: d[s] = 0
  distances[sourceId] = 0;
  minHeap.insert(sourceId, 0);

  let stepCounter = 1;
  let edgesRelaxedCount = 0;

  stepTraces.push({
    step: stepCounter++,
    currentNode: sourceId,
    currentNodeName: SRM_CAMPUS_NODES[sourceId]?.name || sourceId,
    edgeEvaluated: null,
    oldDistance: 0,
    newDistance: 0,
    relaxed: true,
    minHeapState: minHeap.getSnapshot(),
    explanation: `Initialized source node "${SRM_CAMPUS_NODES[sourceId]?.name || sourceId}" with d[s] = 0. Enqueued to MinHeap.`,
  });

  while (!minHeap.isEmpty()) {
    const extracted = minHeap.extractMin();
    if (!extracted) break;

    const u = extracted.item;
    const currentDist = extracted.priority;

    // Skip if we already visited with a shorter distance
    if (visited.has(u)) continue;
    visited.add(u);

    // Early exit optimization (DAA spec section 2.2):
    // When destination is dequeued from MinHeap, its shortest path is guaranteed.
    if (u === destId) {
      stepTraces.push({
        step: stepCounter++,
        currentNode: u,
        currentNodeName: SRM_CAMPUS_NODES[u]?.name || u,
        edgeEvaluated: null,
        oldDistance: currentDist,
        newDistance: currentDist,
        relaxed: false,
        minHeapState: minHeap.getSnapshot(),
        explanation: `Destination node "${SRM_CAMPUS_NODES[u]?.name || u}" extracted from MinHeap with guaranteed shortest distance ${currentDist}m. Early exit triggered!`,
      });
      break;
    }

    const neighbors = adj[u] || [];
    for (const edge of neighbors) {
      const v = edge.to;
      const weight = edge.distance;

      if (visited.has(v)) continue;

      const oldDist = distances[v];
      const tentative = currentDist + weight;

      // Edge relaxation step: if d[u] + w(u, v) < d[v] => d[v] = d[u] + w(u, v), pi[v] = u
      if (tentative < oldDist) {
        distances[v] = tentative;
        previous[v] = u;
        edgesRelaxedCount++;
        minHeap.insert(v, tentative);

        stepTraces.push({
          step: stepCounter++,
          currentNode: u,
          currentNodeName: SRM_CAMPUS_NODES[u]?.name || u,
          edgeEvaluated: {
            from: u,
            to: v,
            toName: SRM_CAMPUS_NODES[v]?.name || v,
            weight,
          },
          oldDistance: oldDist === Infinity ? -1 : oldDist,
          newDistance: tentative,
          relaxed: true,
          minHeapState: minHeap.getSnapshot(),
          explanation: `Relaxed edge (${SRM_CAMPUS_NODES[u]?.name} → ${SRM_CAMPUS_NODES[v]?.name}): ${currentDist}m + ${weight}m = ${tentative}m < ${
            oldDist === Infinity ? '∞' : oldDist + 'm'
          }. Updated d[${v}] and parent pointer.`,
        });
      } else {
        stepTraces.push({
          step: stepCounter++,
          currentNode: u,
          currentNodeName: SRM_CAMPUS_NODES[u]?.name || u,
          edgeEvaluated: {
            from: u,
            to: v,
            toName: SRM_CAMPUS_NODES[v]?.name || v,
            weight,
          },
          oldDistance: oldDist,
          newDistance: oldDist,
          relaxed: false,
          minHeapState: minHeap.getSnapshot(),
          explanation: `Evaluated edge (${SRM_CAMPUS_NODES[u]?.name} → ${SRM_CAMPUS_NODES[v]?.name}): ${currentDist}m + ${weight}m = ${tentative}m ≥ ${oldDist}m. No relaxation needed.`,
        });
      }
    }
  }

  // Reconstruct shortest path by backtracking previous pointers
  const path: string[] = [];
  let curr: string | null = destId;

  if (distances[destId] !== Infinity) {
    while (curr !== null) {
      path.unshift(curr);
      curr = previous[curr];
    }
  }

  const pathNodeNames = path.map((id) => SRM_CAMPUS_NODES[id]?.name || id);
  const totalDistanceMeters = distances[destId] === Infinity ? 0 : distances[destId];
  // Calculate estimated transit seconds at average campus electric bike speed of 22 km/h (~6.1 m/s) + 60s security check
  const estimatedTransitSeconds = Math.round((totalDistanceMeters / 6.1) + 60);

  return {
    source: sourceId,
    destination: destId,
    path,
    pathNodeNames,
    totalDistanceMeters,
    estimatedTransitSeconds,
    distances,
    previous,
    stepTraces,
    visitedNodesCount: visited.size,
    edgesRelaxedCount,
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V)',
  };
}

