<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, shallowRef } from "vue";
import { Chess, type Square } from "chess.js";
import {
  CHESS_STORAGE_KEY,
  dayKey,
  readChessState,
  restoreBoard,
  tryPuzzleMove,
  uciMove,
  validatePuzzle,
} from "../services/chessPuzzle";

type Puzzle = { id: string; fen: string; solution: string[]; rating: number | null };
const CACHE_KEY = "daily-chess-cache:v1";
const dialog = ref<HTMLDialogElement>();
const open = ref(false);
const loading = ref(false);
const error = ref("");
const notice = ref("");
const message = ref("Select a piece, then its destination.");
const puzzle = ref<Puzzle>();
const board = shallowRef(new Chess());
const displayBoard = shallowRef(new Chess());
const animating = ref(false);
const hintLevel = ref(0);
const feedback = ref('neutral');
const lastMove = ref<string[]>([]);
const wrongSquare = ref('');
const practice = ref(false);
let animationRun = 0;
type FlyingPiece = { from: Square; to: Square; type: string; color: string };
const flying = ref<FlyingPiece[]>([]);
const hintMove = computed(() => puzzle.value?.solution[step.value] ?? '');
const totalMoves = computed(() => Math.ceil((puzzle.value?.solution.length ?? 0) / 2));
const completedMoves = computed(() => Math.ceil(step.value / 2));
function position(square: string) {
  const file = square.charCodeAt(0) - 97;
  const rank = Number(square[1]) - 1;
  return player.value === 'w' ? { x: file, y: 7 - rank } : { x: 7 - file, y: rank };
}
function flyingStyle(piece: FlyingPiece) {
  const from = position(piece.from), to = position(piece.to);
  return { left: `${from.x * 12.5}%`, top: `${from.y * 12.5}%`, '--dx': `${(to.x - from.x) * 100}%`, '--dy': `${(to.y - from.y) * 100}%` };
}
const hintArrow = computed(() => {
  if (hintLevel.value < 2 || !hintMove.value) return undefined;
  const from = position(hintMove.value.slice(0, 2)), to = position(hintMove.value.slice(2, 4));
  return { x1: from.x + .5, y1: from.y + .5, x2: to.x + .5, y2: to.y + .5 };
});
function cancelAnimation() { animationRun++; flying.value = []; animating.value = false; }
function resetPresentation() {
  cancelAnimation(); displayBoard.value = new Chess(board.value.fen());
  hintLevel.value = 0; lastMove.value = []; wrongSquare.value = ''; feedback.value = solved.value ? 'success' : 'neutral';
}
const pause = (ms: number) => new Promise<void>(resolve => window.setTimeout(resolve, ms));
async function animateMove(uci: string, run: number) {
  const from = uci.slice(0, 2) as Square, to = uci.slice(2, 4) as Square;
  const piece = displayBoard.value.get(from);
  if (!piece || run !== animationRun) return;
  const next = new Chess(displayBoard.value.fen());
  const move = next.move(uciMove(uci));
  const movers: FlyingPiece[] = [{ from, to, type: piece.type, color: piece.color }];
  if (move.isKingsideCastle() || move.isQueensideCastle()) {
    const rank = from[1];
    movers.push({ from: `${move.isKingsideCastle() ? 'h' : 'a'}${rank}` as Square, to: `${move.isKingsideCastle() ? 'f' : 'd'}${rank}` as Square, type: 'r', color: piece.color });
  }
  lastMove.value = [from, to];
  flying.value = movers;
  await nextTick();
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) await pause(280);
  if (run !== animationRun) return;
  displayBoard.value = next;
  flying.value = [];
}
function hint() {
  if (animating.value || solved.value || !hintMove.value) return;
  hintLevel.value = Math.min(2, hintLevel.value + 1);
  selected.value = undefined; wrongSquare.value = ''; feedback.value = 'hint';
  const from = hintMove.value.slice(0, 2) as Square;
  const piece = board.value.get(from);
  message.value = hintLevel.value === 1 ? `Look at your ${names[piece!.type]} on ${from}.` : `Try ${from} → ${hintMove.value.slice(2, 4)}${hintMove.value[4] ? `, promoting to ${names[hintMove.value[4]]}` : ''}.`;
}
function practiceAgain() {
  if (!puzzle.value || animating.value) return;
  practice.value = true; board.value = new Chess(puzzle.value.fen); step.value = 0; solved.value = false;
  selected.value = undefined; promotion.value = undefined; resetPresentation();
  message.value = 'Play through it again. Your points are already saved.';
}
const selected = ref<Square>();
const promotion = ref<{ from: Square; to: Square }>();
const step = ref(0);
const solved = ref(false);
const now = ref(Date.now());
const activeDay = ref("");
let retryAt = 0;
let controller: AbortController | undefined;
let previousFocus: HTMLElement | null = null;
let previousOverflow = "";
const records = ref<Record<string, { step: number; solved: boolean }>>({});
const points = computed(() => Object.values(records.value).filter((record) => record.solved).length * 100);
const player = computed(() => (puzzle.value ? new Chess(puzzle.value.fen).turn() : "w"));
const cells = computed(() => {
  const files = player.value === "w" ? "abcdefgh" : "hgfedcba";
  const ranks = player.value === "w" ? "87654321" : "12345678";
  return [...ranks].flatMap((rank) =>
    [...files].map((file) => {
      const square = `${file}${rank}` as Square;
      return { square, piece: displayBoard.value.get(square), dark: (file.charCodeAt(0) + Number(rank)) % 2 === 0 };
    }),
  );
});
const destinations = computed(() =>
  selected.value ? board.value.moves({ square: selected.value, verbose: true }).map((move) => move.to) : [],
);
const pieces: Record<string, string> = { k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟" };
const names: Record<string, string> = { k: "king", q: "queen", r: "rook", b: "bishop", n: "knight", p: "pawn" };
const countdown = computed(() => {
  const seconds = Math.ceil((Date.parse(`${dayKey(now.value)}T00:00:00Z`) + 86400000 - now.value) / 1000);
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
});

function save() {
  if (!puzzle.value) return;
  const previous = records.value[puzzle.value.id];
  records.value[puzzle.value.id] = { step: Math.max(step.value, previous?.step ?? 0), solved: solved.value || previous?.solved === true };
  try {
    const latest = readChessState(localStorage).records;
    const existing = latest[puzzle.value.id];
    records.value = {
      ...records.value,
      ...latest,
      [puzzle.value.id]: {
        step: Math.max(step.value, existing?.step ?? 0),
        solved: solved.value || existing?.solved === true || previous?.solved === true,
      },
    };
    localStorage.setItem(CHESS_STORAGE_KEY, JSON.stringify({ records: records.value }));
  } catch {
    notice.value = "Browser storage is unavailable. Progress will last only for this visit.";
  }
}

async function loadPuzzle() {
  if (loading.value) return;
  const day = dayKey();
  loading.value = true;
  cancelAnimation();
  practice.value = false;
  error.value = "";
  selected.value = undefined;
  promotion.value = undefined;
  controller = new AbortController();
  const timeout = window.setTimeout(() => controller?.abort(), 12000);
  try {
    try { records.value = { ...records.value, ...readChessState(localStorage).records }; }
    catch { notice.value = "Browser storage is unavailable. Progress will last only for this visit."; }
    let data;
    try {
      const cache = JSON.parse(localStorage.getItem(CACHE_KEY) ?? "null");
      if (cache?.day === day) data = validatePuzzle({ puzzle: cache.puzzle });
    } catch {
      /* Ignore invalid or unavailable cache. */
    }
    if (!data) {
      const response = await fetch("https://lichess.org/api/puzzle/daily", {
        signal: controller.signal,
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error("Puzzle unavailable");
      data = validatePuzzle(await response.json());
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ day, puzzle: data }));
      } catch {
        notice.value = "Browser storage is unavailable. Progress will last only for this visit.";
      }
    }
    if (day !== dayKey()) return;
    puzzle.value = data;
    activeDay.value = day;
    const restored = restoreBoard(data, records.value[data.id]?.step ?? 0);
    board.value = restored.board;
    step.value = restored.step;
    solved.value = step.value === data.solution.length;
    resetPresentation();
    message.value = solved.value
      ? "Already solved. Come back for the next daily puzzle."
      : "Select a piece, then its destination.";
  } catch {
    error.value = "The daily puzzle could not be loaded. Please try again shortly.";
    retryAt = Date.now() + 60000;
  } finally {
    clearTimeout(timeout);
    loading.value = false;
  }
}

async function show() {
  previousFocus = document.activeElement as HTMLElement;
  previousOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  open.value = true;
  await nextTick();
  dialog.value?.showModal();
  void loadPuzzle();
}
function close() {
  cancelAnimation();
  dialog.value?.close();
  open.value = false;
  document.body.style.overflow = previousOverflow;
  previousFocus?.focus();
}
async function move(from: Square, to: Square, promote = "") {
  promotion.value = undefined;
  if (!puzzle.value || solved.value || loading.value || error.value || animating.value) return;
  if (activeDay.value !== dayKey()) {
    void loadPuzzle();
    return;
  }
  const previousStep = step.value;
  const result = tryPuzzleMove(puzzle.value, step.value, board.value, from + to + promote);
  selected.value = undefined;
  if (!result.ok || !result.board || result.step === undefined) {
    message.value = result.message ?? "Try another move.";
    feedback.value = 'error'; wrongSquare.value = to;
    return;
  }
  const sequence = puzzle.value.solution.slice(previousStep, result.step);
  hintLevel.value = 0; wrongSquare.value = ''; feedback.value = 'success';
  animating.value = true;
  const run = ++animationRun;
  // Commit the complete turn before presentation so closing or reloading mid-animation cannot lose progress.
  board.value = result.board;
  step.value = result.step;
  solved.value = result.solved === true;
  save();
  message.value = 'Correct move!';
  await animateMove(sequence[0], run);
  if (run !== animationRun) return;
  if (sequence[1]) {
    message.value = 'Opponent is moving…';
    await pause(220);
    if (run !== animationRun) return;
    await animateMove(sequence[1], run);
  }
  if (run !== animationRun) return;
  animating.value = false;
  message.value = solved.value ? (practice.value ? 'Well played! Practice complete.' : 'Puzzle solved! 100 points earned.') : `Correct! Opponent played ${result.reply}. Your move.`;
}
function select(square: Square) {
  if (solved.value || promotion.value || loading.value || error.value || animating.value) return;
  wrongSquare.value = '';
  if (board.value.get(square)?.color === player.value) {
    selected.value = selected.value === square ? undefined : square;
    return;
  }
  if (!selected.value) return;
  const from = selected.value;
  if (
    board.value
      .moves({ square: from, verbose: true })
      .some((candidate) => candidate.to === square && candidate.promotion)
  ) {
    promotion.value = { from, to: square };
    return;
  }
  move(from, square);
}
function syncStorage(event: StorageEvent) {
  if (event.key !== CHESS_STORAGE_KEY && event.key !== null) return;
  records.value = readChessState(localStorage).records;
  if (puzzle.value) {
    const restored = restoreBoard(puzzle.value, records.value[puzzle.value.id]?.step ?? 0);
    board.value = restored.board;
    step.value = restored.step;
    solved.value = restored.step === puzzle.value.solution.length;
    practice.value = false;
    resetPresentation();
    message.value = solved.value ? 'Already solved. Your points are saved.' : 'Progress updated. Your move.';
    selected.value = undefined;
    promotion.value = undefined;
  }
}
const timer = window.setInterval(() => {
  now.value = Date.now();
  if (open.value && activeDay.value !== dayKey() && now.value >= retryAt) void loadPuzzle();
}, 1000);
window.addEventListener("storage", syncStorage);
onBeforeUnmount(() => {
  clearInterval(timer);
  controller?.abort();
  window.removeEventListener("storage", syncStorage);
  if (open.value) close();
});
</script>

<template>
  <svg class="chess-hotspot-map" viewBox="0 0 1536 1024" preserveAspectRatio="xMidYMid meet">
    <defs>
      <radialGradient id="chess-outer-halo">
        <stop offset="0%" stop-color="#d5d7db" stop-opacity="0" />
        <stop offset="82%" stop-color="#d5d7db" stop-opacity="0" />
        <stop offset="87%" stop-color="#d5d7db" stop-opacity=".34" />
        <stop offset="100%" stop-color="#d5d7db" stop-opacity="0" />
      </radialGradient>
    </defs>
    <g
      class="chess-hotspot"
      role="button"
      tabindex="0"
      aria-label="Open daily chess puzzle"
      @click.stop="show"
      @keydown.enter.prevent.stop="show"
      @keydown.space.prevent.stop="show">
      <title>Daily chess puzzle</title>
      <circle class="chess-hotspot__halo" cx="414" cy="866" r="80" />
      <circle class="chess-hotspot__ring" cx="414" cy="866" r="64" />
      <g class="chess-hotspot__label">
        <rect x="337" y="760" width="154" height="30" rx="2" />
        <text x="414" y="780" text-anchor="middle">Daily chess</text>
      </g>
    </g>
  </svg>
  <Teleport to="body">
    <dialog
      ref="dialog"
      class="chess-dialog"
      aria-labelledby="chess-title"
      @cancel.prevent="close"
      @click="
        (event) => {
          if (event.target === dialog) close();
        }
      ">
      <div class="chess-panel">
        <header>
          <div>
            <p class="chess-eyebrow">A coffee-table challenge</p>
            <h2 id="chess-title">The daily chess.</h2>
          </div>
          <button class="chess-close" autofocus aria-label="Close chess puzzle" @click="close">×</button>
        </header>
        <div class="chess-stats">
          <span>{{ points }} points</span><span>Next puzzle in {{ countdown }}</span>
        </div>
        <p v-if="loading" role="status">Setting the board…</p>
        <div v-else-if="error" role="alert">
          <p>{{ error }}</p>
          <button class="chess-action" @click="loadPuzzle">Try again</button>
        </div>
        <template v-else-if="puzzle">
          <div class="chess-layout">
            <div class="chess-board" role="group" aria-label="Chess board" :aria-busy="animating">
              <button
                v-for="cell in cells"
                :key="cell.square"
                class="chess-square"
                :class="{
                  'is-dark': cell.dark,
                  'is-selected': selected === cell.square,
                  'is-target': destinations.includes(cell.square),
                  'is-white': cell.piece?.color === 'w',
                  'is-last-move': lastMove.includes(cell.square),
                  'is-hint': hintLevel > 0 && hintMove.slice(0, 2) === cell.square,
                  'is-wrong': wrongSquare === cell.square,
                  'is-capture': destinations.includes(cell.square) && !!cell.piece,
                }"
                :aria-label="`${cell.square}: ${cell.piece ? (cell.piece.color === 'w' ? 'white' : 'black') + ' ' + names[cell.piece.type] : 'empty'}`"
                :aria-pressed="selected === cell.square"
                :disabled="solved || animating"
                @click="select(cell.square)">
                <span aria-hidden="true" :class="{ 'is-moving-source': flying.some(piece => piece.from === cell.square) }">{{ cell.piece ? pieces[cell.piece.type] : "" }}</span
                ><small aria-hidden="true">{{ cell.square }}</small>
              </button>
              <div class="chess-piece-layer" aria-hidden="true">
                <span v-for="piece in flying" :key="piece.from" class="chess-flying-piece" :class="{ 'is-white': piece.color === 'w' }" :style="flyingStyle(piece)">{{ pieces[piece.type] }}</span>
              </div>
              <svg v-if="hintArrow" class="chess-hint-arrow" viewBox="0 0 8 8" aria-hidden="true">
                <defs><marker id="chess-hint-head" markerWidth="3" markerHeight="3" refX="2.1" refY="1.5" orient="auto"><path d="M0,0 L2.5,1.5 L0,3 Z" fill="#f6bf55" /></marker></defs>
                <line v-bind="hintArrow" stroke="#f6bf55" stroke-width=".13" stroke-linecap="round" marker-end="url(#chess-hint-head)" />
              </svg>
            </div>
            <aside class="chess-sidebar">
              <div class="chess-turn"><span class="chess-side-dot" :class="{ 'is-black': player === 'b' }" aria-hidden="true"></span><span>{{ practice ? 'Practice' : 'Daily puzzle' }} <small>· {{ puzzle.rating ?? 'Unrated' }}</small></span></div>
              <h3>{{ animating ? 'Keep watching…' : solved ? 'Nicely played!' : `${player === "w" ? "White" : "Black"} to move` }}</h3>
              <p class="chess-subtitle">Find the best move.</p>
              <div class="chess-move-progress" :aria-label="`${completedMoves} of ${totalMoves} moves found`"><i v-for="index in totalMoves" :key="index" :class="{ 'is-complete': index <= completedMoves }" /><span>{{ completedMoves }} / {{ totalMoves }}</span></div>
              <div class="chess-feedback" :data-tone="feedback" role="status" aria-live="polite"><span class="chess-feedback-icon" aria-hidden="true">{{ feedback === 'success' ? '✓' : feedback === 'error' ? '×' : feedback === 'hint' ? '?' : '♟' }}</span><p>{{ message }}</p></div>
              <div v-if="promotion" class="chess-promotion" role="group" aria-label="Choose promotion">
                <p>Promote to</p>
                <button
                  v-for="piece in ['q', 'r', 'b', 'n']"
                  :key="piece"
                  class="chess-action"
                  @click="move(promotion!.from, promotion!.to, piece)">
                  {{ names[piece] }}
                </button>
              </div>
              <button v-if="!solved" class="chess-hint-button" :disabled="animating || !!promotion || hintLevel >= 2" @click="hint"><span aria-hidden="true">☼</span> {{ hintLevel === 0 ? 'Get a hint' : hintLevel === 1 ? 'Show the move' : 'Move shown on board' }}</button>
              <button v-else class="chess-hint-button" :disabled="animating" @click="practiceAgain">↻ Practice again</button>
              <p class="chess-reward">{{ practice ? 'Practice · no extra points' : '+100 points on completion' }}<br /><small>Hints are free. Points are saved once per puzzle.</small></p>
              <a href="https://lichess.org" target="_blank" rel="noopener noreferrer">Puzzles by Lichess ↗</a>
            </aside>
          </div>
        </template>
        <p v-if="notice" role="status">{{ notice }}</p>
      </div>
    </dialog>
  </Teleport>
</template>

<style scoped>
.chess-hotspot-map {
  position: absolute;
  z-index: 9;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.chess-hotspot {
  pointer-events: auto;
  cursor: pointer;
  outline: none;
}
.chess-hotspot__ring,
.chess-hotspot__halo {
  opacity: 0;
  transform-box: fill-box;
  transform-origin: center;
  transform: scale(0.94);
  transition: opacity 0.35s ease, transform 0.65s cubic-bezier(0.22, 1, 0.36, 1);
}
.chess-hotspot__ring {
  fill: transparent;
  stroke: #d5d7db;
  stroke-width: 1.5;
  vector-effect: non-scaling-stroke;
}
.chess-hotspot__halo {
  fill: url(#chess-outer-halo);
}
.chess-hotspot__label {
  opacity: 0;
  pointer-events: none;
  transform: translateY(7px);
  transition: opacity 0.3s ease, transform 0.5s ease;
}
.chess-hotspot__label rect {
  fill: #080a09e8;
  stroke: #f5f1e799;
  vector-effect: non-scaling-stroke;
  stroke-width: 1;
}
.chess-hotspot__label text {
  fill: #f5f1e7;
  font:
    500 10px "IBM Plex Mono",
    monospace;
  letter-spacing: 1.2px;
  text-transform: uppercase;
}
.chess-hotspot:hover .chess-hotspot__ring,
.chess-hotspot:hover .chess-hotspot__halo,
.chess-hotspot:focus .chess-hotspot__ring,
.chess-hotspot:focus .chess-hotspot__halo {
  opacity: 1;
  transform: scale(1.02);
}
.chess-hotspot:hover .chess-hotspot__label,
.chess-hotspot:focus .chess-hotspot__label {
  opacity: 1;
  transform: none;
}
.chess-hotspot:focus-visible .chess-hotspot__ring { stroke-width: 3; }
.chess-dialog {
  padding: 0;
  border: 1px solid #747873;
  border-radius: 16px;
  margin: auto;
  width: min(940px, calc(100vw - 24px));
  max-height: calc(100dvh - 32px);
  overflow: auto;
  background: #1c2423;
  color: #f1eee4;
  box-shadow: 0 24px 100px #0009;
}
.chess-dialog::backdrop {
  background: #060d12cc;
  backdrop-filter: blur(10px);
}
.chess-panel {
  padding: clamp(18px, 4vw, 36px);
}
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}
h2 {
  font:
    400 clamp(28px, 4vw, 42px)/1.1 Georgia,
    serif;
  margin: 8px 0 20px;
}
h3 {
  font:
    400 28px Georgia,
    serif;
  margin: 14px 0;
}
.chess-eyebrow {
  color: #bec9c3;
  font:
    11px "IBM Plex Mono",
    monospace;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}
.chess-close {
  border: 1px solid #808a84;
  background: transparent;
  color: inherit;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 26px;
  cursor: pointer;
}
.chess-stats {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  border-block: 1px solid #69726b;
  padding: 14px 0;
  margin-bottom: 24px;
  font:
    12px "IBM Plex Mono",
    monospace;
}
.chess-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(180px, 1fr);
  gap: 28px;
}
.chess-board {
  position: relative;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  align-self: start;
  aspect-ratio: 1;
  border: 5px solid #454d44;
  border-radius: 4px;
  overflow: hidden;
}
.chess-square {
  position: relative;
  display: grid;
  place-items: center;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: #dedac8;
  color: #17201e;
  cursor: pointer;
  aspect-ratio: 1;
  min-width: 0;
}
.chess-square.is-dark {
  background: #7b8e80;
}
.chess-square > span {
  font:
    clamp(24px, 4vw, 48px)/1 "Segoe UI Symbol",
    "DejaVu Sans",
    serif;
}
.chess-square > span.is-moving-source { visibility: hidden; }
.chess-piece-layer, .chess-hint-arrow { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 4; }
.chess-flying-piece { position: absolute; width: 12.5%; height: 12.5%; display: grid; place-items: center; color: #17201e; font: clamp(24px, 4vw, 48px)/1 'Segoe UI Symbol', 'DejaVu Sans', serif; animation: chess-piece-slide 280ms cubic-bezier(.25,.65,.3,1) both; }
.chess-flying-piece.is-white { color: #fff9e9; -webkit-text-stroke: 1px #303a31; filter: drop-shadow(0 1px 1px #26332d); }
@keyframes chess-piece-slide { from { transform: translate(0, 0); } to { transform: translate(var(--dx), var(--dy)); } }
.chess-square.is-last-move { box-shadow: inset 0 0 0 100px #efdc5f3d; }
.chess-square.is-hint { box-shadow: inset 0 0 0 4px #f6bf55, inset 0 0 0 100px #f6bf5544; }
.chess-square.is-wrong { box-shadow: inset 0 0 0 4px #df7770, inset 0 0 0 100px #df77704d; }
.chess-square.is-target.is-capture::after { width: 88%; height: 88%; border: 5px solid #17201e55; background: transparent; }
.chess-square.is-white > span {
  color: #fff9e9;
  -webkit-text-stroke: 1px #303a31;
  filter: drop-shadow(0 1px 1px #26332d);
}
.chess-square small {
  position: absolute;
  bottom: 2px;
  left: 3px;
  color: #26332d;
  font: 9px monospace;
}
.chess-square.is-target::after {
  content: "";
  position: absolute;
  width: 18%;
  height: 18%;
  border-radius: 50%;
  background: #17201e66;
}
.chess-square.is-selected,
.chess-square:focus-visible {
  outline: 3px solid #f2bb60;
  outline-offset: -3px;
  z-index: 1;
}
.chess-square:disabled {
  cursor: default;
  opacity: 1;
}
aside {
  font:
    14px/1.65 "IBM Plex Sans",
    sans-serif;
}
.chess-feedback {
  padding: 14px;
  border-left: 2px solid #cbd3bc;
  background: #ffffff08;
  min-height: 72px;
}
.chess-sidebar { background: #ffffff04; border: 1px solid #ffffff0d; border-radius: 10px; padding: 20px; align-self: start; }
.chess-turn { display: flex; align-items: center; gap: 8px; font-weight: 600; }
.chess-turn small { color: #aeb9b1; font-weight: 400; }
.chess-side-dot { width: 16px; height: 16px; background: #f1eee4; border: 1px solid #bfc8bf; border-radius: 50%; }
.chess-side-dot.is-black { background: #17201e; }
.chess-sidebar h3 { font: 600 24px/1.25 'IBM Plex Sans', sans-serif; margin-bottom: 6px; }
.chess-subtitle { color: #b6c0b8; margin-bottom: 20px; }
.chess-move-progress { display: flex; align-items: center; flex-wrap: wrap; gap: 5px; margin-bottom: 18px; }
.chess-move-progress i { height: 6px; width: 22px; border-radius: 8px; background: #ffffff20; }
.chess-move-progress i.is-complete { background: #a7cb7c; }
.chess-move-progress span { margin-left: auto; color: #b6c0b8; font: 11px monospace; }
.chess-sidebar .chess-feedback { display: flex; align-items: flex-start; gap: 10px; border: 0; border-radius: 8px; min-height: 95px; margin-bottom: 18px; }
.chess-feedback p { margin: 0; }
.chess-feedback-icon { font-size: 22px; line-height: 1.1; }
.chess-feedback[data-tone='success'] { color: #bfdea0; background: #9abc6a15; }
.chess-feedback[data-tone='error'] { color: #ffb6ab; background: #df777014; }
.chess-feedback[data-tone='hint'] { color: #f6d28b; background: #f6bf5510; }
.chess-hint-button { width: 100%; padding: 12px; border: 1px solid #ffffff20; border-bottom-width: 3px; border-radius: 7px; background: #3b493d; color: #f1eee4; font: 600 14px 'IBM Plex Sans', sans-serif; cursor: pointer; }
.chess-hint-button:hover:not(:disabled) { background: #4b5d43; }
.chess-hint-button:focus-visible { outline: 2px solid #f6bf55; outline-offset: 3px; }
.chess-hint-button:disabled { opacity: .55; cursor: default; }
.chess-sidebar .chess-reward { margin: 18px 0; font-size: 12px; }
.chess-sidebar a { font-size: 12px; }
.chess-reward {
  color: #e4d6b8;
}
.chess-reward small {
  color: #bdc5bf;
}
aside a {
  color: #cdd9d0;
  text-underline-offset: 4px;
}
.chess-action {
  padding: 8px 12px;
  margin: 4px;
  border: 1px solid #a7b4a8;
  border-radius: 5px;
  color: #f1eee4;
  background: #36443b;
  cursor: pointer;
}
@media (max-width: 650px) {
  .chess-layout {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .chess-square > span, .chess-flying-piece {
    font-size: clamp(25px, 8vw, 46px);
  }
}
@media (prefers-reduced-motion: reduce) {
  .chess-flying-piece { animation: none; }
  .chess-hotspot__ring,
  .chess-hotspot__halo,
  .chess-hotspot__label {
    transition: none;
  }
}
</style>
