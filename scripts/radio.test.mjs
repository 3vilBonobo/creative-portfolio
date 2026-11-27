import test from 'node:test';
import assert from 'node:assert/strict';
import { createRadioController } from '../src/services/radioController.ts';
import { RADIO_STATIONS } from '../src/data/radio.ts';
import { existsSync } from 'node:fs';

class FakeAudio extends EventTarget {
  src = ''; currentSrc = ''; paused = true; ended = false; error = null;
  readyState = 0; volume = 1; muted = false; preload = ''; calls = 0;
  pending = [];
  load() { this.currentSrc = this.src; this.error = null; this.ended = false; this.readyState = 0; }
  removeAttribute() { this.src = ''; }
  pause() { this.paused = true; this.dispatchEvent(new Event('pause')); }
  play() { this.calls++; this.paused = false; return new Promise((resolve,reject) => this.pending.push({resolve,reject})); }
  start(index = this.pending.length - 1) { this.readyState = 4; this.dispatchEvent(new Event('playing')); this.pending[index].resolve(); }
}
const song = id => ({id,title:id,artist:'Artist',src:`/audio/${id}.mp3`});
function fixture(saved = null, stations = [{id:'a',playlist:[song('one'),song('two')]},{id:'empty',playlist:[]},{id:'b',playlist:[song('three')]}]) {
  let count = 0; const audio = new FakeAudio(); let stored = saved;
  const controller = createRadioController(stations, {createAudio:() => {count++; return audio;},baseUrl:'https://portfolio.test/',storage:{getItem:() => stored,setItem:(_key,value) => {stored=value;}}});
  return {controller,audio,count:()=>count,saved:()=>JSON.parse(stored)};
}
const tick = () => new Promise(resolve => queueMicrotask(resolve));

test('silent initialization, station discovery and mute never create or fetch media', () => {
  const f = fixture();
  f.controller.selectStation('empty'); f.controller.toggleMute();
  assert.equal(f.controller.getState().status,'offline'); assert.equal(f.count(),0);
  f.controller.cycle(1,true); assert.equal(f.controller.getState().stationId,'b');
  assert.equal(f.count(),0); assert.equal(f.controller.getState().activated,false);
});
test('play, buffering, pause, mute and volume share one media element', async () => {
  const f = fixture(); const started = f.controller.play();
  assert.equal(f.controller.getState().status,'loading'); f.audio.start(); await started;
  assert.equal(f.controller.getState().status,'playing');
  f.audio.readyState=2; f.audio.dispatchEvent(new Event('waiting'));
  assert.equal(f.controller.getState().status,'buffering');
  f.controller.toggleMute(); f.controller.setVolume(.2);
  assert.equal(f.audio.muted,true); assert.equal(f.audio.volume,.2); assert.equal(f.audio.paused,false);
  f.controller.pause(); assert.equal(f.audio.paused,true); assert.equal(f.controller.getState().status,'paused');
  const resumed = f.controller.play(); f.audio.start(); await resumed; assert.equal(f.count(),1);
});
test('pause wins over unresolved play and late playing events', async () => {
  const f=fixture(); const started=f.controller.play(); f.controller.pause();
  f.audio.paused=false; f.audio.start(); await started;
  assert.equal(f.audio.paused,true); assert.equal(f.controller.getState().status,'paused');
});
test('rapid switches ignore obsolete play rejections and stale media state', async () => {
  const f=fixture(); const old=f.controller.play();
  f.controller.selectStation('b'); f.controller.selectStation('a');
  assert.equal(f.audio.pending.length,3); assert.equal(f.count(),1);
  f.audio.currentSrc='https://portfolio.test/audio/three.mp3'; f.audio.error={code:4};
  f.audio.dispatchEvent(new Event('error'));
  assert.equal(f.controller.getState().status,'loading');
  f.audio.currentSrc=f.audio.src; f.audio.error=null;
  f.audio.dispatchEvent(new Event('ended')); f.audio.dispatchEvent(new Event('pause'));
  assert.equal(f.controller.getState().trackIndex,0);
  f.audio.pending[0].reject(new Error('old')); await old;
  f.audio.start(2); await tick(); assert.equal(f.controller.getState().status,'playing');
});
test('ended advances ordered playlists and loops; selecting empty stops playback', async () => {
  const f=fixture(); const started=f.controller.play(); f.audio.start(); await started;
  f.audio.ended=true; f.audio.paused=true; f.audio.dispatchEvent(new Event('ended'));
  assert.equal(f.controller.getState().trackIndex,1); assert.match(f.audio.src,/two/);
  f.audio.start(); await tick();
  f.audio.ended=true; f.audio.paused=true; f.audio.dispatchEvent(new Event('ended'));
  assert.equal(f.controller.getState().trackIndex,0); assert.match(f.audio.src,/one/);
  f.controller.selectStation('empty'); assert.equal(f.audio.paused,true); assert.equal(f.audio.src,'');
  assert.equal(f.controller.getState().status,'offline');
});
test('single-track playlists restart through the same controller', async () => {
  const f=fixture(); f.controller.selectStation('b'); const started=f.controller.play(); f.audio.start(); await started;
  f.audio.ended=true; f.audio.paused=true; f.audio.dispatchEvent(new Event('ended'));
  assert.equal(f.controller.getState().trackIndex,0); assert.equal(f.audio.calls,2); assert.equal(f.count(),1);
});
test('errors are recoverable and never create duplicate audio instances', async () => {
  const f=fixture(); const started=f.controller.play(); f.audio.pending[0].reject(new Error('blocked')); await started;
  assert.equal(f.controller.getState().status,'error'); assert.equal(f.audio.paused,true);
  const retry=f.controller.play(); f.audio.start(); await retry;
  f.audio.error={code:4}; f.audio.dispatchEvent(new Event('error'));
  assert.equal(f.controller.getState().status,'error'); assert.equal(f.audio.paused,true);
  const again=f.controller.play(); f.audio.start(); await again; assert.equal(f.count(),1);
});
test('preferences restore station and volume without resuming or fetching', () => {
  const f=fixture(); f.controller.selectStation('b'); f.controller.setVolume(.72);
  const fresh=fixture(JSON.stringify(f.saved()));
  assert.equal(fresh.controller.getState().stationId,'b'); assert.equal(fresh.controller.getState().volume,.72);
  assert.equal(fresh.controller.getState().activated,false); assert.equal(fresh.count(),0);
  assert.doesNotThrow(()=>fixture('{malformed'));
});
test('zero volume silences without pausing and one-tap unmute restores sound', async () => {
  const f=fixture(); const started=f.controller.play(); f.audio.start(); await started;
  f.controller.setVolume(0); assert.equal(f.audio.paused,false); assert.equal(f.audio.volume,0);
  f.controller.toggleMute(); assert.equal(f.audio.volume,.45); assert.equal(f.audio.muted,false);
  f.controller.toggleMute(); assert.equal(f.audio.muted,true); assert.equal(f.audio.paused,false);
});
test('all-empty manifests, denied storage and invalid preferences remain usable', async () => {
  const f=fixture(JSON.stringify({stationId:'removed',volume:'bad'}),[{id:'a',playlist:[]}]);
  f.controller.cycle(1,true); await f.controller.play(); assert.equal(f.count(),0); assert.equal(f.controller.getState().status,'offline');
  const controller=createRadioController([], {createAudio:()=>{throw Error('should not instantiate');},baseUrl:'https://test/',storage:{getItem:()=>{throw Error('denied');},setItem:()=>{throw Error('denied');}}});
  await controller.play(); controller.cycle(-1,true); controller.setVolume(.3); controller.dispose();
});
test('disposal removes listeners and invalidates pending work', async () => {
  const f=fixture(); let changes=0; f.controller.subscribe(()=>changes++);
  const started=f.controller.play(); f.controller.dispose(); const before=changes;
  f.audio.pending[0].reject(new Error('old')); await started; f.audio.dispatchEvent(new Event('error'));
  assert.equal(changes,before); assert.equal(f.audio.paused,true); assert.equal(f.audio.src,'');
});
test('configured stations and tracks have unique identities and real local sources', () => {
  assert.equal(RADIO_STATIONS.length,5); assert.equal(new Set(RADIO_STATIONS.map(s=>s.id)).size,5);
  for (const station of RADIO_STATIONS) for (const track of station.playlist) {
    assert.ok(existsSync(new URL('../public'+track.src,import.meta.url))); assert.ok(track.artist); assert.ok(track.title);
  }
});
