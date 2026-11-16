import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Book } from '../game/types';
import { ShelfBay } from './ShelfBay';
import { theme } from '../constants/theme';
import { BOARD_GAP, BOARD_PAD, BOARD_BORDER } from '../constants/config';
import { BoardGeometry } from '../utils/boardGeometry';
import { isBaySorted } from '../game/rules';

interface Props {
  bays: Book[][];
  capacity: number;
  geometry: BoardGeometry;
  selectedBay: number | null;
  pulsingBay: number | null;
  reducedMotion: boolean;
  onBayPress: (index: number) => void;
}

const FAMILY_WORD: Record<string, string> = {
  A: 'green',
  B: 'blue',
  C: 'terracotta',
  D: 'plum',
};

function bayLabel(index: number, books: Book[], capacity: number, selected: boolean): string {
  if (books.length === 0) {
    return `Bay ${index + 1}, empty${selected ? ', selected' : ''}`;
  }
  const top = books[books.length - 1];
  return `Bay ${index + 1}, ${books.length} of ${capacity} books, top ${
    FAMILY_WORD[top.family]
  } ${top.family}, height ${top.rank}${selected ? ', selected' : ''}`;
}

/** Wood-framed, two-row board. The spare cell is a non-interactive rule tile. */
export function ShelfBoard({
  bays,
  capacity,
  geometry,
  selectedBay,
  pulsingBay,
  reducedMotion,
  onBayPress,
}: Props) {
  const { columns, cellWidth, cellHeight, boardWidth, boardHeight, cellCount } = geometry;
  const spare = cellCount - bays.length;

  return (
    <LinearGradient
      colors={theme.gradients.wood}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.frame, { width: boardWidth, height: boardHeight }]}>
      <View style={[styles.grid, { width: boardWidth - 2 * (BOARD_PAD + BOARD_BORDER) }]}>
        {bays.map((books, index) => (
          <ShelfBay
            key={`bay-${index}`}
            index={index}
            books={books}
            capacity={capacity}
            cellWidth={cellWidth}
            cellHeight={cellHeight}
            selected={selectedBay === index}
            sorted={isBaySorted(books, capacity)}
            pulsing={pulsingBay === index}
            reducedMotion={reducedMotion}
            onPress={onBayPress}
            accessibilityLabel={bayLabel(index, books, capacity, selectedBay === index)}
          />
        ))}
        {spare > 0 ? (
          <View
            key="rule-tile"
            importantForAccessibility="no-hide-descendants"
            style={[styles.ruleTile, { width: cellWidth, height: cellHeight }]}>
            <Text style={styles.ruleTitle}>Same color.</Text>
            <Text style={styles.ruleTitle}>Tallest below.</Text>
            <View style={styles.ruleStack}>
              <View style={[styles.ruleBar, { width: cellWidth * 0.34 }]} />
              <View style={[styles.ruleBar, { width: cellWidth * 0.48 }]} />
              <View style={[styles.ruleBar, { width: cellWidth * 0.62 }]} />
            </View>
          </View>
        ) : null}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  frame: {
    borderRadius: theme.radius.md,
    borderWidth: BOARD_BORDER,
    borderColor: theme.colors.wood.dark,
    padding: BOARD_PAD,
    ...theme.shadows.card,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: BOARD_GAP,
  },
  ruleTile: {
    borderRadius: 10,
    backgroundColor: 'rgba(250,245,236,0.92)',
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  ruleTitle: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  ruleStack: { marginTop: 10, alignItems: 'center', gap: 3 },
  ruleBar: {
    height: 10,
    borderRadius: 3,
    backgroundColor: theme.colors.earth.olive,
    opacity: 0.8,
  },
});
