import { Book, BoardState, FAMILIES, LADDER, LevelSpec, Move } from './types';
import {
  cloneBays,
  countMixedBays,
  isSolved,
  replayIsValid,
  serializeBays,
  topOf,
} from './rules';
import { levelSeed, makeLcg } from '../utils/seededRandom';
import { localShelfIndex, roomForShelf, scrambleDepth } from '../constants/rooms';
import { HINTS } from '../constants/config';

const MAX_ATTEMPTS = 64;

function book(family: string, rank: number): Book {
  return { id: `${family}${rank}`, family: family as Book['family'], rank };
}

function solvedBays(familyCount: number, capacity: number, extraBays: number): Book[][] {
  const bays: Book[][] = [];
  for (let f = 0; f < familyCount; f++) {
    const family = FAMILIES[f];
    const stack: Book[] = [];
    for (let rank = capacity; rank >= 1; rank--) {
      stack.push(book(family, rank));
    }
    bays.push(stack);
  }
  for (let e = 0; e < extraBays; e++) {
    bays.push([]);
  }
  return bays;
}

function asState(bays: Book[][]): BoardState {
  return { bays: cloneBays(bays), ladder: null, moves: 0 };
}

interface Candidate {
  /** bay giving up its top book while walking backwards */
  j: number;
  /** bay receiving it in the predecessor layout */
  i: number;
}

/**
 * Enumerates predecessors of `bays`: a book that the forward solution would
 * move from i to j is currently sitting on top of j.
 */
function predecessorCandidates(bays: Book[][], capacity: number): Candidate[] {
  const out: Candidate[] = [];
  for (let j = 0; j < bays.length; j++) {
    const source = bays[j];
    if (source.length === 0) {
      continue;
    }
    const moving = source[source.length - 1];
    const below = source.length >= 2 ? source[source.length - 2] : null;
    if (below && below.family !== moving.family) {
      continue;
    }
    for (let i = 0; i < bays.length; i++) {
      if (i === j || bays[i].length >= capacity) {
        continue;
      }
      out.push({ j, i });
    }
  }
  return out;
}

function applyPredecessor(bays: Book[][], c: Candidate): Book[][] {
  const next = cloneBays(bays);
  const moving = next[c.j].pop();
  if (moving) {
    next[c.i].push(moving);
  }
  return next;
}

interface Walk {
  bays: Book[][];
  solution: Move[];
}

function walkBackwards(
  startBays: Book[][],
  capacity: number,
  depth: number,
  seed: number,
): Walk {
  const rng = makeLcg(seed);
  let current = cloneBays(startBays);
  const visited = new Set<string>([serializeBays(current)]);
  const recorded: Move[] = [];
  let last: Candidate | null = null;

  for (let step = 0; step < depth; step++) {
    const candidates = predecessorCandidates(current, capacity).filter(c => {
      if (last && c.j === last.i && c.i === last.j) {
        return false;
      }
      return !visited.has(serializeBays(applyPredecessor(current, c)));
    });
    if (candidates.length === 0) {
      break;
    }
    const chosen = candidates[rng.pick(candidates.length)];
    current = applyPredecessor(current, chosen);
    visited.add(serializeBays(current));
    // The forward move undoes this backward step.
    recorded.push({ from: chosen.i, to: chosen.j });
    last = chosen;
  }

  return { bays: current, solution: recorded.slice().reverse() };
}

/** Start solved, then swap the two shortest books of the first two families. */
function fallbackLevel(familyCount: number, capacity: number, extraBays: number): Walk {
  const bays = solvedBays(familyCount, capacity, extraBays);
  const a = bays[0];
  const b = bays[1];
  const topA = a[a.length - 1];
  const topB = b[b.length - 1];
  a[a.length - 1] = topB;
  b[b.length - 1] = topA;
  const spare = familyCount; // the first empty bay
  return {
    bays,
    solution: [
      { from: 0, to: spare },
      { from: 1, to: 0 },
      { from: spare, to: 1 },
    ],
  };
}

function authoredShelfOne(): Walk {
  return {
    bays: [
      [book('A', 3), book('A', 2), book('B', 1)],
      [book('B', 3), book('B', 2), book('A', 1)],
      [],
    ],
    solution: [
      { from: 0, to: 2 },
      { from: 1, to: 0 },
      { from: 2, to: 1 },
    ],
  };
}

function authoredShelfTwo(): Walk {
  return {
    bays: [
      [book('A', 3), book('A', 1)],
      [book('B', 3), book('B', 2), book('A', 2)],
      [book('B', 1)],
    ],
    solution: [
      { from: 0, to: LADDER },
      { from: 1, to: 0 },
      { from: LADDER, to: 0 },
      { from: 2, to: 1 },
    ],
  };
}

function hintForShelf(shelf: number): string {
  if (shelf === 1) {
    return HINTS.firstTap;
  }
  if (shelf === 2) {
    return HINTS.ladder;
  }
  return HINTS.rule;
}

const cache = new Map<number, LevelSpec>();

export function generateLevel(shelf: number): LevelSpec {
  const cached = cache.get(shelf);
  if (cached) {
    return cached;
  }

  const room = roomForShelf(shelf);
  const { families: familyCount, capacity, extraBays } = room;

  let walk: Walk | null = null;

  if (shelf === 1) {
    walk = authoredShelfOne();
  } else if (shelf === 2) {
    walk = authoredShelfTwo();
  } else {
    const target = scrambleDepth(shelf);
    const solved = solvedBays(familyCount, capacity, extraBays);
    let best: Walk | null = null;

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      const candidate = walkBackwards(solved, capacity, target, levelSeed(shelf, attempt));
      const state = asState(candidate.bays);
      const acceptable =
        candidate.solution.length > 0 &&
        !isSolved(state, capacity, familyCount) &&
        countMixedBays(candidate.bays) >= Math.min(2, familyCount) &&
        replayIsValid(state, candidate.solution, capacity, familyCount);
      if (!acceptable) {
        continue;
      }
      if (candidate.solution.length >= target) {
        best = candidate;
        break;
      }
      if (!best || candidate.solution.length > best.solution.length) {
        best = candidate;
      }
    }

    walk = best ?? fallbackLevel(familyCount, capacity, extraBays);
  }

  // Final safety net: never expose a level whose reference path does not solve.
  if (!replayIsValid(asState(walk.bays), walk.solution, capacity, familyCount)) {
    walk = shelf <= 2 ? authoredShelfOne() : fallbackLevel(familyCount, capacity, extraBays);
  }

  const spec: LevelSpec = {
    shelf,
    bays: cloneBays(walk.bays),
    capacity: shelf <= 2 ? 3 : capacity,
    familyCount: shelf <= 2 ? 2 : familyCount,
    par: walk.solution.length,
    solution: walk.solution,
    hint: hintForShelf(shelf),
  };
  cache.set(shelf, spec);
  return spec;
}

/** Fresh board for a shelf; the level data itself is cached and never reshuffled. */
export function initialBoard(spec: LevelSpec): BoardState {
  return { bays: cloneBays(spec.bays), ladder: null, moves: 0 };
}

export function topBook(bay: Book[]): Book | null {
  return topOf(bay);
}

export function localLabel(shelf: number): number {
  return localShelfIndex(shelf);
}
