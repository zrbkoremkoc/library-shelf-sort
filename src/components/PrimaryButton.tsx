import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../constants/theme';

import type { IconType } from './iconTypes';

interface Props {
  label: string;
  onPress: () => void;
  Icon?: IconType;
  disabled?: boolean;
  accessibilityLabel?: string;
}

/** 60 dp blue gradient CTA. Pressable is the parent, Animated.View is its child. */
export function PrimaryButton({ label, onPress, Icon, disabled = false, accessibilityLabel }: Props) {
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
      accessibilityState={{ disabled }}
      style={styles.press}>
      <Animated.View style={[styles.shell, { transform: [{ scale }] }]}>
        <LinearGradient
          colors={disabled ? ['#C7CFC2', '#B6BFB1'] : theme.gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fill}>
          <View style={styles.row}>
            {Icon ? <Icon size={24} color={theme.colors.text.primary} strokeWidth={2.4} /> : null}
            <Text style={styles.label} numberOfLines={1}>
              {label}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { width: '100%', height: 60 },
  shell: {
    width: '100%',
    height: 60,
    borderRadius: theme.radius.md,
    ...theme.shadows.primary,
  },
  fill: {
    width: '100%',
    height: 60,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
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
    fontWeight: '700',
    letterSpacing: 0.8,
    color: theme.colors.text.primary,
  },
});
