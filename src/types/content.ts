export interface ProjectPreview { src: string | null; width: number; height: number; alt: string; source: string; kind: "browser" | "landscape" | "portrait" | "app" | "source" }
export interface Project { id: string; title: string; displayTitle: string; shortDescription: string; role: string; technologies: string[]; repositoryUrl: string; liveUrl: string | null; attribution?: string; featured: boolean; preview: ProjectPreview }
export type ExperienceCategory = "development" | "legal" | "education" | "consulting";
export interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  dateLabel: string;
  summary: string;
  highlights: string[];
  technologies: string[];
  current: boolean;
  location?: string;
  employmentType?: string;
  category?: ExperienceCategory;
  confidential?: boolean;
  temporary?: boolean;
}
export interface Principle { title: string; description: string }
export interface ToolkitGroup { label: string; items: string[] }
export interface AboutContent {
  eyebrow: string; title: string; introduction: string; backgroundParagraphs: string[];
  currentFocus: string; backgroundSummary: string; principles: Principle[]; toolkitGroups: ToolkitGroup[]; cvUrl?: string;
}
