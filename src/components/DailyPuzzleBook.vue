<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";

type PuzzleKind = "sudoku" | "nonogram";
type SavedDay = { values: number[]; completed: boolean };

const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Athens" }).format(new Date());
const storageKey = `daily-puzzle-book:${today}`;
const seedNumber = [...today].reduce((value, char) => (value * 31 + char.charCodeAt(0)) >>> 0, 2166136261);
const kind: PuzzleKind = seedNumber % 2 ? "sudoku" : "nonogram";
const open = ref(false);
const closeButton = ref<HTMLButtonElement>();

function rng(seed: number) {
  let state = seed || 1;
  return () => ((state = Math.imul(1664525, state) + 1013904223 >>> 0) / 4294967296);
}
function shuffled<T>(items: T[], random: () => number) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index--) { const next = Math.floor(random() * (index + 1)); [copy[index], copy[next]] = [copy[next], copy[index]]; }
  return copy;
}
function makeSudoku(seed: number) {
  const random = rng(seed); const rows = shuffled([0,1,2], random).flatMap((band) => shuffled([0,1,2], random).map((row) => band * 3 + row));
  const cols = shuffled([0,1,2], random).flatMap((stack) => shuffled([0,1,2], random).map((col) => stack * 3 + col));
  const digits = shuffled([1,2,3,4,5,6,7,8,9], random);
  const solution = rows.flatMap((row) => cols.map((col) => digits[(row * 3 + Math.floor(row / 3) + col) % 9]));
  const visible = new Set(shuffled([...Array(81).keys()], random).slice(0, 38));
  return { solution, clues: solution.map((value, index) => visible.has(index) ? value : 0) };
}

const pictures = [
  ["00100","01110","11111","11111","01110","00100","00100"],
  ["01110","10001","10101","10001","10101","10001","01110"],
  ["00100","01110","11111","00100","01110","10101","00100"],
  ["10001","01010","00100","01010","10001","01110","00100"],
];
const picture = pictures[seedNumber % pictures.length];
const nonogramSolution = picture.flatMap((row) => [...row].map(Number));
const sudoku = makeSudoku(seedNumber);
const solution = kind === "sudoku" ? sudoku.solution : nonogramSolution;
const blankValues = () => Array(solution.length).fill(0);
function readSaved(): SavedDay {
  try { const saved = JSON.parse(localStorage.getItem(storageKey) ?? "null") as SavedDay | null; if (saved?.values?.length === solution.length) return saved; } catch { /* begin a clean page */ }
  return { values: blankValues(), completed: false };
}
const saved = readSaved(); const values = ref(saved.values); const completed = ref(saved.completed);
const correctCount = computed(() => values.value.filter((value, index) => value === solution[index]).length);
const progress = computed(() => Math.round(correctCount.value / solution.length * 100));

function runs(line: number[]) { const result: number[] = []; let count = 0; line.forEach((cell) => { if (cell) count++; else if (count) { result.push(count); count = 0; } }); if (count) result.push(count); return result.length ? result : [0]; }
const rowHints = picture.map((row) => runs([...row].map(Number)));
const colHints = [...picture[0]].map((_, col) => runs(picture.map((row) => Number(row[col]))));
function setSudoku(index: number, event: Event) { const raw = (event.target as HTMLInputElement).value.replace(/[^1-9]/g, "").slice(-1); values.value[index] = Number(raw) || 0; values.value = [...values.value]; }
function toggleCell(index: number) { values.value[index] = values.value[index] === 1 ? 2 : values.value[index] === 2 ? 0 : 1; values.value = [...values.value]; }
function checkPuzzle() { completed.value = values.value.every((value, index) => value === solution[index]); }
function resetPuzzle() { values.value = blankValues(); completed.value = false; }
function showBook() { open.value = true; }
function hideBook() { open.value = false; }
function onKeydown(event: KeyboardEvent) { if (event.key === "Escape" && open.value) hideBook(); }

watch([values, completed], () => localStorage.setItem(storageKey, JSON.stringify({ values: values.value, completed: completed.value } satisfies SavedDay)), { deep: true });
watch(open, async (isOpen) => { document.body.classList.toggle("puzzle-book-is-open", isOpen); if (isOpen) { await nextTick(); closeButton.value?.focus(); } });
window.addEventListener("keydown", onKeydown);
onBeforeUnmount(() => { window.removeEventListener("keydown", onKeydown); document.body.classList.remove("puzzle-book-is-open"); });
</script>

<template>
  <svg v-if="!open" class="puzzle-hotspot-map" viewBox="0 0 1536 1024" preserveAspectRatio="xMidYMid meet">
    <defs>
      <radialGradient id="puzzle-outer-halo">
        <stop offset="0%" stop-color="#55e7ff" stop-opacity="0" />
        <stop offset="79%" stop-color="#55e7ff" stop-opacity="0" />
        <stop offset="86%" stop-color="#55e7ff" stop-opacity=".34" />
        <stop offset="100%" stop-color="#55e7ff" stop-opacity="0" />
      </radialGradient>
    </defs>
    <g class="puzzle-hotspot" role="button" tabindex="0" aria-label="Open today's puzzle book" @click.stop="showBook" @keydown.enter.prevent.stop="showBook" @keydown.space.prevent.stop="showBook">
      <title>Open today's puzzle book</title>
      <circle class="puzzle-hotspot__halo" cx="252" cy="850" r="80" />
      <circle class="puzzle-hotspot__outline" cx="252" cy="850" r="64" />
      <g class="puzzle-hotspot__label"><rect x="175" y="710" width="154" height="30" /><text x="252" y="730" text-anchor="middle">Today's puzzle</text></g>
    </g>
  </svg>
  <Teleport to="body">
    <Transition name="book-reveal">
      <div v-if="open" class="puzzle-book" role="dialog" aria-modal="true" aria-label="Daily puzzle book">
        <div class="puzzle-book__desk" aria-hidden="true" />
        <main class="puzzle-book__spread">
          <section class="puzzle-book__page puzzle-book__page--left">
            <p class="puzzle-book__kicker">The Daily Brain Teaser</p>
            <h2>Take a<br>little break.</h2>
            <p class="puzzle-book__date">{{ today }}</p>
            <div class="puzzle-book__scribble" aria-hidden="true">Think slow.<br>Smile big. ☺</div>
            <p class="puzzle-book__instructions" v-if="kind === 'sudoku'">Fill each row, column and bold 3 × 3 box with the numbers 1–9.</p>
            <p class="puzzle-book__instructions" v-else>Use the clues to reveal today's tiny picture. Click once to fill, twice to mark an X.</p>
            <div class="puzzle-book__progress"><span><i :style="{ width: `${progress}%` }" /></span><b>{{ progress }}% solved</b></div>
          </section>
          <section class="puzzle-book__page puzzle-book__page--right">
            <header><div><small>Puzzle no. {{ seedNumber % 900 + 100 }}</small><h2>{{ kind === 'sudoku' ? 'Sudoku' : 'Picture Nonogram' }}</h2></div><button ref="closeButton" type="button" @click="hideBook">Close book ×</button></header>
            <div v-if="kind === 'sudoku'" class="sudoku-grid" aria-label="Today's Sudoku">
              <template v-for="(clue, index) in sudoku.clues" :key="index">
                <span v-if="clue" class="sudoku-cell is-clue">{{ clue }}</span>
                <input v-else class="sudoku-cell" inputmode="numeric" maxlength="1" :value="values[index] || ''" :aria-label="`Row ${Math.floor(index/9)+1}, column ${index%9+1}`" @input="setSudoku(index, $event)" />
              </template>
            </div>
            <div v-else class="nonogram" :style="{ '--cols': picture[0].length }">
              <div class="nonogram__corner">♡</div><div v-for="(hint, col) in colHints" :key="`c${col}`" class="nonogram__col-hint"><span v-for="n in hint" :key="n">{{ n }}</span></div>
              <template v-for="(row, rowIndex) in picture" :key="rowIndex">
                <div class="nonogram__row-hint"><span v-for="n in rowHints[rowIndex]" :key="n">{{ n }}</span></div>
                <button v-for="(_, colIndex) in row" :key="colIndex" type="button" class="nonogram__cell" :class="{ 'is-filled': values[rowIndex * picture[0].length + colIndex] === 1, 'is-crossed': values[rowIndex * picture[0].length + colIndex] === 2 }" :aria-label="`Row ${rowIndex+1}, column ${colIndex+1}`" @click="toggleCell(rowIndex * picture[0].length + colIndex)">{{ values[rowIndex * picture[0].length + colIndex] === 2 ? '×' : '' }}</button>
              </template>
            </div>
            <div v-if="completed" class="puzzle-book__success" role="status"><b>You cracked it!</b><span>{{ kind === 'nonogram' ? 'A tiny surprise appeared.' : 'Every number found its home.' }}</span></div>
            <footer><button type="button" class="puzzle-book__check" @click="checkPuzzle">Check my puzzle</button><button type="button" class="puzzle-book__reset" @click="resetPuzzle">Start over</button><p>Tomorrow, a fresh page appears.</p></footer>
          </section>
        </main>
      </div>
    </Transition>
  </Teleport>
</template>
