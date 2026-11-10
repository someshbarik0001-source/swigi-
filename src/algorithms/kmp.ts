/**
 * Course: Design and Analysis of Algorithms (DAA)
 * Institution: SRM University AP
 * Algorithm: Knuth-Morris-Pratt (KMP) Pattern Matching
 * Paradigm: String / Finite Automata Preprocessing
 * Module: Food Item & Menu Search Engine
 * Time Complexity: O(N + M) where N = text length, M = pattern length
 * Space Complexity: O(M) for the Longest Proper Prefix which is also Suffix (LPS / Pi) array
 */

import { FoodItem } from '../types';

export interface LPSStepTrace {
  step: number;
  i: number;
  length: number;
  charEvaluated: string;
  charPrev: string;
  action: 'match_extend' | 'mismatch_fallback' | 'zero_reset';
  lpsSnapshot: number[];
  explanation: string;
}

export interface KMPStepTrace {
  step: number;
  textIndex: number;
  patternIndex: number;
  textChar: string;
  patternChar: string;
  isMatch: boolean;
  action: 'match_advance' | 'pattern_found' | 'fallback_via_lps' | 'text_advance';
  nextPatternIndex: number;
  comparisonsCount: number;
  explanation: string;
}

export interface KMPSearchResult {
  pattern: string;
  text: string;
  matches: number[]; // 0-based starting indices where pattern occurs
  matchCount: number;
  comparisonsCount: number;
  naiveComparisonsCount: number;
  comparisonsSaved: number;
  lpsArray: number[];
  lpsSteps: LPSStepTrace[];
  searchSteps: KMPStepTrace[];
  timeComplexity: string;
  spaceComplexity: string;
  durationMs: number;
}

/**
 * Computes the Longest Proper Prefix which is also Suffix (LPS) table
 * for pattern P of length M.
 *
 * Invariant: lps[i] is the length of the longest proper prefix of P[0..i]
 * that is also a suffix of P[0..i].
 */
export function computeLPSArray(pattern: string): { lps: number[]; steps: LPSStepTrace[] } {
  const m = pattern.length;
  const lps: number[] = new Array(m).fill(0);
  const steps: LPSStepTrace[] = [];

  if (m === 0) return { lps, steps };

  let len = 0; // length of previous longest prefix suffix
  let i = 1;

  steps.push({
    step: 1,
    i: 0,
    length: 0,
    charEvaluated: pattern[0],
    charPrev: '-',
    action: 'zero_reset',
    lpsSnapshot: [...lps],
    explanation: `Base case: lps[0] = 0 for initial character '${pattern[0]}'.`,
  });

  while (i < m) {
    const stepNum = steps.length + 1;
    if (pattern[i].toLowerCase() === pattern[len].toLowerCase()) {
      len++;
      lps[i] = len;
      steps.push({
        step: stepNum,
        i,
        length: len,
        charEvaluated: pattern[i],
        charPrev: pattern[len - 1],
        action: 'match_extend',
        lpsSnapshot: [...lps],
        explanation: `Match: pattern[${i}]('${pattern[i]}') == pattern[${len - 1}]('${pattern[len - 1]}'). Increment len to ${len}, set lps[${i}] = ${len}.`,
      });
      i++;
    } else {
      if (len !== 0) {
        const oldLen = len;
        len = lps[len - 1];
        steps.push({
          step: stepNum,
          i,
          length: len,
          charEvaluated: pattern[i],
          charPrev: pattern[oldLen],
          action: 'mismatch_fallback',
          lpsSnapshot: [...lps],
          explanation: `Mismatch at i=${i}('${pattern[i]}'). Fall back len from ${oldLen} to lps[${oldLen - 1}] = ${len} without advancing i.`,
        });
      } else {
        lps[i] = 0;
        steps.push({
          step: stepNum,
          i,
          length: 0,
          charEvaluated: pattern[i],
          charPrev: '-',
          action: 'zero_reset',
          lpsSnapshot: [...lps],
          explanation: `Mismatch with len=0. Set lps[${i}] = 0 and advance i to ${i + 1}.`,
        });
        i++;
      }
    }
  }

  return { lps, steps };
}

/**
 * Executes KMP pattern search over text T using pattern P.
 * Operates case-insensitively for search ergonomics while preserving exact indices.
 */
export function kmpSearch(text: string, pattern: string): KMPSearchResult {
  const startTime = performance.now();
  const n = text.length;
  const m = pattern.length;
  const matches: number[] = [];
  const searchSteps: KMPStepTrace[] = [];

  if (m === 0 || n === 0 || m > n) {
    return {
      pattern,
      text,
      matches: [],
      matchCount: 0,
      comparisonsCount: 0,
      naiveComparisonsCount: 0,
      comparisonsSaved: 0,
      lpsArray: [],
      lpsSteps: [],
      searchSteps: [],
      timeComplexity: 'O(N + M)',
      spaceComplexity: 'O(M)',
      durationMs: 0,
    };
  }

  const { lps, steps: lpsSteps } = computeLPSArray(pattern);

  let i = 0; // index for text
  let j = 0; // index for pattern
  let comparisonsCount = 0;

  // Upper bound on naive comparison count for educational comparison
  let naiveComparisonsCount = 0;
  for (let ni = 0; ni <= n - m; ni++) {
    for (let nj = 0; nj < m; nj++) {
      naiveComparisonsCount++;
      if (text[ni + nj].toLowerCase() !== pattern[nj].toLowerCase()) break;
    }
  }

  while (i < n) {
    comparisonsCount++;
    const stepNum = searchSteps.length + 1;
    const isMatch = text[i].toLowerCase() === pattern[j].toLowerCase();

    if (isMatch) {
      if (j === m - 1) {
        // Full pattern match found at start index (i - m + 1)
        const matchStart = i - m + 1;
        matches.push(matchStart);
        const nextJ = lps[j];
        if (searchSteps.length < 200) {
          searchSteps.push({
            step: stepNum,
            textIndex: i,
            patternIndex: j,
            textChar: text[i],
            patternChar: pattern[j],
            isMatch: true,
            action: 'pattern_found',
            nextPatternIndex: nextJ,
            comparisonsCount,
            explanation: `FULL MATCH found at index [${matchStart}..${i}] ("${text.slice(matchStart, i + 1)}"). Fallback pattern pointer to lps[${j}] = ${nextJ}.`,
          });
        }
        j = nextJ;
        i++;
      } else {
        if (searchSteps.length < 200) {
          searchSteps.push({
            step: stepNum,
            textIndex: i,
            patternIndex: j,
            textChar: text[i],
            patternChar: pattern[j],
            isMatch: true,
            action: 'match_advance',
            nextPatternIndex: j + 1,
            comparisonsCount,
            explanation: `Char match: text[${i}]('${text[i]}') == pattern[${j}]('${pattern[j]}'). Advance both pointers.`,
          });
        }
        i++;
        j++;
      }
    } else {
      if (j !== 0) {
        const nextJ = lps[j - 1];
        if (searchSteps.length < 200) {
          searchSteps.push({
            step: stepNum,
            textIndex: i,
            patternIndex: j,
            textChar: text[i],
            patternChar: pattern[j],
            isMatch: false,
            action: 'fallback_via_lps',
            nextPatternIndex: nextJ,
            comparisonsCount,
            explanation: `Mismatch: text[${i}]('${text[i]}') != pattern[${j}]('${pattern[j]}'). Fall back pattern index to lps[${j - 1}] = ${nextJ} without rewinding text index i.`,
          });
        }
        j = nextJ;
      } else {
        if (searchSteps.length < 200) {
          searchSteps.push({
            step: stepNum,
            textIndex: i,
            patternIndex: 0,
            textChar: text[i],
            patternChar: pattern[0],
            isMatch: false,
            action: 'text_advance',
            nextPatternIndex: 0,
            comparisonsCount,
            explanation: `Mismatch at j=0: text[${i}]('${text[i]}') != pattern[0]('${pattern[0]}'). Advance text pointer i to ${i + 1}.`,
          });
        }
        i++;
      }
    }
  }

  const durationMs = Math.round((performance.now() - startTime) * 100) / 100;

  return {
    pattern,
    text,
    matches,
    matchCount: matches.length,
    comparisonsCount,
    naiveComparisonsCount,
    comparisonsSaved: Math.max(0, naiveComparisonsCount - comparisonsCount),
    lpsArray: lps,
    lpsSteps,
    searchSteps,
    timeComplexity: 'O(N + M)',
    spaceComplexity: 'O(M)',
    durationMs,
  };
}

export interface KMPFoodMatch {
  food: FoodItem;
  matchedField: 'name' | 'category' | 'description' | 'ingredient' | 'restaurant';
  matchIndices: number[];
  relevanceScore: number;
}

/**
 * Filters and ranks food items using KMP string pattern matching.
 */
export function kmpSearchFoods(foods: FoodItem[], query: string): KMPFoodMatch[] {
  const trimmed = query.trim();
  if (!trimmed) {
    return foods.map((f) => ({
      food: f,
      matchedField: 'name',
      matchIndices: [],
      relevanceScore: 1,
    }));
  }

  const results: KMPFoodMatch[] = [];

  for (const food of foods) {
    // 1. Search name
    const nameResult = kmpSearch(food.name, trimmed);
    if (nameResult.matchCount > 0) {
      results.push({
        food,
        matchedField: 'name',
        matchIndices: nameResult.matches,
        relevanceScore: 100 + (nameResult.matches[0] === 0 ? 50 : 0) + nameResult.matchCount * 10,
      });
      continue;
    }

    // 2. Search category
    const catResult = kmpSearch(food.categoryName, trimmed);
    if (catResult.matchCount > 0) {
      results.push({
        food,
        matchedField: 'category',
        matchIndices: catResult.matches,
        relevanceScore: 70 + catResult.matchCount * 5,
      });
      continue;
    }

    // 3. Search ingredients
    if (food.ingredients && food.ingredients.length > 0) {
      let matchedIng = false;
      for (const ing of food.ingredients) {
        const ingResult = kmpSearch(ing, trimmed);
        if (ingResult.matchCount > 0) {
          results.push({
            food,
            matchedField: 'ingredient',
            matchIndices: ingResult.matches,
            relevanceScore: 50 + ingResult.matchCount * 5,
          });
          matchedIng = true;
          break;
        }
      }
      if (matchedIng) continue;
    }

    // 4. Search description
    const descResult = kmpSearch(food.description, trimmed);
    if (descResult.matchCount > 0) {
      results.push({
        food,
        matchedField: 'description',
        matchIndices: descResult.matches,
        relevanceScore: 30 + descResult.matchCount * 5,
      });
      continue;
    }

    // 5. Search restaurant name
    const restResult = kmpSearch(food.restaurantName, trimmed);
    if (restResult.matchCount > 0) {
      results.push({
        food,
        matchedField: 'restaurant',
        matchIndices: restResult.matches,
        relevanceScore: 20 + restResult.matchCount * 5,
      });
    }
  }

  // Sort by highest relevance score
  return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

