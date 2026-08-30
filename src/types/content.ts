export interface Project { id: string; title: string; summary: string; technologies: string[]; role: string; image: string; liveUrl?: string; repositoryUrl?: string; caseStudyUrl?: string; featured: boolean }
export interface Experience { id: string; role: string; company: string; startDate: string; endDate: string; description: string; highlights: string[]; technologies: string[] }
export interface Principle { title: string; description: string }
export interface ToolkitGroup { label: string; items: string[] }
export interface AboutContent {
  eyebrow: string; title: string; introduction: string; backgroundParagraphs: string[];
  currentFocus: string; principles: Principle[]; toolkitGroups: ToolkitGroup[]; cvUrl?: string;
}
