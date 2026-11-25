export interface FloorPosition {
  id: string;
  top: number;
}

/** A reference line works for tall and sticky sections without visibility ratios. */
export function findActiveFloor(floors: readonly FloorPosition[], referenceY: number, atPageEnd = false): string {
  if (atPageEnd) return floors[floors.length - 1]?.id ?? "";
  let active = floors[0]?.id ?? "";
  for (const floor of floors) {
    if (floor.top > referenceY) break;
    active = floor.id;
  }
  // Infrastructure gaps continue to belong to the preceding inhabited floor.
  return active;
}
