export interface Project { id: string; title: string; summary: string; technologies: string[]; role: string; image: string; liveUrl?: string; repositoryUrl?: string; caseStudyUrl?: string; featured: boolean }
export interface Experience { id: string; role: string; company: string; startDate: string; endDate: string; description: string; highlights: string[]; technologies: string[] }
