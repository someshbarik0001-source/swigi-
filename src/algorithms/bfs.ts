/**
 * Course: Design and Analysis of Algorithms (DAA)
 * Institution: SRM University AP
 * Algorithm: Breadth-First Search (BFS)
 * Paradigm: Graph Traversal / Queue-based Level Order
 * Module: Campus Nearby Restaurant Discovery Engine
 * Time Complexity: O(V + E)
 * Space Complexity: O(V)
 */

import { CampusNode, CampusEdge, SRM_CAMPUS_NODES, SRM_CAMPUS_EDGES } from './dijkstra';

export interface BFSStepTrace {
  step: number;
  currentNode: string;
  currentNodeName: string;
  currentLevel: number;
  queueSnapshot: string[];
  visitedSnapshot: string[];
  neighborsExplored: {
    neighborId: string;
    neighborName: string;
    isRestaurant: boolean;
    alreadyVisited: boolean;
    levelAssigned: number;
  }[];
  explanation: string;
}

export interface NearbyRestaurantBFS {
  restaurantId: string;
  nodeId: string;
  name: string;
  hops: number;
  path: string[];
  pathNodeNames: string[];
  totalDistanceMeters: number;
  category: string;
  description: string;
  deliveryTimeEstimateMin: number;
}

export interface BFSResult {
  startNodeId: string;
  startNodeName: string;
  visitedOrder: string[];
  levels: Record<string, number>;
  parents: Record<string, string | null>;
  nearbyRestaurants: NearbyRestaurantBFS[];
  stepTraces: BFSStepTrace[];
  maxHops: number;
  nodesVisitedCount: number;
  timeComplexity: string;
  spaceComplexity: string;
  durationMs: number;
}

/**
 * Builds an undirected adjacency list from campus edges.
 */
function buildGraphAdjacency(edges: CampusEdge[]): Record<string, { to: string; distance: number }[]> {
  const adj: Record<string, { to: string; distance: number }[]> = {};

  Object.keys(SRM_CAMPUS_NODES).forEach((nodeId) => {
    adj[nodeId] = [];
  });

  edges.forEach((edge) => {
    if (!adj[edge.from]) adj[edge.from] = [];
    if (!adj[edge.to]) adj[edge.to] = [];

    adj[edge.from].push({ to: edge.to, distance: edge.distanceMeters });
    adj[edge.to].push({ to: edge.from, distance: edge.distanceMeters });
  });

  return adj;
}

/**
 * Executes Breadth-First Search from startNodeId across the SRM AP campus graph.
 * Discovers nearby restaurants ranked in ascending order of hop distance (levels).
 */
export function bfsExplore(
  startNodeId: string,
  edges: CampusEdge[] = SRM_CAMPUS_EDGES,
  nodes: Record<string, CampusNode> = SRM_CAMPUS_NODES
): BFSResult {
  const startTime = performance.now();
  const adj = buildGraphAdjacency(edges);

  const visited = new Set<string>();
  const queue: string[] = [];
  const visitedOrder: string[] = [];
  const levels: Record<string, number> = {};
  const parents: Record<string, string | null> = {};
  const stepTraces: BFSStepTrace[] = [];

  // Edge distance lookup
  const edgeDistances: Record<string, number> = {};
  edges.forEach((e) => {
    edgeDistances[`${e.from}->${e.to}`] = e.distanceMeters;
    edgeDistances[`${e.to}->${e.from}`] = e.distanceMeters;
  });

  const validStart = nodes[startNodeId] ? startNodeId : 'GANGA_HOSTEL';

  // Initialize
  visited.add(validStart);
  queue.push(validStart);
  levels[validStart] = 0;
  parents[validStart] = null;

  while (queue.length > 0) {
    const currentNode = queue.shift()!;
    visitedOrder.push(currentNode);
    const currentLevel = levels[currentNode];
    const nodeInfo = nodes[currentNode] || { name: currentNode, category: 'transit' };

    const neighbors = adj[currentNode] || [];
    const neighborsExplored: BFSStepTrace['neighborsExplored'] = [];

    for (const edge of neighbors) {
      const neighborId = edge.to;
      const neighborInfo = nodes[neighborId] || { name: neighborId, category: 'transit' };
      const alreadyVisited = visited.has(neighborId);

      if (!alreadyVisited) {
        visited.add(neighborId);
        levels[neighborId] = currentLevel + 1;
        parents[neighborId] = currentNode;
        queue.push(neighborId);

        neighborsExplored.push({
          neighborId,
          neighborName: neighborInfo.name,
          isRestaurant: neighborInfo.category === 'restaurant',
          alreadyVisited: false,
          levelAssigned: currentLevel + 1,
        });
      } else {
        neighborsExplored.push({
          neighborId,
          neighborName: neighborInfo.name,
          isRestaurant: neighborInfo.category === 'restaurant',
          alreadyVisited: true,
          levelAssigned: levels[neighborId] ?? 0,
        });
      }
    }

    stepTraces.push({
      step: stepTraces.length + 1,
      currentNode,
      currentNodeName: nodeInfo.name,
      currentLevel,
      queueSnapshot: [...queue],
      visitedSnapshot: Array.from(visited),
      neighborsExplored,
      explanation: `Dequeued ${nodeInfo.name} at Level ${currentLevel}. Explored ${neighbors.length} adjacent campus pathways, enqueued ${neighborsExplored.filter((n) => !n.alreadyVisited).length} new nodes into FIFO queue.`,
    });
  }

  // Extract and rank all reachable restaurant nodes
  const nearbyRestaurants: NearbyRestaurantBFS[] = [];

  Object.keys(nodes).forEach((nodeId) => {
    const node = nodes[nodeId];
    if (node.category === 'restaurant' && visited.has(nodeId)) {
      // Reconstruct hop path
      const path: string[] = [];
      let curr: string | null = nodeId;
      while (curr !== null) {
        path.unshift(curr);
        curr = parents[curr] || null;
      }

      // Compute physical path distance
      let totalDistanceMeters = 0;
      for (let i = 0; i < path.length - 1; i++) {
        const u = path[i];
        const v = path[i + 1];
        totalDistanceMeters += edgeDistances[`${u}->${v}`] || 150;
      }

      const hops = levels[nodeId] ?? 99;
      // Estimate delivery time: baseline 10 min prep + 2 min per 150m
      const deliveryTimeEstimateMin = Math.round(10 + (totalDistanceMeters / 150) * 2);

      nearbyRestaurants.push({
        restaurantId: nodeId,
        nodeId,
        name: node.name,
        hops,
        path,
        pathNodeNames: path.map((id) => nodes[id]?.name || id),
        totalDistanceMeters,
        category: node.category,
        description: node.description,
        deliveryTimeEstimateMin,
      });
    }
  });

  // Sort restaurants primarily by hops (BFS level), secondarily by physical distance
  nearbyRestaurants.sort((a, b) => {
    if (a.hops !== b.hops) return a.hops - b.hops;
    return a.totalDistanceMeters - b.totalDistanceMeters;
  });

  const durationMs = Math.round((performance.now() - startTime) * 100) / 100;
  const maxHops = Math.max(...Object.values(levels), 0);

  return {
    startNodeId: validStart,
    startNodeName: nodes[validStart]?.name || validStart,
    visitedOrder,
    levels,
    parents,
    nearbyRestaurants,
    stepTraces,
    maxHops,
    nodesVisitedCount: visited.size,
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    durationMs,
  };
}

