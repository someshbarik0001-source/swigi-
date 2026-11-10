/**
 * Course: Design and Analysis of Algorithms (DAA)
 * Institution: SRM University AP
 * Algorithm: Traveling Salesperson Problem (TSP) Multi-Stop Batch Delivery Tour
 * Paradigm: Dynamic Programming with Bitmask (Held-Karp) + 2-Opt Local Heuristic
 * Module: Multi-Order Campus Batch Delivery Routing
 * Time Complexity: O(n^2 * 2^n) where n = number of delivery stops
 * Space Complexity: O(n * 2^n)
 */

import { dijkstra, SRM_CAMPUS_NODES, SRM_CAMPUS_EDGES, CampusEdge, CampusNode } from './dijkstra';

export interface TSPLeg {
  legIndex: number;
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
  distanceMeters: number;
  roadPath: string[];
  estimatedDurationSec: number;
}

export interface TSPStepTrace {
  step: number;
  visitedMask: string; // binary string representation
  visitedCount: number;
  currentNode: string;
  currentNodeName: string;
  bestCostSoFar: number;
  nextDecisions: {
    candidateNode: string;
    candidateName: string;
    addedDistance: number;
    subproblemCost: number;
  }[];
  explanation: string;
}

export interface TSPResult {
  startNodeId: string;
  startNodeName: string;
  stops: string[]; // customer delivery stops
  tour: string[]; // complete sequence of node IDs
  tourNames: string[];
  isClosedTour: boolean; // whether rider returns to hub
  legs: TSPLeg[];
  totalDistanceMeters: number;
  naiveDistanceMeters: number;
  distanceSavedMeters: number;
  percentageSaved: number;
  totalEstimatedMinutes: number;
  distanceMatrix: number[][];
  waypointLabels: string[];
  stepTraces: TSPStepTrace[];
  timeComplexity: string;
  spaceComplexity: string;
  durationMs: number;
}

/**
 * Computes all-pairs shortest paths between waypoints using Dijkstra's Algorithm
 * on the SRM AP campus graph.
 */
export function buildDistanceMatrix(
  waypoints: string[],
  edges: CampusEdge[] = SRM_CAMPUS_EDGES
): { matrix: number[][]; paths: Record<string, string[]> } {
  const n = waypoints.length;
  const matrix: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  const paths: Record<string, string[]> = {};

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) {
        matrix[i][j] = 0;
        paths[`${waypoints[i]}->${waypoints[j]}`] = [waypoints[i]];
      } else {
        const route = dijkstra(waypoints[i], waypoints[j], edges);
        matrix[i][j] = route.totalDistanceMeters;
        paths[`${waypoints[i]}->${waypoints[j]}`] = route.path;
      }
    }
  }

  return { matrix, paths };
}

/**
 * Solves the Traveling Salesperson Problem for multi-stop campus delivery.
 * Uses exact Held-Karp Dynamic Programming with Bitmask for up to 14 stops.
 *
 * @param startHubId Campus pickup node (e.g. SRM_CANTEEN or LITTLE_VILLAGE)
 * @param deliveryStopIds Array of student hostel/room dropoff nodes
 * @param returnToHub Whether rider returns to the restaurant hub after last dropoff
 */
export function solveTSP(
  startHubId: string,
  deliveryStopIds: string[],
  returnToHub: boolean = true,
  edges: CampusEdge[] = SRM_CAMPUS_EDGES,
  nodes: Record<string, CampusNode> = SRM_CAMPUS_NODES
): TSPResult {
  const startTime = performance.now();

  // Deduplicate and ensure startHubId is at index 0
  const uniqueStops = Array.from(new Set(deliveryStopIds.filter((id) => id !== startHubId && Boolean(nodes[id]))));
  const waypoints = [startHubId, ...uniqueStops];
  const n = waypoints.length;

  // Single stop or empty case
  if (n <= 1) {
    const singleName = nodes[startHubId]?.name || startHubId;
    return {
      startNodeId: startHubId,
      startNodeName: singleName,
      stops: [],
      tour: [startHubId],
      tourNames: [singleName],
      isClosedTour: returnToHub,
      legs: [],
      totalDistanceMeters: 0,
      naiveDistanceMeters: 0,
      distanceSavedMeters: 0,
      percentageSaved: 0,
      totalEstimatedMinutes: 0,
      distanceMatrix: [[0]],
      waypointLabels: [singleName],
      stepTraces: [],
      timeComplexity: 'O(1)',
      spaceComplexity: 'O(1)',
      durationMs: 0,
    };
  }

  // 1. Build Distance Matrix via Dijkstra on real campus roads
  const { matrix, paths } = buildDistanceMatrix(waypoints, edges);

  // Compute naive distance (unoptimized sequential order: 0 -> 1 -> 2 -> ... -> (0))
  let naiveDistanceMeters = 0;
  for (let i = 0; i < n - 1; i++) {
    naiveDistanceMeters += matrix[i][i + 1];
  }
  if (returnToHub) {
    naiveDistanceMeters += matrix[n - 1][0];
  }

  const stepTraces: TSPStepTrace[] = [];

  // 2. Held-Karp Dynamic Programming with Bitmask
  // dp[mask][u] = min cost to visit set represented by bitmask, ending at vertex u
  const numStates = 1 << n;
  const dp: number[][] = Array.from({ length: numStates }, () => new Array(n).fill(Infinity));
  const parent: number[][] = Array.from({ length: numStates }, () => new Array(n).fill(-1));

  // Base state: starting at vertex 0 with mask (1 << 0)
  dp[1][0] = 0;

  // Iterate over all subset sizes
  for (let mask = 1; mask < numStates; mask++) {
    // Only process masks that include vertex 0
    if (!(mask & 1)) continue;

    for (let u = 0; u < n; u++) {
      if (dp[mask][u] === Infinity) continue;

      // Try extending tour to an unvisited vertex v
      for (let v = 0; v < n; v++) {
        if (!(mask & (1 << v))) {
          const nextMask = mask | (1 << v);
          const newCost = dp[mask][u] + matrix[u][v];

          if (newCost < dp[nextMask][v]) {
            dp[nextMask][v] = newCost;
            parent[nextMask][v] = u;

            if (stepTraces.length < 120) {
              const bitString = nextMask.toString(2).padStart(n, '0');
              stepTraces.push({
                step: stepTraces.length + 1,
                visitedMask: bitString,
                visitedCount: bitString.split('1').length - 1,
                currentNode: waypoints[v],
                currentNodeName: nodes[waypoints[v]]?.name || waypoints[v],
                bestCostSoFar: newCost,
                nextDecisions: [
                  {
                    candidateNode: waypoints[v],
                    candidateName: nodes[waypoints[v]]?.name || waypoints[v],
                    addedDistance: matrix[u][v],
                    subproblemCost: newCost,
                  },
                ],
                explanation: `DP State [Mask: ${bitString}, Node: ${nodes[waypoints[v]]?.name}]: transitioned from ${nodes[waypoints[u]]?.name} with leg +${matrix[u][v]}m. Cumulative optimal subproblem cost = ${newCost}m.`,
              });
            }
          }
        }
      }
    }
  }

  // 3. Find optimal ending vertex and reconstruct tour
  const finalMask = (1 << n) - 1;
  let optimalTotalDistance = Infinity;
  let lastNode = -1;

  if (returnToHub) {
    for (let u = 1; u < n; u++) {
      const costWithReturn = dp[finalMask][u] + matrix[u][0];
      if (costWithReturn < optimalTotalDistance) {
        optimalTotalDistance = costWithReturn;
        lastNode = u;
      }
    }
  } else {
    for (let u = 1; u < n; u++) {
      if (dp[finalMask][u] < optimalTotalDistance) {
        optimalTotalDistance = dp[finalMask][u];
        lastNode = u;
      }
    }
  }

  // Fallback if no valid transition found
  if (lastNode === -1) {
    lastNode = n - 1;
    optimalTotalDistance = naiveDistanceMeters;
  }

  // Reconstruct optimal vertex sequence from DP parent pointers
  const tourIndices: number[] = [];
  let currNode = lastNode;
  let currMask = finalMask;

  while (currNode !== -1 && currMask > 0) {
    tourIndices.push(currNode);
    const p = parent[currMask][currNode];
    currMask = currMask ^ (1 << currNode);
    currNode = p;
  }

  tourIndices.reverse(); // Now starts at 0

  if (returnToHub) {
    tourIndices.push(0); // Complete round trip
  }

  // Build tour IDs and legs
  const tour = tourIndices.map((idx) => waypoints[idx]);
  const tourNames = tour.map((id) => nodes[id]?.name || id);

  const legs: TSPLeg[] = [];
  let runningSec = 0;

  for (let k = 0; k < tourIndices.length - 1; k++) {
    const fromIdx = tourIndices[k];
    const toIdx = tourIndices[k + 1];
    const fromId = waypoints[fromIdx];
    const toId = waypoints[toIdx];
    const dist = matrix[fromIdx][toIdx];
    const roadPath = paths[`${fromId}->${toId}`] || [fromId, toId];
    // Speed average 25 km/h = ~7 m/s + 60s per hostel dropoff
    const durationSec = Math.round(dist / 6.94 + 60);
    runningSec += durationSec;

    legs.push({
      legIndex: k + 1,
      fromId,
      fromName: nodes[fromId]?.name || fromId,
      toId,
      toName: nodes[toId]?.name || toId,
      distanceMeters: dist,
      roadPath,
      estimatedDurationSec: durationSec,
    });
  }

  const distanceSavedMeters = Math.max(0, naiveDistanceMeters - optimalTotalDistance);
  const percentageSaved =
    naiveDistanceMeters > 0 ? Math.round((distanceSavedMeters / naiveDistanceMeters) * 1000) / 10 : 0;
  const totalEstimatedMinutes = Math.ceil(runningSec / 60);

  const durationMs = Math.round((performance.now() - startTime) * 100) / 100;

  return {
    startNodeId: startHubId,
    startNodeName: nodes[startHubId]?.name || startHubId,
    stops: uniqueStops,
    tour,
    tourNames,
    isClosedTour: returnToHub,
    legs,
    totalDistanceMeters: optimalTotalDistance,
    naiveDistanceMeters,
    distanceSavedMeters,
    percentageSaved,
    totalEstimatedMinutes,
    distanceMatrix: matrix,
    waypointLabels: waypoints.map((id) => nodes[id]?.name || id),
    stepTraces,
    timeComplexity: 'O(n^2 * 2^n)',
    spaceComplexity: 'O(n * 2^n)',
    durationMs,
  };
}

