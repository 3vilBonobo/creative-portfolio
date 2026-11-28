import test from 'node:test';
import assert from 'node:assert/strict';
import { createArcadeAudio } from '../src/services/arcadeAudio.ts';

test('audio is opt-in, separates music and effects, suspends, and closes on disposal', async () => {
  const original = globalThis.AudioContext;
  let created = 0, tones = 0, instance;
  globalThis.AudioContext = class {
    state = 'suspended'; currentTime = 0; destination = {};
    constructor() { created++; instance = this; }
    createGain() { return {connect(){}, disconnect(){}, gain:{value:0, setValueAtTime(){}, linearRampToValueAtTime(){}, exponentialRampToValueAtTime(){}}}; }
    createOscillator() { tones++; return {frequency:{value:0},connect(){},disconnect(){},start(){},stop(){}}; }
    async resume() { this.state = 'running'; }
    async suspend() { this.state = 'suspended'; }
    async close() { this.state = 'closed'; }
  };
  try {
    const audio = createArcadeAudio(); audio.cue('launch'); audio.update(true); assert.equal(created, 0);
    await audio.configure({music:false,effects:false,volume:.3}); assert.equal(created, 0);
    await audio.configure({music:false,effects:true,volume:.3}); audio.cue('launch'); assert.equal(tones, 3);
    audio.update(true); assert.equal(tones, 3, 'effects do not enable music');
    await audio.configure({music:true,effects:false,volume:.2}); audio.cue('brick'); assert.equal(tones, 3);
    audio.update(true); assert.equal(tones, 5); audio.update(false); assert.equal(tones, 5);
    audio.suspend(); assert.equal(instance.state, 'suspended'); await audio.resume(); assert.equal(instance.state, 'running');
    audio.dispose(); assert.equal(instance.state, 'closed'); assert.equal(await audio.configure({music:true,effects:true,volume:.3}), false);
  } finally { globalThis.AudioContext = original; }
});
