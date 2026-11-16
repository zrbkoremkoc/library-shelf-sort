import { ROOMS, firstShelfOfRoom, localShelfIndex, roomIndexForShelf } from '../constants/rooms';
import { SHELVES_PER_ROOM, TOTAL_SHELVES } from '../constants/config';
import { DECOR_ITEMS, DecorItem } from '../constants/decor';
import { ShelfRecord } from './scoring';

export type RecordMap = Record<number, ShelfRecord>;

export function clearedCount(records: RecordMap): number {
  return Object.keys(records).length;
}

/** The highest shelf the player may start: one past the best cleared shelf. */
export function nextUnlockedShelf(records: RecordMap): number {
  let highest = 0;
  for (const key of Object.keys(records)) {
    const shelf = Number(key);
    if (shelf > highest) {
      highest = shelf;
    }
  }
  return Math.min(highest + 1, TOTAL_SHELVES);
}

export function isShelfUnlocked(shelf: number, records: RecordMap): boolean {
  return shelf <= nextUnlockedShelf(records);
}

export function isRoomUnlocked(roomId: number, records: RecordMap): boolean {
  return firstShelfOfRoom(roomId) <= nextUnlockedShelf(records);
}

export function roomsCleared(records: RecordMap): number {
  let count = 0;
  for (const room of ROOMS) {
    const first = firstShelfOfRoom(room.id);
    let all = true;
    for (let s = first; s < first + SHELVES_PER_ROOM; s++) {
      if (!records[s]) {
        all = false;
        break;
      }
    }
    if (all) {
      count += 1;
    } else {
      break;
    }
  }
  return count;
}

export function shelvesTidyInRoom(roomId: number, records: RecordMap): number {
  const first = firstShelfOfRoom(roomId);
  let count = 0;
  for (let s = first; s < first + SHELVES_PER_ROOM; s++) {
    if (records[s]) {
      count += 1;
    }
  }
  return count;
}

export function totalStars(records: RecordMap): number {
  return Object.values(records).reduce((sum, r) => sum + r.stars, 0);
}

/** Decor is derived from cleared shelves, so a replay can never award it twice. */
export function unlockedDecorIds(records: RecordMap): string[] {
  const cleared = clearedCount(records);
  return DECOR_ITEMS.filter(item => item.requiresShelves <= cleared).map(item => item.id);
}

export function isDecorUnlocked(item: DecorItem, records: RecordMap): boolean {
  return item.requiresShelves <= clearedCount(records);
}

/** Reward announced on the result screen, if this clear opened something new. */
export function rewardForClear(shelf: number, recordsBefore: RecordMap): DecorItem | null {
  if (recordsBefore[shelf]) {
    return null;
  }
  const before = clearedCount(recordsBefore);
  const after = before + 1;
  const found = DECOR_ITEMS.find(item => item.requiresShelves === after);
  return found ?? null;
}

export function roomNameForShelf(shelf: number): string {
  return ROOMS[roomIndexForShelf(shelf)].name;
}

export function shelfLabel(shelf: number): string {
  return `Shelf ${shelf}`;
}

export function localShelfLabel(shelf: number): string {
  return `Shelf ${localShelfIndex(shelf)} of ${SHELVES_PER_ROOM}`;
}
