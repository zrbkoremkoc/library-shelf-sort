import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Check, Lock, X } from 'lucide-react-native';
import { IconButton } from './IconButton';
import { SecondaryButton } from './SecondaryButton';
import { theme } from '../constants/theme';
import { SCREEN } from '../constants/config';
import { DecorCategory, decorForCategory } from '../constants/decor';

interface Props {
  category: DecorCategory;
  categoryLabel: string;
  equippedId: string;
  clearedShelves: number;
  onEquip: (id: string) => void;
  onClose: () => void;
}

const PANEL_W = Math.min(SCREEN.width - 32, 348);
const CELL_W = Math.floor((PANEL_W - 32 - 16) / 3);

export function DecorPicker({
  category,
  categoryLabel,
  equippedId,
  clearedShelves,
  onEquip,
  onClose,
}: Props) {
  const items = decorForCategory(category);

  return (
    <View style={styles.backdrop}>
      <View style={styles.panel}>
        <View style={styles.head}>
          <Text style={styles.title} numberOfLines={1}>
            {categoryLabel}
          </Text>
          <IconButton Icon={X} onPress={onClose} label="Close chooser" />
        </View>

        <View style={styles.grid}>
          {items.map(item => {
            const unlocked = item.requiresShelves <= clearedShelves;
            const equipped = item.id === equippedId;
            return (
              <Pressable
                key={item.id}
                onPress={() => (unlocked ? onEquip(item.id) : undefined)}
                disabled={!unlocked}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityRole="button"
                accessibilityLabel={
                  unlocked
                    ? `${item.name}${equipped ? ', in use' : ''}`
                    : `${item.name}, tidy ${item.requiresShelves} shelves to open`
                }
                accessibilityState={{ disabled: !unlocked, selected: equipped }}
                style={[
                  styles.cell,
                  { width: CELL_W },
                  equipped ? styles.cellSelected : null,
                  !unlocked ? styles.cellLocked : null,
                ]}>
                <View style={[styles.swatch, { backgroundColor: item.main, borderColor: item.trim }]}>
                  {equipped ? (
                    <Check size={16} color={theme.colors.text.primary} strokeWidth={3} />
                  ) : null}
                  {!unlocked ? (
                    <Lock size={14} color={theme.colors.text.primary} strokeWidth={2.5} />
                  ) : null}
                </View>
                <Text style={styles.name} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={styles.state} numberOfLines={1}>
                  {unlocked ? (equipped ? 'In use' : 'Use') : `${item.requiresShelves} shelves`}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.close}>
          <SecondaryButton label="DONE" onPress={onClose} tone="paper" />
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
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  title: { flex: 1, fontSize: 24, lineHeight: 30, fontWeight: '700', color: theme.colors.text.primary },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  cell: {
    height: 96,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    backgroundColor: theme.colors.ui.surfaceWarm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  cellSelected: { borderColor: theme.colors.action.primary, borderWidth: 2 },
  cellLocked: { opacity: 0.6 },
  swatch: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '600',
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  state: {
    fontSize: 12,
    lineHeight: 16,
    color: theme.colors.text.muted,
    textAlign: 'center',
  },
  close: { marginTop: 14 },
});
