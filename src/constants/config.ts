import { Dimensions } from 'react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export const SCREEN = { width: SCREEN_W, height: SCREEN_H };

/** Branded splash duration. Must stay at 8000 ms (pipeline screenshot window). */
export const LOADER_DURATION_MS = 8000;

export const TOP_INSET = 44;
export const BOTTOM_INSET = 16;

/** Board geometry (see boardGeometry.ts for the derived values). */
export const BOARD_MAX_W = Math.min(SCREEN_W - 32, 380);
export const BOARD_PAD = 6;
export const BOARD_BORDER = 2;
export const BOARD_FRAME = BOARD_PAD + BOARD_BORDER; // 8
export const BOARD_GAP = 8;
export const BOARD_ROWS = 2;
export const CELL_H = 132;

/** Book rendering. */
export const BOOK_THICKNESS = 20;
export const BOOK_SEPARATOR = 2;
export const BOOK_MIN_RATIO = 0.55;
export const BOOK_MAX_RATIO = 1;
export const BAY_INNER_PAD = 6;

/** Timings (ms). */
export const TIMING = {
  lift: 150,
  transfer: 200,
  settle: 150,
  press: 80,
  screenFade: 200,
  hint: 1200,
  pulse: 180,
  reduced: 100,
  star: 90,
};

/** Shelves. */
export const SHELVES_PER_ROOM = 20;
export const ROOM_COUNT = 10;
export const TOTAL_SHELVES = SHELVES_PER_ROOM * ROOM_COUNT; // 200
export const LADDER_CAPACITY = 1;

export const HINTS = {
  firstTap: 'Tap a bay to lift its top book.',
  afterSelect: 'Tap an empty bay or match the color.',
  ladder: "Use the ladder's extra spot to put heights in order.",
  rule: 'Tallest at the bottom',
  needBook: 'Choose a book first',
  matchColor: 'Match the color',
  bayFull: 'This bay is full',
  ladderFull: 'The ladder holds one book',
  heightOrder: 'Height order',
  stuck: 'Try Undo, the ladder, or PLAY AGAIN',
  solved: 'Tallest below, shortest on top.',
};
