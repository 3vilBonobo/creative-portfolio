export interface ExperienceArchiveState {
  activeIndex: number;
  expanded: boolean;
  contributions: Record<string, boolean>;
}

// Layout changes deliberately have no state transition. A phone is collapsed
// only when the archive is created, not whenever it changes orientation.
export function createExperienceArchive(phone: boolean): ExperienceArchiveState {
  return { activeIndex: 0, expanded: !phone, contributions: {} };
}

export function selectExperienceChapter(state: ExperienceArchiveState, index: number, count: number, accordion: boolean) {
  const nextIndex = Math.max(0, Math.min(index, count - 1));
  state.expanded = accordion && nextIndex === state.activeIndex ? !state.expanded : true;
  state.activeIndex = nextIndex;
}
