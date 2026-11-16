import {
  BAY_INNER_PAD,
  BOARD_FRAME,
  BOARD_GAP,
  BOARD_MAX_W,
  BOARD_ROWS,
  BOOK_MAX_RATIO,
  BOOK_MIN_RATIO,
  CELL_H,
} from '../constants/config';

export interface BoardGeometry {
  columns: number;
  rows: number;
  cellWidth: number;
  cellHeight: number;
  boardWidth: number;
  boardHeight: number;
  /** cells rendered, including the non-interactive rule tile */
  cellCount: number;
}

/** Two rows always; three or four bays use two columns, five or six use three. */
export function boardGeometry(bayCount: number): BoardGeometry {
  const columns = bayCount <= 4 ? 2 : 3;
  const rows = BOARD_ROWS;
  const inner = BOARD_MAX_W - 2 * BOARD_FRAME - (columns - 1) * BOARD_GAP;
  const cellWidth = Math.floor(inner / columns);
  const boardWidth = cellWidth * columns + (columns - 1) * BOARD_GAP + 2 * BOARD_FRAME;
  const boardHeight = CELL_H * rows + (rows - 1) * BOARD_GAP + 2 * BOARD_FRAME;
  return {
    columns,
    rows,
    cellWidth,
    cellHeight: CELL_H,
    boardWidth,
    boardHeight,
    cellCount: columns * rows,
  };
}

/** Width of a book inside a bay cell; rank 1 is shortest, rank `capacity` tallest. */
export function bookWidth(rank: number, capacity: number, cellWidth: number): number {
  const available = cellWidth - 2 * BAY_INNER_PAD;
  if (capacity <= 1) {
    return Math.floor(available * BOOK_MAX_RATIO);
  }
  const t = (rank - 1) / (capacity - 1);
  const ratio = BOOK_MIN_RATIO + (BOOK_MAX_RATIO - BOOK_MIN_RATIO) * t;
  return Math.floor(available * ratio);
}
