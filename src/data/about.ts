import type { AboutContent } from "../types/content";
import { FLOOR } from "../config/floors";

// Owner-approved personal introduction and profile brief, November 2026.
export const aboutProfile = {
  name: "Irinella Boutsika",
  facts: [
    { label: "Professional experience", value: "~5 years" },
    { label: "Core expertise", value: "Frontend Engineering" },
    { label: "Based in", value: "Athens, Greece" },
  ],
};

type PersonalAboutContent = Pick<AboutContent, "eyebrow" | "title" | "introduction" | "principles" | "toolkitGroups" | "cvUrl"> & {
  introductionParagraphs: string[];
  sections: { title: string; paragraphs: string[] }[];
  journey: { title: string; description: string }[];
  backendNote: string;
  panels: Record<"background" | "toolkit" | "approach", { label: string; title: string; closing: string }>;
};

// Backend practice and creative exploration are qualified, not proficiency claims.
export const aboutContent: PersonalAboutContent = {
  eyebrow: `Level ${FLOOR.about.number} · ${FLOOR.about.label}`,
  title: "About",
  introduction:
    "Software engineer by choice. Problem solver by nature.",
  introductionParagraphs: [
    "I build digital experiences where logic meets creativity. My path from law to software engineering was less of a career detour and more of a natural evolution: understanding complex systems, asking difficult questions and figuring out how things work — or why they don’t.",
    "Today, I turn that curiosity into software.",
  ],
  sections: [
    {
      title: "Engineering mindset",
      paragraphs: [
        "I enjoy making complicated things feel simple — particularly when they involve intricate workflows, large amounts of data, demanding interfaces and the occasional bug with an unnecessarily elaborate backstory.",
        "My work combines frontend architecture, user experience, application logic and an expanding understanding of backend systems.",
      ],
    },
    {
      title: "Beyond the code",
      paragraphs: [
        "I’m drawn to the intersection of technology, art and human experience. Interactive storytelling, game development, creative coding and immersive environments are some of the territories I enjoy exploring.",
        "Not everything needs to solve a business problem. Sometimes, making something wonderfully strange is reason enough.",
      ],
    },
  ],
  journey: [
    { title: "Law & Criminology", description: "Analytical reasoning, investigation, human behaviour and navigating complex systems." },
    { title: "Software Engineering", description: "Building production applications, designing interfaces and turning complicated requirements into dependable software." },
    { title: "Creative Technology", description: "Exploring interactive experiences, emerging technologies and the possibilities beyond conventional web development." },
  ],
  principles: [
    {
      title: "Investigate first",
      description: "Understand the problem before committing to a solution. Symptoms are rarely the whole story.",
    },
    {
      title: "Build with intent",
      description: "Prioritise maintainability, usability and practical engineering decisions over unnecessary complexity.",
    },
    {
      title: "Work with intelligence",
      description: "Use AI and agentic development tools to accelerate engineering while retaining responsibility for architecture, decisions, verification and quality.",
    },
    {
      title: "Stay curious",
      description: "Keep learning across disciplines. The most interesting ideas often emerge outside the boundaries of a single specialisation.",
    },
  ],
  toolkitGroups: [
    { label: "Frontend Engineering", items: ["Angular · TypeScript", "JavaScript · Vue · React"] },
    { label: "Application Architecture", items: ["Reactive programming · State management", "Component architecture · Offline workflows"] },
    { label: "Beyond the Frontend", items: ["REST APIs · Java · Spring Boot", "SQL · Database-backed workflows"] },
    { label: "Engineering & Exploration", items: ["Automated testing · Agentic development", "Creative coding · Interactive experiences"] },
  ],
  backendNote: "Backend engineering is an expanding area of my professional practice.",
  panels: {
    background: {
      label: "01 / The journey",
      title: "Different disciplines. Familiar questions.",
      closing: "Different tools, same obsession with understanding how things work.",
    },
    toolkit: {
      label: "02 / Technical inventory",
      title: "The tools behind the thinking.",
      closing: "Frameworks change. Knowing how to think is the more portable skill.",
    },
    approach: {
      label: "03 / Working principles",
      title: "How I think, build and collaborate.",
      closing: "Good software should make life easier, not give complexity a prettier interface.",
    },
  },
};
