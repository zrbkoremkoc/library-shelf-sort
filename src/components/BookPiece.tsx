import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Book } from '../game/types';
import { theme } from '../constants/theme';
import { BOOK_THICKNESS, TIMING } from '../constants/config';
import { bookWidth } from '../utils/boardGeometry';

interface Props {
  book: Book;
  capacity: number;
  cellWidth: number;
  selected?: boolean;
  reducedMotion?: boolean;
  compact?: boolean;
}

const SPINE: Record<string, string> = {
  A: theme.colors.family.A,
  B: theme.colors.family.B,
  C: theme.colors.family.C,
  D: theme.colors.family.D,
};

/** Label text is on the dark end of every spine, so colour is never the only cue. */
const LABEL_ON_LIGHT = ['A', 'B'];

export function BookPiece({
  book,
  capacity,
  cellWidth,
  selected = false,
  reducedMotion = false,
  compact = false,
}: Props) {
  const lift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.timing(lift, {
      toValue: selected ? -8 : 0,
      duration: reducedMotion ? TIMING.reduced : TIMING.lift,
      useNativeDriver: true,
    });
    anim.start();
    return () => anim.stop();
  }, [lift, reducedMotion, selected]);

  const width = compact ? 44 : bookWidth(book.rank, capacity, cellWidth);
  const height = compact ? 16 : BOOK_THICKNESS;
  const spine = SPINE[book.family] ?? theme.colors.family.A;
  const labelColor = LABEL_ON_LIGHT.indexOf(book.family) >= 0 ? '#1F2418' : '#F2F6ED';

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.wrap,
        { width, height, transform: [{ translateY: lift }] },
        selected ? styles.selected : null,
      ]}>
      <View style={[styles.spine, { backgroundColor: spine }]}>
        <View style={[styles.band, { backgroundColor: labelColor, opacity: 0.35 }]} />
        {compact ? null : (
          <Text style={[styles.label, { color: labelColor }]} numberOfLines={1}>
            {book.family}
            {book.rank}
          </Text>
        )}
        <View style={[styles.band, { backgroundColor: labelColor, opacity: 0.35 }]} />
      </View>
      <View style={styles.pages} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(31,36,24,0.25)',
    ...theme.shadows.book,
  },
  selected: {
    borderColor: theme.colors.action.primary,
    borderWidth: 2,
  },
  spine: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    gap: 4,
  },
  band: { width: 2, height: 10, borderRadius: 1 },
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  pages: {
    height: 3,
    backgroundColor: theme.colors.bg.secondary,
    borderTopWidth: 1,
    borderTopColor: 'rgba(31,36,24,0.18)',
  },
});
