const MODULUS = 4294967296; // 2^32

export interface Lcg {
  next(): number;
  pick(count: number): number;
}

/** Linear congruential generator, reproducible across runs and devices. */
export function makeLcg(seed: number): Lcg {
  let state = seed >>> 0;
  const next = (): number => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return state / MODULUS;
  };
  return {
    next,
    pick(count: number): number {
      if (count <= 1) {
        return 0;
      }
      const idx = Math.floor(next() * count);
      return idx >= count ? count - 1 : idx;
    },
  };
}

/** Deterministic seed per shelf and attempt. */
export function levelSeed(shelf: number, attempt: number): number {
  return (5489 + 104729 * shelf + 8191 * attempt) >>> 0;
}
