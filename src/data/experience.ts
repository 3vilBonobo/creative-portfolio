import type { ExperienceEntry } from "../types/content";

// Curated portfolio copy approved by the owner, based on the supplied 2026 CV.
// Overlapping employment dates are intentional. Supporting roles remain separate.
export const experience: ExperienceEntry[] = [
  {
    id: "agritrack-frontend", role: "Software Engineer", company: "Agritrack SA",
    startDate: "2025-01", endDate: "Present", dateLabel: "Jan 2025 — Present",
    summary: "I take ownership of frontend features across a production B2B traceability platform for food and seafood. I turn complex operational workflows into clear Angular interfaces, covering UX/UI redesign, reactive forms, offline data, and production troubleshooting. I also contribute to Java and Spring Boot features.",
    mobileSummary: "I build frontend features for a production food and seafood traceability platform: UX/UI redesign, Angular workflows, offline data, and production troubleshooting. I also contribute to Java and Spring Boot features.",
    highlights: ["I redesigned core workflows, building reusable Angular components, reactive forms, and client-side state.", "I investigate frontend and API failures, maintain automated checks, and contribute to Java and Spring Boot features."],
    technologies: ["Angular", "TypeScript", "RxJS", "IndexedDB", "Dexie", "Java", "Spring Boot"],
    current: true, category: "development",
  },
  {
    id: "internet-now", role: "Web Developer", company: "Internet Now",
    startDate: "2022-09", endDate: "2025-02", dateLabel: "Sep 2022 — Feb 2025",
    summary: "I delivered responsive websites and web applications across client projects, working with JavaScript, React, Vue, and WordPress. I balanced new feature work with the care of established production sites: investigating legacy code, maintaining existing functionality, and improving performance.",
    mobileSummary: "I delivered responsive websites and web applications with JavaScript, React, Vue, and WordPress, while maintaining established sites and improving performance.",
    highlights: ["I built custom frontend features and responsive interfaces across client websites and applications.", "I investigated legacy code, maintained production functionality, and improved website performance."],
    technologies: ["JavaScript", "React", "Vue", "WordPress", "HTML/CSS"],
    current: false, category: "development",
  },
  {
    id: "freelance-frontend", role: "Frontend Developer", company: "Freelance",
    startDate: "2021-05", endDate: "2024-09", dateLabel: "May 2021 — Sep 2024",
    summary: "I built responsive, accessible websites and web applications, pairing frontend development with custom SVG graphics and animation. Freelance projects gave me room to connect practical delivery with a distinct visual point of view.",
    mobileSummary: "I built responsive, accessible web experiences and created custom SVG graphics and animations for independent projects.",
    highlights: ["I developed responsive, accessible interfaces and custom functionality for independent web projects.", "I created SVG graphics and web animation to bring more character and movement to the interface."],
    technologies: ["SVG"], current: false, category: "consulting",
  },
  {
    id: "boutsika-associates", role: "Lawyer", company: "Boutsika & Associates",
    startDate: "2011", endDate: "2020-12", dateLabel: "2011 — Dec 2020",
    summary: "I practised across criminal, property, immigration, and human rights law, including pro bono refugee cases. That work sharpened my research, evidence-led analysis, and client communication—strengths I now bring to complex technical problems.",
    mobileSummary: "I practised criminal, property, immigration, and human rights law, including pro bono refugee cases, building strengths in research, analysis, and client communication.",
    highlights: ["I managed legal matters involving client communication, negotiation, research, and case analysis.", "I worked on immigration and human rights matters, including pro bono refugee cases."],
    technologies: [], current: false, category: "legal",
  },
];

export const communityExperience: ExperienceEntry[] = [
  {
    id: "rainbow-school", role: "Web Manager", company: "Rainbow School NGO",
    startDate: "2021-11", endDate: "2025-01", dateLabel: "Nov 2021 — Jan 2025", employmentType: "Volunteer",
    summary: "I managed the volunteer website, looking after its content, functionality, visual presentation, and performance monitoring.",
    highlights: [], technologies: [], current: false,
  },
  {
    id: "enargeia-ngo", role: "Legal Counsellor and Founding Member", company: "Enargeia NGO",
    startDate: "2013-11", endDate: "2014-06", dateLabel: "Nov 2013 — Jun 2014",
    summary: "As a founding member, I contributed legal counselling and support to the organisation.",
    highlights: [], technologies: [], current: false,
  },
  {
    id: "peri-psychis", role: "Seminar Tutor", company: "Peri Psychis",
    startDate: "2013-02", endDate: "2014-06", dateLabel: "Feb 2013 — Jun 2014",
    summary: "I taught seminars in criminal law, criminology, and forensic psychology.",
    highlights: [], technologies: [], current: false,
  },
];
