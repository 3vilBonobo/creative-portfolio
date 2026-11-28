export const CAT_SPOTS = [
  { id: "rug", label: "Rug · beside the desk", x: 1030, y: 824, scale: 1 },
  { id: "couch", label: "Couch · cushion", x: 230, y: 675, scale: .85 },
] as const;
export type CatSpot = (typeof CAT_SPOTS)[number]["id"];
export type CatPose = "sitting" | "sleeping";

// Stable throughout each hour, including reloads; every spot gets both poses.
export function getHourlyCat(timestamp: number) {
  const hour = Math.floor(timestamp / 3_600_000);
  const spot = CAT_SPOTS[hour % CAT_SPOTS.length]!;
  const pose = (Math.floor(hour / CAT_SPOTS.length) % 2 ? "sleeping" : "sitting") as CatPose;
  return { spot, pose };
}
