/** @typedef {import('../data/breakoutLevels').BreakoutLevel} BreakoutLevel */

/**
 * Keeps the hand-authored Athens boards up front, then remixes them forever.
 * @param {number} level
 * @param {BreakoutLevel[]} levels
 * @returns {BreakoutLevel}
 */
export function breakoutLevel(level, levels) {
  const safeLevel = Math.max(1, Math.floor(level));
  const base = levels[(safeLevel - 1) % levels.length];
  if (!base || safeLevel <= levels.length) return base;

  const cycle = Math.floor((safeLevel - 1) / levels.length);
  const layout = base.layout.map((row, rowIndex) => [...row].map((cell, colIndex) => {
    if (cell === '0') return cell;
    return (safeLevel + rowIndex * 3 + colIndex * 5) % 7 === 0 ? '2' : cell;
  }).join(''));
  if (safeLevel % 5 === 0 && layout.length < 8) {
    layout.push(Array.from({ length: 8 }, (_, col) => (col + safeLevel) % 3 === 0 ? '0' : cycle > 2 ? '2' : '1').join(''));
  }
  return {
    ...base,
    name: `${base.name} · remix ${cycle + 1}`,
    layout,
    speed: 400 + Math.min(110, (safeLevel - 10) * 5),
    paddleWidth: Math.max(78, 88 - Math.floor((safeLevel - 10) / 3) * 2),
  };
}
