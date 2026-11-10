/**
 * Course: Design and Analysis of Algorithms (DAA), 2026-27
 * Institution: SRM University AP
 * Algorithm: 0/1 Knapsack (Dynamic Programming)
 * Paradigm: Dynamic Programming
 * Module: "Best Combo" Menu Optimizer
 * Time Complexity: O(n * W)
 * Space Complexity: O(n * W)
 */

export interface KnapsackItem {
  id: string;
  name: string;
  cost: number; // Weight (in ₹)
  rating: number; // Star rating (e.g., 4.8)
  value: number; // Integer optimization weight (e.g., Math.round(rating * 10))
  category: string;
  image?: string;
  isVeg: boolean;
  restaurantId?: string;
  restaurantName?: string;
}

export interface KnapsackResult {
  budget: number;
  itemCount: number;
  selectedItems: KnapsackItem[];
  totalCost: number;
  totalRatingScore: number;
  averageRating: number;
  remainingBudget: number;
  budgetUtilizationPct: number;
  // Full (n + 1) x (W + 1) table for visualizer rendering
  dpTable: number[][];
  // Subproblem step explanation for evaluator
  backtrackPath: { i: number; w: number; action: string; itemAdded?: string }[];
  timeComplexity: string;
  spaceComplexity: string;
}

/**
 * 0/1 Knapsack DP Algorithm from scratch
 * DP[i][w] = DP[i-1][w] if cost > w
 * DP[i][w] = max(DP[i-1][w], DP[i-1][w - cost] + value) if cost <= w
 */
export function solve01Knapsack(
  items: KnapsackItem[],
  budget: number
): KnapsackResult {
  const n = items.length;
  const W = Math.max(0, Math.floor(budget));

  // Initialize 2D DP table with dimension (n + 1) x (W + 1)
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(W + 1).fill(0));

  // Fill DP Table iteratively
  for (let i = 1; i <= n; i++) {
    const item = items[i - 1];
    const weight = Math.max(1, Math.round(item.cost));
    const value = item.value > 0 ? item.value : Math.round((item.rating || 4.0) * 10);

    for (let w = 0; w <= W; w++) {
      if (weight > w) {
        // Cannot include item i-1 because its cost exceeds current capacity w
        dp[i][w] = dp[i - 1][w];
      } else {
        // Choice: exclude item or include item
        const excludeVal = dp[i - 1][w];
        const includeVal = dp[i - 1][w - weight] + value;
        dp[i][w] = Math.max(excludeVal, includeVal);
      }
    }
  }

  // Backtracking step: reconstruct optimal subset of items from (n, W)
  const selectedItems: KnapsackItem[] = [];
  const backtrackPath: { i: number; w: number; action: string; itemAdded?: string }[] = [];

  let currW = W;
  for (let i = n; i > 0 && currW > 0; i--) {
    const item = items[i - 1];
    const weight = Math.max(1, Math.round(item.cost));

    // If value differs from the cell above, item i-1 was included in the optimal combo
    if (dp[i][currW] !== dp[i - 1][currW]) {
      selectedItems.push(item);
      backtrackPath.push({
        i,
        w: currW,
        action: `DP[${i}][${currW}] (${dp[i][currW]}) ≠ DP[${i - 1}][${currW}] (${dp[i - 1][currW]}) → Picked "${item.name}" (Cost: ₹${item.cost})`,
        itemAdded: item.name,
      });
      currW -= weight;
    } else {
      backtrackPath.push({
        i,
        w: currW,
        action: `DP[${i}][${currW}] == DP[${i - 1}][${currW}] (${dp[i][currW]}) → Skipped "${item.name}"`,
      });
    }
  }

  // Selected items are in reverse order of selection
  selectedItems.reverse();

  const totalCost = selectedItems.reduce((sum, item) => sum + item.cost, 0);
  const totalRatingScore = selectedItems.reduce((sum, item) => sum + item.value, 0);
  const averageRating =
    selectedItems.length > 0
      ? Number((selectedItems.reduce((sum, item) => sum + item.rating, 0) / selectedItems.length).toFixed(1))
      : 0;

  const remainingBudget = Math.max(0, budget - totalCost);
  const budgetUtilizationPct = budget > 0 ? Number(((totalCost / budget) * 100).toFixed(1)) : 0;

  return {
    budget,
    itemCount: n,
    selectedItems,
    totalCost,
    totalRatingScore,
    averageRating,
    remainingBudget,
    budgetUtilizationPct,
    dpTable: dp,
    backtrackPath,
    timeComplexity: `O(n · W) = O(${n} × ${W}) = ${n * W} operations`,
    spaceComplexity: `O(n · W) = (${n + 1}) × (${W + 1}) table cells`,
  };
}

