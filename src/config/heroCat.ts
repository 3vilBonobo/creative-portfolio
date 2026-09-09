export const CAT_SPOTS = [
  { id: "rug", label: "Rug · beside the desk", x: 992, y: 925, scale: 1 },
  { id: "couch", label: "Couch · cushion", x: 184, y: 758, scale: .85 },
  { id: "table", label: "Coffee table · by the vase", x: 424, y: 835, scale: .9 },
] as const;
export type CatSpot = (typeof CAT_SPOTS)[number]["id"];
export type CatPose = "sitting" | "sleeping";

// Stable throughout each hour, including reloads; every spot gets both poses.
export function getHourlyCat(timestamp: number) {
  const hour = Math.floor(timestamp / 3_600_000);
  return { spot: CAT_SPOTS[hour % CAT_SPOTS.length]!, pose: (hour % 2 ? "sleeping" : "sitting") as CatPose };
}
