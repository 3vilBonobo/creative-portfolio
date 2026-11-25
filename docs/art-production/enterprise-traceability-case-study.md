# Enterprise Traceability Platform — case-study refinement

Implemented locally under the owner's focused content request. This supersedes the earlier Agritrack/HarborTrace mockup presentation for Floor 02 only. Unrelated employer information remains intact.

## Public identity and content

The professional project is now **Enterprise Traceability Platform**, with category **Professional Engineering · Production B2B Software** and role **Frontend Engineering · UX/UI Modernization · Backend Contributions**. The card uses the exact supplied summary. Its dialog headline is **Engineering Complex Enterprise Software**.

The full supplied contribution narrative covers complex forms/validation/tables, reusable Angular components, reactive state, REST APIs, persistent drafts and browser recovery, Java/Spring Boot/SQL contributions, stakeholder coordination and cross-layer troubleshooting. It explicitly identifies a collaborative production platform and ownership of significant application areas rather than sole ownership of the system. Technology tags use only the owner's supplied technologies; no library, metrics or architecture claims were invented.

The configured LinkedIn URL was copied from `src/sections/ContactSection.vue`: `https://www.linkedin.com/in/irinella-boutsika/`. Both card and dialog expose **View my professional experience on LinkedIn**, with an accessible new-tab label and `target="_blank" rel="noopener noreferrer"`. No fabricated demo or repository link was added.

The exact owner-supplied confidentiality disclosure appears in the dialog. Neither the employer name nor the former fictional branding appears in this project's visible copy, identifiers, captions or image descriptions. Employer references elsewhere are preserved.

## Illustrations

The owner's final instruction to replace the two six-screen collages takes precedence over the earlier request to preserve them for now. Three original, brand-free SVG illustrations use invented records and intentionally generic compositions, each labelled as fictional and illustrative:

| File under `public/projects/enterprise-traceability/` | Subject | Bytes |
|---|---|---:|
| `complex-form.svg` | Dependent inputs, validation feedback and draft recovery | 4,285 |
| `data-management.svg` | Searchable records, selection and data-quality feedback | 4,579 |
| `workflow.svg` | Draft/validation/submission flow with an interrupted-operation recovery path | 4,036 |

All have 1200×760 intrinsic dimensions. They are conceptual problem-space illustrations, not descriptions of production schemas, endpoints or architecture. The first supplies the card image; all three appear in Details with truthful captions and alt descriptions. Static SVG drawing code requires no external images, fonts, scripts or dependencies. The old PNG files are retained unchanged as prior source assets, but this project no longer references or displays them.

## Scope and preservation

Changed source files: `src/data/projects.ts`, `src/types/content.ts`, `src/components/ProjectCard.vue`, `src/sections/ProjectsSection.vue`. Optional case-study fields supply the narrative/category label. A case-study-only dialog class limits the headline, permits long-word wrapping and removes an outer overflow scrollbar while retaining the existing scrollable panel and focus handlers.

A pre-edit src/public SHA-256 audit found changes only in those four existing source files; the three SVGs are new. Semantic comparison confirms all five other project records are unchanged, including Orthobyron's supplied cover and existing dialog screenshot. No floor grouping, bounded desktop scroll logic, navigation, lamp, environmental asset or unrelated floor source was changed.

## Verification

- PASS: Node 22 `node node_modules/vue-tsc/bin/vue-tsc.js --noEmit`.
- PASS: `npm test`, all 18 existing tests.
- PASS: `npm run build`; pre-existing large-JS-chunk warning remains.
- PASS: scoped `git diff --check`.
- PASS: actual application desktop 1440×1000 and simulated mobile 390×844. Card/dialog show new identity, supplied copy, seven technology labels and three loaded illustrations. No sampled mobile card/dialog horizontal overflow or text clipping.
- PASS: exact disclosure, five contribution areas, configured LinkedIn URL/rel/target, absence of old names within the case-study dialog, employer retained in Experience.
- PASS: keyboard Enter opens Details; Escape closes and restores `work-title-enterprise-traceability` trigger. Other-project check: Orthobyron still renders its original `/projects/orthobyron.webp` screenshot and no case-study sections.
- PASS: disposable 200% text proof at 1440×1000 and 390×1000. Computed text sizes are doubled after opening the real case-study dialog; panel scrollWidth equals clientWidth and sampled headings/list items/link labels do not clip. Native text preferences/physical devices remain unverified.
- No sampled error/warn console entries in the normal application tab. Native OS reduced-motion preference was not changed; no animated SVGs or new motion were introduced.

Screenshot and measurement evidence under `tmp/enterprise-case-study/`: `card-desktop.jpg`, `card-mobile.jpg`, `dialog-desktop.jpg`, `dialog-desktop-bottom.jpg`, `dialog-mobile.jpg`, `dialog-mobile-bottom.jpg`, `dialog-mobile-200.jpg`, `browser-checks.json`, `text-200-checks.json`, `before-hashes.json`. Captures show actual rendered Vue HTML. The generator and text-proof entry in that folder are disposable verification artifacts and are not production imports.

No dependencies installed, assets regenerated outside the requested illustrations, commit, push or deployment.
