import { test } from "node:test";
import assert from "node:assert/strict";
import { Chess } from "chess.js";
import { dayKey, validatePuzzle, restoreBoard, tryPuzzleMove, readChessState } from "../src/services/chessPuzzle.js";

const puzzle = validatePuzzle({
  puzzle: {
    id: "TpQ6K",
    fen: "1rb4r/2k3bp/2pn2p1/p4p2/2B1p3/N3BP2/PP4PP/1R1R2K1 w - - 0 1",
    solution: ["d1d6", "c7d6", "e3f4", "d6e7", "f4b8"],
  },
});
test("legal and incorrect moves do not change the board", () => {
  const board = new Chess(puzzle.fen);
  assert.equal(tryPuzzleMove(puzzle, 0, board, "d1d8").ok, false);
  assert.match(tryPuzzleMove(puzzle, 0, board, "d1d2").message, /not the puzzle solution/);
  assert.equal(board.fen(), puzzle.fen);
});
test("solution auto-plays replies, restores progress, and completes only at the end", () => {
  const first = tryPuzzleMove(puzzle, 0, new Chess(puzzle.fen), "d1d6");
  assert.equal(first.step, 2);
  assert.equal(first.solved, false);
  const restored = restoreBoard(puzzle, first.step);
  assert.equal(restored.board.fen(), first.board.fen());
  const second = tryPuzzleMove(puzzle, restored.step, restored.board, "e3f4");
  const last = tryPuzzleMove(puzzle, second.step, second.board, "f4b8");
  assert.equal(last.solved, true);
  assert.equal(last.step, 5);
  assert.equal(restoreBoard(puzzle, 5).board.fen(), last.board.fen());
  assert.equal(restoreBoard(puzzle, 3).step, 0);
});
test("invalid API responses and corrupt storage are rejected", () => {
  assert.throws(() => validatePuzzle({ puzzle: { ...puzzle, solution: ["a1a8"] } }));
  assert.deepEqual(readChessState({ getItem: () => "{bad" }), { records: {} });
  assert.deepEqual(
    readChessState({
      getItem() {
        throw Error();
      },
    }),
    { records: {} },
  );
});
test("daily rollover uses UTC and cached puzzle validates again", () => {
  assert.notEqual(dayKey(Date.parse("2026-09-09T23:59:59Z")), dayKey(Date.parse("2026-09-10T00:00:00Z")));
  assert.deepEqual(validatePuzzle({ puzzle }), puzzle);
});
test("underpromotion is validated", () => {
  const promotion = validatePuzzle({
    puzzle: { id: "promo", fen: "8/1P5k/8/8/8/8/8/K7 w - - 0 1", solution: ["b7b8n"] },
  });
  assert.equal(tryPuzzleMove(promotion, 0, new Chess(promotion.fen), "b7b8q").ok, false);
  assert.equal(tryPuzzleMove(promotion, 0, new Chess(promotion.fen), "b7b8n").solved, true);
});
