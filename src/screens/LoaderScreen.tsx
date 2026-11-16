import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { AppShell } from '../components/AppShell';
import { assets } from '../assets';
import { theme } from '../constants/theme';
import { LOADER_DURATION_MS } from '../constants/config';

const TRACK_W = 180;

interface Props {
  onDone: () => void;
}

/** Branded splash: dark library composition, clearly unlike the light menu. */
export function LoaderScreen({ onDone }: Props) {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.94)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const doneRef = useRef(false);

  useEffect(() => {
    const entry = Animated.parallel([
      Animated.timing(logoOpacity, { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.timing(logoScale, { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 200,
        delay: 100,
        useNativeDriver: true,
      }),
      Animated.timing(progress, {
        toValue: 1,
        duration: LOADER_DURATION_MS,
        useNativeDriver: true,
      }),
    ]);
    entry.start();

    const timer = setTimeout(() => {
      if (!doneRef.current) {
        doneRef.current = true;
        onDone();
      }
    }, LOADER_DURATION_MS);

    return () => {
      entry.stop();
      clearTimeout(timer);
    };
  }, [logoOpacity, logoScale, onDone, progress, titleOpacity]);

  // scaleX anchored to the left edge of the 180 dp track.
  const fillTransform = [
    { translateX: -TRACK_W / 2 },
    { scaleX: progress },
    { translateX: TRACK_W / 2 },
  ];

  return (
    <AppShell tone="loader">
      <View style={styles.root}>
        <View style={styles.center}>
          <View style={styles.brandCard}>
            <Animated.View
              pointerEvents="none"
              style={{ opacity: logoOpacity, transform: [{ scale: logoScale }] }}>
              <Image source={assets.logo} style={styles.logo} resizeMode="contain" />
            </Animated.View>
          </View>

          <Animated.View pointerEvents="none" style={{ opacity: titleOpacity }}>
            <Text style={styles.title}>Library</Text>
            <Text style={styles.title}>Shelf Sort</Text>
            <Text style={styles.subtitle}>A little order, a little calm</Text>
          </Animated.View>
        </View>

        <View style={styles.footer}>
          <View style={styles.track}>
            <Animated.View style={[styles.fill, { transform: fillTransform }]} />
          </View>
          <Text style={styles.loading}>LOADING...</Text>
        </View>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: 24, paddingTop: 44, paddingBottom: 56 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  brandCard: {
    width: 216,
    height: 152,
    borderRadius: theme.radius.xl,
    backgroundColor: 'rgba(242,234,216,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(232,221,196,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  logo: { width: 168, height: 112 },
  title: {
    fontSize: 40,
    lineHeight: 44,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: theme.colors.text.onDark,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    color: theme.colors.bg.tertiary,
    textAlign: 'center',
    marginTop: 14,
  },
  footer: { alignItems: 'center' },
  track: {
    width: TRACK_W,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(216,201,168,0.30)',
    overflow: 'hidden',
  },
  fill: {
    width: TRACK_W,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.earth.sage,
  },
  loading: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    letterSpacing: 1.6,
    color: theme.colors.bg.accent,
    marginTop: 12,
  },
});
