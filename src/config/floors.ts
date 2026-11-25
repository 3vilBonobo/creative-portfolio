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
  { from: FLOOR.office, to: FLOOR.about, variant: "pipes" },
  { from: FLOOR.about, to: FLOOR.projects, variant: "cables" },
  { from: FLOOR.projects, to: FLOOR.experience, variant: "pipes" },
  { from: FLOOR.experience, to: FLOOR.street, variant: "cables" },
].map(({ from, to, variant }) => ({
  id: `${from.number}-to-${to.number}`,
  from,
  to,
  variant: variant as "pipes" | "cables",
}));

export type FloorTransition = (typeof FLOOR_TRANSITIONS)[number];
