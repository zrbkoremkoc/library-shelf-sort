import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';
import { TOP_INSET } from '../constants/config';

interface Props {
  title: string;
  subtitle?: string;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
}

/** The one header used by every screen; only the slots and copy differ. */
export function ScreenHeader({ title, subtitle, leftSlot, rightSlot }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.slot}>{leftSlot ?? null}</View>
        <View style={styles.plateWrap}>
          <View style={styles.plate}>
            <Text style={styles.title} numberOfLines={2}>
              {title}
            </Text>
            {subtitle ? (
              <Text style={styles.subtitle} numberOfLines={1}>
                {subtitle}
              </Text>
            ) : null}
          </View>
        </View>
        <View style={styles.slot}>{rightSlot ?? null}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: TOP_INSET,
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: 'rgba(31,36,24,0.30)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(216,201,168,0.55)',
  },
  row: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  slot: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  plateWrap: { flex: 1, alignItems: 'center', paddingHorizontal: 8 },
  plate: {
    backgroundColor: theme.colors.ui.surface,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    paddingHorizontal: 14,
    paddingVertical: 6,
    alignItems: 'center',
    maxWidth: '100%',
    ...theme.shadows.card,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    letterSpacing: 0.4,
    color: theme.colors.text.muted,
    textAlign: 'center',
  },
});
