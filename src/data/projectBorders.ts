// A stable outline color per project, shared by desktop and phone previews.
// This palette only affects the frame; surfaces and buttons keep their theme.
const projectBorders: Record<string, string> = {
  "nerve-ending": "#b6c67f",
  "project-companion": "#cba66b",
  "enterprise-traceability": "#69bdc9",
  "podcast-app": "#c88680",
  "athens-therapy": "#91b49a",
  "orthobyron": "#78a5dc",
  "athens-cyberpunk": "#ba89c9",
  "iss-tracker": "#8da9bd",
  "madlen-v": "#aaa0d8",
  "magic-herbs": "#accd8e",
  "fashion-show": "#d694b0",
  "tip-calculator": "#79c7b4",
};

export function projectBorderColor(id: string) {
  return projectBorders[id] ?? "#a98d64";
}
