import { Chess } from "chess.js";

export const CHESS_STORAGE_KEY = "daily-chess:v1";
export const dayKey = (now = Date.now()) => new Date(now).toISOString().slice(0, 10);
export const uciMove = (move) => ({ from: move.slice(0, 2), to: move.slice(2, 4), promotion: move[4] });

export function validatePuzzle(data) {
  const puzzle = data?.puzzle;
  if (
    !puzzle ||
    !/^[a-zA-Z0-9]+$/.test(puzzle.id) ||
    !Array.isArray(puzzle.solution) ||
    !puzzle.solution.length ||
    puzzle.solution.length > 100 ||
    !puzzle.solution.every((move) => typeof move === "string" && /^[a-h][1-8][a-h][1-8][qrbn]?$/.test(move))
  ) {
    throw new Error("Invalid puzzle");
  }
  const board = new Chess();
  if (puzzle.fen) board.load(puzzle.fen);
  else {
    board.loadPgn(data.game.pgn);
    const moves = board.history();
    if (!Number.isInteger(puzzle.initialPly) || puzzle.initialPly < 0 || moves.length < puzzle.initialPly + 1)
      throw new Error("Invalid position");
    while (board.history().length > puzzle.initialPly + 1) board.undo();
  }
  const fen = board.fen();
  for (const move of puzzle.solution) board.move(uciMove(move));
  return {
    id: puzzle.id,
    fen,
    solution: puzzle.solution,
    rating: Number.isFinite(puzzle.rating) ? puzzle.rating : null,
  };
}

export function readChessState(storage) {
  try {
    const value = JSON.parse(storage.getItem(CHESS_STORAGE_KEY));
    if (!value || typeof value.records !== "object" || !value.records || Array.isArray(value.records))
      return { records: {} };
    const records = Object.fromEntries(
      Object.entries(value.records).filter(
        ([id, record]) =>
          /^[a-zA-Z0-9]+$/.test(id) &&
          record &&
          Number.isInteger(record.step) &&
          record.step >= 0 &&
          record.step <= 100 &&
          typeof record.solved === "boolean",
      ),
    );
    return { records };
  } catch {
    return { records: {} };
  }
}

export function restoreBoard(puzzle, step) {
  const board = new Chess(puzzle.fen);
  const safeStep =
    Number.isInteger(step) &&
    step >= 0 &&
    step <= puzzle.solution.length &&
    (step % 2 === 0 || step === puzzle.solution.length)
      ? step
      : 0;
  for (const move of puzzle.solution.slice(0, safeStep)) board.move(uciMove(move));
  return { board, step: safeStep };
}

export function tryPuzzleMove(puzzle, step, board, move) {
  const candidate = new Chess(board.fen());
  try {
    candidate.move(uciMove(move));
  } catch {
    return { ok: false, message: "That move is not legal. Try another square." };
  }
  if (move !== puzzle.solution[step])
    return { ok: false, message: "Legal move, but not the puzzle solution. Try again." };
  step++;
  let reply = "";
  if (step < puzzle.solution.length) {
    reply = candidate.move(uciMove(puzzle.solution[step])).san;
    step++;
  }
  return { ok: true, board: candidate, step, reply, solved: step === puzzle.solution.length };
}
