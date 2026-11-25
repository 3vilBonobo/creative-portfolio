export const FLOOR = {
  office: { id: "office", number: "04", label: "Hero" },
  about: { id: "about", number: "03", label: "About" },
  projects: { id: "projects", number: "02", label: "Projects" },
  experience: { id: "experience", number: "01", label: "Experience" },
  street: { id: "street", number: "00", label: "Contact" },
} as const;

// Sequence is explicit and independent of both section identity and display number.
export const FLOORS = [FLOOR.office, FLOOR.about, FLOOR.projects, FLOOR.experience, FLOOR.street] as const;
export type Floor = (typeof FLOORS)[number];

export const FLOOR_TRANSITIONS = [
  { from: FLOOR.office, to: FLOOR.about, variant: "upper", light: { x: 1100, y: 40 } },
  { from: FLOOR.about, to: FLOOR.projects, variant: "data", light: { x: 1130, y: 24 } },
  { from: FLOOR.projects, to: FLOOR.experience, variant: "power", light: { x: 740, y: 110 } },
  { from: FLOOR.experience, to: FLOOR.street, variant: "lower", light: { x: 1190, y: 24 } },
].map(({ from, to, variant, light }) => ({
  id: `${from.number}-to-${to.number}`,
  from,
  to,
  variant,
  artwork: `/environments/transitions/transition-${from.number}-to-${to.number}-universal.webp`,
  light,
}));

export type FloorTransition = (typeof FLOOR_TRANSITIONS)[number];
