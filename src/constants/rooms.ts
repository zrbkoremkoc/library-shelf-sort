import { SHELVES_PER_ROOM } from './config';

export interface RoomDef {
  id: number;
  floor: number;
  name: string;
  /** colour families active on this room's shelves */
  families: number;
  /** books per family, equal to a bay's capacity */
  capacity: number;
  /** extra empty bays beyond one per family */
  extraBays: number;
  /** requested reverse-scramble depth across the room */
  depthFrom: number;
  depthTo: number;
  decorAtTen: string;
  decorAtTwenty: string;
}

export const ROOMS: RoomDef[] = [
  { id: 1, floor: 1, name: 'Quiet Reading Room', families: 2, capacity: 3, extraBays: 1, depthFrom: 8, depthTo: 12, decorAtTen: 'Oak Chair', decorAtTwenty: 'Amber Lamp' },
  { id: 2, floor: 1, name: 'Picture Book Room', families: 2, capacity: 4, extraBays: 1, depthFrom: 12, depthTo: 16, decorAtTen: 'Fern Pot', decorAtTwenty: 'Sage Rug' },
  { id: 3, floor: 2, name: 'Garden Window Room', families: 3, capacity: 3, extraBays: 1, depthFrom: 14, depthTo: 18, decorAtTen: 'Cushioned Chair', decorAtTwenty: 'Arc Lamp' },
  { id: 4, floor: 2, name: 'Poetry Room', families: 3, capacity: 4, extraBays: 1, depthFrom: 18, depthTo: 22, decorAtTen: 'Trailing Ivy', decorAtTwenty: 'Woven Runner' },
  { id: 5, floor: 3, name: 'Classics Room', families: 3, capacity: 4, extraBays: 1, depthFrom: 22, depthTo: 26, decorAtTen: 'Reading Armchair', decorAtTwenty: 'Paper Lantern' },
  { id: 6, floor: 3, name: 'Map Room', families: 3, capacity: 4, extraBays: 2, depthFrom: 24, depthTo: 28, decorAtTen: 'Flower Pot', decorAtTwenty: 'Blue Mat' },
  { id: 7, floor: 4, name: 'History Room', families: 3, capacity: 4, extraBays: 2, depthFrom: 26, depthTo: 30, decorAtTen: 'Window Bench', decorAtTwenty: 'Brass Lamp' },
  { id: 8, floor: 4, name: 'Story Gallery', families: 4, capacity: 4, extraBays: 2, depthFrom: 28, depthTo: 32, decorAtTen: 'Broad Leaf Plant', decorAtTwenty: 'Terracotta Rug' },
  { id: 9, floor: 5, name: 'Lantern Room', families: 4, capacity: 4, extraBays: 2, depthFrom: 32, depthTo: 36, decorAtTen: 'Cozy Rocker', decorAtTwenty: 'Library Lamp' },
  { id: 10, floor: 5, name: 'Grand Library', families: 4, capacity: 4, extraBays: 2, depthFrom: 36, depthTo: 40, decorAtTen: 'Mini Tree', decorAtTwenty: 'Patterned Rug' },
];

export const FLOOR_NAMES = ['Floor 1', 'Floor 2', 'Floor 3', 'Floor 4', 'Floor 5'];

export function roomIndexForShelf(shelf: number): number {
  const idx = Math.floor((shelf - 1) / SHELVES_PER_ROOM);
  return Math.min(Math.max(idx, 0), ROOMS.length - 1);
}

export function roomForShelf(shelf: number): RoomDef {
  return ROOMS[roomIndexForShelf(shelf)];
}

/** 1..20 inside its room */
export function localShelfIndex(shelf: number): number {
  return ((shelf - 1) % SHELVES_PER_ROOM) + 1;
}

export function firstShelfOfRoom(roomId: number): number {
  return (roomId - 1) * SHELVES_PER_ROOM + 1;
}

export function roomsOnFloor(floor: number): RoomDef[] {
  return ROOMS.filter(r => r.floor === floor);
}

/** requested reverse-scramble depth for a shelf */
export function scrambleDepth(shelf: number): number {
  const room = roomForShelf(shelf);
  const k = localShelfIndex(shelf);
  const span = room.depthTo - room.depthFrom;
  return room.depthFrom + Math.floor(((k - 1) * span) / (SHELVES_PER_ROOM - 1));
}
