import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Lock,
  Play,
  Settings as SettingsIcon,
  Sofa,
} from 'lucide-react-native';
import { AppShell } from '../components/AppShell';
import { ScreenHeader } from '../components/ScreenHeader';
import { IconButton } from '../components/IconButton';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { StatCard } from '../components/StatCard';
import { LevelPicker } from '../components/LevelPicker';
import { assets, shelfStrip } from '../assets';
import { theme } from '../constants/theme';
import { ROOMS, firstShelfOfRoom } from '../constants/rooms';
import { SHELVES_PER_ROOM, TOTAL_SHELVES } from '../constants/config';
import {
  RecordMap,
  isRoomUnlocked,
  nextUnlockedShelf,
  shelvesTidyInRoom,
} from '../game/progression';

interface Props {
  records: RecordMap;
  cleared: number;
  stars: number;
  selectedRoom: number;
  onSelectRoom: (roomId: number) => void;
  onPlay: (shelf: number) => void;
  onOpenNook: () => void;
  onOpenFacts: () => void;
  onOpenSettings: () => void;
}

export function MenuScreen({
  records,
  cleared,
  stars,
  selectedRoom,
  onSelectRoom,
  onPlay,
  onOpenNook,
  onOpenFacts,
  onOpenSettings,
}: Props) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const sheetShift = useRef(new Animated.Value(12)).current;
  const sheetOpacity = useRef(new Animated.Value(0)).current;

  const room = ROOMS[selectedRoom - 1] ?? ROOMS[0];
  const unlocked = isRoomUnlocked(room.id, records);
  const nextShelf = nextUnlockedShelf(records);
  const tidyHere = shelvesTidyInRoom(room.id, records);

  const targetShelf = useMemo(() => {
    const first = firstShelfOfRoom(room.id);
    const last = first + SHELVES_PER_ROOM - 1;
    if (nextShelf >= first && nextShelf <= last) {
      return nextShelf;
    }
    return nextShelf > last ? last : first;
  }, [nextShelf, room.id]);

  const [pickerShelf, setPickerShelf] = useState(targetShelf);

  useEffect(() => {
    setPickerShelf(targetShelf);
  }, [targetShelf]);

  useEffect(() => {
    const anim = Animated.parallel([
      Animated.timing(sheetShift, { toValue: 0, duration: 220, useNativeDriver: true }),
      Animated.timing(sheetOpacity, { toValue: 1, duration: 220, useNativeDriver: true }),
    ]);
    anim.start();
    return () => anim.stop();
  }, [sheetOpacity, sheetShift]);

  const previousRoomName = ROOMS[room.id - 2] ? ROOMS[room.id - 2].name : 'the earlier room';
  let playHint = `Shelf ${targetShelf} ready`;
  if (!unlocked) {
    playHint = `Tidy ${previousRoomName} first`;
  } else if (tidyHere >= SHELVES_PER_ROOM) {
    playHint = 'All shelves tidy';
  } else if (records[targetShelf]) {
    playHint = `Resume shelf ${targetShelf}`;
  }

  const showStats = cleared > 0 && stars > 0;

  return (
    <AppShell tone="menu">
      <ScreenHeader
        title="Library Floors"
        subtitle={`${cleared} of ${TOTAL_SHELVES} shelves tidy`}
        rightSlot={
          <IconButton Icon={SettingsIcon} onPress={onOpenSettings} label="Open settings" />
        }
      />

      <View style={styles.art}>
        <Text style={styles.hero}>Library</Text>
        <Text style={styles.hero}>Shelf Sort</Text>

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
        ) : null}

        <View style={styles.roomRow}>
          <IconButton
            Icon={ChevronLeft}
            onPress={() => onSelectRoom(room.id > 1 ? room.id - 1 : ROOMS.length)}
            label="Previous room"
          />

          <LinearGradient
            colors={theme.gradients.wood}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.roomCard}>
            <View style={styles.roomInner}>
              <Text style={styles.floorTag} numberOfLines={1}>
                FLOOR {room.floor}
              </Text>
              <Image source={assets.logo} style={styles.roomLogo} resizeMode="contain" />
              <View style={styles.strip}>
                {shelfStrip.map((src, i) => (
                  <Image
                    key={`strip-${i}`}
                    source={src}
                    style={styles.stripItem}
                    resizeMode="contain"
                  />
                ))}
              </View>
              <View style={styles.stripLip} />
            </View>
            {unlocked ? null : (
              <View style={styles.lockBadge}>
                <Lock size={14} color={theme.colors.text.onDark} strokeWidth={2.5} />
              </View>
            )}
          </LinearGradient>

          <IconButton
            Icon={ChevronRight}
            onPress={() => onSelectRoom(room.id < ROOMS.length ? room.id + 1 : 1)}
            label="Next room"
          />
        </View>
      </View>

      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.sheet,
          { opacity: sheetOpacity, transform: [{ translateY: sheetShift }] },
        ]}>
        <Text style={styles.roomName} numberOfLines={1}>
          {room.name}
        </Text>
        <Text style={styles.progressLine} numberOfLines={1}>
          {tidyHere} of {SHELVES_PER_ROOM} shelves tidy here
        </Text>

        <View style={styles.sheetGap} />
        <SecondaryButton
          label="CHOOSE SHELF"
          onPress={() => setPickerOpen(true)}
          tone="paper"
          disabled={!unlocked}
        />

        <Text style={styles.playHint} numberOfLines={1}>
          {playHint}
        </Text>

        {unlocked ? (
          <PrimaryButton
            label="PLAY"
            Icon={Play}
            onPress={() => onPlay(targetShelf)}
            accessibilityLabel={`Play shelf ${targetShelf}`}
          />
        ) : (
          <PrimaryButton label="ROOM LOCKED" Icon={Lock} onPress={() => {}} disabled />
        )}

        <View style={styles.destRow}>
          <View style={styles.destSlot}>
            <SecondaryButton label="Nook" Icon={Sofa} onPress={onOpenNook} tone="paper" />
          </View>
          <View style={styles.destSlot}>
            <SecondaryButton label="Facts" Icon={BookOpen} onPress={onOpenFacts} tone="paper" />
          </View>
          <View style={styles.destSlot}>
            <SecondaryButton
              label="Set"
              Icon={SettingsIcon}
              onPress={onOpenSettings}
              tone="paper"
              accessibilityLabel="Open settings"
            />
          </View>
        </View>
      </Animated.View>

      {pickerOpen ? (
        <LevelPicker
          room={room}
          selectedShelf={pickerShelf}
          records={records}
          onSelect={setPickerShelf}
          onPlay={shelf => {
            setPickerOpen(false);
            onPlay(shelf);
          }}
          onClose={() => setPickerOpen(false)}
        />
      ) : null}
    </AppShell>
  );
}

const styles = StyleSheet.create({
  art: { flex: 1, paddingHorizontal: 16, paddingTop: 12 },
  hero: {
    fontSize: 36,
    lineHeight: 40,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  statsRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  statSlot: { flex: 1 },
  roomRow: {
    flex: 1,
    minHeight: 120,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    marginBottom: 10,
  },
  roomCard: {
    flex: 1,
    alignSelf: 'stretch',
    borderRadius: theme.radius.md,
    borderWidth: 2,
    borderColor: theme.colors.wood.dark,
    padding: 8,
    ...theme.shadows.card,
  },
  roomInner: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: 'rgba(250,245,236,0.88)',
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 6,
    paddingBottom: 8,
    paddingHorizontal: 8,
    overflow: 'hidden',
  },
  floorTag: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: theme.colors.wood.dark,
  },
  roomLogo: { width: 128, height: 54, marginVertical: 4 },
  strip: { flexDirection: 'row', alignItems: 'flex-end', gap: 6 },
  stripItem: { width: 38, height: 38 },
  stripLip: {
    height: 5,
    alignSelf: 'stretch',
    marginTop: 4,
    borderRadius: 3,
    backgroundColor: theme.colors.wood.light,
  },
  lockBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: theme.colors.wood.dark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheet: {
    backgroundColor: theme.colors.ui.surface,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 18,
    ...theme.shadows.sheet,
  },
  roomName: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  progressLine: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '400',
    color: theme.colors.text.muted,
    marginTop: 2,
  },
  sheetGap: { height: 10 },
  playHint: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 8,
  },
  destRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  destSlot: { flex: 1 },
});
