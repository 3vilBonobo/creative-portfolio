import type { Project } from "../types/content";

export type CatalogueCategory = Project["category"];

// Keep catalogue order; the feature has its own place in the exhibition.
export function categoryProjects(catalogue: readonly Project[], category: CatalogueCategory, featuredId?: string) {
  return catalogue.filter(project => project.category === category && project.id !== featuredId);
}

export function projectDisclosure<T>(items: readonly T[], expanded: boolean, columns: number) {
  const rowSize = Math.max(1, Math.floor(columns));
  const visible = expanded ? [...items] : items.slice(0, rowSize);
  return { visible, remaining: items.length - visible.length, expandable: items.length > rowSize };
}
