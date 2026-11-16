import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';

interface Props {
  message: string;
  emphasis?: 'calm' | 'warn';
}

/** Stable helper area; never shifts the layout when the message changes. */
export function InlineHint({ message, emphasis = 'calm' }: Props) {
  return (
    <View style={styles.wrap} accessibilityLiveRegion="polite">
      <Text
        style={[
          styles.text,
          emphasis === 'warn' ? { color: theme.colors.earth.terracotta } : null,
        ]}
        numberOfLines={2}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
});
