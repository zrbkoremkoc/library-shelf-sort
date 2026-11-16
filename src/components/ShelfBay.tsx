import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { Book } from '../game/types';
import { BookPiece } from './BookPiece';
import { theme } from '../constants/theme';
import { BOOK_SEPARATOR, TIMING } from '../constants/config';

interface Props {
  index: number;
  books: Book[];
  capacity: number;
  cellWidth: number;
  cellHeight: number;
  selected: boolean;
  sorted: boolean;
  pulsing: boolean;
  reducedMotion: boolean;
  onPress: (index: number) => void;
  accessibilityLabel: string;
}

/** One shelf bay. The whole bay is the touch target. */
function ShelfBayBase({
  index,
  books,
  capacity,
  cellWidth,
  cellHeight,
  selected,
  sorted,
  pulsing,
  reducedMotion,
  onPress,
  accessibilityLabel,
}: Props) {
  const pulse = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!pulsing) {
      return;
    }
    pulse.setValue(0);
    const anim = Animated.sequence([
      Animated.timing(pulse, { toValue: 1, duration: TIMING.pulse / 2, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 0, duration: TIMING.pulse / 2, useNativeDriver: true }),
    ]);
    anim.start();
    return () => anim.stop();
  }, [pulse, pulsing]);

  const handlePressIn = () => {
    if (reducedMotion) {
      return;
    }
    Animated.timing(scale, { toValue: 0.98, duration: 80, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, tension: 180, friction: 18, useNativeDriver: true }).start();
  };

  const topIndex = books.length - 1;
  const stack = books.slice().reverse();

  return (
    <Pressable
      onPress={() => onPress(index)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected }}
      style={{ width: cellWidth, height: cellHeight }}>
      <Animated.View
        style={[
          styles.cell,
          {
            width: cellWidth,
            height: cellHeight,
            borderColor: selected ? theme.colors.action.primary : theme.colors.wood.dark,
            borderWidth: selected ? 2 : 1,
            transform: [{ scale }],
          },
        ]}>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.pulseRing,
            { opacity: pulse, borderColor: theme.colors.earth.terracotta },
          ]}
        />
        <View style={styles.headRow}>
          <Text style={styles.bayNumber}>{index + 1}</Text>
          {sorted ? <Check size={14} color={theme.colors.earth.olive} strokeWidth={3} /> : null}
        </View>
        <View style={styles.stack}>
          {stack.map((b, i) => (
            <View key={b.id} style={styles.slot}>
              <BookPiece
                book={b}
                capacity={capacity}
                cellWidth={cellWidth}
                selected={selected && i === 0 && topIndex >= 0}
                reducedMotion={reducedMotion}
              />
            </View>
          ))}
        </View>
        <View style={styles.lip} />
      </Animated.View>
    </Pressable>
  );
}

export const ShelfBay = React.memo(ShelfBayBase);

const styles = StyleSheet.create({
  cell: {
    borderRadius: 10,
    backgroundColor: theme.colors.ui.inset,
    overflow: 'hidden',
    paddingHorizontal: 2,
    paddingTop: 4,
    justifyContent: 'flex-end',
  },
  pulseRing: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 10,
    borderWidth: 3,
  },
  headRow: {
    position: 'absolute',
    top: 4,
    left: 6,
    right: 6,
    height: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bayNumber: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    color: theme.colors.text.muted,
  },
  stack: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 2,
  },
  slot: { marginBottom: BOOK_SEPARATOR, alignItems: 'center' },
  lip: {
    height: 6,
    backgroundColor: theme.colors.wood.light,
    borderTopWidth: 1,
    borderTopColor: theme.colors.wood.dark,
    marginHorizontal: -2,
  },
});
