import type { Project } from "../types/content";
export const projects: Project[] = [
  {
    "id": "nerve-ending",
    "title": "NERVE ENDING",
    "displayTitle": "An Investigative Tech-Horror Experience",
    "category": "creative",
    "categoryLabel": "Games & Interactive Experiences",
    "status": "In Development",
    "genre": "Psychological tech-horror \u00b7 Investigative mystery \u00b7 Interactive fiction",
    "shortDescription": "A browser-based psychological horror investigation into the fictional Meridian Systems corporation. Question MOTHER, examine records and follow contradictions through a retro computer terminal.",
    "role": "Frontend and game-system development",
    "technologies": [
      "Angular 21",
      "TypeScript",
      "Vitest",
      "Browser persistence"
    ],
    "repositoryUrl": null,
    "liveUrl": null,
    "liveLabel": "Play prototype",
    "featured": true,
    "preview": {
      "src": "/projects/nerve-ending/welcome-1440.jpg",
      "width": 1440,
      "height": 796,
      "srcSet": "/projects/nerve-ending/welcome-800.jpg 800w, /projects/nerve-ending/welcome-1440.jpg 1440w",
      "alt": "NERVE ENDING prototype neutral opening screen with Meridian Systems remote access information; no investigation or story revelations shown",
      "source": "Authentic local prototype opening screen; captured from the existing build on 25 November 2026",
      "kind": "browser"
    },
    "developmentDetails": {
      "concept": "Players investigate the fictional Meridian Systems corporation through a retro terminal, converse with the artificial intelligence MOTHER using natural-language questions, examine records and identify contradictions. The intended experience combines investigative gameplay, interactive storytelling, psychological horror and morally consequential decisions.",
      "implemented": [
        "Angular 21 and TypeScript application with a deterministic game-state and narrative transition layer.",
        "Record exploration, evidence observations and state-dependent investigative progression.",
        "Bounded natural-language intent recognition and authored, state-aware MOTHER responses, with optional on-device semantic recognition.",
        "Prototype branching outcome paths and explicitly confirmed consequential operations.",
        "Browser save/resume with versioned persistence and recovery handling.",
        "Automated tests for game rules, narrative/language routing and save handling."
      ],
      "planned": [
        "Continued development and refinement of the wider narrative and later-stage investigation design.",
        "Further human playtesting of language coverage, pacing and consequential choices before presenting the experience as finished."
      ],
      "architecture": "The Angular interface delegates game rules to a deterministic TypeScript engine. Natural-language interpretation resolves player intent into authored responses and state-aware actions. Browser persistence stores progress locally; automated tests exercise gameplay and narrative rules.",
      "artisticDirection": "A restrained corporate access screen leads into a retro terminal aesthetic: phosphor-toned displays, archival records, deliberate text presentation and an atmosphere of investigative unease. The preview shows only the neutral opening screen."
    },
    "cardDescription": "Investigate Meridian Systems, question MOTHER and uncover contradictions in a browser-based psychological horror game.",
    "cover": {
      "src": "/projects/nerve-ending/concept-equipment-room-1440.jpg",
      "srcSet": "/projects/nerve-ending/concept-equipment-room-800.jpg 800w, /projects/nerve-ending/concept-equipment-room-1440.jpg 1440w",
      "width": 1440,
      "height": 901,
      "alt": "Green-phosphor equipment-room visual development concept for NERVE ENDING; fictional and not a prototype screenshot",
      "label": "In-development concept art"
    },
    "additionalPreviews": [
      {
        "src": "/projects/nerve-ending/concept-equipment-room-1440.jpg",
        "srcSet": "/projects/nerve-ending/concept-equipment-room-800.jpg 800w, /projects/nerve-ending/concept-equipment-room-1440.jpg 1440w",
        "width": 1440,
        "height": 901,
        "alt": "Fictional equipment-room concept in a green CRT archive interface",
        "source": "AI-generated visual development concept; non-canon equipment room, not a game screenshot.",
        "kind": "mockup"
      },
      {
        "src": "/projects/nerve-ending/concept-personnel-1440.jpg",
        "srcSet": "/projects/nerve-ending/concept-personnel-800.jpg 800w, /projects/nerve-ending/concept-personnel-1440.jpg 1440w",
        "width": 1440,
        "height": 901,
        "alt": "Fictional demo personnel portrait and generic terminal panel, with no canonical identity or story information",
        "source": "AI-generated visual development concept; fictional demo personnel, not a canonical character or game screenshot.",
        "kind": "mockup"
      }
    ]
  },
  {
    "id": "project-companion",
    "title": "Project Companion",
    "displayTitle": "Project Companion",
    "category": "professional",
    "categoryLabel": "Software Engineering & Productivity Tools",
    "status": "Live Application",
    "shortDescription": "An offline-first planning application that turns personal projects into manageable steps, recommends the next action and keeps project progress on the user's device.",
    "role": "Product engineering and frontend development",
    "technologies": [
      "Angular 20",
      "TypeScript",
      "Ionic 8",
      "Angular Signals",
      "LocalStorage",
      "Capacitor"
    ],
    "repositoryUrl": "https://github.com/3vilBonobo/project-companion",
    "liveUrl": "https://project-companion.netlify.app/today",
    "liveLabel": "Live Demo",
    "featured": false,
    "preview": {
      "src": "/projects/project-companion.jpg",
      "srcSet": "/projects/project-companion.jpg 1440w",
      "width": 1440,
      "height": 1000,
      "alt": "Live Project Companion Today screen recommending a small task from the seeded Build Memory Game demonstration project",
      "source": "Actual deployed Project Companion / Today; seeded demonstration data, not personal project information",
      "kind": "browser"
    },
    "cardDescription": "A calm planning app that breaks personal projects into small steps and keeps progress on the user\u2019s device."
  },
  {
    "id": "enterprise-traceability",
    "title": "Enterprise Traceability Platform",
    "displayTitle": "Engineering Complex Enterprise Software",
    "categoryLabel": "Professional Engineering \u00b7 Production B2B Software",
    "shortDescription": "Contributing to the development and modernization of a production enterprise platform built around complex operational workflows, data-intensive forms, tables, and interconnected business processes.",
    "role": "Frontend Engineering \u00b7 UX/UI Modernization \u00b7 Backend Contributions",
    "technologies": [
      "Angular",
      "TypeScript",
      "Reactive state management",
      "REST APIs",
      "Java",
      "Spring Boot",
      "SQL"
    ],
    "repositoryUrl": null,
    "liveUrl": null,
    "featured": false,
    "category": "professional",
    "preview": {
      "src": "/projects/enterprise-traceability/complex-form.svg",
      "width": 1200,
      "height": 760,
      "alt": "Fictional complex-form illustration with dependent fields, validation feedback and draft recovery notes",
      "source": "Illustrative interface concept \u2014 complex form; invented data",
      "kind": "mockup"
    },
    "additionalPreviews": [
      {
        "src": "/projects/enterprise-traceability/data-management.svg",
        "width": 1200,
        "height": 760,
        "alt": "Fictional data-management illustration with a searchable record list, selection and data-quality feedback",
        "source": "Illustrative interface concept \u2014 data management; invented data",
        "kind": "mockup"
      },
      {
        "src": "/projects/enterprise-traceability/workflow.svg",
        "width": 1200,
        "height": 760,
        "alt": "Fictional workflow diagram showing draft editing, validation, submission and a recovery path",
        "source": "Illustrative engineering concept \u2014 workflow and recovery; no production architecture",
        "kind": "mockup"
      }
    ],
    "caseStudy": {
      "introduction": [
        "I contribute to the development and ongoing evolution of a production enterprise platform supporting traceability, operational data management, and complex business workflows.",
        "My responsibilities extend beyond implementing frontend components. I've taken ownership of significant areas of the application, including UX/UI modernization, sophisticated data-entry workflows, application state, API integrations, and production troubleshooting.",
        "This is a collaborative production platform. The work described here reflects my engineering contributions and ownership of significant application areas, rather than sole ownership of the entire software system."
      ],
      "contributions": [
        {
          "title": "Complex interfaces",
          "text": "Designing and implementing multi-section forms, advanced validation, dynamic workflows, searchable data tables, and data-heavy interfaces."
        },
        {
          "title": "Frontend architecture",
          "text": "Developing reusable Angular components, managing reactive state, integrating REST APIs, and improving application maintainability."
        },
        {
          "title": "Data reliability",
          "text": "Working on persistent form drafts, browser persistence, data synchronization, error handling, and reliable recovery from interrupted operations."
        },
        {
          "title": "Backend development",
          "text": "Increasingly contributing to Java, Spring Boot, SQL, and API-level implementations, connecting frontend features with backend data and business logic."
        },
        {
          "title": "Product engineering",
          "text": "Translating operational requirements into practical software solutions, coordinating with stakeholders, and investigating production issues across application layers."
        }
      ],
      "confidentiality": "The images shown are fictional interface mockups, not production screenshots. The actual application and its internal implementation are proprietary, so this case study presents my engineering contributions without exposing confidential systems or operational data.",
      "experienceUrl": "https://www.linkedin.com/in/irinella-boutsika/"
    },
    "cardDescription": "Production B2B software with complex operational workflows, data-intensive interfaces and interconnected business processes."
  },
  {
    "id": "podcast-app",
    "title": "Dumb & Dahmer — Podcast App",
    "displayTitle": "Dumb & Dahmer — Podcast App",
    "category": "professional",
    "categoryLabel": "Professional Web Development · Audio & Media",
    "status": "Live Application",
    "shortDescription": "A Greek-first podcast application for discovering and listening to Dumb & Dahmer episodes, with searchable archives, a listening queue, favourites and locally saved progress.",
    "cardDescription": "A podcast listening app with searchable episodes, a personal queue, favourites and saved listening progress.",
    "role": "Frontend development and UX/UI implementation",
    "technologies": ["Angular 21", "TypeScript", "Transloco", "HTML Audio", "Browser persistence"],
    "repositoryUrl": "https://github.com/3vilBonobo/podcast-app",
    "liveUrl": "https://3vilbonobo.github.io/podcast-app/",
    "liveLabel": "Live Demo",
    "featured": false,
    "preview": {
      "src": "/projects/podcast-app.jpg",
      "srcSet": "/projects/podcast-app.jpg 1280w",
      "width": 1280,
      "height": 720,
      "alt": "Actual Dumb & Dahmer podcast application homepage with Greek navigation and the latest episode",
      "source": "Actual deployed podcast application homepage, captured 25 November 2026",
      "kind": "browser"
    }
  },
  {
    "id": "athens-therapy",
    "title": "Athens Therapy",
    "displayTitle": "Psychotherapy Practice Website",
    "category": "professional",
    "categoryLabel": "Professional Web Development",
    "industry": "Mental Health & Psychotherapy",
    "shortDescription": "A professional website developed for a psychotherapy practice in Athens, presenting its therapeutic services, professional identity and physical space through an accessible and responsive digital experience.",
    "role": "Frontend development, responsive web design and UX/UI implementation",
    "skills": [
      "Frontend development",
      "Responsive web design",
      "UX/UI implementation",
      "Information architecture",
      "Professional website delivery"
    ],
    "technologies": [
      "HTML",
      "CSS",
      "JavaScript"
    ],
    "repositoryUrl": "https://github.com/3vilBonobo/athens-therapy.gr",
    "liveUrl": "https://www.athens-therapy.gr/",
    "liveLabel": "Visit website",
    "featured": false,
    "preview": {
      "src": "/projects/athens-therapy.jpg",
      "width": 1425,
      "height": 891,
      "srcSet": "/projects/athens-therapy-800.jpg 800w, /projects/athens-therapy.jpg 1425w",
      "alt": "Athens Therapy live homepage showing the practice identity, therapy room and professional introduction",
      "source": "Actual Athens Therapy website, homepage; captured 25 November 2026",
      "kind": "browser"
    },
    "cardDescription": "A responsive psychotherapy-practice website presenting services, professional identity and the space in Athens."
  },
  {
    "id": "orthobyron",
    "title": "Orthobyron",
    "displayTitle": "Orthodontic Practice Website",
    "shortDescription": "A responsive Greek-language website for an orthodontic practice, presenting clinics, treatments, patient information and contact options.",
    "role": "Frontend development and interface implementation",
    "technologies": [
      "React",
      "Styled Components",
      "JavaScript"
    ],
    "repositoryUrl": "https://github.com/3vilBonobo/orthobyron.gr",
    "liveUrl": "https://3vilbonobo.github.io/orthobyron.gr/",
    "featured": false,
    "category": "professional",
    "cover": {
      "src": "/projects/covers/orthobyron-cover.png",
      "width": 2511,
      "height": 1256,
      "alt": "Orthobyron website cover showing the orthodontic practice interior and Greek heading",
      "objectPosition": "center center"
    },
    "preview": {
      "src": "/projects/orthobyron.webp",
      "width": 1440,
      "height": 760,
      "alt": "Orthobyron treatment options displayed in a responsive website layout",
      "source": "Public Orthobyron website, treatments section",
      "kind": "browser"
    },
    "cardDescription": "A Greek-language orthodontic-practice website with treatments, patient information, clinics and contact details."
  },
  {
    "id": "athens-cyberpunk",
    "title": "Athens Cyberpunk — Interactive Portfolio",
    "displayTitle": "Building an Interactive Athens",
    "category": "creative",
    "categoryLabel": "Creative Frontend & Interactive Experiences",
    "shortDescription": "A five-floor interactive portfolio set in a cyberpunk Athens building. Built with Vue 3, TypeScript and Vite, it combines layered scene artwork with responsive HTML interfaces, GSAP animation and focused Three.js experiences.",
    "cardDescription": "An interactive five-floor Athens portfolio combining atmospheric scenes, responsive interfaces and playful discoveries.",
    "role": "Creative direction, frontend architecture and interaction development",
    "technologies": ["Vue 3", "TypeScript", "Vite", "GSAP", "Three.js", "CSS"],
    "interactionNotes": "Each floor is composed as a Vue section, with reusable interaction components and shared composables and services. Layered artwork, lighting and hotspots share scene coordinates, while HTML content adapts to different screen sizes. GSAP ScrollTrigger drives selected parallax transitions; Three.js powers the interactive aquarium. Athens time and weather inform the environment, and smaller discoveries include a telescope and a daily chess puzzle. Keyboard navigation, dialog focus restoration, reduced-motion preferences and animation cleanup are built into the interactions.",
    "repositoryUrl": "https://github.com/3vilBonobo/creative-portfolio",
    "liveUrl": "https://irinella-dev.netlify.app/",
    "liveLabel": "Explore Portfolio",
    "featured": false,
    "preview": {
      "src": "/projects/athens-cyberpunk.jpg",
      "srcSet": "/projects/athens-cyberpunk.jpg 1280w",
      "width": 1280,
      "height": 720,
      "alt": "Actual Athens Cyberpunk portfolio rooftop office overlooking Athens at night, with interactive scene objects and floor navigation",
      "source": "Actual deployed portfolio, captured 25 November 2026; implementation described from this repository",
      "kind": "browser"
    }
  },
  {
    "id": "iss-tracker",
    "title": "Where Is the ISS Now?",
    "displayTitle": "Live ISS Tracker",
    "shortDescription": "A live International Space Station tracker displaying its current position and flight information on an interactive map.",
    "role": "Frontend development, API integration and animated interface",
    "technologies": [
      "JavaScript",
      "HTML",
      "CSS",
      "REST API",
      "Leaflet",
      "OpenStreetMap",
      "Mapbox",
      "GSAP",
      "Particles.js"
    ],
    "repositoryUrl": "https://github.com/3vilBonobo/where-is-the-ISS-now",
    "liveUrl": "https://3vilbonobo.github.io/where-is-the-ISS-now/",
    "featured": false,
    "category": "creative",
    "preview": {
      "src": "/projects/iss-tracker.webp",
      "width": 1440,
      "height": 900,
      "alt": "Live ISS Tracker showing the station position on a world map and current flight data",
      "source": "Public Live ISS Tracker website",
      "kind": "browser"
    },
    "cardDescription": "An interactive world map tracking the International Space Station with live position and flight information."
  },
  {
    "id": "madlen-v",
    "credit": "Poetry: Vasileia Oikonomou \u00b7 Frontend development: Irinella Boutsika",
    "interactionNotes": "Words and phrase groups change over time with fades. Hovering over the poem pauses the changes; touch start and end also pause and resume them.",
    "title": "Madlen V \u2014 Interactive Poetry",
    "displayTitle": "Interactive Digital Poetry",
    "category": "creative",
    "categoryLabel": "Creative Technology & Digital Art",
    "shortDescription": "An interactive digital poetry experience that explores the intersection of literature, technology and artistic expression, using the browser as a medium for experiencing poetry beyond traditional written formats.",
    "role": "Creative frontend development and interaction implementation",
    "skills": [
      "Creative frontend development",
      "Interactive digital storytelling",
      "Digital literature",
      "Artistic web experiences",
      "Interaction design"
    ],
    "technologies": [
      "HTML",
      "CSS",
      "JavaScript",
      "CSS transitions"
    ],
    "attribution": "Poetry and artistic authorship: Vasileia Oikonomou. Frontend development: Irinella Boutsika, as credited on the live experience.",
    "repositoryUrl": "https://github.com/3vilBonobo/poem",
    "liveUrl": "https://www.vasileia-oikonomou.com/madlen-v.html",
    "liveLabel": "Explore live poem",
    "featured": false,
    "preview": {
      "src": "/projects/madlen-v.jpg",
      "width": 1440,
      "height": 900,
      "srcSet": "/projects/madlen-v-800.jpg 800w, /projects/madlen-v.jpg 1440w",
      "alt": "Madlen V live digital poem on a textured paper background with author and developer credits",
      "source": "Actual Madlen V live experience, one timed reading state; captured 25 November 2026",
      "kind": "landscape"
    },
    "additionalPreviews": [
      {
        "src": "/projects/madlen-v-alternate.jpg",
        "width": 1440,
        "height": 900,
        "alt": "A second genuine Madlen V reading state showing changed words and phrases in the same poem",
        "source": "Actual Madlen V live experience, a different timed reading state; captured 25 November 2026",
        "kind": "landscape"
      }
    ],
    "cardDescription": "Interactive digital poetry with changing words and phrases, bringing literature and creative frontend development together."
  },
  {
    "id": "magic-herbs",
    "title": "Magic Herbs",
    "displayTitle": "Magic Herbs SVG Animation",
    "shortDescription": "An interactive illustrated scene created with custom SVG artwork and GSAP animation.",
    "role": "SVG illustration, interaction design and frontend animation",
    "technologies": [
      "SVG",
      "GSAP",
      "JavaScript",
      "HTML",
      "CSS"
    ],
    "repositoryUrl": "https://github.com/3vilBonobo/magic-herbs-SVG-animation",
    "liveUrl": "https://codepen.io/Irinella_B/pen/jOwyvRp",
    "featured": false,
    "category": "creative",
    "preview": {
      "src": "/projects/magic-herbs.webp",
      "width": 1440,
      "height": 900,
      "alt": "Illustrated Magic Herbs landscape animation with plants and character artwork",
      "source": "Public CodePen full-result view",
      "kind": "landscape"
    },
    "cardDescription": "An interactive illustrated landscape combining custom SVG artwork, animation and playful browser interactions."
  },
  {
    "id": "fashion-show",
    "title": "Fashion Show",
    "displayTitle": "Fashion Show SVG Animation",
    "shortDescription": "An interactive fashion-show animation built with custom SVG parts created in Affinity Designer and animated with GSAP.",
    "role": "SVG asset creation, visual design and frontend animation",
    "technologies": [
      "SVG",
      "GSAP",
      "JavaScript",
      "HTML",
      "CSS",
      "Affinity Designer"
    ],
    "repositoryUrl": "https://github.com/3vilBonobo/fashion_show_animation",
    "liveUrl": "https://codepen.io/Irinella_B/pen/bGRoobN",
    "featured": false,
    "category": "creative",
    "preview": {
      "src": "/projects/fashion-show.webp",
      "width": 1440,
      "height": 900,
      "alt": "Stylized illustrated runway from the Fashion Show SVG animation",
      "source": "Public CodePen full-result view",
      "kind": "portrait"
    },
    "cardDescription": "An illustrated runway experience built from custom SVG artwork and choreographed browser animation."
  },
  {
    "id": "tip-calculator",
    "title": "Tip Calculator",
    "displayTitle": "Tip Calculator App",
    "shortDescription": "A responsive tip calculator that calculates tip and total amounts per person from bill, percentage and group-size inputs.",
    "role": "Frontend implementation and interaction logic",
    "technologies": [
      "Vanilla JavaScript",
      "SCSS",
      "HTML",
      "Responsive design"
    ],
    "repositoryUrl": "https://github.com/3vilBonobo/tipp_calculator_app",
    "liveUrl": "https://3vilbonobo.github.io/tipp_calculator_app/",
    "attribution": "Interface challenge supplied by Frontend Mentor.",
    "featured": false,
    "category": "creative",
    "preview": {
      "src": "/projects/tip-calculator.webp",
      "width": 1440,
      "height": 900,
      "alt": "Tip Calculator interface populated with example bill, percentage and group size values",
      "source": "Public Tip Calculator website",
      "kind": "app"
    },
    "cardDescription": "A responsive bill-splitting calculator with tip percentages, group-size inputs and clear per-person totals."
  }
];
