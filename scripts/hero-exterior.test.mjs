import test from 'node:test';
import assert from 'node:assert/strict';
import { getHeroExterior } from '../src/services/heroExterior.ts';

test('exterior follows solar phase and uses overcast photos only during daylight', () => {
  for (const weather of ['clear', 'partlyCloudy', 'cloudy', 'fog', 'rain', 'storm', 'snow']) {
    assert.equal(getHeroExterior('night', weather), 'night');
    assert.equal(getHeroExterior('dusk', weather), 'dusk');
  }
  assert.equal(getHeroExterior('day', 'clear'), 'sunny');
  assert.equal(getHeroExterior('dawn', 'clear'), 'sunny');
  assert.equal(getHeroExterior('goldenHour', 'clear'), 'sunset');
  for (const phase of ['dawn', 'day', 'goldenHour']) {
    for (const weather of ['cloudy', 'rain', 'storm', 'fog', 'snow']) {
      assert.equal(getHeroExterior(phase, weather), 'cloudy');
    }
  }
});
