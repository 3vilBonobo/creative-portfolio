import type { Project } from "../types/content";

export const INITIAL_PROJECTS = 2;
export type CatalogueCategory = Project["category"];

// Keep catalogue order; the feature has its own place in the exhibition.
export function categoryProjects(catalogue: readonly Project[], category: CatalogueCategory, featuredId?: string) {
  return catalogue.filter(project => project.category === category && project.id !== featuredId);
}

export function projectDisclosure<T>(items: readonly T[], expanded: boolean, compact: boolean) {
  const visible = compact && !expanded ? items.slice(0, INITIAL_PROJECTS) : [...items];
  return { visible, remaining: items.length - visible.length, expandable: items.length > INITIAL_PROJECTS };
}
