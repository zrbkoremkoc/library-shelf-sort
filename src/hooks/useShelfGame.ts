import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BoardState, LADDER, Selection } from '../game/types';
import { generateLevel, initialBoard } from '../game/levelGenerator';
import {
  bookAt,
  checkMove,
  applyMove,
  cloneState,
  hasLegalMove,
  isSolved,
} from '../game/rules';
import { HINTS, TIMING } from '../constants/config';

interface Options {
  shelf: number;
  onSolved: (moves: number, par: number) => void;
}

/**
 * Owns one attempt at one shelf. Selection is visual only: a book stays in its
 * source until a legal transfer commits, so a rapid tap can never duplicate it.
 */
export function useShelfGame({ shelf, onSolved }: Options) {
  const level = useMemo(() => generateLevel(shelf), [shelf]);

  const [board, setBoard] = useState<BoardState>(() => initialBoard(level));
  const [history, setHistory] = useState<BoardState[]>([]);
  const [selection, setSelection] = useState<Selection>(null);
  const [hint, setHint] = useState<string>(level.hint);
  const [hintEmphasis, setHintEmphasis] = useState<'calm' | 'warn'>('calm');
  const [pulsingBay, setPulsingBay] = useState<number | null>(null);

  const solvedRef = useRef(false);
  const lockedRef = useRef(false);
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pulseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (hintTimer.current) {
      clearTimeout(hintTimer.current);
      hintTimer.current = null;
    }
    if (settleTimer.current) {
      clearTimeout(settleTimer.current);
      settleTimer.current = null;
    }
    if (pulseTimer.current) {
      clearTimeout(pulseTimer.current);
      pulseTimer.current = null;
    }
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  // A new shelf always starts from its stored initial layout.
  useEffect(() => {
    clearTimers();
    solvedRef.current = false;
    lockedRef.current = false;
    setBoard(initialBoard(level));
    setHistory([]);
    setSelection(null);
    setHint(level.hint);
    setHintEmphasis('calm');
    setPulsingBay(null);
  }, [clearTimers, level]);

  const announce = useCallback(
    (message: string, emphasis: 'calm' | 'warn' = 'calm', sticky = false) => {
      setHint(message);
      setHintEmphasis(emphasis);
      if (hintTimer.current) {
        clearTimeout(hintTimer.current);
        hintTimer.current = null;
      }
      if (!sticky) {
        hintTimer.current = setTimeout(() => {
          setHint(HINTS.rule);
          setHintEmphasis('calm');
        }, TIMING.hint);
      }
    },
    [],
  );

  const rejectInto = useCallback(
    (index: number, reason: string) => {
      setPulsingBay(index);
      if (pulseTimer.current) {
        clearTimeout(pulseTimer.current);
      }
      pulseTimer.current = setTimeout(() => setPulsingBay(null), TIMING.pulse + 40);
      announce(reason, 'warn');
    },
    [announce],
  );

  const commit = useCallback(
    (from: number, to: number) => {
      lockedRef.current = true;
      const snapshot = cloneState(board);
      const next = applyMove(board, from, to);
      setHistory(current => [...current, snapshot]);
      setBoard(next);
      setSelection(null);

      if (settleTimer.current) {
        clearTimeout(settleTimer.current);
      }
      settleTimer.current = setTimeout(() => {
        lockedRef.current = false;
        if (isSolved(next, level.capacity, level.familyCount)) {
          if (!solvedRef.current) {
            solvedRef.current = true;
            onSolved(next.moves, level.par);
          }
          return;
        }
        if (!hasLegalMove(next, level.capacity)) {
          announce(HINTS.stuck, 'warn', true);
        }
      }, TIMING.transfer + TIMING.settle);
    },
    [announce, board, level.capacity, level.familyCount, level.par, onSolved],
  );

  const handleSource = useCallback(
    (index: number) => {
      if (solvedRef.current || lockedRef.current) {
        return;
      }

      // Nothing selected yet: lift the exposed book, if there is one.
      if (!selection) {
        if (!bookAt(board, index)) {
          announce(HINTS.needBook, 'calm');
          return;
        }
        setSelection(index === LADDER ? { kind: 'ladder' } : { kind: 'bay', index });
        announce(HINTS.afterSelect, 'calm');
        return;
      }

      const from = selection.kind === 'ladder' ? LADDER : selection.index;
      if (from === index) {
        setSelection(null);
        announce(HINTS.firstTap, 'calm');
        return;
      }

      const check = checkMove(board, from, index, level.capacity);
      if (!check.ok) {
        rejectInto(index, check.reason ?? HINTS.matchColor);
        return;
      }
      commit(from, index);
    },
    [announce, board, commit, level.capacity, rejectInto, selection],
  );

  const handleBayPress = useCallback((index: number) => handleSource(index), [handleSource]);
  const handleLadderPress = useCallback(() => handleSource(LADDER), [handleSource]);

  const undo = useCallback(() => {
    if (solvedRef.current || lockedRef.current || history.length === 0) {
      return;
    }
    const previous = history[history.length - 1];
    setHistory(current => current.slice(0, -1));
    setBoard(cloneState(previous));
    setSelection(null);
    announce('Move undone', 'calm');
  }, [announce, history]);

  const replay = useCallback(() => {
    clearTimers();
    solvedRef.current = false;
    lockedRef.current = false;
    setBoard(initialBoard(level));
    setHistory([]);
    setSelection(null);
    setPulsingBay(null);
    setHint(level.hint);
    setHintEmphasis('calm');
  }, [clearTimers, level]);

  const cancelSelection = useCallback(() => {
    setSelection(null);
  }, []);

  const selectedBay = selection && selection.kind === 'bay' ? selection.index : null;
  const ladderSelected = selection?.kind === 'ladder';
  const hasChanges = board.moves > 0;

  return {
    level,
    board,
    selectedBay,
    ladderSelected,
    pulsingBay,
    hint,
    hintEmphasis,
    canUndo: history.length > 0,
    hasChanges,
    handleBayPress,
    handleLadderPress,
    undo,
    replay,
    cancelSelection,
  };
}
