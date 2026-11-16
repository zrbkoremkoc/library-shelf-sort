import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Lock, Star, X } from 'lucide-react-native';
import { PrimaryButton } from './PrimaryButton';
import { IconButton } from './IconButton';
import { theme } from '../constants/theme';
import { SHELVES_PER_ROOM, SCREEN } from '../constants/config';
import { RoomDef, firstShelfOfRoom } from '../constants/rooms';
import { RecordMap, isShelfUnlocked, nextUnlockedShelf } from '../game/progression';

interface Props {
  room: RoomDef;
  selectedShelf: number;
  records: RecordMap;
  onSelect: (shelf: number) => void;
  onPlay: (shelf: number) => void;
  onClose: () => void;
}

const PANEL_W = Math.min(SCREEN.width - 32, 348);
const CELL_W = Math.floor((PANEL_W - 32 - 24) / 4);

export function LevelPicker({ room, selectedShelf, records, onSelect, onPlay, onClose }: Props) {
  const first = firstShelfOfRoom(room.id);
  const shelves = Array.from({ length: SHELVES_PER_ROOM }, (_, i) => first + i);
  const nextShelf = nextUnlockedShelf(records);
  const canPlay = isShelfUnlocked(selectedShelf, records);

  return (
    <View style={styles.backdrop}>
      <View style={styles.panel}>
        <View style={styles.head}>
          <Text style={styles.title} numberOfLines={1}>
            Choose shelf
          </Text>
          <IconButton Icon={X} onPress={onClose} label="Close shelf picker" />
        </View>
        <Text style={styles.sub} numberOfLines={1}>
          {room.name}
        </Text>

        <View style={styles.grid}>
          {shelves.map(shelf => {
            const record = records[shelf];
            const unlocked = isShelfUnlocked(shelf, records);
            const isNext = shelf === nextShelf;
            const selected = shelf === selectedShelf;
            return (
              <Pressable
                key={shelf}
                onPress={() => onSelect(shelf)}
                disabled={!unlocked}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityRole="button"
                accessibilityLabel={
                  unlocked
                    ? `Shelf ${shelf}${record ? `, ${record.stars} stars` : ', not tidy yet'}`
                    : `Shelf ${shelf}, locked`
                }
                accessibilityState={{ disabled: !unlocked, selected }}
                style={[
                  styles.cell,
                  record ? styles.cellDone : null,
                  isNext && !record ? styles.cellNext : null,
                  selected ? styles.cellSelected : null,
                  !unlocked ? styles.cellLocked : null,
                ]}>
                {unlocked ? (
                  <>
                    <Text style={styles.cellText}>{shelf}</Text>
                    {record ? (
                      <View style={styles.starRow}>
                        {[0, 1, 2].map(i => (
                          <Star
                            key={i}
                            size={9}
                            color={
                              i < record.stars ? theme.colors.earth.mustard : theme.colors.ui.border
                            }
                            fill={i < record.stars ? theme.colors.earth.mustard : 'transparent'}
                            strokeWidth={2}
                          />
                        ))}
                      </View>
                    ) : null}
                  </>
                ) : (
                  <Lock size={18} color={theme.colors.text.muted} strokeWidth={2} />
                )}
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.hint} numberOfLines={1}>
          {canPlay ? `Shelf ${selectedShelf} ready` : 'Tidy earlier shelves first'}
        </Text>
        <PrimaryButton
          label={`PLAY SHELF ${selectedShelf}`}
          onPress={() => onPlay(selectedShelf)}
          disabled={!canPlay}
        />
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
    paddingHorizontal: 16,
  },
  panel: {
    width: PANEL_W,
    backgroundColor: theme.colors.ui.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    padding: 16,
    ...theme.shadows.sheet,
  },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: {
    flex: 1,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  sub: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: theme.colors.text.muted,
    marginBottom: 12,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  cell: {
    width: CELL_W,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    backgroundColor: theme.colors.ui.surfaceWarm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellDone: { backgroundColor: 'rgba(179,221,176,0.45)', borderColor: theme.colors.earth.olive },
  cellNext: { borderColor: theme.colors.action.primary, borderWidth: 2 },
  cellSelected: { borderColor: theme.colors.action.primary, borderWidth: 2 },
  cellLocked: { backgroundColor: 'rgba(216,201,168,0.30)', opacity: 0.7 },
  cellText: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '700',
    color: theme.colors.text.primary,
    fontVariant: ['tabular-nums'],
  },
  starRow: { flexDirection: 'row', gap: 1, marginTop: 1 },
  hint: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: 14,
    marginBottom: 8,
  },
});
