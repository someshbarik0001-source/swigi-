/**
 * Course: Design and Analysis of Algorithms (DAA), 2026-27
 * Institution: SRM University AP
 * Algorithm: Quick Sort (Divide and Conquer)
 * Paradigm: Divide & Conquer
 * Module: Cafeteria & Dish Ranking
 * Time Complexity: Avg O(n log n), Worst O(n^2)
 * Space Complexity: O(log n) stack depth
 */

export type PivotStrategy = 'random' | 'median_of_three' | 'last';

export interface QuickSortPartitionStep {
  step: number;
  depth: number;
  low: number;
  high: number;
  pivotStrategy: PivotStrategy;
  pivotIndexChosen: number;
  pivotValue: number | string;
  finalPivotIndex: number;
  comparisonsCount: number;
  swapsCount: number;
  sliceElementsBefore: string[];
  sliceElementsAfter: string[];
}

export interface QuickSortResult<T> {
  sortedArray: T[];
  totalComparisons: number;
  totalSwaps: number;
  executionTimeMs: number;
  maxRecursionDepth: number;
  pivotStrategy: PivotStrategy;
  partitionSteps: QuickSortPartitionStep[];
  timeComplexity: string;
  spaceComplexity: string;
}

/**
 * Quick Sort with In-Place Partitioning & Multiple Pivot Strategies
 */
export function quickSort<T>(
  inputArray: T[],
  keyExtractor: (item: T) => number | string,
  direction: 'asc' | 'desc' = 'asc',
  pivotStrategy: PivotStrategy = 'median_of_three'
): QuickSortResult<T> {
  const startTime = performance.now();
  const arr: T[] = [...inputArray];
  const partitionSteps: QuickSortPartitionStep[] = [];

  let totalComparisons = 0;
  let totalSwaps = 0;
  let maxRecursionDepth = 0;
  let stepCounter = 1;

  function swap(i: number, j: number) {
    if (i === j) return;
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
    totalSwaps++;
  }

  function compare(a: T, b: T): number {
    totalComparisons++;
    const keyA = keyExtractor(a);
    const keyB = keyExtractor(b);

    if (keyA < keyB) return direction === 'asc' ? -1 : 1;
    if (keyA > keyB) return direction === 'asc' ? 1 : -1;
    return 0;
  }

  function selectPivotIndex(low: number, high: number): number {
    if (pivotStrategy === 'last') {
      return high;
    }

    if (pivotStrategy === 'random') {
      return Math.floor(Math.random() * (high - low + 1)) + low;
    }

    // Median of three: {low, mid, high}
    const mid = Math.floor((low + high) / 2);
    const vLow = keyExtractor(arr[low]);
    const vMid = keyExtractor(arr[mid]);
    const vHigh = keyExtractor(arr[high]);

    // Find median
    if ((vLow <= vMid && vMid <= vHigh) || (vHigh <= vMid && vMid <= vLow)) {
      return mid;
    }
    if ((vMid <= vLow && vLow <= vHigh) || (vHigh <= vLow && vLow <= vMid)) {
      return low;
    }
    return high;
  }

  function partition(low: number, high: number, depth: number): number {
    const chosenPivotIndex = selectPivotIndex(low, high);
    const chosenPivotValue = keyExtractor(arr[chosenPivotIndex]);

    // Snapshot slice before partition
    const sliceBefore = arr.slice(low, high + 1).map((item) => String(keyExtractor(item)));

    // Move chosen pivot to high
    swap(chosenPivotIndex, high);

    const pivotElement = arr[high];
    let i = low - 1;
    let stepComparisons = 0;
    let stepSwaps = 0;

    for (let j = low; j < high; j++) {
      stepComparisons++;
      if (compare(arr[j], pivotElement) <= 0) {
        i++;
        if (i !== j) {
          swap(i, j);
          stepSwaps++;
        }
      }
    }

    // Place pivot in correct sorted position
    swap(i + 1, high);
    stepSwaps++;

    const finalPivotIndex = i + 1;

    // Snapshot slice after partition
    const sliceAfter = arr.slice(low, high + 1).map((item) => String(keyExtractor(item)));

    partitionSteps.push({
      step: stepCounter++,
      depth,
      low,
      high,
      pivotStrategy,
      pivotIndexChosen: chosenPivotIndex,
      pivotValue: chosenPivotValue,
      finalPivotIndex,
      comparisonsCount: stepComparisons,
      swapsCount: stepSwaps,
      sliceElementsBefore: sliceBefore,
      sliceElementsAfter: sliceAfter,
    });

    return finalPivotIndex;
  }

  function sort(low: number, high: number, depth: number) {
    if (depth > maxRecursionDepth) {
      maxRecursionDepth = depth;
    }

    if (low < high) {
      const pivotIndex = partition(low, high, depth);
      sort(low, pivotIndex - 1, depth + 1);
      sort(pivotIndex + 1, high, depth + 1);
    }
  }

  if (arr.length > 1) {
    sort(0, arr.length - 1, 1);
  }

  const endTime = performance.now();
  const executionTimeMs = Number((endTime - startTime).toFixed(3));

  const n = inputArray.length;
  const timeComplexity =
    pivotStrategy === 'last'
      ? `Avg O(n log n) ≈ ${Math.round(n * Math.log2(n || 1))} ops | Worst O(n²) ≈ ${n * n} ops`
      : `O(n log n) ≈ ${Math.round(n * Math.log2(n || 1))} comparisons`;

  return {
    sortedArray: arr,
    totalComparisons,
    totalSwaps,
    executionTimeMs,
    maxRecursionDepth,
    pivotStrategy,
    partitionSteps,
    timeComplexity,
    spaceComplexity: `O(log n) stack depth = max depth reached: ${maxRecursionDepth}`,
  };
}

