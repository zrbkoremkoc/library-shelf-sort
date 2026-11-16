import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ArrowLeft, Home } from 'lucide-react-native';
import { AppShell } from '../components/AppShell';
import { ScreenHeader } from '../components/ScreenHeader';
import { IconButton } from '../components/IconButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { SettingRow } from '../components/SettingRow';
import { StatCard } from '../components/StatCard';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { theme } from '../constants/theme';
import { TOTAL_SHELVES } from '../constants/config';

interface Props {
  soundEnabled: boolean;
  reduceMotion: boolean;
  cleared: number;
  stars: number;
  onSoundChange: (next: boolean) => void;
  onReduceMotionChange: (next: boolean) => void;
  onReset: () => void;
  onBack: () => void;
}

export function SettingsScreen({
  soundEnabled,
  reduceMotion,
  cleared,
  stars,
  onSoundChange,
  onReduceMotionChange,
  onReset,
  onBack,
}: Props) {
  const [confirming, setConfirming] = useState(false);
  const showStats = cleared > 0 && stars > 0;

  return (
    <AppShell tone="settings">
      <ScreenHeader
        title="Settings"
        subtitle="Sound and motion"
        leftSlot={<IconButton Icon={ArrowLeft} onPress={onBack} label="Back to Library Floors" />}
      />

      <View style={styles.body}>
        <View style={styles.card}>
          <SettingRow
            label="Sound"
            explanation="Quiet taps and one soft chime"
            enabled={soundEnabled}
            onToggle={onSoundChange}
          />
          <View style={styles.divider} />
          <SettingRow
            label="Reduce motion"
            explanation="Fades instead of movement"
            enabled={reduceMotion}
            onToggle={onReduceMotionChange}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Progress</Text>
          {showStats ? (
            <View style={styles.statsRow}>
              <View style={styles.statSlot}>
                <StatCard
                  value={`${cleared}`}
                  label="shelves tidy"
                  valueColor={theme.colors.earth.olive}
                />
              </View>
              <View style={styles.statSlot}>
                <StatCard
                  value={`${stars}`}
                  label="stars"
                  valueColor={theme.colors.earth.mustard}
                />
              </View>
            </View>
          ) : (
            <Text style={styles.progressLine}>
              No shelves tidy yet. Shelf 1 of {TOTAL_SHELVES} is ready whenever you are.
            </Text>
          )}
        </View>

        <View style={styles.spacer} />

        <SecondaryButton
          label="RESET PROGRESS"
          onPress={() => setConfirming(true)}
          tone="warn"
          height={56}
        />
        <View style={styles.gap} />
        <SecondaryButton label="LIBRARY FLOORS" Icon={Home} onPress={onBack} tone="sage" />
      </View>

      {confirming ? (
        <ConfirmDialog
          title="Reset all progress?"
          explanation="Clears shelves, stars, and unlocked decor."
          cancelLabel="CANCEL"
          confirmLabel="RESET PROGRESS"
          onCancel={() => setConfirming(false)}
          onConfirm={() => {
            setConfirming(false);
            onReset();
          }}
        />
      ) : null}
    </AppShell>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 20 },
  card: {
    backgroundColor: theme.colors.ui.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    padding: 14,
    marginBottom: 12,
    ...theme.shadows.card,
  },
  cardTitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 10,
  },
  divider: { height: 1, backgroundColor: theme.colors.ui.divider, marginVertical: 2 },
  statsRow: { flexDirection: 'row', gap: 10 },
  statSlot: { flex: 1 },
  progressLine: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.text.secondary,
  },
  spacer: { flex: 1 },
  gap: { height: 10 },
});
