import type { ExperienceEntry } from "../types/content";

// Curated portfolio copy approved by the owner, based on the supplied 2026 CV.
// Overlapping employment dates are intentional. Supporting roles remain separate.
export const experience: ExperienceEntry[] = [
  {
    id: "agritrack-frontend", role: "Software Engineer", company: "Agritrack SA",
    startDate: "2025-01", endDate: "Present", dateLabel: "Jan 2025 — Present",
    summary: "I build and maintain a B2B food and seafood traceability application, taking responsibility for substantial parts of its frontend. My work brings operational requirements into data-heavy interfaces, offline-capable workflows, and reliable production behaviour.",
    mobileSummary: "I own substantial frontend work on a food and seafood traceability platform, including its UX/UI redesign, offline-capable workflows, and production debugging. I also contribute to Java/Spring Boot features.",
    highlights: ["I redesigned the application's UX/UI and build reusable Angular components, reactive forms, and state management.", "I trace frontend and API failures, maintain automated checks, and contribute to Java and Spring Boot features."],
    technologies: ["Angular", "TypeScript", "RxJS", "IndexedDB", "Dexie"],
    current: true, category: "development",
  },
  {
    id: "internet-now", role: "Web Developer", company: "Internet Now",
    startDate: "2022-09", endDate: "2025-02", dateLabel: "Sep 2022 — Feb 2025",
    summary: "I worked across multiple websites and web applications, balancing new development with the upkeep of existing systems. The work involved different frontend frameworks, WordPress, client requirements, and the constraints of established production websites.",
    mobileSummary: "I developed responsive websites and web applications using JavaScript, React, Vue, and WordPress, while maintaining existing code and improving performance.",
    highlights: ["I built custom frontend functionality and responsive interfaces using JavaScript, React, Vue, and WordPress.", "I investigated legacy code, maintained existing functionality, and improved website performance."],
    technologies: ["JavaScript", "React", "Vue", "WordPress", "HTML/CSS"],
    current: false, category: "development",
  },
  {
    id: "freelance-frontend", role: "Frontend Developer", company: "Freelance",
    startDate: "2021-05", endDate: "2024-09", dateLabel: "May 2021 — Sep 2024",
    summary: "I built responsive, accessible websites and web applications, combining interface development with custom SVG graphics and web animation. Independent work connected practical web development with my interest in visual interaction.",
    mobileSummary: "I built responsive, accessible websites and created custom SVG graphics and web animations.",
    highlights: ["I built responsive, accessible interfaces and custom functionality for web projects.", "I created SVG graphics and web animations, exploring how movement changes the feel of an interface."],
    technologies: ["SVG"], current: false, category: "consulting",
  },
  {
    id: "boutsika-associates", role: "Lawyer", company: "Boutsika & Associates",
    startDate: "2011", endDate: "2020-12", dateLabel: "2011 — Dec 2020",
    summary: "I practised law across criminal, property, immigration, and human rights matters. The discipline of examining evidence and interpreting complex requirements remains useful when I approach technical problems and unfamiliar systems today.",
    mobileSummary: "I worked across criminal, property, immigration, and human rights law, including pro bono refugee cases.",
    highlights: ["I managed legal matters involving client communication, negotiations, and case analysis.", "I worked on immigration and human rights cases, including pro bono refugee matters."],
    technologies: [], current: false, category: "legal",
  },
];

export const communityExperience: ExperienceEntry[] = [
  {
    id: "rainbow-school", role: "Web Manager", company: "Rainbow School NGO",
    startDate: "2021-11", endDate: "2025-01", dateLabel: "Nov 2021 — Jan 2025", employmentType: "Volunteer",
    summary: "I maintained the organisation's website content, functionality, visual presentation, and performance monitoring.",
    highlights: [], technologies: [], current: false,
  },
  {
    id: "enargeia-ngo", role: "Legal Counsellor and Founding Member", company: "Enargeia NGO",
    startDate: "2013-11", endDate: "2014-06", dateLabel: "Nov 2013 — Jun 2014",
    summary: "I contributed as a legal counsellor and founding member of the organisation.",
    highlights: [], technologies: [], current: false,
  },
  {
    id: "peri-psychis", role: "Seminar Tutor", company: "Peri Psychis",
    startDate: "2013-02", endDate: "2014-06", dateLabel: "Feb 2013 — Jun 2014",
    summary: "I taught seminars covering criminal law, criminology, and forensic psychology.",
    highlights: [], technologies: [], current: false,
  },
];
