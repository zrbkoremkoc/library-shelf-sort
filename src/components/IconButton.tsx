import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { theme } from '../constants/theme';

import type { IconType } from './iconTypes';

interface Props {
  Icon: IconType;
  onPress: () => void;
  label: string;
  disabled?: boolean;
  tint?: string;
}

/** 48x48 circular control. Pressable is the parent; the animated view is inside. */
export function IconButton({ Icon, onPress, label, disabled = false, tint }: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const color = disabled ? theme.colors.text.muted : tint ?? theme.colors.text.primary;

  const pressIn = () => {
    Animated.spring(scale, { toValue: 0.94, tension: 180, friction: 18, useNativeDriver: true }).start();
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
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      style={styles.press}>
      <Animated.View style={[styles.plate, disabled && styles.disabled, { transform: [{ scale }] }]}>
        <View style={styles.inner}>
          <Icon size={22} color={color} strokeWidth={2} />
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { width: 48, height: 48 },
  plate: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.ui.surface,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.card,
  },
  inner: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  disabled: { opacity: 0.45 },
});
