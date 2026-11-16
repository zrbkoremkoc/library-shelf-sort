import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { ArrowLeft, ChevronLeft, ChevronRight, Home, Lock } from 'lucide-react-native';
import { AppShell } from '../components/AppShell';
import { ScreenHeader } from '../components/ScreenHeader';
import { IconButton } from '../components/IconButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { familySprites } from '../assets';
import { theme } from '../constants/theme';
import { BOOK_FACTS } from '../constants/bookFacts';

interface Props {
  roomsCleared: number;
  reduceMotion: boolean;
  onBack: () => void;
}

export function BookFactsScreen({ roomsCleared, reduceMotion, onBack }: Props) {
  const [page, setPage] = useState(0);
  const slide = useRef(new Animated.Value(0)).current;

  const fact = BOOK_FACTS[page];
  const unlocked = fact.requiresRoom <= roomsCleared;

  useEffect(() => {
    slide.setValue(reduceMotion ? 0 : 16);
    const anim = Animated.timing(slide, {
      toValue: 0,
      duration: reduceMotion ? 100 : 180,
      useNativeDriver: true,
    });
    anim.start();
    return () => anim.stop();
  }, [page, reduceMotion, slide]);

  const art = familySprites[page % familySprites.length];

  return (
    <AppShell tone="facts">
      <ScreenHeader
        title="Book Facts"
        subtitle={`Fact ${fact.index} of ${BOOK_FACTS.length}`}
        leftSlot={<IconButton Icon={ArrowLeft} onPress={onBack} label="Back to Library Floors" />}
      />

      <View style={styles.body}>
        <Animated.View
          pointerEvents="box-none"
          style={[styles.card, { transform: [{ translateX: slide }] }]}>
          <View style={styles.artWrap}>
            <Image source={art} style={styles.art} resizeMode="contain" />
            {unlocked ? null : (
              <View style={styles.lockPill}>
                <Lock size={14} color={theme.colors.text.onDark} strokeWidth={2.5} />
              </View>
            )}
          </View>

          <Text style={styles.counter}>Fact {fact.index} of {BOOK_FACTS.length}</Text>
          <Text style={styles.title} numberOfLines={3}>
            {unlocked ? fact.title : 'Closed book'}
          </Text>
          <Text style={styles.sentence}>
            {unlocked
              ? fact.sentence
              : `Finish room ${fact.requiresRoom} to open this fact.`}
          </Text>
          <Text style={styles.caption} numberOfLines={1}>
            {unlocked
              ? fact.requiresRoom > 0
                ? `Opened by room ${fact.requiresRoom}`
                : 'Open from the start'
              : `Room ${fact.requiresRoom} needed`}
          </Text>
        </Animated.View>

        <View style={styles.pager}>
          <IconButton
            Icon={ChevronLeft}
            onPress={() => setPage(p => (p > 0 ? p - 1 : BOOK_FACTS.length - 1))}
            label="Previous fact"
          />
          <View style={styles.dots}>
            {BOOK_FACTS.map((f, i) => (
              <View
                key={f.index}
                style={[styles.dot, i === page ? styles.dotActive : null]}
              />
            ))}
          </View>
          <IconButton
            Icon={ChevronRight}
            onPress={() => setPage(p => (p < BOOK_FACTS.length - 1 ? p + 1 : 0))}
            label="Next fact"
          />
        </View>

        <SecondaryButton label="LIBRARY FLOORS" Icon={Home} onPress={onBack} tone="sage" />
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 20 },
  card: {
    flex: 1,
    minHeight: 220,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.ui.surface,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.card,
  },
  artWrap: {
    width: 112,
    height: 112,
    alignItems: 'center',
    justifyContent: 'center',
  },
  art: { width: 100, height: 100 },
  lockPill: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: theme.colors.wood.dark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counter: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: theme.colors.text.muted,
    marginTop: 6,
  },
  title: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700',
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginTop: 4,
  },
  sentence: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '400',
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: 10,
  },
  caption: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.text.muted,
    textAlign: 'center',
    marginTop: 10,
  },
  pager: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 14,
  },
  dots: { flexDirection: 'row', gap: 6, flex: 1, justifyContent: 'center' },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.ui.border,
  },
  dotActive: { backgroundColor: theme.colors.earth.olive, width: 18 },
});
