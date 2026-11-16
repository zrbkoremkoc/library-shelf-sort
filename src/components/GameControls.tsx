import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RotateCcw, Undo2 } from 'lucide-react-native';
import { Book } from '../game/types';
import { LadderSlot } from './LadderSlot';
import { SecondaryButton } from './SecondaryButton';
import { InlineHint } from './InlineHint';
import { theme } from '../constants/theme';
import { BOTTOM_INSET, HINTS } from '../constants/config';

interface Props {
  moves: number;
  capacity: number;
  ladderBook: Book | null;
  ladderSelected: boolean;
  canUndo: boolean;
  hint: string;
  hintEmphasis: 'calm' | 'warn';
  reducedMotion: boolean;
  onUndo: () => void;
  onReplay: () => void;
  onLadderPress: () => void;
}

/** Separate bottom panel. Controls never sit on top of the books. */
export function GameControls({
  moves,
  capacity,
  ladderBook,
  ladderSelected,
  canUndo,
  hint,
  hintEmphasis,
  reducedMotion,
  onUndo,
  onReplay,
  onLadderPress,
}: Props) {
  return (
    <View style={styles.panel}>
      <View style={styles.row1}>
        <View style={styles.movesBox}>
          <Text style={styles.movesLabel}>MOVES</Text>
          <Text style={styles.movesValue}>{moves}</Text>
        </View>
        <Text style={styles.ruleText} numberOfLines={2}>
          {HINTS.rule}
        </Text>
        <LadderSlot
          book={ladderBook}
          capacity={capacity}
          selected={ladderSelected}
          reducedMotion={reducedMotion}
          onPress={onLadderPress}
        />
      </View>

      <View style={styles.row2}>
        <View style={styles.half}>
          <SecondaryButton
            label="UNDO"
            Icon={Undo2}
            onPress={onUndo}
            disabled={!canUndo}
            tone="paper"
            height={56}
            accessibilityLabel="Undo last move"
          />
        </View>
        <View style={styles.half}>
          <SecondaryButton
            label="PLAY AGAIN"
            Icon={RotateCcw}
            onPress={onReplay}
            tone="sage"
            height={56}
            accessibilityLabel="Play this shelf again"
          />
        </View>
      </View>

      <InlineHint message={hint} emphasis={hintEmphasis} />
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: theme.colors.ui.surface,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: BOTTOM_INSET,
    ...theme.shadows.sheet,
  },
  row1: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  movesBox: {
    width: 64,
    height: 48,
    borderRadius: 10,
    backgroundColor: theme.colors.ui.surfaceWarm,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  movesLabel: {
    fontSize: 12,
    lineHeight: 14,
    fontWeight: '500',
    letterSpacing: 0.6,
    color: theme.colors.text.muted,
  },
  movesValue: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '700',
    color: theme.colors.text.primary,
    fontVariant: ['tabular-nums'],
  },
  ruleText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  row2: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  half: { flex: 1 },
});
