// Optional same-origin asset URLs, e.g. '/audio/arcade/brick.ogg'.
// Empty slots use the original procedural synth; no downloads are needed.
export type ArcadeCue = 'launch' | 'bounce' | 'brick' | 'miss' | 'win';
export const ARCADE_AUDIO: { music?: string; effects: Partial<Record<ArcadeCue, string>> } = {
  effects: {},
};
