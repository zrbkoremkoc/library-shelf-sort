import { useCallback, useMemo, useState } from 'react';
import { DEFAULT_DECOR, DecorCategory } from '../constants/decor';
import { RecordMap, clearedCount, nextUnlockedShelf, totalStars } from '../game/progression';
import { mergeRecord, starsFor } from '../game/scoring';

export interface ClearOutcome {
  shelf: number;
  moves: number;
  stars: number;
  bestMoves: number;
  isFirstClear: boolean;
}

/**
 * Session progress. Records are the single ground truth: unlocked shelves,
 * rooms and decor are all derived from them, so a replay can never award twice.
 */
export function useLibraryProgress() {
  const [records, setRecords] = useState<RecordMap>({});
  const [equipped, setEquipped] = useState<Record<DecorCategory, string>>(DEFAULT_DECOR);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);

  const cleared = useMemo(() => clearedCount(records), [records]);
  const stars = useMemo(() => totalStars(records), [records]);
  const nextShelf = useMemo(() => nextUnlockedShelf(records), [records]);

  const recordClear = useCallback(
    (shelf: number, moves: number, par: number): ClearOutcome => {
      const earned = starsFor(moves, par);
      const previous = records[shelf];
      const merged = mergeRecord(previous, earned, moves);
      setRecords(current => ({ ...current, [shelf]: mergeRecord(current[shelf], earned, moves) }));
      return {
        shelf,
        moves,
        stars: earned,
        bestMoves: merged.bestMoves,
        isFirstClear: !previous,
      };
    },
    [records],
  );

  const equip = useCallback((category: DecorCategory, id: string) => {
    setEquipped(current => ({ ...current, [category]: id }));
  }, []);

  const resetProgress = useCallback(() => {
    setRecords({});
    setEquipped(DEFAULT_DECOR);
  }, []);

  return {
    records,
    cleared,
    stars,
    nextShelf,
    equipped,
    soundEnabled,
    reduceMotion,
    setSoundEnabled,
    setReduceMotion,
    recordClear,
    equip,
    resetProgress,
  };
}

export type LibraryProgress = ReturnType<typeof useLibraryProgress>;
