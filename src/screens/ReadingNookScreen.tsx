import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ArrowLeft, Home } from 'lucide-react-native';
import { AppShell } from '../components/AppShell';
import { ScreenHeader } from '../components/ScreenHeader';
import { IconButton } from '../components/IconButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { NookScene } from '../components/NookScene';
import { DecorPicker } from '../components/DecorPicker';
import { theme } from '../constants/theme';
import { DECOR_CATEGORIES, DecorCategory, decorById } from '../constants/decor';

interface Props {
  equipped: Record<DecorCategory, string>;
  clearedShelves: number;
  onEquip: (category: DecorCategory, id: string) => void;
  onBack: () => void;
}

export function ReadingNookScreen({ equipped, clearedShelves, onEquip, onBack }: Props) {
  const [open, setOpen] = useState<DecorCategory | null>(null);
  const openLabel = open ? DECOR_CATEGORIES.filter(c => c.id === open)[0].label : '';

  return (
    <AppShell tone="nook">
      <ScreenHeader
        title="Reading Nook"
        subtitle={`${clearedShelves} shelves tidy`}
        leftSlot={<IconButton Icon={ArrowLeft} onPress={onBack} label="Back to Library Floors" />}
      />

      <View style={styles.body}>
        <NookScene equipped={equipped} />

        <View style={styles.grid}>
          {DECOR_CATEGORIES.map(category => {
            const item = decorById(equipped[category.id]);
            return (
              <Pressable
                key={category.id}
                onPress={() => setOpen(category.id)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityRole="button"
                accessibilityLabel={`Change ${category.label}, currently ${item.name}`}
                style={styles.card}>
                <View style={[styles.swatch, { backgroundColor: item.main, borderColor: item.trim }]} />
                <View style={styles.cardText}>
                  <Text style={styles.cardLabel} numberOfLines={1}>
                    {category.label}
                  </Text>
                  <Text style={styles.cardValue} numberOfLines={1}>
                    {item.name}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        <SecondaryButton label="LIBRARY FLOORS" Icon={Home} onPress={onBack} tone="sage" />
      </View>

      {open ? (
        <DecorPicker
          category={open}
          categoryLabel={openLabel}
          equippedId={equipped[open]}
          clearedShelves={clearedShelves}
          onEquip={id => onEquip(open, id)}
          onClose={() => setOpen(null)}
        />
      ) : null}
    </AppShell>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginVertical: 14 },
  card: {
    width: '48%',
    height: 72,
    flexGrow: 1,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    backgroundColor: theme.colors.ui.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 10,
    ...theme.shadows.card,
  },
  swatch: { width: 28, height: 28, borderRadius: 14, borderWidth: 2 },
  cardText: { flex: 1 },
  cardLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: theme.colors.text.muted,
  },
  cardValue: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
});
