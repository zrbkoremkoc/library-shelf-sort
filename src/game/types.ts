export type Family = 'A' | 'B' | 'C' | 'D';

export const FAMILIES: Family[] = ['A', 'B', 'C', 'D'];

export interface Book {
  /** stable within a level, e.g. "A3" */
  id: string;
  family: Family;
  /** 1 = shortest, capacity = tallest */
  rank: number;
}

/** -1 addresses the ladder, 0..n-1 address normal bays. */
export const LADDER = -1;

export interface Move {
  from: number;
  to: number;
}

export interface LevelSpec {
  shelf: number;
  bays: Book[][];
  capacity: number;
  familyCount: number;
  /** length of the stored reference solution */
  par: number;
  solution: Move[];
  hint: string;
}

export interface BoardState {
  bays: Book[][];
  ladder: Book | null;
  moves: number;
}

export type Selection = { kind: 'bay'; index: number } | { kind: 'ladder' } | null;
