import type { Chess } from "chess.js";
type Puzzle = { id: string; fen: string; solution: string[]; rating: number | null };
export const CHESS_STORAGE_KEY: string;
export function dayKey(now?: number): string;
export function uciMove(move: string): { from: string; to: string; promotion?: string };
export function validatePuzzle(data: unknown): Puzzle;
export function readChessState(storage: Storage): { records: Record<string, { step: number; solved: boolean }> };
export function restoreBoard(puzzle: Puzzle, step: number): { board: Chess; step: number };
export function tryPuzzleMove(
  puzzle: Puzzle,
  step: number,
  board: Chess,
  move: string,
): { ok: boolean; message?: string; board?: Chess; step?: number; reply?: string; solved?: boolean };
