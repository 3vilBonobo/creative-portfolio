import type { AboutContent } from "../types/content";

// TEMPORARY COPY: replace with Irene's approved biography, focus, toolkit and CV URL.
// The themes below come only from the approved About-section brief.
export const aboutContent: AboutContent = {
  eyebrow: "Level 01 · About",
  title: "Clarity for complex systems.",
  introduction: "I’m a frontend developer focused on making complex workflows feel understandable, dependable and human.",
  backgroundParagraphs: [
    "My path into software began in law and criminology, disciplines that taught me to examine evidence, question assumptions and find structure in complicated situations.",
    "That perspective now shapes how I build interfaces: with empathy for the people using them, attention to edge cases and a respect for the real-world systems behind every screen.",
  ],
  currentFocus: "Deepening my frontend practice while growing toward broader engineering knowledge—especially the architecture, integrations and quality decisions that make interfaces resilient.",
  principles: [
    { title: "Make complexity understandable", description: "Turn dense requirements and system behaviour into clear, navigable experiences." },
    { title: "Design for real workflows", description: "Consider context, constraints and edge cases—not only the ideal path." },
    { title: "Keep learning across boundaries", description: "Connect product thinking, user needs and engineering detail to make stronger decisions." },
  ],
  toolkitGroups: [
    { label: "Frontend", items: ["Vue", "TypeScript", "JavaScript", "HTML", "CSS"] },
    { label: "Practice", items: ["Component architecture", "Responsive design", "Accessibility", "API integration"] },
  ],
};
