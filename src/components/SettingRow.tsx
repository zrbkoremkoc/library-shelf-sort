import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { theme } from '../constants/theme';

interface Props {
  label: string;
  explanation: string;
  enabled: boolean;
  onToggle: (next: boolean) => void;
}

export function SettingRow({ label, explanation, enabled, onToggle }: Props) {
  return (
    <Pressable
      onPress={() => onToggle(!enabled)}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityHint={explanation}
      accessibilityState={{ checked: enabled }}
      style={styles.row}>
      <View style={styles.text}>
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
        <Text style={styles.explain} numberOfLines={1}>
          {explanation}
        </Text>
      </View>
      <View
        style={[
          styles.box,
          enabled ? styles.boxOn : null,
        ]}>
        {enabled ? <Check size={20} color={theme.colors.text.primary} strokeWidth={3} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    width: '100%',
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    gap: 12,
  },
  text: { flex: 1 },
  label: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  explain: {
    fontSize: 12,
    lineHeight: 16,
    color: theme.colors.text.muted,
  },
  box: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    backgroundColor: theme.colors.ui.surfaceWarm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxOn: {
    backgroundColor: 'rgba(179,221,176,0.55)',
    borderColor: theme.colors.earth.olive,
    borderWidth: 2,
  },
});
