/** 3 stars at or under par, 2 up to 1.5x par, otherwise 1. */
export function starsFor(moves: number, par: number): number {
  if (par <= 0) {
    return 3;
  }
  if (moves <= par) {
    return 3;
  }
  if (moves <= Math.ceil(par * 1.5)) {
    return 2;
  }
  return 1;
}

export interface ShelfRecord {
  stars: number;
  bestMoves: number;
}

/** Records never get worse after a replay. */
export function mergeRecord(previous: ShelfRecord | undefined, stars: number, moves: number): ShelfRecord {
  if (!previous) {
    return { stars, bestMoves: moves };
  }
  return {
    stars: Math.max(previous.stars, stars),
    bestMoves: Math.min(previous.bestMoves, moves),
  };
}
