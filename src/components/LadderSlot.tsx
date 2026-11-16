import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Book } from '../game/types';
import { BookPiece } from './BookPiece';
import { theme } from '../constants/theme';

interface Props {
  book: Book | null;
  capacity: number;
  selected: boolean;
  disabled?: boolean;
  reducedMotion: boolean;
  onPress: () => void;
}

/** The permanent one-book extra spot. Never a consumable. */
export function LadderSlot({ book, capacity, selected, disabled = false, reducedMotion, onPress }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Animated.timing(scale, { toValue: 0.96, duration: 80, useNativeDriver: true }).start();
  };
  const pressOut = () => {
    Animated.spring(scale, { toValue: 1, tension: 180, friction: 18, useNativeDriver: true }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      disabled={disabled}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityRole="button"
      accessibilityLabel={
        book
          ? `Ladder, holding ${book.family} height ${book.rank}${selected ? ', selected' : ''}`
          : 'Ladder, empty, one spot'
      }
      accessibilityState={{ selected, disabled }}
      style={styles.press}>
      <Animated.View
        style={[
          styles.slot,
          {
            borderColor: selected ? theme.colors.action.primary : theme.colors.ui.border,
            borderWidth: selected ? 2 : 1,
            opacity: disabled ? 0.5 : 1,
            transform: [{ scale }],
          },
        ]}>
        {book ? (
          <BookPiece
            book={book}
            capacity={capacity}
            cellWidth={60}
            selected={selected}
            reducedMotion={reducedMotion}
            compact
          />
        ) : (
          <View style={styles.rungs}>
            <View style={styles.rung} />
            <View style={styles.rung} />
          </View>
        )}
        <Text style={styles.caption} numberOfLines={1}>
          {book ? 'Ladder' : '1 spot'}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { width: 64, height: 48 },
  slot: {
    width: 64,
    height: 48,
    borderRadius: 10,
    backgroundColor: theme.colors.ui.inset,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 2,
  },
  rungs: { width: 36, height: 16, justifyContent: 'space-between' },
  rung: { height: 3, borderRadius: 2, backgroundColor: theme.colors.wood.light },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    color: theme.colors.text.muted,
  },
});
