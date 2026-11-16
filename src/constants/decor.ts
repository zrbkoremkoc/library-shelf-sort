export type DecorCategory = 'seat' | 'lamp' | 'plant' | 'rug';

export interface DecorItem {
  id: string;
  category: DecorCategory;
  name: string;
  /** shelves that must be tidy before this item can be equipped (0 = default) */
  requiresShelves: number;
  /** material colours used by the vector nook scene */
  main: string;
  trim: string;
}

export const DECOR_CATEGORIES: { id: DecorCategory; label: string }[] = [
  { id: 'seat', label: 'Seat' },
  { id: 'lamp', label: 'Lamp' },
  { id: 'plant', label: 'Plant' },
  { id: 'rug', label: 'Rug' },
];

export const DECOR_ITEMS: DecorItem[] = [
  { id: 'seat_plain', category: 'seat', name: 'Plain Chair', requiresShelves: 0, main: '#B88B61', trim: '#8A6245' },
  { id: 'seat_oak', category: 'seat', name: 'Oak Chair', requiresShelves: 10, main: '#8A6245', trim: '#D9B36C' },
  { id: 'seat_cushion', category: 'seat', name: 'Cushioned Chair', requiresShelves: 50, main: '#71AB2A', trim: '#B3DDB0' },
  { id: 'seat_armchair', category: 'seat', name: 'Reading Armchair', requiresShelves: 90, main: '#D97B4D', trim: '#F2EAD8' },
  { id: 'seat_bench', category: 'seat', name: 'Window Bench', requiresShelves: 130, main: '#2891E0', trim: '#67B3EA' },
  { id: 'seat_rocker', category: 'seat', name: 'Cozy Rocker', requiresShelves: 170, main: '#7A648F', trim: '#D8C9A8' },

  { id: 'lamp_paper', category: 'lamp', name: 'Paper Lamp', requiresShelves: 0, main: '#F2EAD8', trim: '#D8C9A8' },
  { id: 'lamp_amber', category: 'lamp', name: 'Amber Lamp', requiresShelves: 20, main: '#D9B36C', trim: '#8A6245' },
  { id: 'lamp_arc', category: 'lamp', name: 'Arc Lamp', requiresShelves: 60, main: '#4D5940', trim: '#B3DDB0' },
  { id: 'lamp_lantern', category: 'lamp', name: 'Paper Lantern', requiresShelves: 100, main: '#FAF5EC', trim: '#D97B4D' },
  { id: 'lamp_brass', category: 'lamp', name: 'Brass Lamp', requiresShelves: 140, main: '#B88B61', trim: '#D9B36C' },
  { id: 'lamp_library', category: 'lamp', name: 'Library Lamp', requiresShelves: 180, main: '#71AB2A', trim: '#D9B36C' },

  { id: 'plant_fern_small', category: 'plant', name: 'Small Fern', requiresShelves: 0, main: '#71AB2A', trim: '#B88B61' },
  { id: 'plant_fern_pot', category: 'plant', name: 'Fern Pot', requiresShelves: 30, main: '#B3DDB0', trim: '#D97B4D' },
  { id: 'plant_ivy', category: 'plant', name: 'Trailing Ivy', requiresShelves: 70, main: '#4D5940', trim: '#71AB2A' },
  { id: 'plant_flower', category: 'plant', name: 'Flower Pot', requiresShelves: 110, main: '#D97B4D', trim: '#B3DDB0' },
  { id: 'plant_broadleaf', category: 'plant', name: 'Broad Leaf Plant', requiresShelves: 150, main: '#71AB2A', trim: '#8A6245' },
  { id: 'plant_tree', category: 'plant', name: 'Mini Tree', requiresShelves: 190, main: '#4D5940', trim: '#B88B61' },

  { id: 'rug_woven', category: 'rug', name: 'Woven Mat', requiresShelves: 0, main: '#D8C9A8', trim: '#B88B61' },
  { id: 'rug_sage', category: 'rug', name: 'Sage Rug', requiresShelves: 40, main: '#B3DDB0', trim: '#71AB2A' },
  { id: 'rug_runner', category: 'rug', name: 'Woven Runner', requiresShelves: 80, main: '#D9B36C', trim: '#8A6245' },
  { id: 'rug_blue', category: 'rug', name: 'Blue Mat', requiresShelves: 120, main: '#67B3EA', trim: '#2891E0' },
  { id: 'rug_terracotta', category: 'rug', name: 'Terracotta Rug', requiresShelves: 160, main: '#D97B4D', trim: '#F2EAD8' },
  { id: 'rug_pattern', category: 'rug', name: 'Patterned Rug', requiresShelves: 200, main: '#7A648F', trim: '#D9B36C' },
];

export const DEFAULT_DECOR: Record<DecorCategory, string> = {
  seat: 'seat_plain',
  lamp: 'lamp_paper',
  plant: 'plant_fern_small',
  rug: 'rug_woven',
};

export function decorById(id: string): DecorItem {
  return DECOR_ITEMS.find(d => d.id === id) ?? DECOR_ITEMS[0];
}

export function decorForCategory(category: DecorCategory): DecorItem[] {
  return DECOR_ITEMS.filter(d => d.category === category);
}
