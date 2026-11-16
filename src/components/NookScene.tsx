import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { ladderSprite } from '../assets';
import { DecorCategory, decorById } from '../constants/decor';
import { theme } from '../constants/theme';

interface Props {
  equipped: Record<DecorCategory, string>;
}

/** Native shapes only: the nook never needs an extra asset name. */
export function NookScene({ equipped }: Props) {
  const seat = decorById(equipped.seat);
  const lamp = decorById(equipped.lamp);
  const plant = decorById(equipped.plant);
  const rug = decorById(equipped.rug);

  return (
    <View style={styles.panel}>
      <View style={styles.lightPool} pointerEvents="none" />

      <View style={styles.floorRow}>
        {/* lamp */}
        <View style={styles.slot}>
          <View style={[styles.lampShade, { backgroundColor: lamp.main, borderColor: lamp.trim }]} />
          <View style={[styles.lampStem, { backgroundColor: lamp.trim }]} />
          <View style={[styles.lampFoot, { backgroundColor: lamp.trim }]} />
          <Text style={styles.caption} numberOfLines={1}>
            {lamp.name}
          </Text>
        </View>

        {/* seat */}
        <View style={styles.slot}>
          <View style={[styles.seatBack, { backgroundColor: seat.trim }]} />
          <View style={[styles.seatPad, { backgroundColor: seat.main }]} />
          <View style={styles.seatLegs}>
            <View style={[styles.leg, { backgroundColor: seat.trim }]} />
            <View style={[styles.leg, { backgroundColor: seat.trim }]} />
          </View>
          <Text style={styles.caption} numberOfLines={1}>
            {seat.name}
          </Text>
        </View>

        {/* plant */}
        <View style={styles.slot}>
          <View style={styles.leaves}>
            <View style={[styles.leaf, { backgroundColor: plant.main, marginRight: -6 }]} />
            <View style={[styles.leafTall, { backgroundColor: plant.main }]} />
            <View style={[styles.leaf, { backgroundColor: plant.main, marginLeft: -6 }]} />
          </View>
          <View style={[styles.pot, { backgroundColor: plant.trim }]} />
          <Text style={styles.caption} numberOfLines={1}>
            {plant.name}
          </Text>
        </View>
      </View>

      <View style={[styles.rug, { backgroundColor: rug.main, borderColor: rug.trim }]}>
        <View style={[styles.rugStripe, { backgroundColor: rug.trim }]} />
        <Text style={styles.rugCaption} numberOfLines={1}>
          {rug.name}
        </Text>
      </View>

      <Image source={ladderSprite} style={styles.ladder} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    flex: 1,
    minHeight: 184,
    borderRadius: theme.radius.lg,
    backgroundColor: 'rgba(250,245,236,0.88)',
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    padding: 12,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    ...theme.shadows.card,
  },
  lightPool: {
    position: 'absolute',
    top: 10,
    left: 40,
    width: 180,
    height: 110,
    borderRadius: 90,
    backgroundColor: 'rgba(217,179,108,0.22)',
  },
  floorRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  slot: { alignItems: 'center', width: 86 },
  lampShade: { width: 42, height: 26, borderRadius: 6, borderWidth: 1 },
  lampStem: { width: 4, height: 34 },
  lampFoot: { width: 28, height: 5, borderRadius: 3 },
  seatBack: { width: 40, height: 26, borderRadius: 6 },
  seatPad: { width: 52, height: 14, borderRadius: 5, marginTop: 2 },
  seatLegs: { flexDirection: 'row', gap: 30, marginTop: 2 },
  leg: { width: 5, height: 16, borderRadius: 2 },
  leaves: { flexDirection: 'row', alignItems: 'flex-end' },
  leaf: { width: 16, height: 26, borderRadius: 10 },
  leafTall: { width: 16, height: 36, borderRadius: 10 },
  pot: { width: 34, height: 20, borderTopLeftRadius: 4, borderTopRightRadius: 4, borderBottomLeftRadius: 10, borderBottomRightRadius: 10, marginTop: 2 },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    color: theme.colors.text.muted,
    marginTop: 4,
  },
  rug: {
    height: 34,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rugStripe: { position: 'absolute', left: 16, right: 16, height: 3, borderRadius: 2, top: 6 },
  rugCaption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  ladder: { position: 'absolute', right: 12, top: 12, width: 40, height: 40, opacity: 0.9 },
});
