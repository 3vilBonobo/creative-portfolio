export const ARCADE_RECORDS_KEY = 'athens-arcade:records:v1';
export type ArcadeRecordGame = 'breakout' | 'snake' | 'invaders' | 'asteroids' | 'pinball';
export type ArcadeRecord = { score: number; level: number };
export type ArcadeRecords = Partial<Record<ArcadeRecordGame, ArcadeRecord>>;
type RecordStorage = Pick<Storage, 'getItem' | 'setItem'>;

export function readArcadeRecords(storage: RecordStorage | undefined): ArcadeRecords {
  try {
    const parsed = JSON.parse(storage?.getItem(ARCADE_RECORDS_KEY) ?? '{}') as Record<string, unknown>;
    const records: ArcadeRecords = {};
    for (const game of ['breakout', 'snake', 'invaders', 'asteroids', 'pinball'] as const) {
      const item = parsed[game] as Partial<ArcadeRecord> | undefined;
      if (item && Number.isSafeInteger(item.score) && item.score! >= 0 && item.score! <= 1e9
        && Number.isSafeInteger(item.level) && item.level! >= 1 && item.level! <= 100000) {
        records[game] = { score: item.score!, level: item.level! };
      }
    }
    return records;
  } catch { return {}; }
}

export function recordArcadeHighScore(storage: RecordStorage | undefined, game: ArcadeRecordGame, score: number, level: number): boolean {
  if (!storage || !Number.isSafeInteger(score) || score < 0 || score > 1e9
    || !Number.isSafeInteger(level) || level < 1 || level > 100000) return false;
  const records = readArcadeRecords(storage);
  if (score <= (records[game]?.score ?? -1)) return false;
  records[game] = { score, level };
  try { storage.setItem(ARCADE_RECORDS_KEY, JSON.stringify(records)); return true; } catch { return false; }
}
