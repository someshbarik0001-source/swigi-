/**
 * Course: Design and Analysis of Algorithms (DAA), 2026-27
 * Institution: SRM University AP
 * Algorithm: Huffman Coding
 * Paradigm: Greedy
 * Module: Menu & Payload Compression
 * Time Complexity: O(n log n)
 * Space Complexity: O(n)
 */

export interface HuffmanNode {
  char?: string;
  freq: number;
  left?: HuffmanNode;
  right?: HuffmanNode;
  id?: number;
}

export interface CodeTableEntry {
  char: string;
  displayChar: string;
  frequency: number;
  code: string;
  bits: number;
  originalAsciiBits: number;
}

export interface HuffmanTreeMergeStep {
  step: number;
  node1: { char?: string; freq: number };
  node2: { char?: string; freq: number };
  parentFreq: number;
  remainingHeapSize: number;
}

export interface HuffmanResult {
  originalText: string;
  encodedBitstring: string;
  decodedText: string;
  isLossless: boolean;
  originalBits: number;
  compressedBits: number;
  originalBytes: number;
  compressedBytes: number;
  bitsSaved: number;
  compressionRatioPct: number;
  codeTable: CodeTableEntry[];
  mergeSteps: HuffmanTreeMergeStep[];
  treeRoot: HuffmanNode | null;
  timeComplexity: string;
  spaceComplexity: string;
}

/**
 * Custom MinHeap for Huffman Nodes from scratch
 */
class HuffmanMinHeap {
  private heap: HuffmanNode[] = [];

  public size(): number {
    return this.heap.length;
  }

  public insert(node: HuffmanNode): void {
    this.heap.push(node);
    this.siftUp(this.heap.length - 1);
  }

  public extractMin(): HuffmanNode | null {
    if (this.heap.length === 0) return null;
    const min = this.heap[0];
    const last = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.siftDown(0);
    }
    return min;
  }

  private siftUp(index: number): void {
    let current = index;
    while (current > 0) {
      const parent = Math.floor((current - 1) / 2);
      if (this.heap[current].freq < this.heap[parent].freq) {
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

      if (left < length && this.heap[left].freq < this.heap[smallest].freq) {
        smallest = left;
      }
      if (right < length && this.heap[right].freq < this.heap[smallest].freq) {
        smallest = right;
      }

      if (smallest !== current) {
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
 * Builds the frequency map f(c) for an input string
 */
export function buildFrequencyTable(text: string): Record<string, number> {
  const freq: Record<string, number> = {};
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    freq[char] = (freq[char] || 0) + 1;
  }
  return freq;
}

/**
 * Recursive traversal to generate prefix codes (left = '0', right = '1')
 */
function generateCodes(
  node: HuffmanNode | undefined,
  currentCode: string,
  codeMap: Record<string, string>
): void {
  if (!node) return;

  // Leaf node reached
  if (!node.left && !node.right && node.char !== undefined) {
    codeMap[node.char] = currentCode.length > 0 ? currentCode : '0';
    return;
  }

  generateCodes(node.left, currentCode + '0', codeMap);
  generateCodes(node.right, currentCode + '1', codeMap);
}

/**
 * Huffman Encoding and Decoding Algorithm from Scratch
 */
export function huffmanCompress(text: string): HuffmanResult {
  if (!text || text.length === 0) {
    return {
      originalText: '',
      encodedBitstring: '',
      decodedText: '',
      isLossless: true,
      originalBits: 0,
      compressedBits: 0,
      originalBytes: 0,
      compressedBytes: 0,
      bitsSaved: 0,
      compressionRatioPct: 0,
      codeTable: [],
      mergeSteps: [],
      treeRoot: null,
      timeComplexity: 'O(1)',
      spaceComplexity: 'O(1)',
    };
  }

  // Step 1: Compute frequency table
  const freqTable = buildFrequencyTable(text);
  const distinctCount = Object.keys(freqTable).length;

  // Step 2: Push each distinct character into MinHeap as a leaf node
  const heap = new HuffmanMinHeap();
  let nodeIdCounter = 1;

  Object.entries(freqTable).forEach(([char, freq]) => {
    heap.insert({ char, freq, id: nodeIdCounter++ });
  });

  // Step 3: Build the Huffman Tree by greedily merging the two lowest frequency nodes
  const mergeSteps: HuffmanTreeMergeStep[] = [];
  let mergeCounter = 1;

  while (heap.size() > 1) {
    const node1 = heap.extractMin()!;
    const node2 = heap.extractMin()!;

    const parent: HuffmanNode = {
      freq: node1.freq + node2.freq,
      left: node1,
      right: node2,
      id: nodeIdCounter++,
    };

    mergeSteps.push({
      step: mergeCounter++,
      node1: { char: node1.char, freq: node1.freq },
      node2: { char: node2.char, freq: node2.freq },
      parentFreq: parent.freq,
      remainingHeapSize: heap.size() + 1,
    });

    heap.insert(parent);
  }

  const root = heap.extractMin();

  // Step 4: Generate prefix codes table
  const codeMap: Record<string, string> = {};
  generateCodes(root || undefined, '', codeMap);

  // Step 5: Encode text into bitstring
  let encodedBitstring = '';
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    encodedBitstring += codeMap[c] || '';
  }

  // Step 6: Lossless Decoding Verification (walking tree from root using bits)
  let decodedText = '';
  if (root) {
    let curr: HuffmanNode = root;
    for (let i = 0; i < encodedBitstring.length; i++) {
      const bit = encodedBitstring[i];
      if (bit === '0') {
        curr = curr.left || curr;
      } else {
        curr = curr.right || curr;
      }

      // If reached a leaf node
      if (!curr.left && !curr.right && curr.char !== undefined) {
        decodedText += curr.char;
        curr = root;
      }
    }
  }

  const isLossless = decodedText === text;

  // Format code table entries
  const codeTable: CodeTableEntry[] = Object.entries(codeMap)
    .map(([char, code]) => {
      let displayChar = char;
      if (char === ' ') displayChar = '␠ (space)';
      else if (char === '\n') displayChar = '↵ (newline)';
      else if (char === '\t') displayChar = '⇥ (tab)';

      return {
        char,
        displayChar,
        frequency: freqTable[char] || 0,
        code,
        bits: code.length,
        originalAsciiBits: 8,
      };
    })
    .sort((a, b) => b.frequency - a.frequency);

  // Metrics
  const originalBits = text.length * 8;
  const compressedBits = encodedBitstring.length;
  const originalBytes = Math.ceil(originalBits / 8);
  const compressedBytes = Math.ceil(compressedBits / 8);
  const bitsSaved = originalBits - compressedBits;
  const compressionRatioPct =
    originalBits > 0 ? Number(((bitsSaved / originalBits) * 100).toFixed(1)) : 0;

  return {
    originalText: text,
    encodedBitstring,
    decodedText,
    isLossless,
    originalBits,
    compressedBits,
    originalBytes,
    compressedBytes,
    bitsSaved,
    compressionRatioPct,
    codeTable,
    mergeSteps,
    treeRoot: root,
    timeComplexity: `O(n + k log k) = O(${text.length} + ${distinctCount} log ${distinctCount}) ≈ O(n log n)`,
    spaceComplexity: `O(k) = ${distinctCount} leaf nodes + ${distinctCount - 1} internal nodes`,
  };
}

