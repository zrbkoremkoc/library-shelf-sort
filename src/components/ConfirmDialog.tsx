import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from './PrimaryButton';
import { SecondaryButton } from './SecondaryButton';
import { theme } from '../constants/theme';

interface Props {
  title: string;
  explanation: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Paper modal used by changed-attempt replay and by progress reset. */
export function ConfirmDialog({
  title,
  explanation,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <View style={styles.backdrop}>
      <View style={styles.panel}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>{explanation}</Text>
        <View style={styles.actions}>
          <SecondaryButton label={cancelLabel} onPress={onCancel} tone="paper" />
          <View style={styles.gap} />
          <PrimaryButton label={confirmLabel} onPress={onConfirm} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.ui.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  panel: {
    width: '100%',
    maxWidth: 348,
    backgroundColor: theme.colors.ui.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    padding: 20,
    ...theme.shadows.sheet,
  },
  title: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700',
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 18,
  },
  actions: { width: '100%' },
  gap: { height: 10 },
});
