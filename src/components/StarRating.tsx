import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Star } from 'lucide-react-native';
import { theme } from '../constants/theme';
import { TIMING } from '../constants/config';

interface Props {
  count: number;
  size?: number;
  animated?: boolean;
  reducedMotion?: boolean;
}

export function StarRating({ count, size = 36, animated = false, reducedMotion = false }: Props) {
  const slots = [0, 1, 2];
  return (
    <View style={styles.row} accessibilityLabel={`${count} of 3 stars`}>
      {slots.map(i => (
        <Slot
          key={i}
          index={i}
          filled={i < count}
          size={size}
          animated={animated}
          reducedMotion={reducedMotion}
        />
      ))}
    </View>
  );
}

function Slot({
  index,
  filled,
  size,
  animated,
  reducedMotion,
}: {
  index: number;
  filled: boolean;
  size: number;
  animated: boolean;
  reducedMotion: boolean;
}) {
  const progress = useRef(new Animated.Value(animated ? 0 : 1)).current;

  useEffect(() => {
    if (!animated) {
      progress.setValue(1);
      return;
    }
    const anim = Animated.timing(progress, {
      toValue: 1,
      duration: reducedMotion ? TIMING.reduced : TIMING.star,
      delay: reducedMotion ? 0 : index * TIMING.star,
      useNativeDriver: true,
    });
    anim.start();
    return () => anim.stop();
  }, [animated, index, progress, reducedMotion]);

  const scale = reducedMotion
    ? 1
    : progress.interpolate({ inputRange: [0, 0.6, 1], outputRange: [0.8, 1.08, 1] });

  return (
    <Animated.View style={{ opacity: progress, transform: [{ scale }] }}>
      <Star
        size={size}
        color={filled ? theme.colors.earth.mustard : theme.colors.ui.border}
        fill={filled ? theme.colors.earth.mustard : 'transparent'}
        strokeWidth={2}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
});
