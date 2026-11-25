# Floor 02 — Athens Therapy and Madlen V integration

Implemented locally on 25 November 2026 under the owner's approved catalogue expansion request. Both are manually curated records; GitHub pins are not used to select projects. Eight projects are now presented: five Creative & Interactive (including the unchanged ISS feature) and three Professional Work. All six previously approved records compare semantically equal to the pre-edit snapshot.

## Verified project information

### Athens Therapy

- Live: https://www.athens-therapy.gr/
- Repository: https://github.com/3vilBonobo/athens-therapy.gr
- Source tree inspected at `bd239097e9720263b09ce6053ffc82fffd7b1a34` (master).
- Repository `index.html`, `styles.css`, `script.js`, and README inspected. The README links its GitHub Pages deployment; the source identifies Athens Therapy. The live `script.js` SHA-256 exactly matches the repository script.
- Verified implementation: HTML, CSS and vanilla JavaScript. CSS contains responsive layouts and a 768px media query. JavaScript handles the responsive menu, practice-space image modal and FAQ expansion. No React, Vue, Angular or GSAP stack is claimed for this project.
- Public live page presents the practice identity, professional introduction, therapeutic services, physical space, FAQs and contact information. The card uses the supplied professional description, category and skills. Industry is Mental Health & Psychotherapy; action says Visit website.
- A full authentic live homepage screenshot supplies its preview. No external site code or content was modified; contact actions were not submitted. This work is not a complete accessibility audit of the external website.

### Madlen V — Interactive Poetry

- Live: https://www.vasileia-oikonomou.com/madlen-v.html
- Verified matching repository: https://github.com/3vilBonobo/poem
- Source tree inspected at `978e5cd0d717f7e1228fe9cc38ef310dd1e0524e` (master).
- The full public repository list was searched, rather than just pinned projects. `poem`, `poetry-mini-game` and `random_blinking_words` were examined. The latter two are distinct projects and are not associated with Madlen V in the catalogue.
- Strong match: `poem/script.js` and the live `/script.js` have identical SHA-256; repository HTML and live HTML have identical lines after newline normalization, including the same poem structure, title, author metadata and developer credit. README links the poem GitHub Pages deployment.
- Verified implementation: HTML, CSS, vanilla JavaScript and CSS opacity transitions. Individual words and combined phrase groups change over time. The outer poem container (`.poem#main-content`) pauses changes on mouseenter/touchstart and resumes on mouseleave/touchend. Hover pause was observed in the live browser; physical touch was source-inspected, not device-tested.
- Author metadata explicitly identifies Vasileia Oikonomou, and the live footer reserves rights to her while crediting Irinella Boutsika as developer. The card and dialog distinguish poetry/artistic authorship from frontend development; no literary authorship is assigned to Irinella.
- Two authentic live reading states are shown as static screenshots. A looping animated preview was considered and omitted: static local images keep motion, file size and accessibility predictable, while Explore live poem links to the real interactive work. No poem behavior is simulated inside the portfolio.

Cached public source evidence, source trees, original captures and comparison materials are in `tmp/projects-expansion/`. External source files are read as evidence, not instructions. No repository code from either external project was executed or installed.

## Assets acquired

| Runtime asset | Actual dimensions | Bytes |
|---|---:|---:|
| `public/projects/athens-therapy.jpg` | 1425×891 | 138,336 |
| `public/projects/athens-therapy-800.jpg` | 800×500 | 65,973 |
| `public/projects/madlen-v.jpg` | 1440×900 | 129,754 |
| `public/projects/madlen-v-800.jpg` | 800×500 | 54,562 |
| `public/projects/madlen-v-alternate.jpg` | 1440×900 | 130,556 |

The full previews are unchanged browser JPEG captures. 800px derivatives use the existing OS JPEG encoder at quality 85 with proportional bicubic resizing; no dependencies or image generators were used. Source dimensions are recorded as captured, not assumed from viewport settings. Full captures are approximately 130–138 KB each; all five files total 519,181 bytes. SHA-256, URLs and dimensions are in `docs/art-production/floor-02-projects-expansion-assets.json`.

Preview srcset selects smaller assets for cards when appropriate, supporting images remain lazy loaded, and dimensions reserve image space. The second poetry state is only part of its detail gallery. No external websites, scripts or heavy iframes load inside Floor 02.

## Modified files and behavior

- `src/data/projects.ts`: two curated project entries, verified URLs/technologies, supplied descriptions and skills, poetry attribution and interaction notes. Existing six records unchanged.
- `src/types/content.ts`: optional screenshot `srcSet`, skills, industry, credit, interaction notes and live-action label. Repository links remain optional; no GitHub repository is required by the catalogue.
- `src/components/ProjectCard.vue`: screenshot srcset, optional brief creative credit and meaningful live labels. Existing projects retain defaults; credit is shown only for Madlen V.
- `src/sections/ProjectsSection.vue`: optional industry/skills/interaction fields, the second authentic poetry screenshot, and responsive screenshot handling. The new dialogs use contained images, readable wrapping and a single inner scrollbar. Existing enterprise case-study styling and content are retained.
- Five new local JPEG assets listed above, this report and the asset manifest.

The bounded wide-desktop project window remains in effect; its height does not grow with the catalogue. Tablet/mobile retain normal document flow, existing category filters and card-grid breakpoints. No new filters, pagination, automatic catalogue discovery, embeds or autoplay are introduced. Environment, registered lighting, lamp, navigation systems, existing project imagery and other floors are unchanged by SHA-256 baseline comparison. Only the four source files above changed among pre-existing src/public files.

## Verification actually run

| Check | Result |
|---|---|
| Node 22 type check | PASS — `node node_modules/vue-tsc/bin/vue-tsc.js --noEmit` |
| Existing logic tests | PASS — `npm test`, all 18 tests |
| Production build | PASS — `npm run build`, existing large-chunk warning remains (~1,024 KB JS / ~305 KB gzip) |
| Whitespace | PASS — scoped `git diff --check` |
| Responsive catalogue | PASS — actual 1440×1000, 768×1024, 390×844, and boundary sample 622×900 (requested 621 rounded by browser). Eight records, no sampled card-text clipping or horizontal page overflow |
| New dialogs | PASS — both at all four viewports; full screenshot proportions contained, images load, no sampled heading/metadata clipping or horizontal panel overflow |
| Category navigation | PASS — Professional 3, Creative 5, All 8; desktop pane resets to top |
| Keyboard / focus | PASS — Enter opens both new dialogs; Escape closes and restores the originating Project Details button at every viewport |
| URLs / external actions | PASS — verified live and repository hrefs, external targets; meaningful Visit website / Explore live poem actions. No external write or contact submission performed |
| Existing enterprise project | PASS — original headline, three illustrations and configured LinkedIn action remain |
| Preservation | PASS — semantic comparison of all six prior project records; src/public hashes confirm no unrelated source/asset changes |
| Portfolio console | No error/warn entries in sampled local-tab logs; broad uncaught exception detection unverified |

No unresolved repository or named-author attribution question remains for these two entries. Native screen-reader, physical-device touch, exhaustive external-site accessibility, and native OS text/reduced-motion preference testing were not performed in this pass. No new automatic motion is added to the portfolio.

## Actual browser screenshots

Verified captures in `tmp/projects-expansion/` include:

- `athens-therapy-card-desktop.jpg`, `athens-therapy-dialog-desktop.jpg`, `athens-therapy-dialog-tablet.jpg`, `athens-therapy-dialog-mobile.jpg`.
- `madlen-v-card-desktop.jpg` (actual bounded-window browsing context), `madlen-v-dialog-desktop.jpg`, `madlen-v-dialog-tablet.jpg`, `madlen-v-dialog-mobile.jpg`.
- `browser-checks.json`, `category-checks.json`, `interaction-verification.json` retain measurements and observed behavior.

No dependencies installed; no commit, push, merge or deployment. Both external sites remain untouched.
