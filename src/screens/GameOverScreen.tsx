import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { Home, RotateCcw, Sofa } from 'lucide-react-native';
import { AppShell } from '../components/AppShell';
import { ScreenHeader } from '../components/ScreenHeader';
import { IconButton } from '../components/IconButton';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { StatCard } from '../components/StatCard';
import { StarRating } from '../components/StarRating';
import { assets, ladderSprite } from '../assets';
import { theme } from '../constants/theme';
import { HINTS, TIMING, TOTAL_SHELVES } from '../constants/config';
import { roomNameForShelf } from '../game/progression';

interface Props {
  shelf: number;
  moves: number;
  bestMoves: number;
  stars: number;
  rewardName: string | null;
  isLastShelf: boolean;
  reduceMotion: boolean;
  onNextShelf: () => void;
  onPlayAgain: () => void;
  onMenu: () => void;
  onOpenNook: () => void;
}

export function GameOverScreen({
  shelf,
  moves,
  bestMoves,
  stars,
  rewardName,
  isLastShelf,
  reduceMotion,
  onNextShelf,
  onPlayAgain,
  onMenu,
  onOpenNook,
}: Props) {
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.timing(fade, {
      toValue: 1,
      duration: reduceMotion ? TIMING.reduced : TIMING.screenFade,
      useNativeDriver: true,
    });
    anim.start();
    return () => anim.stop();
  }, [fade, reduceMotion]);

  return (
    <AppShell tone="result">
      <ScreenHeader
        title="Shelf tidy!"
        subtitle={roomNameForShelf(shelf)}
        leftSlot={<IconButton Icon={Home} onPress={onMenu} label="Library Floors" />}
      />

      <Animated.View pointerEvents="box-none" style={[styles.body, { opacity: fade }]}>
        <View style={styles.vignette}>
          <Image source={assets.logo} style={styles.logo} resizeMode="contain" />
          <Image source={ladderSprite} style={styles.ladder} resizeMode="contain" />
        </View>

        <Text style={styles.headline}>Shelf {shelf} tidy</Text>
        <Text style={styles.sub}>{HINTS.solved}</Text>

        <View style={styles.stars}>
          <StarRating count={stars} animated reducedMotion={reduceMotion} />
        </View>

        <View style={styles.panel}>
          <View style={styles.statsRow}>
            <View style={styles.statSlot}>
              <StatCard
                value={`${moves}`}
                label="moves used"
                valueColor={theme.colors.action.primary}
              />
            </View>
            <View style={styles.statSlot}>
              <StatCard
                value={`${bestMoves}`}
                label="best moves"
                valueColor={theme.colors.earth.olive}
              />
            </View>
          </View>

          {rewardName ? (
            <View style={styles.unlock}>
              <Text style={styles.unlockLabel}>NEW FOR YOUR NOOK</Text>
              <Text style={styles.unlockName} numberOfLines={1}>
                {rewardName}
              </Text>
            </View>
          ) : null}
        </View>
      </Animated.View>

      <View style={styles.actions}>
        {isLastShelf ? (
          <PrimaryButton label="READING NOOK" Icon={Sofa} onPress={onOpenNook} />
        ) : (
          <PrimaryButton
            label="NEXT SHELF"
            onPress={onNextShelf}
            accessibilityLabel={`Start shelf ${Math.min(shelf + 1, TOTAL_SHELVES)}`}
          />
        )}
        <View style={styles.gap} />
        <SecondaryButton label="PLAY AGAIN" Icon={RotateCcw} onPress={onPlayAgain} tone="sage" />
        <View style={styles.gap} />
        <SecondaryButton label="LIBRARY FLOORS" Icon={Home} onPress={onMenu} tone="paper" />
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
  vignette: {
    width: 200,
    height: 120,
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(250,245,236,0.75)',
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logo: { width: 136, height: 72 },
  ladder: { position: 'absolute', right: 10, bottom: 10, width: 34, height: 34 },
  headline: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '700',
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginTop: 14,
  },
  sub: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: 4,
  },
  stars: { marginTop: 12, marginBottom: 14 },
  panel: {
    width: '100%',
    maxWidth: 348,
    backgroundColor: theme.colors.ui.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    padding: 16,
    ...theme.shadows.card,
  },
  statsRow: { flexDirection: 'row', gap: 10 },
  statSlot: { flex: 1 },
  unlock: {
    marginTop: 12,
    height: 64,
    borderRadius: theme.radius.sm,
    backgroundColor: 'rgba(179,221,176,0.35)',
    borderWidth: 1,
    borderColor: theme.colors.earth.olive,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  unlockLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.text.muted,
  },
  unlockName: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  actions: { paddingHorizontal: 16, paddingBottom: 20, paddingTop: 4 },
  gap: { height: 10 },
});
