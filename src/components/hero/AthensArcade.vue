<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { advanceBreakout, createBreakout, launchBreakout, movePaddle, stepBreakout } from '../../services/neonBreakout';
import { createArcadeAudio } from '../../services/arcadeAudio';
import { ARCADE_AUDIO } from '../../data/arcadeAudio';
import { BREAKOUT_LEVELS } from '../../data/breakoutLevels';
import { breakoutLevel } from '../../services/breakoutDifficulty.mjs';
import { deleteArcadeProgress, readArcadeProgress, saveArcadeProgress } from '../../services/arcadeProgress';
import { createSnake, deleteSnakeSave, readSnakeSave, saveSnake, snakeLevel, snakeTickSeconds, steerSnake, stepSnake, type SnakeDirection } from '../../services/signalSnake';
import { aimInvaderPlayer, createInvaders, deleteInvadersSave, fireInvaderShot, invaderEnemyVolleySize, INVADERS_PLAYER_Y, moveInvaderPlayer, readInvadersSave, saveInvaders, stepInvaders } from '../../services/rooftopInvaders';
import { readArcadeRecords, recordArcadeHighScore } from '../../services/arcadeRecords';

defineProps<{ hotspots?: boolean }>();
const open = ref(false);
const focused = ref(window.matchMedia('(max-width: 700px), (max-height: 550px)').matches);
const dialog = ref<HTMLDialogElement>();
const court = ref<SVGSVGElement>();
let storage: Storage | undefined;
try { storage = window.localStorage; } catch { /* Optional local progress. */ }
const restored = readArcadeProgress(storage, BREAKOUT_LEVELS);
const game = reactive(restored.state ?? createBreakout(1, BREAKOUT_LEVELS[0]));
const games = ['breakout', 'snake', 'invaders', 'asteroids', 'pinball'] as const;
type ArcadeGame = typeof games[number];
const selectedGame = ref<ArcadeGame>('breakout');
const gameNames: Record<ArcadeGame, string> = { breakout: 'Neon Breakout', snake: 'Signal Snake', invaders: 'Rooftop Invaders', asteroids: 'Orbital Courier', pinball: 'Midnight Pinball' };
const gameTaglines: Record<ArcadeGame, string> = { breakout: 'A paddle. A pulse. A skyline to clear.', snake: 'Catch rogue data. Try not to eat your own tail.', invaders: 'Defend the antenna. The drones have no manners.', asteroids: 'Deliver souvlaki through a very inconvenient asteroid field.', pinball: 'One tiny ball. A city full of questionable decisions.' };
const invaderColors = ['#f28bd5','#ffd27b','#76e8e1','#bb9bff'];
const arcadeLevel = ref(1), arcadeScore = ref(0), arcadeStatus = ref<'ready'|'playing'|'paused'|'won'|'lost'>('ready');
const savedSnake = readSnakeSave(storage);
const snake = reactive(savedSnake ?? createSnake());
let snakeElapsed = 0;
const invaders = reactive(createInvaders());
const orbital = reactive({ ship: {x:360,y:220,a:-Math.PI/2}, shots: [] as {x:number;y:number;vx:number;vy:number}[], rocks: Array.from({length:7},(_,i)=>({x:(i*103+77)%720,y:(i*59+31)%440,r:12+i%3*5,vx:30+i*4,vy:18+i*3})), keys:new Set<string>() });
const pinball = reactive({ ball:{x:360,y:220,vx:130,vy:-100}, flippers:0, score:0 });
const saveKeyFor = (name: ArcadeGame) => `athens-arcade:${name}:v1`;
const level = computed(() => breakoutLevel(game.level, BREAKOUT_LEVELS));
const records = ref(readArcadeRecords(storage));
const personalBest = computed(() => records.value[selectedGame.value]?.score ?? 0);
const playing = computed(() => selectedGame.value === 'breakout' ? game.status === 'playing'
  : selectedGame.value === 'snake' ? snake.status === 'playing'
    : selectedGame.value === 'invaders' ? invaders.status === 'playing' : arcadeStatus.value === 'playing');
const paused = computed(() => selectedGame.value === 'breakout' ? game.status === 'paused'
  : selectedGame.value === 'snake' ? snake.status === 'paused'
    : selectedGame.value === 'invaders' ? invaders.status === 'paused' : arcadeStatus.value === 'paused');
const gameInstructions: Record<ArcadeGame, { keyboard: string; pointer: string; touch: string }> = {
  breakout: { keyboard: '← → / A D · Space launch · P pause', pointer: 'Move to steer · click to launch', touch: 'Drag across the board to guide the paddle' },
  snake: { keyboard: 'Arrows / WASD · Space start · P pause', pointer: 'Choose direction with the pad', touch: 'Tap the direction pad to turn' },
  invaders: { keyboard: '← → / A D · hold Space to fire · P pause', pointer: 'Move to aim · hold click to fire', touch: 'Drag to steer · hold FIRE to shoot' },
  asteroids: { keyboard: '← → / A D turn · ↑ / W thrust · Space fire', pointer: 'Move to steer · click to fire', touch: 'Drag to steer · tap to fire' },
  pinball: { keyboard: 'Space / ↑ / Enter to flip', pointer: 'Click the table to flip', touch: 'Tap the table or FLIP button' },
};
function finishRun(name: ArcadeGame, score: number, level: number) {
  if (recordArcadeHighScore(storage, name, score, level)) records.value = readArcadeRecords(storage);
}
const hasSave = ref(!!restored.state);
const saveMessage = ref(restored.message ?? (restored.state ? 'Saved game loaded. Resume when ready.' : 'Progress stays on this browser/device.'));
const confirmDelete = ref(false);
const confirmRestart = ref(false);
let savingStarted = !!restored.state, lastSave = 0;
function saveProgress() {
  savingStarted = true;
  const ok = saveArcadeProgress(storage, game);
  hasSave.value = ok || hasSave.value;
  saveMessage.value = ok ? `Sector ${game.level} saved on this device.` : 'Saving is unavailable. Keep this tab open to continue playing.';
}
function deleteProgress() {
  pause();
  if (deleteArcadeProgress(storage)) {
    Object.assign(game, createBreakout(1, BREAKOUT_LEVELS[0]));
    savingStarted = false; hasSave.value = false;
    saveMessage.value = 'Saved progress deleted. Your next game starts fresh.';
  } else saveMessage.value = 'The save could not be deleted. Browser storage is unavailable.';
  confirmDelete.value = false;
  void nextTick(() => dialog.value?.querySelector<HTMLButtonElement>('.arcade-save-save')?.focus());
}
async function askDelete() { pause(); confirmDelete.value = true; await nextTick(); dialog.value?.querySelector<HTMLButtonElement>('.arcade-save-confirm')?.focus(); }
async function keepSave() { confirmDelete.value = false; await nextTick(); dialog.value?.querySelector<HTMLButtonElement>('.arcade-save-delete')?.focus(); }
const audio = createArcadeAudio(ARCADE_AUDIO);
const music = ref(false), effects = ref(false), volume = ref(.3);
const audioError = ref('');
async function configureAudio() {
  const ok = await audio.configure({ music: music.value, effects: effects.value, volume: volume.value });
  audioError.value = ok ? '' : 'Audio unavailable in this browser. You can keep playing silently.';
  if (ok) audio.cue('bounce');
}
const message = computed(() => ({ ready: `${level.value.district} · ${level.value.name}. Launch when ready.`, playing: 'Clear the billboards. Double lines need two hits.', paused: 'Taking a breather. Your city can wait.', cleared: `Sector ${game.level} cleared. Next stop: ${breakoutLevel(game.level + 1, BREAKOUT_LEVELS).district}.`, lost: 'Signal lost. Your best run is saved on this device.', won: 'City cleared. The night is yours.' })[game.status]);
const arcadeMessage = computed(() => {
  if (selectedGame.value === 'breakout') return message.value;
  if (selectedGame.value === 'snake') {
    if (arcadeStatus.value === 'ready') return `${snakeLevel(snake.level).name} · collect ${snakeLevel(snake.level).target} signal packets to clear the district.`;
    if (arcadeStatus.value === 'playing') return 'Catch rogue data. Try not to eat your own tail.';
    if (arcadeStatus.value === 'won') return 'Every packet delivered. Athens is buffering beautifully.';
    if (arcadeStatus.value === 'lost') return 'Signal lost. Even the best courier takes a wrong turn.';
    return 'Courier on a coffee break. The packets can wait.';
  }
  if (selectedGame.value === 'invaders') {
    const fireLabel = invaders.weaponLevel === 1 ? 'single shot' : invaders.weaponLevel === 2 ? invaders.level === 2 ? 'TWIN FIRE UNLOCKED' : 'TWIN FIRE ACTIVE' : invaders.level === 5 ? 'TRIPLE FIRE UNLOCKED' : 'TRIPLE FIRE ACTIVE';
    if (invaders.status === 'ready') return `Wave ${invaders.level} · ${fireLabel} · ${invaderEnemyVolleySize(invaders.level) === 1 ? 'one hostile lane' : `${invaderEnemyVolleySize(invaders.level)}-shot enemy volleys`}.`;
    if (invaders.status === 'playing') return `${invaders.weaponLevel === 1 ? 'Single' : invaders.weaponLevel === 2 ? 'Twin' : 'Triple'} fire · hold Space or FIRE for a steady stream.`;
    if (invaders.status === 'paused') return 'Turret cooling down. The rooftop is still yours.';
    if (invaders.status === 'won') return 'Wave cleared. The Acropolis remains gloriously unbothered.';
    return 'The drones filed a change of address. Give the roof another go.';
  }
  return arcadeStatus.value === 'ready' ? `SECTOR ${arcadeLevel.value} · ${gameTaglines[selectedGame.value]}` : arcadeStatus.value === 'playing' ? gameTaglines[selectedGame.value] : arcadeStatus.value === 'won' ? 'Athens is safe. Go on, have a victory koulouri.' : arcadeStatus.value === 'lost' ? 'The city forgives you. The drones do not.' : 'Paused. Even legends hydrate.';
});
let frame = 0, previousTime = 0;
let previousFocus: HTMLElement | null = null;
let previousOverflow = '';
const held = new Set<string>();
function stop() { cancelAnimationFrame(frame); frame = 0; previousTime = 0; held.clear(); audio.update(false); }
function tick(time: number) {
  const dt = previousTime ? Math.min((time - previousTime) / 1000, .05) : 0;
  previousTime = time;
  if (selectedGame.value === 'breakout' && (held.has('ArrowLeft') || held.has('a'))) movePaddle(game, game.paddle - 480 * dt);
  if (selectedGame.value === 'breakout' && (held.has('ArrowRight') || held.has('d'))) movePaddle(game, game.paddle + 480 * dt);
  if (selectedGame.value !== 'breakout') {
    tickExtra(dt, time);
    const active = selectedGame.value === 'snake' ? snake.status === 'playing' : selectedGame.value === 'invaders' ? invaders.status === 'playing' : arcadeStatus.value === 'playing';
    audio.update(active);
    if (active) frame = requestAnimationFrame(tick); else stop();
    return;
  }
  const score = game.score, lives = game.lives, vx = game.vx, vy = game.vy, status = game.status;
  stepBreakout(game, dt, BREAKOUT_LEVELS.length);
  if (status === 'playing' && game.status === 'lost') finishRun('breakout', game.score, game.level);
  if (game.status === 'won' || game.status === 'cleared') audio.cue('win');
  else if (game.lives < lives) audio.cue('miss');
  else if (game.score > score) audio.cue('brick');
  else if (game.vx !== vx || game.vy !== vy) audio.cue('bounce');
  audio.update(game.status === 'playing');
  if (game.score !== score || game.lives !== lives || time - lastSave >= 2000 || game.status !== 'playing') { saveProgress(); lastSave = time; }
  if (game.status === 'playing') frame = requestAnimationFrame(tick);
  else stop();
}
function play() {
  if (selectedGame.value === 'snake') {
    if (snake.status === 'won' || snake.status === 'lost') Object.assign(snake, createSnake());
    snake.status = 'playing'; arcadeStatus.value = 'playing'; arcadeLevel.value = snake.level; arcadeScore.value = snake.score;
    void audio.resume().then(() => { if (open.value && snake.status === 'playing') audio.cue('launch'); });
    saveExtra(); if (!frame) frame = requestAnimationFrame(tick); return;
  }
  if (selectedGame.value === 'asteroids' || selectedGame.value === 'pinball') {
    if (arcadeStatus.value === 'lost' || arcadeStatus.value === 'won') resetExtra();
    arcadeStatus.value = 'playing';
    void audio.resume().then(() => { if (open.value && arcadeStatus.value === 'playing') audio.cue('launch'); });
    if (!frame) frame = requestAnimationFrame(tick);
    return;
  }
  if (selectedGame.value === 'invaders') {
    if (invaders.status === 'won' || invaders.status === 'lost') Object.assign(invaders, createInvaders());
    invaders.status = 'playing'; arcadeStatus.value = 'playing'; arcadeLevel.value = invaders.level; arcadeScore.value = invaders.score;
    void audio.resume().then(() => { if (open.value && invaders.status === 'playing') audio.cue('launch'); });
    saveExtra(); if (!frame) frame = requestAnimationFrame(tick); return;
  }
  void audio.resume().then(() => { if (open.value && game.status === 'playing') audio.cue('launch'); });
  if (game.status === 'cleared') advanceBreakout(game, BREAKOUT_LEVELS);
  if (game.status === 'lost') {
    const earnedThisSector = game.bricks.filter((brick, index) => !brick.alive && level.value.layout[Math.floor(index / 8)]![index % 8] !== '0').length * 25;
    const score = game.score - earnedThisSector;
    Object.assign(game, createBreakout(game.level, level.value)); game.score = score;
  }
  if (game.status === 'won') Object.assign(game, createBreakout(1, BREAKOUT_LEVELS[0]));
  launchBreakout(game);
  saveProgress();
  if (!frame) frame = requestAnimationFrame(tick);
  court.value?.focus({ preventScroll: true });
}
function resetExtra() {
  arcadeLevel.value = 1; arcadeScore.value = 0; arcadeStatus.value = 'ready';
  Object.assign(snake, createSnake()); snakeElapsed = 0;
  Object.assign(invaders, createInvaders());
  Object.assign(orbital.ship, { x: 360, y: 220, a: -Math.PI / 2 });
  orbital.shots.length = 0;
  orbital.rocks.splice(0, orbital.rocks.length, ...Array.from({ length: 7 }, (_, i) => ({ x: (i * 103 + 77) % 720, y: (i * 59 + 31) % 440, r: 12 + i % 3 * 5, vx: 30 + i * 4, vy: 18 + i * 3 })));
  pinball.ball = { x: 360, y: 220, vx: 130, vy: -100 }; pinball.flippers = 0; pinball.score = 0;
}
function tickExtra(dt:number, time:number) {
  if (selectedGame.value==='snake') {
    snakeElapsed += dt;
    if (snakeElapsed < snakeTickSeconds(snake.level)) return;
    snakeElapsed = 0;
    const oldStatus = snake.status;
    const result = stepSnake(snake);
    arcadeLevel.value = snake.level; arcadeScore.value = snake.score; arcadeStatus.value = snake.status;
    if (result === 'snack') audio.cue('brick');
    else if (result === 'sector') audio.cue('win');
    else if (result === 'won') audio.cue('win');
    else if (result === 'lost') audio.cue('miss');
    if (oldStatus === 'playing' && snake.status === 'lost') finishRun('snake', snake.score, snake.level);
    if (result !== 'idle' && (result !== 'moved' || time - lastSave >= 2000 || snake.status !== 'playing')) { saveExtra(); lastSave = time; }
    if (snake.status !== 'playing') { stop(); return; }
  }
  if (selectedGame.value==='invaders') {
    const oldScore=invaders.score, oldLives=invaders.lives, oldLevel=invaders.level, oldStatus=invaders.status;
    const axis=(held.has('ArrowLeft')||held.has('a')||held.has('inv-left')?-1:0)+(held.has('ArrowRight')||held.has('d')||held.has('inv-right')?1:0);
    moveInvaderPlayer(invaders,Math.max(-1,Math.min(1,axis)) as -1|0|1,dt);
    if (held.has('inv-fire')) fireInvaders();
    const events=stepInvaders(invaders,dt);
    if(oldStatus==='playing'&&invaders.status==='lost')finishRun('invaders',invaders.score,invaders.level);
    arcadeLevel.value=invaders.level; arcadeScore.value=invaders.score; arcadeStatus.value=invaders.status;
    for(const event of events){if(event==='hit')audio.cue('brick');else if(event==='life'||event==='lost')audio.cue('miss');else if(event==='wave'||event==='won')audio.cue('win');}
    if(invaders.score!==oldScore||invaders.lives!==oldLives||invaders.level!==oldLevel||invaders.status!==oldStatus||time-lastSave>=2000){saveExtra();lastSave=time;}
  }
  if(selectedGame.value==='asteroids'){const k=orbital.keys;if(k.has('ArrowLeft')||k.has('a'))orbital.ship.a-=3*dt;if(k.has('ArrowRight')||k.has('d'))orbital.ship.a+=3*dt;if(k.has('ArrowUp')||k.has('w')){orbital.ship.x+=Math.cos(orbital.ship.a)*150*dt;orbital.ship.y+=Math.sin(orbital.ship.a)*150*dt;}orbital.ship.x=(orbital.ship.x+720)%720;orbital.ship.y=(orbital.ship.y+440)%440;for(const r of orbital.rocks){r.x=(r.x+r.vx*dt+720)%720;r.y=(r.y+r.vy*dt+440)%440;if(Math.hypot(r.x-orbital.ship.x,r.y-orbital.ship.y)<r.r+9){arcadeStatus.value='lost';finishRun('asteroids',arcadeScore.value,arcadeLevel.value);}}for(const s of orbital.shots){s.x+=s.vx*dt;s.y+=s.vy*dt;}orbital.shots=orbital.shots.filter(s=>s.x>=0&&s.x<=720&&s.y>=0&&s.y<=440);for(const s of orbital.shots)for(let i=orbital.rocks.length-1;i>=0;i--){const r=orbital.rocks[i];if(Math.hypot(s.x-r.x,s.y-r.y)<r.r){orbital.rocks.splice(i,1);s.x=-1;arcadeScore.value+=15;}}if(!orbital.rocks.length)advanceExtra();}
  if(selectedGame.value==='pinball'){const b=pinball.ball;b.x+=b.vx*dt;b.y+=b.vy*dt;b.vy+=(300+Math.min(180,(arcadeLevel.value-1)*14))*dt;if(b.x<12||b.x>708)b.vx*=-1;if(b.y<15)b.vy=Math.abs(b.vy);if(b.y>410){arcadeStatus.value='lost';finishRun('pinball',arcadeScore.value,arcadeLevel.value);}for(const [x,y,r] of [[180,180,35],[540,180,35],[360,130,28]] as const)if(Math.hypot(b.x-x,b.y-y)<r){const a=Math.atan2(b.y-y,b.x-x);b.vx=Math.cos(a)*Math.hypot(b.vx,b.vy)*1.04;b.vy=Math.sin(a)*Math.hypot(b.vx,b.vy)*1.04;arcadeScore.value+=10;}if(pinball.flippers){b.vy=-Math.abs(b.vy)-140;arcadeScore.value+=5;pinball.flippers=0;}if(arcadeScore.value>=arcadeLevel.value*250)arcadeLevel.value++;}
}
function advanceExtra(){arcadeLevel.value++;arcadeScore.value+=50;arcadeStatus.value='ready';if(selectedGame.value==='asteroids'){const count=Math.min(20,7+arcadeLevel.value);orbital.rocks.splice(0,orbital.rocks.length,...Array.from({length:count},(_,i)=>({x:(i*103+77)%720,y:(i*59+31)%440,r:12+i%3*5,vx:(30+i*4)*(1+Math.min(1.2,(arcadeLevel.value-1)*.04)),vy:(18+i*3)*(1+Math.min(1.2,(arcadeLevel.value-1)*.04))})));}}
function changeGame(g:ArcadeGame){if(g===selectedGame.value)return;pause();selectedGame.value=g;resetExtra();if(g==='snake'){const restoredSnake=readSnakeSave(storage);if(restoredSnake)Object.assign(snake,restoredSnake);arcadeLevel.value=snake.level;arcadeScore.value=snake.score;arcadeStatus.value=snake.status;hasSave.value=!!restoredSnake;saveMessage.value=restoredSnake?'Signal Snake progress loaded from this device.':'Signal Snake saves on this device.';return;}if(g==='invaders'){const restoredInvaders=readInvadersSave(storage);if(restoredInvaders)Object.assign(invaders,restoredInvaders);arcadeLevel.value=invaders.level;arcadeScore.value=invaders.score;arcadeStatus.value=invaders.status;hasSave.value=!!restoredInvaders;saveMessage.value=restoredInvaders?'Rooftop Invaders progress loaded from this device.':'Rooftop Invaders saves on this device.';return;}const saved=storage?.getItem(saveKeyFor(g));if(saved){try{const s=JSON.parse(saved);arcadeLevel.value=s.level;arcadeScore.value=s.score;}catch{}}}
function saveExtra(){if(selectedGame.value==='snake'){const ok=saveSnake(storage,snake);saveMessage.value=ok?`Signal Snake · sector ${snake.level} saved on this device.`:'Local save unavailable. You can still play.';hasSave.value=ok||hasSave.value;return;}if(selectedGame.value==='invaders'){const ok=saveInvaders(storage,invaders);saveMessage.value=ok?`Rooftop Invaders · wave ${invaders.level} saved on this device.`:'Local save unavailable. You can still play.';hasSave.value=ok||hasSave.value;return;}try{storage?.setItem(saveKeyFor(selectedGame.value),JSON.stringify({level:arcadeLevel.value,score:arcadeScore.value,snake,invaders,orbital,pinball}));saveMessage.value=`${gameNames[selectedGame.value]} progress saved on this device.`;hasSave.value=true;}catch{saveMessage.value='Local save unavailable. You can still play.'}}
function deleteExtra(){if(selectedGame.value==='snake'){if(deleteSnakeSave(storage)){Object.assign(snake,createSnake());arcadeLevel.value=1;arcadeScore.value=0;arcadeStatus.value='ready';hasSave.value=false;confirmDelete.value=false;saveMessage.value='Signal Snake save deleted. Fresh city, fresh start.';}else saveMessage.value='Could not delete this local save.';return;}if(selectedGame.value==='invaders'){if(deleteInvadersSave(storage)){Object.assign(invaders,createInvaders());arcadeLevel.value=1;arcadeScore.value=0;arcadeStatus.value='ready';hasSave.value=false;confirmDelete.value=false;saveMessage.value='Rooftop Invaders save deleted. Fresh skyline, fresh start.';}else saveMessage.value='Could not delete this local save.';return;}try{storage?.removeItem(saveKeyFor(selectedGame.value));resetExtra();hasSave.value=false;confirmDelete.value=false;saveMessage.value='Game save deleted. Fresh city, fresh start.';}catch{saveMessage.value='Could not delete this local save.'}}
function pause() { if(selectedGame.value==='snake'&&snake.status==='playing'){snake.status='paused';arcadeStatus.value='paused';stop();saveExtra();} else if(selectedGame.value==='invaders'&&invaders.status==='playing'){invaders.status='paused';arcadeStatus.value='paused';stop();saveExtra();} else if(selectedGame.value!=='breakout'&&arcadeStatus.value==='playing'){arcadeStatus.value='paused';stop();saveExtra();} if (game.status === 'playing') { game.status = 'paused'; stop(); if (savingStarted) saveProgress(); } audio.suspend(); }
function reset() { stop(); audio.suspend(); Object.assign(game, createBreakout(1, BREAKOUT_LEVELS[0])); confirmRestart.value = false; if (savingStarted) saveProgress(); }
function restartJourney() { if (confirmRestart.value) reset(); else { pause(); confirmRestart.value = true; } }
async function show() {
  if (open.value) return;
  previousFocus = document.activeElement as HTMLElement;
  previousOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  open.value = true;
  await nextTick();
  dialog.value?.showModal();
}
function close() {
  if (!open.value) return;
  pause(); stop(); open.value = false;
  confirmRestart.value = false; confirmDelete.value = false;
  dialog.value?.close(); document.body.style.overflow = previousOverflow;
  previousFocus?.focus({ preventScroll: true });
}
function keydown(event: KeyboardEvent) {
  const target = event.target instanceof Element ? event.target : null;
  if (target?.closest('input, select, textarea, [contenteditable="true"]')) return;
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  const directions: Record<string, SnakeDirection> = { ArrowUp:'up',w:'up',ArrowDown:'down',s:'down',ArrowLeft:'left',a:'left',ArrowRight:'right',d:'right' };
  if (selectedGame.value === 'snake' && directions[key]) {
    event.preventDefault(); event.stopPropagation();
    steerSnake(snake, directions[key]!); return;
  }
  if (selectedGame.value === 'snake' && (key === ' ' || key === 'p')) {
    // Keep native Space activation on the main game action and direction buttons.
    // Everywhere else, Space starts/resumes or pauses even while a library/close
    // button still owns focus after the player selects Snake.
    if (key === ' ' && target?.closest('button')) return;
    event.preventDefault(); event.stopPropagation();
    if (snake.status === 'playing') pause(); else play();
    return;
  }
  if (selectedGame.value === 'invaders') {
    if (['ArrowLeft','ArrowRight','a','d'].includes(key)) { event.preventDefault();event.stopPropagation();held.add(key);return; }
    if (key === ' ') { event.preventDefault();event.stopPropagation();if(invaders.status==='playing'){held.add('inv-fire');if(!event.repeat)fireInvaders();}else if(!event.repeat){play();held.add('inv-fire');fireInvaders();}return; }
    if (key === 'p') { event.preventDefault();event.stopPropagation();if(invaders.status==='playing')pause();else if(invaders.status==='paused')play();return; }
  }
  if (selectedGame.value === 'asteroids') {
    if (key === ' ' && target?.closest('button')) return;
    if (['ArrowLeft','ArrowRight','a','d','ArrowUp','w'].includes(key)) { event.preventDefault(); event.stopPropagation(); orbital.keys.add(key); return; }
    if (key === ' ') {
      event.preventDefault(); event.stopPropagation();
      if (arcadeStatus.value !== 'playing') play();
      else orbital.shots.push({ x: orbital.ship.x, y: orbital.ship.y, vx: Math.cos(orbital.ship.a) * 350, vy: Math.sin(orbital.ship.a) * 350 });
      return;
    }
  }
  if (selectedGame.value === 'pinball' && [' ', 'ArrowUp', 'Enter'].includes(key)) {
    if (target?.closest('button') && (key === ' ' || key === 'Enter')) return;
    event.preventDefault(); event.stopPropagation();
    if (arcadeStatus.value !== 'playing') play(); else pinball.flippers = 1;
    return;
  }
  if (target?.closest('button')) return;
  if (['ArrowLeft', 'ArrowRight', 'a', 'd'].includes(key)) {
    event.preventDefault(); event.stopPropagation(); held.add(key);
    if (game.status === 'ready') movePaddle(game, game.paddle + (key === 'ArrowLeft' || key === 'a' ? -24 : 24));
  } else if (key === ' ' || key === 'p') {
    event.preventDefault(); event.stopPropagation();
    if (game.status === 'playing') pause(); else play();
  }
}
function keyup(event: KeyboardEvent) {
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  held.delete(key); orbital.keys.delete(key);
}
function toggleGame() { if (playing.value) pause(); else play(); }
function steer(direction: SnakeDirection) { steerSnake(snake, direction); }
function fireInvaders() { if (invaders.status === 'playing' && fireInvaderShot(invaders)) audio.cue('launch'); }
function fireAsteroid() { if (arcadeStatus.value === 'playing') orbital.shots.push({ x: orbital.ship.x, y: orbital.ship.y, vx: Math.cos(orbital.ship.a) * 350, vy: Math.sin(orbital.ship.a) * 350 }); }
function holdArcadeKey(event: PointerEvent, key: string) { (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId); held.add(key); }
function releaseArcadeKey(key: string) { held.delete(key); }
function aimInvaders(event: PointerEvent) { const svg=(event.currentTarget as HTMLElement).querySelector('svg');const rect=svg?.getBoundingClientRect();if(rect)aimInvaderPlayer(invaders,(event.clientX-rect.left)/rect.width*720); }
function invaderPointerDown(event: PointerEvent) { (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);aimInvaders(event);if(invaders.status==='playing'){held.add('inv-fire');fireInvaders();}else play(); }
function holdInvaderMove(event: PointerEvent,direction:'left'|'right') { (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);held.add(`inv-${direction}`); }
function releaseInvaderMove(direction:'left'|'right') { held.delete(`inv-${direction}`); }
function pointer(event: PointerEvent) {
  const matrix = court.value?.getScreenCTM();
  if (matrix) movePaddle(game, new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse()).x);
}
function pointerDown(event: PointerEvent) {
  court.value?.setPointerCapture(event.pointerId); court.value?.focus({ preventScroll: true }); pointer(event);
}
function visibility() { if (document.hidden) pause(); }
onMounted(() => { document.addEventListener('visibilitychange', visibility); window.addEventListener('blur', pause); window.addEventListener('pagehide', pause); });
onBeforeUnmount(() => { close(); stop(); audio.dispose(); document.removeEventListener('visibilitychange', visibility); window.removeEventListener('blur', pause); window.removeEventListener('pagehide', pause); });
defineExpose({ open, show });
</script>

<template>
  <svg v-if="hotspots !== false" class="arcade-hotspot-map" viewBox="0 0 1672 941" preserveAspectRatio="xMidYMid meet">
    <g class="telescope-hotspot-target" role="button" tabindex="0" aria-label="Open Athens arcade" aria-haspopup="dialog" @click.stop="show" @keydown.enter.prevent.stop="show" @keydown.space.prevent.stop="show">
      <title>Hidden in plain sight · Athens arcade</title>
      <circle class="telescope-hotspot-target__halo" cx="190" cy="488" r="57" />
      <circle class="telescope-hotspot-target__shape" cx="190" cy="488" r="45" />
      <g class="telescope-hotspot-target__label"><rect x="110" y="558" width="160" height="30" rx="2" /><text x="190" y="578" text-anchor="middle">Enter the arcade</text></g>
    </g>
  </svg>
  <Teleport to="body">
    <dialog ref="dialog" class="athens-arcade" :class="{ 'athens-arcade--focused': focused }" aria-labelledby="arcade-title" @cancel.prevent="close" @close="close" @click="event => { if (event.target === dialog) close(); }" @keydown="keydown" @keyup="keyup">
      <div class="arcade-shell">
        <header class="arcade-header">
          <div><p class="arcade-eyebrow">ATHENS UNDERGROUND · FREE PLAY</p><h2 id="arcade-title">After hours<span> // arcade</span></h2></div>
          <div class="arcade-header__actions"><button class="arcade-mode" :aria-pressed="focused" @click="focused = !focused">{{ focused ? 'Show arcade' : 'Focus game' }}</button><button class="arcade-close" autofocus aria-label="Close arcade" @click="close">×</button></div>
        </header>
        <div class="arcade-layout">
          <aside class="arcade-library" aria-label="Arcade games">
            <p class="arcade-eyebrow">01 / SELECT YOUR SIGNAL</p>
            <button v-for="g in games" :key="g" class="arcade-game-choice" :aria-pressed="selectedGame===g" @click="changeGame(g)"><span aria-hidden="true">{{ {breakout:'▰',snake:'〰',invaders:'✦',asteroids:'✧',pinball:'●'}[g] }}</span><b>{{ gameNames[g] }}</b><small>{{ {breakout:'REFLEX',snake:'ROUTE PLANNING',invaders:'DEFENCE',asteroids:'PILOTING',pinball:'PHYSICS'}[g] }}</small></button>
          </aside>
          <section class="arcade-machine" :aria-labelledby="'arcade-game-title'">
            <div class="arcade-machine__title"><h3 id="arcade-game-title">{{ gameNames[selectedGame].toUpperCase() }}</h3><span>{{ selectedGame==='invaders' ? `ATH / 04 · FIRE ×${invaders.weaponLevel} · THREAT ×${invaderEnemyVolleySize(invaders.level)}` : 'ATH / 04' }}</span></div>
            <div class="arcade-stats"><span>SCORE <b>{{ String(selectedGame==='breakout'?game.score:arcadeScore).padStart(4, '0') }}</b></span><span>BEST <b>{{ String(personalBest).padStart(4, '0') }}</b></span><span>{{ selectedGame==='snake'?'LENGTH':'LIVES' }} <b>{{ selectedGame==='breakout'?game.lives:selectedGame==='snake'?snake.body.length:selectedGame==='invaders'?invaders.lives:'♡♡♡' }}</b></span><span>{{ selectedGame==='invaders'?'DRONES':'LEVEL' }} <b>{{ selectedGame==='invaders'?String(invaders.enemies.length).padStart(2, '0'):String(selectedGame==='breakout'?game.level:arcadeLevel).padStart(2, '0') }}</b></span></div>
            <div v-if="selectedGame==='breakout'" class="arcade-screen">
              <svg ref="court" class="arcade-court" viewBox="0 0 720 440" role="group" aria-label="Neon Breakout playfield" aria-describedby="arcade-controls arcade-status" tabindex="0" @pointerdown="pointerDown" @pointermove="pointer" @lostpointercapture="held.clear()" @blur="held.clear()" @pointercancel="held.clear()">
                <defs><pattern id="arcade-grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#6de4ef" stroke-opacity=".07" /></pattern></defs>
                <rect width="720" height="440" :fill="level.sky" /><rect width="720" height="440" fill="url(#arcade-grid)" />
                <g aria-hidden="true" :fill="level.city" stroke="#3c5269" stroke-width="1"><path d="M0 360V310H45V285H82V335H120V301H160V340H210V298H245V325H280V310H320V284H335V270H395V284H410V315H455V333H485V292H520V320H560V275H598V304H644V330H680V300H720V440H0Z" />
                  <g v-if="level.landmark === 'temple'"><path d="M325 268H405L365 249Z" fill="#43506a" /><path d="M340 285V309M352 285V309M365 285V309M378 285V309M390 285V309" stroke="#82949e" /></g>
                  <g v-else-if="level.landmark === 'antenna'" fill="none" stroke="#82c9d0"><path d="M360 300V240M345 300L360 250L375 300M338 249Q360 226 382 249M329 241Q360 207 391 241" /><circle cx="360" cy="240" r="3" fill="#faafc7" /></g>
                  <circle v-else cx="570" cy="242" r="24" :fill="level.colors[0]" fill-opacity=".35" />
                </g>
                <text x="25" y="30" :fill="level.colors[0]" font-family="monospace" font-size="12" letter-spacing="2">{{ level.district.toUpperCase() }} // {{ level.name.toUpperCase() }}</text>
                <g v-for="(brick, index) in game.bricks" :key="`${game.level}-${index}`"><rect v-if="brick.alive" :x="brick.x" :y="brick.y" width="70" height="18" rx="3" :fill="level.colors[brick.row % level.colors.length]" :fill-opacity="brick.health > 1 ? .45 : .2" :stroke="level.colors[brick.row % level.colors.length]" /><path v-if="brick.alive" :d="`M${brick.x + 8} ${brick.y + 6}h28${brick.health > 1 ? 'm-28 6h28' : ''}`" :stroke="level.colors[brick.row % level.colors.length]" stroke-opacity=".65" /></g>
                <rect :x="game.paddle - game.paddleWidth / 2" y="398" :width="game.paddleWidth" height="10" rx="5" fill="#9af6e7" /><rect :x="game.paddle - game.paddleWidth * .3" y="401" :width="game.paddleWidth * .6" height="3" rx="1" fill="#fff" />
                <circle :cx="game.x" :cy="game.y" r="7" fill="#fff2bf" stroke="#f5b967" stroke-width="3" />
              </svg>
              <div v-if="game.status !== 'playing'" class="arcade-screen__notice" aria-hidden="true"><span>{{ game.status === 'ready' ? 'INSERT CURIOSITY' : game.status === 'paused' ? 'PAUSED' : game.status === 'won' ? 'CITY CLEARED' : game.status === 'cleared' ? 'SECTOR CLEARED' : 'SIGNAL LOST' }}</span></div>
            </div>
            <div v-else-if="selectedGame==='snake'" class="arcade-screen extra-screen snake-screen">
              <svg viewBox="0 0 720 440" preserveAspectRatio="xMidYMid meet" role="img" :aria-label="`Signal Snake in ${snakeLevel(snake.level).name}`">
                <defs>
                  <pattern id="snake-grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#91bdf3" stroke-opacity=".11" /></pattern>
                  <linearGradient id="snake-sky" x2="0" y2="1"><stop stop-color="#101b31"/><stop offset="1" stop-color="#17152b"/></linearGradient>
                  <filter id="snake-glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                </defs>
                <rect width="720" height="440" fill="url(#snake-sky)"/><rect width="720" height="440" fill="url(#snake-grid)"/>
                <g aria-hidden="true" fill="#7d70a4" opacity=".18"><path d="M0 330h62v-62h54v39h42v-85h48v108h38v-58h45v58h51v-96h45v61h37v-43h52v78h51v-92h37v54h50v-73h40v94h30v130H0z"/><path d="M45 275v-24h16v24m54 18v-30h17v30m115 0v-21h15v21m132 0v-30h18v30m166 0v-21h16v21m70 3v-33h18v33" fill="#d387ed" opacity=".45"/></g>
                <text x="18" y="26" fill="#e6a7ef" font-family="monospace" font-size="13" letter-spacing="2">{{ snakeLevel(snake.level).name.toUpperCase() }} · SIGNAL COURIER</text>
                <text x="702" y="26" text-anchor="end" fill="#a6d9df" font-family="monospace" font-size="11">{{ snakeLevel(snake.level).target - snake.snacksThisLevel }} PACKETS LEFT</text>
                <g v-for="(block,i) in snake.obstacles" :key="`block-${i}`"><rect :x="block.x*40+5" :y="block.y*40+5" width="30" height="30" rx="5" fill="#332642" stroke="#b16fbc" stroke-opacity=".7"/><path :d="`M${block.x*40+11} ${block.y*40+15}h18m-18 10h18`" stroke="#d08ade" stroke-opacity=".55"/></g>
                <g filter="url(#snake-glow)"><rect :x="snake.food.x*40+10" :y="snake.food.y*40+10" width="20" height="20" rx="5" fill="#ffe79a" stroke="#fff7d0"/><path :d="`M${snake.food.x*40+15} ${snake.food.y*40+20}h10m-5 -5v10`" stroke="#6d4b6d" stroke-width="2"/></g>
                <g v-for="(p,i) in snake.body" :key="`segment-${i}`"><rect :x="p.x*40+5" :y="p.y*40+5" width="30" height="30" :rx="i===0?11:8" :fill="i===0?'#ff9ccf':'#47c8bd'" :fill-opacity="i===0?1:.86" :stroke="i===0?'#ffe1f2':'#a9fff1'" stroke-opacity=".8"/><template v-if="i===0"><circle :cx="p.x*40+14" :cy="p.y*40+15" r="2.4" fill="#19203a"/><circle :cx="p.x*40+25" :cy="p.y*40+15" r="2.4" fill="#19203a"/><path :d="`M${p.x*40+15} ${p.y*40+23}q4 4 9 0`" fill="none" stroke="#71395e" stroke-width="1.6"/></template></g>
                <text x="18" y="430" fill="#bac5df" font-family="monospace" font-size="10">NO WALL HACKS IN THIS DISTRICT · TURN EARLY</text>
              </svg>
            </div>
            <div v-else-if="selectedGame==='invaders'" class="arcade-screen extra-screen invaders-screen" @pointermove="aimInvaders" @pointerdown="invaderPointerDown" @pointerup="held.delete('inv-fire')" @pointercancel="held.delete('inv-fire')">
              <svg viewBox="0 0 720 440" preserveAspectRatio="xMidYMid meet" role="img" :aria-label="`Rooftop Invaders wave ${invaders.level}, ${invaders.enemies.length} drones remaining`">
                <defs>
                  <pattern id="invader-sky-grid" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M48 0H0V48" fill="none" stroke="#69a8d8" stroke-opacity=".08"/></pattern>
                  <linearGradient id="invader-sky" x2="0" y2="1"><stop stop-color="#0a1120"/><stop offset=".7" stop-color="#17172e"/><stop offset="1" stop-color="#251632"/></linearGradient>
                  <filter id="invader-glow" x="-150%" y="-150%" width="400%" height="400%"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                </defs>
                <rect width="720" height="440" fill="url(#invader-sky)"/><rect width="720" height="440" fill="url(#invader-sky-grid)"/>
                <g aria-hidden="true" fill="#121a2b" stroke="#394357" stroke-width="1"><path d="M0 353h42v-32h38v16h42v-62h36v78h30v-42h44v42h30v-87h46v87h40v-33h44v33h35v-70h40v70h36v-46h45v46h36v-83h41v83h42v-51h36v51h34v87H0z"/><path d="M48 342v-20h18v20m74-17v-39h16v39m130 0v-52h18v52m142 0v-31h18v31m114 0v-45h18v45m82 0v-26h18v26" fill="#923c9c" opacity=".45"/></g>
                <g aria-hidden="true" fill="none" stroke="#77e9df" stroke-width="2" opacity=".65"><path d="M355 354v-78m-16 78 16-60 16 60m-27-48q27-28 54 0m-65-12q38-40 76 0"/><circle cx="355" cy="276" r="4" fill="#ffe08f"/></g>
                <text x="16" y="24" fill="#a5e8e3" font-family="monospace" font-size="11" letter-spacing="2">ATHENS ROOFTOP DEFENSE · WAVE {{ String(invaders.level).padStart(2,'0') }}</text>
                <text x="704" y="24" text-anchor="end" fill="#c3a3dc" font-family="monospace" font-size="10">{{ invaders.enemies.length }} DRONES INBOUND</text>
                <g v-for="enemy in invaders.enemies" :key="enemy.id" :transform="`translate(${enemy.x} ${enemy.y})`" :style="{color:invaderColors[(enemy.row+invaders.level-1)%invaderColors.length]}" filter="url(#invader-glow)">
                  <path d="M-12-3L-22-12L-18 1L-11 5M12-3L22-12L18 1L11 5" fill="currentColor" opacity=".75"/>
                  <path d="M-10-7L-5-14H5L10-7L13 3L7 10H-7L-13 3Z" fill="#25253d" stroke="currentColor" stroke-width="2"/>
                  <path d="M-6-2Q0-7 6-2V3Q0 8-6 3Z" fill="currentColor"/><circle cx="-3" cy="0" r="1.4" fill="#17152b"/><circle cx="3" cy="0" r="1.4" fill="#17152b"/>
                  <path d="M0-14V-19M-3-19H3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M-7 10v4m14-4v4" stroke="currentColor" stroke-width="2"/>
                  <rect v-if="enemy.hp>1" x="-9" y="17" width="18" height="2" rx="1" fill="#fff2ad"/>
                </g>
                <g v-for="(shot,i) in invaders.enemyShots" :key="`enemy-shot-${i}`" filter="url(#invader-glow)"><path :d="`M${shot.x} ${shot.y-7}l4 5-4 5-4-5z`" fill="#ff7abf"/></g>
                <g v-for="(shot,i) in invaders.playerShots" :key="`player-shot-${i}`" class="invader-player-shot" aria-hidden="true">
                  <rect :x="shot.x-3" :y="shot.y-13" width="6" height="26" rx="3" fill="#ffe08a"/>
                  <circle :cx="shot.x" :cy="shot.y-13" r="3" fill="#fffef0"/>
                </g>
                <g :transform="`translate(${invaders.playerX} ${INVADERS_PLAYER_Y})`" :opacity="invaders.invulnerability > 0 && Math.floor(invaders.invulnerability * 12) % 2 ? 0.35 : 1" filter="url(#invader-glow)">
                  <path d="M-28 5L-23-4L-13-8L-8-17H8L13-8L23-4L28 5V9H-28Z" fill="#16504f" stroke="#8af4e4" stroke-width="2"/>
                  <path d="M-7-14H7L11-7H-11Z" fill="#95fff0"/><path d="M-19 0H19M0-17V-28" stroke="#d6fff4" stroke-width="2" stroke-linecap="round"/>
                  <circle cy="-29" r="3" fill="#ffb0dc"/><path d="M-21 10h8m26 0h8" stroke="#ff96cf" stroke-width="3"/>
                </g>
                <path d="M0 406H720" stroke="#63d9d2" stroke-opacity=".35"/>
                <text x="16" y="428" fill="#c5bfd8" font-family="monospace" font-size="9">← → / A D TO PILOT · HOLD SPACE TO FIRE · P TO PAUSE</text>
              </svg>
              <div v-if="invaders.status!=='playing'" class="arcade-screen__notice" aria-hidden="true"><span>{{ invaders.status==='ready'?`WAVE ${String(invaders.level).padStart(2,'0')} · ${invaders.weaponLevel===1?'LOCK AND LOAD':invaders.weaponLevel===2?invaders.level===2?'TWIN FIRE UNLOCKED':'TWIN FIRE ACTIVE':invaders.level===5?'TRIPLE FIRE UNLOCKED':'TRIPLE FIRE ACTIVE'}`:invaders.status==='paused'?'PAUSED':invaders.status==='won'?'WAVE CLEARED':'SKYLINE BREACHED' }}</span></div>
            </div>
            <div v-else class="arcade-screen extra-screen" @pointermove="event=>{if(selectedGame==='asteroids'){const r=(event.currentTarget as HTMLElement).getBoundingClientRect();orbital.ship.x=(event.clientX-r.left)/r.width*720;orbital.ship.y=(event.clientY-r.top)/r.height*440}}" @pointerdown="event=>{if(selectedGame==='asteroids')fireAsteroid();if(selectedGame==='pinball')pinball.flippers=1}" @pointerup="pinball.flippers=0" @pointercancel="pinball.flippers=0">
              <svg viewBox="0 0 720 440" preserveAspectRatio="xMidYMid meet" :aria-label="`${gameNames[selectedGame]} playfield`"><rect width="720" height="440" fill="#0b1020"/><path d="M0 390V300L100 260L180 320L260 240L360 280L460 220L560 280L640 230L720 280V440H0Z" fill="#17243a" stroke="#457081"/><text x="24" y="34" fill="#a4eee0" font-size="14" font-family="monospace">{{ ['MONASTIRAKI','PSYRRI','SYNTAGMA','EXARCHIA','GAZI','PIRAEUS','KOLONAKI','LYCABETTUS','ACROPOLIS','ATHENS'][arcadeLevel-1] }} // NIGHT SHIFT</text>
              <g v-if="selectedGame==='asteroids'"><path :transform="`translate(${orbital.ship.x} ${orbital.ship.y}) rotate(${orbital.ship.a*180/Math.PI+90})`" d="M0-12L-9 10L0 5L9 10Z" fill="#a4eee0"/><circle v-for="(r,i) in orbital.rocks" :key="i" :cx="r.x" :cy="r.y" :r="r.r" fill="#38314f" stroke="#c69bdf"/><circle v-for="(s,i) in orbital.shots" :key="i" :cx="s.x" :cy="s.y" r="3" fill="#ffe69a"/><text x="24" y="420" fill="#d9e3ff">Move to steer · click to fire</text></g>
              <g v-else><path d="M80 380Q360 455 640 380L600 70H120Z" fill="#17172d" stroke="#df92ff" stroke-width="5"/><circle v-for="(b,i) in [[180,180],[540,180],[360,130]]" :key="i" :cx="b[0]" :cy="b[1]" r="35" fill="#143d47" stroke="#a4eee0" stroke-width="5"/><circle :cx="pinball.ball.x" :cy="pinball.ball.y" r="9" fill="#fff2bf"/><path d="M270 370l70 -24M450 370l-70 -24" stroke="#fc83bd" stroke-width="18" stroke-linecap="round"/><text x="24" y="420" fill="#d9e3ff">Space / tap to flip · click bumpers for points</text></g></svg>
              <div v-if="arcadeStatus!=='playing'" class="arcade-screen__notice"><span>{{ arcadeStatus==='paused'?'PAUSED':arcadeStatus==='won'?'ATHENS SAVED':arcadeStatus==='lost'?'OOPS, ATHENS':`SECTOR ${arcadeLevel} · ${gameTaglines[selectedGame]}` }}</span></div>
            </div>
            <div class="arcade-action-bar">
              <p id="arcade-status" class="arcade-status" role="status">{{ selectedGame==='breakout'?message:arcadeMessage }}</p>
              <div class="arcade-actions"><button class="arcade-primary" @click="confirmRestart = false; toggleGame()">{{ playing ? 'Pause' : paused ? 'Resume' : selectedGame==='breakout'&&game.status==='cleared' ? 'Next level' : 'Start game' }} <span aria-hidden="true">↗</span></button><button @click="selectedGame==='breakout'?restartJourney():(resetExtra(),saveExtra())">Restart</button></div>
            </div>
            <section class="arcade-control-deck" aria-label="How to play">
              <div class="arcade-control-guide" id="arcade-controls">
                <div><small>KEYBOARD</small><span>{{ gameInstructions[selectedGame].keyboard }}</span></div>
                <div><small>MOUSE</small><span>{{ gameInstructions[selectedGame].pointer }}</span></div>
                <div><small>TOUCH</small><span>{{ gameInstructions[selectedGame].touch }}</span></div>
              </div>
              <div v-if="selectedGame==='breakout'" class="arcade-touch-buttons" role="group" aria-label="Breakout touch controls">
                <button aria-label="Move paddle left" @pointerdown.prevent="holdArcadeKey($event,'ArrowLeft')" @pointerup="releaseArcadeKey('ArrowLeft')" @pointercancel="releaseArcadeKey('ArrowLeft')" @lostpointercapture="releaseArcadeKey('ArrowLeft')">←</button>
                <button aria-label="Move paddle right" @pointerdown.prevent="holdArcadeKey($event,'ArrowRight')" @pointerup="releaseArcadeKey('ArrowRight')" @pointercancel="releaseArcadeKey('ArrowRight')" @lostpointercapture="releaseArcadeKey('ArrowRight')">→</button>
              </div>
              <div v-else-if="selectedGame==='snake'" class="snake-controls" role="group" aria-label="Signal Snake direction pad">
                <button aria-label="Turn up" @click="steer('up')">↑</button>
                <div><button aria-label="Turn left" @click="steer('left')">←</button><button aria-label="Turn down" @click="steer('down')">↓</button><button aria-label="Turn right" @click="steer('right')">→</button></div>
              </div>
              <div v-else-if="selectedGame==='invaders'" class="invaders-controls" role="group" aria-label="Rooftop Invaders touch controls">
                <button aria-label="Pilot left" @pointerdown.prevent="holdInvaderMove($event,'left')" @pointerup="releaseInvaderMove('left')" @pointercancel="releaseInvaderMove('left')" @lostpointercapture="releaseInvaderMove('left')">←</button>
                <button class="invaders-fire" :disabled="invaders.status!=='playing'" @pointerdown.prevent="held.add('inv-fire');fireInvaders()" @pointerup="held.delete('inv-fire')" @pointercancel="held.delete('inv-fire')" @lostpointercapture="held.delete('inv-fire')">HOLD FIRE ✦</button>
                <button aria-label="Pilot right" @pointerdown.prevent="holdInvaderMove($event,'right')" @pointerup="releaseInvaderMove('right')" @pointercancel="releaseInvaderMove('right')" @lostpointercapture="releaseInvaderMove('right')">→</button>
              </div>
              <div v-else-if="selectedGame==='asteroids'" class="arcade-touch-buttons" role="group" aria-label="Orbital Courier touch controls">
                <button aria-label="Turn left" @pointerdown.prevent="holdArcadeKey($event,'ArrowLeft')" @pointerup="releaseArcadeKey('ArrowLeft')" @pointercancel="releaseArcadeKey('ArrowLeft')">↶</button>
                <button aria-label="Thrust" @pointerdown.prevent="holdArcadeKey($event,'ArrowUp')" @pointerup="releaseArcadeKey('ArrowUp')" @pointercancel="releaseArcadeKey('ArrowUp')">THRUST</button>
                <button aria-label="Fire" @pointerdown.prevent="fireAsteroid">FIRE</button>
                <button aria-label="Turn right" @pointerdown.prevent="holdArcadeKey($event,'ArrowRight')" @pointerup="releaseArcadeKey('ArrowRight')" @pointercancel="releaseArcadeKey('ArrowRight')">↷</button>
              </div>
              <div v-else class="arcade-touch-buttons" role="group" aria-label="Midnight Pinball touch controls">
                <button class="pinball-flip" @pointerdown.prevent="pinball.flippers=1" @pointerup="pinball.flippers=0" @pointercancel="pinball.flippers=0">HOLD TO FLIP</button>
              </div>
            </section>
            <details class="arcade-settings">
              <summary>Audio &amp; local save <span>Sound, volume, progress controls</span></summary>
              <div class="arcade-settings-panel">
                <div class="arcade-audio" role="group" aria-label="Game audio">
                  <button :aria-pressed="effects" @click="effects = !effects; configureAudio()">Sound FX {{ effects ? 'On' : 'Off' }}</button>
                  <button :aria-pressed="music" @click="music = !music; configureAudio()">Music {{ music ? 'On' : 'Off' }}</button>
                  <label>Volume <input v-model.number="volume" type="range" min="0" max="1" step=".05" aria-label="Game audio volume" @input="configureAudio" /></label>
                  <span v-if="audioError" role="status">{{ audioError }}</span>
                </div>
                <div class="arcade-save" role="group" aria-label="Local game progress">
                  <p role="status">{{ saveMessage }}</p>
                  <div v-if="!confirmDelete"><button class="arcade-save-save" @click="selectedGame==='breakout'?saveProgress():saveExtra()">Save progress</button><button class="arcade-save-delete" :disabled="selectedGame==='breakout'?!hasSave && !restored.message:!hasSave" @click="selectedGame==='breakout'?askDelete():(confirmDelete=true)">Delete saved progress</button></div>
                  <div v-else><span>Delete this game’s local save and start fresh?</span><button class="arcade-save-confirm" @click="selectedGame==='breakout'?deleteProgress():deleteExtra()">Yes, delete save</button><button @click="keepSave">Keep save</button></div>
                </div>
              </div>
            </details>
          </section>
        </div>
        <footer class="arcade-footer"><span>BUILT FOR SHORT BREAKS & LONG NIGHTS</span><span>37.98° N / 23.73° E</span></footer>
      </div>
    </dialog>
  </Teleport>
</template>

<style scoped>
.arcade-hotspot-map { position: absolute; z-index: 13; inset: 0; width: 100%; height: 100%; pointer-events: none; }
.athens-arcade { margin: auto; padding: 0; width: min(1120px, calc(100vw - 28px)); max-height: calc(100dvh - 28px); overflow: auto; border: 1px solid #586377; border-radius: 14px; background: #10141e; color: #eff2fa; box-shadow: 0 30px 120px #000b; }
.athens-arcade::backdrop { background: #03070ee0; backdrop-filter: blur(12px); }
.arcade-shell { padding: clamp(16px, 3vw, 32px); background: radial-gradient(ellipse at 0 0, #36204566, transparent 55%); }
.arcade-header, .arcade-machine__title, .arcade-stats, .arcade-footer { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.arcade-header { padding-bottom: 24px; border-bottom: 1px solid #394050; margin-bottom: 24px; }
.arcade-eyebrow, .arcade-tag, .arcade-machine__title, .arcade-stats, .arcade-controls, .arcade-footer { font: 11px/1.6 'IBM Plex Mono', monospace; letter-spacing: .06em; }
.arcade-eyebrow { color: #a7eee7; margin: 0 0 8px; }
.arcade-header h2 { font: 500 clamp(26px, 4vw, 42px)/1.1 'Barlow Condensed', sans-serif; text-transform: uppercase; margin: 0; }
.arcade-header h2 span { color: #c39be9; }
.arcade-header__actions { display: flex; align-items: center; gap: 8px; }
.athens-arcade .arcade-mode { font-size: 11px; padding-inline: 10px; white-space: nowrap; }
.athens-arcade button { min-height: 44px; border: 1px solid #586377; border-radius: 5px; padding: 10px 18px; background: #1b2434; color: #eff2fa; font: 13px 'IBM Plex Mono', monospace; cursor: pointer; }
.athens-arcade button:hover { background: #2b3850; }
.athens-arcade :focus-visible { outline: 3px solid #a4eee0; outline-offset: 4px; }
.athens-arcade .arcade-close { font-size: 26px; padding: 3px 12px; }
.arcade-layout { display: grid; grid-template-columns: 210px minmax(0, 1fr); gap: 28px; }
.arcade-library > .arcade-eyebrow { color: #b9becf; font-size: 10px; }
.arcade-cartridge { border: 1px solid #af87d2; background: linear-gradient(155deg, #342641, #192131); padding: 18px; border-radius: 8px; }
.arcade-game-choice { width:100%;display:grid;grid-template-columns:34px 1fr;grid-template-rows:auto auto;text-align:left;gap:2px 8px;margin:0 0 8px!important;padding:10px!important;background:#121b2b!important; }
.arcade-game-choice>span{grid-row:1/3;color:#a4eee0;font-size:24px}.arcade-game-choice b{font:14px 'IBM Plex Sans',sans-serif}.arcade-game-choice small{font:9px 'IBM Plex Mono',monospace;color:#b8a1ce}.arcade-game-choice[aria-pressed="true"]{border-color:#a4eee0!important;background:linear-gradient(100deg,#18414a,#29223b)!important}
.arcade-cartridge__art { display: block; color: #a4eee0; font: 30px/1 monospace; padding: 18px; margin-bottom: 16px; text-align: center; border: 1px solid #64718a; background: #0d1422; }
.arcade-tag { font-size: 9px; color: #cbb1e7; }
.arcade-cartridge h3 { font: 500 25px/1.2 'Barlow Condensed', sans-serif; margin: 8px 0; }
.arcade-cartridge p, .arcade-next p { font-size: 13px; line-height: 1.8; color: #ced3e0; margin: 10px 0; }
.arcade-next { padding: 22px 4px; }
.arcade-next small { font-size: 11px; color: #aeb6c8; }
.arcade-machine { min-width: 0; }
.arcade-machine__title { color: #a4eee0; }
.arcade-machine__title h3 { margin: 0; font: inherit; font-weight: 600; letter-spacing: .15em; }
.arcade-machine__title > span { color: #aeb6c8; }
.arcade-stats { margin: 14px 0; color: #aeb6c8; flex-wrap: wrap; }
.arcade-stats b { color: #fff2bf; margin-left: 8px; }
.arcade-screen { position: relative; border: 1px solid #526478; border-radius: 8px; padding: 5px; background: #070b13; }
.extra-screen{aspect-ratio:720/440;overflow:hidden;touch-action:none}.extra-screen>svg{display:block;width:100%;height:100%}
.snake-screen{box-shadow:inset 0 0 35px #a45db11c}.snake-screen>svg{touch-action:pan-y}
.snake-controls{display:grid;grid-template-rows:auto 48px 48px;justify-items:center;gap:6px;margin:12px auto 0;max-width:220px}
.snake-controls__hint{font:9px 'IBM Plex Mono',monospace;letter-spacing:.12em;color:#b8a1ce}
.snake-controls>div{display:flex;gap:8px}.athens-arcade .snake-controls button{width:52px;height:48px;min-height:48px;padding:0;font-size:20px;color:#a4eee0;background:linear-gradient(145deg,#202c40,#191b2e);touch-action:manipulation}
.snake-controls button:active{background:#315261;transform:translateY(1px)}
.invaders-screen{touch-action:none;box-shadow:inset 0 0 38px #9d4bb31f}.invaders-screen>svg{touch-action:none}
.invaders-controls{display:flex;justify-content:center;flex-wrap:wrap;gap:8px;margin:10px auto 0}.athens-arcade .invaders-controls button{min-width:52px;min-height:48px;padding:8px 12px;color:#a4eee0;background:linear-gradient(145deg,#202c40,#191b2e);touch-action:none;user-select:none}
.athens-arcade .invaders-controls .invaders-fire{min-width:112px;color:#10151c;border-color:#ffb4df;background:linear-gradient(120deg,#ffb4df,#f2d8a1);font-weight:700}
.athens-arcade .invaders-controls .invaders-pause{min-width:88px;color:#e3cee9;border-color:#806695;background:#241b31}
.invaders-controls button:active{filter:brightness(1.25);transform:translateY(1px)}
.arcade-court { display: block; width: 100%; height: auto; touch-action: none; border-radius: 4px; }
.arcade-screen__notice { position: absolute; inset: 51% 0 auto; text-align: center; pointer-events: none; }
.arcade-screen__notice span { background: #0b111ee8; border: 1px solid #798596; padding: 10px 14px; font: clamp(10px, 2vw, 15px) 'IBM Plex Mono', monospace; letter-spacing: .15em; }
.arcade-status { min-height: 1.5em; margin: 14px 0; font-size: 13px; color: #d6deeb; }
.arcade-actions { display: flex; gap: 10px; flex-wrap: wrap; }
.athens-arcade .arcade-primary { background: #a4eee0; border-color: #a4eee0; color: #0b1820; }
.athens-arcade .arcade-primary:hover { background: #cdfcf2; }
.arcade-primary span { margin-left: 22px; }
.arcade-controls { color: #b1bdcf; margin-top: 16px; letter-spacing: 0; }
.arcade-audio { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin-top: 16px; }
.athens-arcade .arcade-audio button { padding: 8px 12px; font-size: 11px; }
.arcade-audio button[aria-pressed="true"] { border-color: #a4eee0; color: #a4eee0; }
.arcade-audio label { display: flex; align-items: center; gap: 8px; min-height: 44px; color: #b1bdcf; font: 11px 'IBM Plex Mono', monospace; }
.arcade-audio input { width: 100px; min-height: 32px; accent-color: #a4eee0; }
.arcade-save { margin-top: 16px; border-top: 1px solid #394050; padding-top: 12px; color: #b1bdcf; font: 11px/1.7 'IBM Plex Mono', monospace; }
.arcade-save p { margin: 0 0 8px; }
.arcade-save > div { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.athens-arcade .arcade-save button { font-size: 11px; padding-inline: 12px; }
.athens-arcade button:disabled { opacity: .45; cursor: default; }
.arcade-footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid #394050; color: #9aa6ba; font-size: 9px; flex-wrap: wrap; }
@media (max-width: 700px) { .arcade-layout { grid-template-columns: minmax(0, 1fr); gap: 18px; } .arcade-library > .arcade-eyebrow, .arcade-cartridge__art, .arcade-cartridge p, .arcade-cartridge > .arcade-tag:last-child, .arcade-next { display: none; } .arcade-cartridge { display: flex; align-items: center; gap: 14px; padding: 10px 14px; } .arcade-cartridge h3 { margin: 0; font-size: 21px; } .arcade-header { margin-bottom: 16px; padding-bottom: 16px; } }
@media (orientation: landscape) and (max-height: 550px) {
  .arcade-shell { padding: 12px 16px; }
  .arcade-header { padding-bottom: 8px; margin-bottom: 10px; }
  .arcade-header .arcade-eyebrow, .arcade-library, .arcade-footer { display: none; }
  .arcade-header h2 { font-size: 25px; }
  .arcade-layout { display: block; }
  .arcade-machine { display: grid; grid-template-columns: minmax(0, 1fr) 230px; column-gap: 16px; align-items: start; }
  .arcade-machine__title { grid-column: 1; grid-row: 1; }
  .arcade-stats { grid-column: 1; grid-row: 2; margin: 4px 0 8px; }
  .arcade-screen { grid-column: 1; grid-row: 3 / 7; width: min(100%, calc((100dvh - 150px) * 720 / 440)); justify-self: center; }
  .arcade-status { grid-column: 2; grid-row: 1 / 3; margin: 0 0 8px; font-size: 12px; }
  .arcade-actions { grid-column: 2; grid-row: 3; gap: 6px; }
  .arcade-actions button { padding: 8px 10px; font-size: 11px; }
  .arcade-primary span { margin-left: 4px; }
  .arcade-controls { grid-column: 2; grid-row: 4; font-size: 10px; margin: 8px 0 0; }
  .arcade-audio { grid-column: 2; grid-row: 5; margin-top: 8px; gap: 6px; }
  .arcade-save { grid-column: 1 / -1; grid-row: 7; }
}
@media (prefers-reduced-motion: reduce) { .telescope-hotspot-target__shape, .telescope-hotspot-target__halo, .telescope-hotspot-target__label { transition: none; } }
.athens-arcade--focused { width: calc(100vw - 16px); max-width: none; height: calc(100dvh - 16px); max-height: none; }
.athens-arcade--focused .arcade-shell { height: 100%; padding: 12px; display: flex; flex-direction: column; }
.athens-arcade--focused .arcade-header { flex: 0 0 auto; margin-bottom: 8px; padding-bottom: 8px; }
.athens-arcade--focused .arcade-header h2 { font-size: clamp(18px, 3vw, 28px); }
.athens-arcade--focused .arcade-header h2 span, .athens-arcade--focused .arcade-eyebrow,
.athens-arcade--focused .arcade-library, .athens-arcade--focused .arcade-footer,
.athens-arcade--focused .arcade-audio, .athens-arcade--focused .arcade-controls, .athens-arcade--focused .arcade-save { display: none; }
.athens-arcade--focused .arcade-layout { display: flex; flex: 1; min-height: 0; }
.athens-arcade--focused .arcade-machine { display: flex; flex-direction: column; width: 100%; min-height: 0; gap: 8px; }
.athens-arcade--focused .arcade-machine__title { display: none; }
.athens-arcade--focused .arcade-stats { width: 100%; margin: 0; flex: 0 0 auto; }
.athens-arcade--focused .arcade-screen { flex: 0 0 auto; width: min(100%, calc((100dvh - 260px) * 720 / 440)); height: auto; max-height: calc(100dvh - 260px); aspect-ratio: 720 / 440; min-height: 0; overflow: hidden; }
.athens-arcade--focused .arcade-court { width: 100%; height: 100%; }
.athens-arcade--focused .arcade-status { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
.athens-arcade--focused .arcade-actions { flex: 0 0 auto; align-self: center; }
.athens-arcade--focused .invaders-controls{flex:0 0 auto;margin:2px auto 0}.athens-arcade--focused .arcade-screen.invaders-screen{width:min(100%,calc((100dvh - 230px) * 720 / 440));max-height:calc(100dvh - 230px)}
.athens-arcade--focused .snake-controls{grid-template-rows:auto 42px 42px;gap:3px;margin:2px auto 0}.athens-arcade--focused .snake-controls__hint{display:none}.athens-arcade--focused .snake-controls button{height:42px;min-height:42px;width:48px}

/* One cabinet size and one predictable control layout across all games. */
.athens-arcade { box-sizing: border-box; display: flex; flex-direction: column; width: min(1120px, calc(100vw - 28px)); height: min(900px, calc(100dvh - 28px)); max-height: calc(100dvh - 28px); overflow: hidden; }
.athens-arcade:not([open]) { display: none; }
.arcade-shell { box-sizing: border-box; display: flex; flex: 1; flex-direction: column; min-height: 0; height: 100%; padding: clamp(14px, 2.2vw, 26px); overflow: hidden; }
.arcade-header { flex: 0 0 auto; padding-bottom: 14px; margin-bottom: 14px; }
.arcade-layout { flex: 1; min-height: 0; grid-template-columns: 184px minmax(0, 1fr); gap: 18px; overflow: hidden; }
.arcade-library { min-height: 0; overflow-y: auto; }
.arcade-game-choice { min-height: 56px!important; margin-bottom: 6px!important; }
.arcade-machine { display: flex; flex: 1; flex-direction: column; min-height: 0; gap: 9px; overflow-y: auto; scrollbar-color: #586377 #111723; scrollbar-width: thin; }
.arcade-machine__title { flex: 0 0 auto; min-height: 20px; }
.arcade-stats { flex: 0 0 auto; margin: 0; min-height: 26px; }
.arcade-screen { box-sizing: border-box; flex: 0 0 auto; width: min(100%, calc((100dvh - 410px) * 720 / 440)); height: auto; max-height: calc(100dvh - 410px); align-self: center; aspect-ratio: 720 / 440; padding: 0; overflow: hidden; }
.arcade-screen > svg { display: block; width: 100%; height: 100%; }
.extra-screen { aspect-ratio: 720 / 440; }
.arcade-action-bar { display: flex; align-items: center; justify-content: space-between; flex: 0 0 auto; min-height: 42px; gap: 12px; }
.arcade-status { flex: 1; min-width: 0; min-height: 0; margin: 0; }
.arcade-actions { flex: 0 0 auto; gap: 8px; }
.arcade-actions button { min-height: 40px; padding: 8px 13px; }
.arcade-primary span { margin-left: 10px; }
.arcade-control-deck { box-sizing: border-box; display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: 10px; flex: 0 0 auto; min-height: 78px; padding: 9px 11px; border: 1px solid #384455; border-radius: 7px; background: linear-gradient(110deg, #131d2b, #171525); }
.arcade-control-guide { display: grid; gap: 4px; min-width: 0; }
.arcade-control-guide > div { display: grid; grid-template-columns: 68px minmax(0, 1fr); align-items: baseline; gap: 8px; min-width: 0; }
.arcade-control-guide small { color: #9fe8df; font: 9px 'IBM Plex Mono', monospace; letter-spacing: .1em; }
.arcade-control-guide span { overflow: hidden; color: #d5d9e5; font: 10px/1.35 'IBM Plex Sans', sans-serif; text-overflow: ellipsis; }
.arcade-touch-buttons, .snake-controls, .invaders-controls { display: flex; flex: 0 0 auto; align-items: center; justify-content: center; gap: 6px; margin: 0; }
.athens-arcade .arcade-control-deck button { min-width: 42px; min-height: 42px; padding: 6px 10px; color: #a4eee0; background: #202a3b; touch-action: none; user-select: none; }
.athens-arcade .arcade-control-deck button:active { background: #315261; transform: translateY(1px); }
.athens-arcade .arcade-control-deck .invaders-fire { min-width: 102px; border-color: #ffb4df; background: linear-gradient(120deg,#ffb4df,#f2d8a1); color: #10151c; font-weight: 700; }
.athens-arcade .arcade-control-deck .snake-controls button { width: 42px; min-width: 42px; min-height: 36px; height: 36px; padding: 0; font-size: 18px; }
.snake-controls > div { display: flex; gap: 5px; }
.athens-arcade .arcade-control-deck .pinball-flip { min-width: 112px; border-color: #c49ae8; color: #f3d5ff; }
.arcade-settings { flex: 0 0 auto; border: 1px solid #384455; border-radius: 6px; background: #111823; }
.arcade-settings summary { display: flex; align-items: center; justify-content: space-between; min-height: 38px; padding: 0 12px; color: #dce4ef; cursor: pointer; font: 11px 'IBM Plex Mono', monospace; list-style-position: inside; }
.arcade-settings summary span { color: #9eaabd; font: 10px 'IBM Plex Sans', sans-serif; }
.arcade-settings-panel { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 12px; border-top: 1px solid #303b4c; padding: 10px 12px; }
.arcade-settings .arcade-audio { margin: 0; gap: 6px; align-content: start; }
.arcade-settings .arcade-audio button { min-height: 36px; padding: 6px 9px; }
.arcade-settings .arcade-audio label { min-height: 36px; }
.arcade-settings .arcade-save { margin: 0; padding: 0 0 0 12px; border-top: 0; border-left: 1px solid #303b4c; }
.arcade-settings .arcade-save button { min-height: 36px; padding: 6px 9px; }
.arcade-footer { flex: 0 0 auto; margin-top: 10px; padding-top: 9px; }
.athens-arcade--focused .arcade-shell { box-sizing: border-box; }
.athens-arcade--focused .arcade-screen { width: min(100%, calc((100dvh - 250px) * 720 / 440)); height: auto; max-height: calc(100dvh - 250px); aspect-ratio: 720 / 440; }
.athens-arcade--focused .arcade-action-bar { align-self: center; }
.athens-arcade--focused .arcade-control-deck, .athens-arcade--focused .arcade-settings { display: none; }
@media (max-width: 700px) {
  .athens-arcade { width: calc(100vw - 20px); height: calc(100dvh - 20px); max-height: calc(100dvh - 20px); }
  .arcade-shell { padding: 12px; }
  .arcade-header { padding-bottom: 10px; margin-bottom: 10px; }
  .arcade-layout { display: grid; grid-template-columns: minmax(0, 1fr); grid-template-rows: auto minmax(0, 1fr); gap: 8px; }
  .arcade-library { display: flex; gap: 6px; overflow-x: auto; overflow-y: hidden; }
  .arcade-library > .arcade-eyebrow { display: none; }
  .arcade-game-choice { flex: 0 0 142px; grid-template-columns: 24px 1fr; min-height: 48px!important; margin: 0!important; padding: 6px 8px!important; }
  .arcade-game-choice > span { font-size: 18px; }
  .arcade-game-choice b { font-size: 11px; }
  .arcade-game-choice small { font-size: 8px; }
  .arcade-machine { gap: 7px; }
  .arcade-machine__title > span { display: none; }
  .arcade-stats { justify-content: flex-start; gap: 12px; font-size: 9px; }
  .arcade-stats b { margin-left: 3px; }
  .arcade-action-bar { align-items: flex-start; flex-direction: column; gap: 6px; }
  .arcade-status { font-size: 11px; }
  .arcade-actions { width: 100%; }
  .arcade-actions button { flex: 1; }
  .arcade-control-deck { grid-template-columns: minmax(0, 1fr) auto; min-height: 72px; gap: 6px; padding: 7px; }
  .arcade-control-guide > div { grid-template-columns: 54px minmax(0, 1fr); gap: 5px; }
  .arcade-control-guide small { font-size: 8px; }
  .arcade-control-guide span { font-size: 9px; }
  .arcade-touch-buttons, .snake-controls, .invaders-controls { gap: 4px; }
  .athens-arcade .arcade-control-deck button { min-width: 36px; min-height: 38px; padding: 5px 7px; font-size: 11px; }
  .athens-arcade .arcade-control-deck .invaders-fire { min-width: 86px; }
  .athens-arcade .arcade-control-deck .snake-controls button { width: 34px; min-width: 34px; height: 34px; min-height: 34px; }
  .arcade-settings summary { min-height: 36px; }
  .arcade-settings summary span { display: none; }
  .arcade-settings-panel { grid-template-columns: minmax(0, 1fr); gap: 8px; }
  .arcade-settings .arcade-save { padding: 8px 0 0; border-left: 0; border-top: 1px solid #303b4c; }
  .arcade-footer { display: none; }
}
@media (max-width: 390px) {
  .arcade-control-deck { grid-template-columns: minmax(0, 1fr); }
  .arcade-touch-buttons, .snake-controls, .invaders-controls { justify-content: flex-end; }
}
@media (max-height: 760px) {
  .arcade-header { margin-bottom: 8px; padding-bottom: 8px; }
  .arcade-footer { display: none; }
}
</style>
  if (selectedGame.value !== 'breakout') { if (arcadeStatus.value === 'lost' || arcadeStatus.value === 'won') resetExtra(); arcadeStatus.value = 'playing'; if (!frame) frame = requestAnimationFrame(tick); return; }
