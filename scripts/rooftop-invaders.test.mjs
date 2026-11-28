import test from 'node:test';
import assert from 'node:assert/strict';
import { aimInvaderPlayer, createInvaders, deleteInvadersSave, fireInvaderShot, invaderEnemyVolleySize, INVADERS_SAVE_KEY, moveInvaderPlayer, readInvadersSave, saveInvaders, stepInvaders } from '../src/services/rooftopInvaders.ts';

test('formations grow to a screen-safe cap while wave pressure rises', () => {
  const first = createInvaders(1), last = createInvaders(10), cap = createInvaders(11);
  assert.equal(first.enemies.length, 15);
  assert.equal(last.enemies.length, 45);
  assert.equal(cap.enemies.length, 50);
  assert.ok(last.enemySpeed > first.enemySpeed);
  assert.ok(last.enemies.some(enemy => enemy.hp === 2));
});

test('keyboard and pointer piloting stay inside the playfield', () => {
  const game = createInvaders();
  moveInvaderPlayer(game, -1, 10); assert.equal(game.playerX, 28);
  moveInvaderPlayer(game, 1, 10); assert.equal(game.playerX, 692);
  aimInvaderPlayer(game, 120); assert.equal(game.playerX, 120);
  aimInvaderPlayer(game, 900); assert.equal(game.playerX, 692);
});

test('fire streams straight vertical shots at a short rate limit', () => {
  const game = createInvaders(); game.status = 'playing';
  assert.equal(fireInvaderShot(game), true);
  assert.deepEqual(game.playerShots[0], { x: game.playerX, y: 368, vy: -320 });
  const shotX = game.playerShots[0].x;
  stepInvaders(game, .1, () => 1);
  assert.equal(game.playerShots[0].x, shotX);
  assert.equal(game.playerShots[0].y, 336);
  game.fireCooldown = 0;
  assert.equal(fireInvaderShot(game), true);
  assert.equal(game.playerShots.length, 2);
  assert.ok(game.playerShots.every(shot=>shot.x===shotX));
  game.playerShots = [];
  game.fireCooldown = 0;
  assert.equal(fireInvaderShot(game), true);
  assert.equal(fireInvaderShot(game), false);
  game.playerShots=Array.from({length:9},()=>({x:game.playerX,y:200,vy:-320}));game.fireCooldown=0;
  assert.equal(fireInvaderShot(game),false);
  game.status = 'paused'; assert.equal(fireInvaderShot(game), false);
});

test('waves unlock twin then triple straight fire, while enemy volleys escalate later', () => {
  const first=createInvaders(); first.status='playing';
  const twin=createInvaders(2); twin.status='playing';
  const triple=createInvaders(5); triple.status='playing';
  assert.equal(first.weaponLevel,1); assert.equal(twin.weaponLevel,2); assert.equal(triple.weaponLevel,3);
  assert.equal(invaderEnemyVolleySize(1),1); assert.equal(invaderEnemyVolleySize(4),2); assert.equal(invaderEnemyVolleySize(8),3);
  for (const [game,count] of [[first,1],[twin,2],[triple,3]]) {
    assert.equal(fireInvaderShot(game),true);
    assert.equal(game.playerShots.length,count);
    assert.ok(game.playerShots.every(shot=>shot.vy===-320));
    assert.equal(new Set(game.playerShots.map(shot=>shot.x)).size,count);
  }
});

test('enemy fire adds a predictable parallel volley at the later milestones', () => {
  for (const [level,count] of [[1,1],[4,2],[8,3]]) {
    const game=createInvaders(level); game.status='playing'; game.enemyFireTimer=0;
    stepInvaders(game,.01,()=>.5);
    assert.equal(game.enemyShots.length,count);
    assert.equal(new Set(game.enemyShots.map(shot=>shot.vy)).size,1);
    assert.equal(game.enemyShots.at(-1).x-game.enemyShots[0].x,count===1?0:count===2?20:30);
  }
});

test('a hit clears a drone, awards points and builds the next wave', () => {
  const game = createInvaders(); game.status = 'playing'; game.enemies = [{id:1,x:360,y:100,row:0,kind:'commander',hp:1}];
  game.playerShots = [{x:360,y:100,vy:0}];
  assert.deepEqual(stepInvaders(game,.01), ['hit','wave']);
  assert.equal(game.level, 2); assert.equal(game.status, 'ready'); assert.equal(game.score, 125); assert.equal(game.enemies.length, 15);
});

test('wave ten rolls into wave eleven and the enemy line breaching the roof loses', () => {
  const final = createInvaders(10); final.status='playing'; final.enemies=[{id:1,x:360,y:100,row:0,kind:'commander',hp:1}]; final.playerShots=[{x:360,y:100,vy:0}];
  assert.deepEqual(stepInvaders(final,.01), ['hit','wave']); assert.equal(final.level,11); assert.equal(final.status,'ready');
  const breach=createInvaders(); breach.status='playing'; breach.enemies[0].y=345;
  assert.deepEqual(stepInvaders(breach,.01),['lost']); assert.equal(breach.status,'lost');
});

test('enemy shots consume lives, grant a brief respawn window, then end the run', () => {
  const game=createInvaders(5); game.status='playing'; game.enemies=[{id:1,x:500,y:100,row:0,kind:'commander',hp:1}];
  game.enemyShots=[{x:game.playerX,y:380,vy:0}];
  assert.deepEqual(stepInvaders(game,.01,()=>.99),['life']); assert.equal(game.lives,2); assert.equal(game.weaponLevel,2); assert.ok(game.invulnerability>0);
  game.invulnerability=0;game.enemyShots=[{x:game.playerX,y:380,vy:0}];
  assert.deepEqual(stepInvaders(game,.01,()=>.99),['life']); assert.equal(game.lives,1);
  game.invulnerability=0;game.enemyShots=[{x:game.playerX,y:380,vy:0}];
  assert.deepEqual(stepInvaders(game,.01,()=>.99),['life','lost']); assert.equal(game.status,'lost');
});

test('local save restores play paused and supports legacy, corruption and deletion', () => {
  const values=new Map(), storage={getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)};
  const game=createInvaders(4,220,2);game.status='playing';
  assert.equal(saveInvaders(storage,game),true);assert.equal(readInvadersSave(storage).status,'paused');assert.equal(readInvadersSave(storage).weaponLevel,2);
  values.set(INVADERS_SAVE_KEY,JSON.stringify({level:3,score:90,invaders:{enemies:[]}}));
  assert.equal(readInvadersSave(storage).level,3);
  values.set(INVADERS_SAVE_KEY,'not json');assert.equal(readInvadersSave(storage),undefined);
  assert.equal(deleteInvadersSave(storage),true);assert.equal(readInvadersSave(storage),undefined);
});

test('generated waves remain saveable after wave ten', () => {
  const values = new Map(), storage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) };
  const game = createInvaders(16, 1200); game.status = 'playing';
  assert.equal(saveInvaders(storage, game), true);
  const restored = readInvadersSave(storage);
  assert.equal(restored.level, 16); assert.equal(restored.score, 1200); assert.equal(restored.enemies.length, 50);
});
