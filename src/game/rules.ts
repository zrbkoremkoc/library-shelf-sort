import { Book, BoardState, Family, LADDER, Move } from './types';
import { HINTS } from '../constants/config';

export function topOf(stack: Book[]): Book | null {
  return stack.length > 0 ? stack[stack.length - 1] : null;
}

export function cloneBays(bays: Book[][]): Book[][] {
  return bays.map(bay => bay.slice());
}

export function cloneState(state: BoardState): BoardState {
  return { bays: cloneBays(state.bays), ladder: state.ladder, moves: state.moves };
}

export function serializeBays(bays: Book[][]): string {
  return bays.map(bay => bay.map(b => b.id).join('-')).join('|');
}

/** The book a source currently exposes, or null when the source is empty. */
export function bookAt(state: BoardState, index: number): Book | null {
  if (index === LADDER) {
    return state.ladder;
  }
  const bay = state.bays[index];
  return bay ? topOf(bay) : null;
}

export interface MoveCheck {
  ok: boolean;
  reason?: string;
}

export function checkMove(state: BoardState, from: number, to: number, capacity: number): MoveCheck {
  if (from === to) {
    return { ok: false, reason: HINTS.needBook };
  }
  const book = bookAt(state, from);
  if (!book) {
    return { ok: false, reason: HINTS.needBook };
  }
  if (to === LADDER) {
    if (state.ladder) {
      return { ok: false, reason: HINTS.ladderFull };
    }
    return { ok: true };
  }
  const target = state.bays[to];
  if (!target) {
    return { ok: false, reason: HINTS.bayFull };
  }
  if (target.length >= capacity) {
    return { ok: false, reason: HINTS.bayFull };
  }
  const top = topOf(target);
  if (top && top.family !== book.family) {
    return { ok: false, reason: HINTS.matchColor };
  }
  return { ok: true };
}

/** Applies a legal transfer. Returns a new state; the caller checks legality first. */
export function applyMove(state: BoardState, from: number, to: number): BoardState {
  const next = cloneState(state);
  let book: Book | null = null;
  if (from === LADDER) {
    book = next.ladder;
    next.ladder = null;
  } else {
    book = next.bays[from].pop() ?? null;
  }
  if (!book) {
    return state;
  }
  if (to === LADDER) {
    next.ladder = book;
  } else {
    next.bays[to].push(book);
  }
  next.moves = state.moves + 1;
  return next;
}

/** A bay is tidy when it holds one family, full, ordered tallest at the bottom. */
export function isBaySorted(bay: Book[], capacity: number): boolean {
  if (bay.length !== capacity) {
    return false;
  }
  const family = bay[0].family;
  for (let i = 0; i < bay.length; i++) {
    if (bay[i].family !== family) {
      return false;
    }
    if (bay[i].rank !== capacity - i) {
      return false;
    }
  }
  return true;
}

export function isBayMonochrome(bay: Book[]): boolean {
  if (bay.length < 2) {
    return bay.length === 1;
  }
  const family = bay[0].family;
  return bay.every(b => b.family === family);
}

export function isSolved(state: BoardState, capacity: number, familyCount: number): boolean {
  if (state.ladder) {
    return false;
  }
  const seen = new Set<Family>();
  let filled = 0;
  for (const bay of state.bays) {
    if (bay.length === 0) {
      continue;
    }
    if (!isBaySorted(bay, capacity)) {
      return false;
    }
    if (seen.has(bay[0].family)) {
      return false;
    }
    seen.add(bay[0].family);
    filled += 1;
  }
  return filled === familyCount;
}

/** True when neither a normal bay nor the ladder can accept any exposed book. */
export function hasLegalMove(state: BoardState, capacity: number): boolean {
  const sources: number[] = [LADDER];
  for (let i = 0; i < state.bays.length; i++) {
    sources.push(i);
  }
  for (const from of sources) {
    if (!bookAt(state, from)) {
      continue;
    }
    for (const to of sources) {
      if (to === from) {
        continue;
      }
      if (checkMove(state, from, to, capacity).ok) {
        return true;
      }
    }
  }
  return false;
}

/** Replays a reference path and reports whether it legally reaches the goal. */
export function replayIsValid(
  start: BoardState,
  moves: Move[],
  capacity: number,
  familyCount: number,
): boolean {
  let state = cloneState(start);
  for (const move of moves) {
    if (!checkMove(state, move.from, move.to, capacity).ok) {
      return false;
    }
    state = applyMove(state, move.from, move.to);
  }
  return isSolved(state, capacity, familyCount);
}

export function countMixedBays(bays: Book[][]): number {
  return bays.filter(bay => bay.length > 1 && !isBayMonochrome(bay)).length;
}
