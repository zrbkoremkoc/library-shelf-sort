import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';

interface Props {
  value: string;
  label: string;
  valueColor: string;
}

/**
 * Shared number treatment for menu and results. No raster icon: an 8 dp colour
 * dot carries the semantics so every card in a row has identical geometry.
 */
export function StatCard({ value, label, valueColor }: Props) {
  return (
    <View style={[styles.card, { borderColor: valueColor + '55' }]}>
      <View style={[styles.dot, { backgroundColor: valueColor }]} />
      <Text style={[styles.value, { color: valueColor }]} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    backgroundColor: theme.colors.ui.surface,
    alignItems: 'center',
    ...theme.shadows.card,
  },
  dot: { width: 8, height: 8, borderRadius: 4, marginBottom: 8 },
  value: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: theme.colors.text.muted,
    marginTop: 2,
  },
});
