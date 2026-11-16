import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';

import type { IconType } from './iconTypes';

interface Props {
  label: string;
  onPress: () => void;
  Icon?: IconType;
  selected?: boolean;
  disabled?: boolean;
  tone?: 'sage' | 'paper' | 'warn';
  height?: number;
  accessibilityLabel?: string;
}

const TONE_FILL = {
  sage: 'rgba(179,221,176,0.25)',
  paper: 'rgba(250,245,236,0.92)',
  warn: 'rgba(217,123,77,0.22)',
};

/** 48 dp minimum secondary control with the shared sand border. */
export function SecondaryButton({
  label,
  onPress,
  Icon,
  selected = false,
  disabled = false,
  tone = 'sage',
  height = 48,
  accessibilityLabel,
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Animated.timing(scale, { toValue: 0.97, duration: 80, useNativeDriver: true }).start();
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
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled, selected }}
      style={[styles.press, { height }]}>
      <Animated.View
        style={[
          styles.shell,
          {
            height,
            backgroundColor: TONE_FILL[tone],
            borderColor: selected ? theme.colors.action.primary : theme.colors.ui.border,
            borderWidth: selected ? 2 : 1,
            opacity: disabled ? 0.5 : 1,
            transform: [{ scale }],
          },
        ]}>
        <View style={styles.row}>
          {Icon ? <Icon size={24} color={theme.colors.text.primary} strokeWidth={2.2} /> : null}
          <Text style={styles.label} numberOfLines={1}>
            {label}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { width: '100%' },
  shell: {
    width: '100%',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    ...theme.shadows.card,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
});
