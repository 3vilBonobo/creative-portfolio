import test from 'node:test';
import assert from 'node:assert/strict';
import { getWeatherEffectValues } from '../src/services/weatherEffects.ts';
const state = { weatherCondition: 'partlyCloudy', precipitation: 0, rain: 0, cloudCover: 35, windSpeed: 10 };
test('clear sky stays cloud-free even with stale cloud-cover measurements', () => {
  assert.equal(getWeatherEffectValues({ ...state, weatherCondition: 'clear', cloudCover: 100 }).cloud, 0);
});
test('cloud transit scales proportionally with wind and stops in calm air', () => {
  const slow = getWeatherEffectValues(state);
  const fast = getWeatherEffectValues({ ...state, windSpeed: 20 });
  assert.equal(fast.cloudDuration, slow.cloudDuration / 2);
  assert.equal(getWeatherEffectValues({ ...state, windSpeed: 0 }).cloudPaused, true);
  assert.equal(getWeatherEffectValues({ ...state, windSpeed: NaN }).cloudPaused, true);
});
test('storm previews have cloud cover and precipitation strength with clear live measurements', () => {
  const storm = getWeatherEffectValues({ ...state, weatherCondition: 'storm', cloudCover: 0 });
  assert.equal(storm.cloud, 1);
  assert.ok(storm.strength >= .72);
});
