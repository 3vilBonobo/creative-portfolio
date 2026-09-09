export const CAT_SPOTS = [
  { id: "rug", label: "Rug · beside the desk", x: 992, y: 925, scale: 1 },
  { id: "couch", label: "Couch · cushion", x: 185, y: 758, scale: .78 },
  { id: "table", label: "Coffee table · front edge", x: 145, y: 965, scale: .72 },
] as const;
export type CatSpot = (typeof CAT_SPOTS)[number]["id"];
export type CatPose = "sitting" | "sleeping";

// Stable throughout each hour, including reloads; every spot gets both poses.
export function getHourlyCat(timestamp: number) {
  const hour = Math.floor(timestamp / 3_600_000);
  return { spot: CAT_SPOTS[hour % CAT_SPOTS.length]!, pose: (hour % 2 ? "sleeping" : "sitting") as CatPose };
}
