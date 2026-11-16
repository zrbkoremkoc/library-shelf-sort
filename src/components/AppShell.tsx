import React from 'react';
import { ImageBackground, StatusBar, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { assets } from '../assets';

export type ScreenTone = 'loader' | 'menu' | 'game' | 'result' | 'nook' | 'facts' | 'settings';

interface ToneSpec {
  colors: string[];
  start: { x: number; y: number };
  end: { x: number; y: number };
  halo: string;
  haloTop: number;
  haloRight: number;
  bar: 'light-content' | 'dark-content';
}

/** Every screen shares bg_game and is told apart by its gradient overlay. */
const TONES: Record<ScreenTone, ToneSpec> = {
  loader: {
    colors: ['rgba(31,36,24,0.97)', 'rgba(61,46,31,0.94)', 'rgba(138,98,69,0.90)'],
    start: { x: 0.5, y: 0 },
    end: { x: 0.5, y: 1 },
    halo: 'rgba(232,221,196,0.12)',
    haloTop: 150,
    haloRight: 70,
    bar: 'light-content',
  },
  menu: {
    colors: ['rgba(242,246,237,0.86)', 'rgba(232,221,196,0.78)'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
    halo: 'rgba(217,179,108,0.22)',
    haloTop: 70,
    haloRight: -40,
    bar: 'dark-content',
  },
  game: {
    colors: ['rgba(242,246,237,0.92)', 'rgba(179,221,176,0.88)'],
    start: { x: 0.5, y: 0 },
    end: { x: 0.5, y: 1 },
    halo: 'rgba(217,179,108,0.16)',
    haloTop: 110,
    haloRight: -60,
    bar: 'dark-content',
  },
  result: {
    colors: ['rgba(179,221,176,0.90)', 'rgba(242,246,237,0.86)'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
    halo: 'rgba(217,179,108,0.24)',
    haloTop: 120,
    haloRight: -30,
    bar: 'dark-content',
  },
  nook: {
    colors: ['rgba(250,245,236,0.88)', 'rgba(216,201,168,0.84)'],
    start: { x: 0.5, y: 0 },
    end: { x: 0.5, y: 1 },
    halo: 'rgba(217,179,108,0.26)',
    haloTop: 180,
    haloRight: -20,
    bar: 'dark-content',
  },
  facts: {
    colors: ['rgba(242,246,237,0.92)', 'rgba(242,234,216,0.90)'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
    halo: 'rgba(179,221,176,0.20)',
    haloTop: 200,
    haloRight: -50,
    bar: 'dark-content',
  },
  settings: {
    colors: ['rgba(242,246,237,0.94)', 'rgba(232,221,196,0.92)'],
    start: { x: 0.5, y: 0 },
    end: { x: 0.5, y: 1 },
    halo: 'rgba(217,179,108,0.18)',
    haloTop: 90,
    haloRight: -60,
    bar: 'dark-content',
  },
};

interface Props {
  tone: ScreenTone;
  children: React.ReactNode;
}

export function AppShell({ tone, children }: Props) {
  const spec = TONES[tone];
  return (
    <View style={styles.root}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={spec.bar}
      />
      <ImageBackground source={assets.bgGame} style={styles.bg} resizeMode="cover">
        <LinearGradient
          colors={spec.colors}
          start={spec.start}
          end={spec.end}
          style={StyleSheet.absoluteFill}
        />
        <View
          pointerEvents="none"
          style={[
            styles.halo,
            { backgroundColor: spec.halo, top: spec.haloTop, right: spec.haloRight },
          ]}
        />
        <View style={styles.content}>{children}</View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F2F6ED' },
  bg: { flex: 1 },
  content: { flex: 1 },
  halo: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
  },
});
