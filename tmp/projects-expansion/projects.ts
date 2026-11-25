import type { Project } from "../types/content";
export const projects: Project[] = [
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
    }
  },
  { id:"orthobyron", title:"Orthobyron", displayTitle:"Orthodontic Practice Website", shortDescription:"A responsive Greek-language website for an orthodontic practice, presenting clinics, treatments, patient information and contact options.", role:"Frontend development and interface implementation", technologies:["React","Styled Components","JavaScript"], repositoryUrl:"https://github.com/3vilBonobo/orthobyron.gr", liveUrl:"https://3vilbonobo.github.io/orthobyron.gr/", featured:true, category:"professional", cover:{src:"/projects/covers/orthobyron-cover.png",width:2511,height:1256,alt:"Orthobyron website cover showing the orthodontic practice interior and Greek heading",objectPosition:"center center"}, preview:{src:"/projects/orthobyron.webp",width:1440,height:760,alt:"Orthobyron treatment options displayed in a responsive website layout",source:"Public Orthobyron website, treatments section",kind:"browser"} },
  { id:"iss-tracker", title:"Where Is the ISS Now?", displayTitle:"Live ISS Tracker", shortDescription:"A live International Space Station tracker displaying its current position and flight information on an interactive map.", role:"Frontend development, API integration and animated interface", technologies:["JavaScript","HTML","CSS","REST API","Leaflet","OpenStreetMap","Mapbox","GSAP","Particles.js"], repositoryUrl:"https://github.com/3vilBonobo/where-is-the-ISS-now", liveUrl:"https://3vilbonobo.github.io/where-is-the-ISS-now/", featured:true, category:"creative", preview:{src:"/projects/iss-tracker.webp",width:1440,height:900,alt:"Live ISS Tracker showing the station position on a world map and current flight data",source:"Public Live ISS Tracker website",kind:"browser"} },
  { id:"magic-herbs", title:"Magic Herbs", displayTitle:"Magic Herbs SVG Animation", shortDescription:"An interactive illustrated scene created with custom SVG artwork and GSAP animation.", role:"SVG illustration, interaction design and frontend animation", technologies:["SVG","GSAP","JavaScript","HTML","CSS"], repositoryUrl:"https://github.com/3vilBonobo/magic-herbs-SVG-animation", liveUrl:"https://codepen.io/Irinella_B/pen/jOwyvRp", featured:false, category:"creative", preview:{src:"/projects/magic-herbs.webp",width:1440,height:900,alt:"Illustrated Magic Herbs landscape animation with plants and character artwork",source:"Public CodePen full-result view",kind:"landscape"} },
  { id:"fashion-show", title:"Fashion Show", displayTitle:"Fashion Show SVG Animation", shortDescription:"An interactive fashion-show animation built with custom SVG parts created in Affinity Designer and animated with GSAP.", role:"SVG asset creation, visual design and frontend animation", technologies:["SVG","GSAP","JavaScript","HTML","CSS","Affinity Designer"], repositoryUrl:"https://github.com/3vilBonobo/fashion_show_animation", liveUrl:"https://codepen.io/Irinella_B/pen/bGRoobN", featured:false, category:"creative", preview:{src:"/projects/fashion-show.webp",width:1440,height:900,alt:"Stylized illustrated runway from the Fashion Show SVG animation",source:"Public CodePen full-result view",kind:"portrait"} },
  { id:"tip-calculator", title:"Tip Calculator", displayTitle:"Tip Calculator App", shortDescription:"A responsive tip calculator that calculates tip and total amounts per person from bill, percentage and group-size inputs.", role:"Frontend implementation and interaction logic", technologies:["Vanilla JavaScript","SCSS","HTML","Responsive design"], repositoryUrl:"https://github.com/3vilBonobo/tipp_calculator_app", liveUrl:"https://3vilbonobo.github.io/tipp_calculator_app/", attribution:"Interface challenge supplied by Frontend Mentor.", featured:false, category:"creative", preview:{src:"/projects/tip-calculator.webp",width:1440,height:900,alt:"Tip Calculator interface populated with example bill, percentage and group size values",source:"Public Tip Calculator website",kind:"app"} },
];
