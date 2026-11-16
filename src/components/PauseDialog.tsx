import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Home, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react-native';
import { PrimaryButton } from './PrimaryButton';
import { SecondaryButton } from './SecondaryButton';
import { theme } from '../constants/theme';

interface Props {
  soundEnabled: boolean;
  onResume: () => void;
  onSoundChange: (next: boolean) => void;
  onHome: () => void;
  onReplay: () => void;
}

/** Pausing never discards the attempt. */
export function PauseDialog({ soundEnabled, onResume, onSoundChange, onHome, onReplay }: Props) {
  return (
    <View style={styles.backdrop}>
      <View style={styles.panel}>
        <Text style={styles.title}>Paused</Text>
        <Text style={styles.body}>Your shelf is saved.</Text>

        <PrimaryButton label="RESUME" Icon={Play} onPress={onResume} />
        <View style={styles.gap} />
        <SecondaryButton
          label={soundEnabled ? 'Sound on' : 'Sound off'}
          Icon={soundEnabled ? Volume2 : VolumeX}
          onPress={() => onSoundChange(!soundEnabled)}
          tone="paper"
          selected={soundEnabled}
          accessibilityLabel={soundEnabled ? 'Sound is on' : 'Sound is off'}
        />
        <View style={styles.gap} />
        <SecondaryButton label="LIBRARY FLOORS" Icon={Home} onPress={onHome} tone="paper" />
        <View style={styles.gap} />
        <SecondaryButton label="PLAY AGAIN" Icon={RotateCcw} onPress={onReplay} tone="sage" />
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
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.text.muted,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 18,
  },
  gap: { height: 10 },
});
