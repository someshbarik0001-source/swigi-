/**
 * Course: Design and Analysis of Algorithms (DAA)
 * Institution: SRM University AP
 * Algorithm: Merge Sort
 * Paradigm: Divide and Conquer
 * Module: Restaurant & Menu Ranking Engine (Price, Rating, Preparation Time)
 * Time Complexity: O(N log N) in all cases (Best, Average, Worst)
 * Space Complexity: O(N) auxiliary space
 * Stability: Stable (preserves order of duplicate keys)
 */

export interface MergeStepTrace {
  step: number;
  depth: number;
  leftSubarray: { id: string; label: string; value: number | string }[];
  rightSubarray: { id: string; label: string; value: number | string }[];
  mergedSubarray: { id: string; label: string; value: number | string }[];
  comparisonsInMerge: number;
  explanation: string;
}

export interface MergeSortResult<T> {
  sortedArray: T[];
  originalArray: T[];
  comparisonCount: number;
  inversionCount: number;
  recursionDepth: number;
  stepTraces: MergeStepTrace[];
  timeComplexity: string;
  spaceComplexity: string;
  isStable: boolean;
  durationMs: number;
}

/**
 * Merge Sort implementation written strictly from scratch.
 * Recursively divides array into two halves, sorts each half, and merges
 * them stably using an auxiliary array.
 */
export function mergeSort<T>(
  items: T[],
  keySelector: (item: T) => number | string,
  direction: 'asc' | 'desc' = 'asc',
  labelSelector?: (item: T) => string,
  idSelector?: (item: T) => string
): MergeSortResult<T> {
  const startTime = performance.now();
  const originalArray = [...items];
  const stepTraces: MergeStepTrace[] = [];
  let comparisonCount = 0;
  let inversionCount = 0;
  let maxDepth = 0;

  const getLabel = labelSelector || ((item: any) => item.name || item.title || String(keySelector(item)));
  const getId = idSelector || ((item: any) => item.id || String(Math.random()));

  function compare(a: T, b: T): number {
    comparisonCount++;
    const valA = keySelector(a);
    const valB = keySelector(b);

    if (valA === valB) return 0;

    if (direction === 'asc') {
      return valA < valB ? -1 : 1;
    } else {
      return valA > valB ? -1 : 1;
    }
  }

  function merge(left: T[], right: T[], depth: number): T[] {
    const merged: T[] = [];
    let i = 0;
    let j = 0;
    let mergeComparisons = 0;

    const leftTraceItems = left.map((item) => ({
      id: getId(item),
      label: getLabel(item),
      value: keySelector(item),
    }));
    const rightTraceItems = right.map((item) => ({
      id: getId(item),
      label: getLabel(item),
      value: keySelector(item),
    }));

    while (i < left.length && j < right.length) {
      mergeComparisons++;
      // Stable comparison: when equal or less-than, take from left subarray first
      if (compare(left[i], right[j]) <= 0) {
        merged.push(left[i]);
        i++;
      } else {
        merged.push(right[j]);
        // Number of inversions = remaining elements in left subarray
        inversionCount += left.length - i;
        j++;
      }
    }

    // Append remaining elements from left
    while (i < left.length) {
      merged.push(left[i]);
      i++;
    }

    // Append remaining elements from right
    while (j < right.length) {
      merged.push(right[j]);
      j++;
    }

    const mergedTraceItems = merged.map((item) => ({
      id: getId(item),
      label: getLabel(item),
      value: keySelector(item),
    }));

    if (stepTraces.length < 150) {
      stepTraces.push({
        step: stepTraces.length + 1,
        depth,
        leftSubarray: leftTraceItems,
        rightSubarray: rightTraceItems,
        mergedSubarray: mergedTraceItems,
        comparisonsInMerge: mergeComparisons,
        explanation: `Merged depth ${depth}: [${leftTraceItems.map((x) => x.label).join(', ')}] with [${rightTraceItems.map((x) => x.label).join(', ')}] -> ${mergedTraceItems.length} elements ordered.`,
      });
    }

    return merged;
  }

  function divideAndConquer(arr: T[], depth: number): T[] {
    if (depth > maxDepth) maxDepth = depth;
    if (arr.length <= 1) return arr;

    const mid = Math.floor(arr.length / 2);
    const leftHalf = arr.slice(0, mid);
    const rightHalf = arr.slice(mid);

    const sortedLeft = divideAndConquer(leftHalf, depth + 1);
    const sortedRight = divideAndConquer(rightHalf, depth + 1);

    return merge(sortedLeft, sortedRight, depth);
  }

  const sortedArray = divideAndConquer([...items], 1);
  const durationMs = Math.round((performance.now() - startTime) * 100) / 100;

  return {
    sortedArray,
    originalArray,
    comparisonCount,
    inversionCount,
    recursionDepth: maxDepth,
    stepTraces,
    timeComplexity: 'O(N log N)',
    spaceComplexity: 'O(N)',
    isStable: true,
    durationMs,
  };
}

