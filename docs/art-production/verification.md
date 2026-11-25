# Structural correction and reference verification

25 November 2026. Repository baseline was master at 42f66dc. This report covers the approved structural batch and saved pre-production references, not integration of new artwork.

## Implemented behavior

- Canonical building sequence is Hero 04, About 03, Projects 02, Experience 01 and Contact 00.
- `src/config/floors.ts` owns the metadata and derives four adjacent transition identities. Semantic anchors remain office/about/projects/experience/street.
- The floor observer uses section positions at a viewport reference line rather than visible percentages. Tall sections, sticky scenes, reverse scrolling and the final ground floor no longer depend on intersection ratios.
- Reference-line policy retains the preceding floor through an infrastructure gap until the next floor reaches the reference line. At the bottom of the document the final floor is active.
- Desktop informational content reserves a right navigation gutter. Exterior scene canvases keep their existing geometry and use compact floor controls. Narrower layouts dock floor controls at the bottom.
- Experience columns flex at narrow desktop sizes. Tablet portrait detail text is bounded inside its scene. No informational content or interaction was removed.
- Projects stretching was inspected and its proportional-plate/quiet-continuation replacement is specified in `responsive-compositions.md`. Its current background is retained for future artwork integration.

## Commands actually run

All project checks used Node 22.13.1 through its existing local installation. No dependency installation or global Node switch was performed.

| Check | Result | Evidence |
|---|---|---|
| `npm run build` | PASS | Final build transformed 124 modules, CSS 198.52 kB and JS 1006.04 kB before gzip |
| `node node_modules/vue-tsc/bin/vue-tsc.js --noEmit` | PASS | Exit 0 |
| `npm test` | PASS | 14 tests, zero failures; chess, mouse, weather and three new floor-navigation cases |
| `git diff --check` | PASS | No whitespace errors |
| Existing public artwork and protected interaction files | PASS | Aggregate SHA-256 matched the pre-edit digest |
| Git index preservation | PASS | No staged changes or Git mutations |

Build still warns about a JavaScript chunk above 500 kB. This bounded batch does not change loading architecture. Node 22 emits its expected experimental type-stripping notice during tests. The first sandboxed browser connection timed out; the authorized server retry outside the sandbox rendered successfully. Build outputs refreshed ignored `dist/` files as part of the requested verification.

## Browser checks actually exercised

| Check | Result and limits |
|---|---|
| Five floor anchors at six requested sizes | PASS. All 30 saved layout records show the expected active anchor and no horizontal document overflow |
| Desktop informational navigation clearance | PASS at 1920x1080, 1440x900 and 1180x820. Content/detail bounds clear the floor-control bounds |
| Narrow desktop boundary | PASS after a focused column correction near the 1100 px breakpoint. The browser reported 1102 CSS px for the requested 1101 test |
| Long mobile Projects scrolling | PASS through three Page Down steps and Page Up while inside the section |
| Direct Projects anchor and browser history | PASS. Initial hash, Back and Forward selected the expected floor |
| Sticky Experience scrolling | PASS. Page Down/Page Up retained Experience and changed the selected career record |
| Ground floor at document end | PASS. Contact active with data-floor-number 00 |
| About tab keyboard selection | PASS. ArrowRight selected Toolkit; restored Background afterward |
| Project modal | PASS. Open, Escape close, focus return to Info |
| Telescope | PASS for keyboard entry and Escape exit. Pan/pinch and clue completion not exhaustively retested |
| Puzzle book | PASS for keyboard entry and exit. No puzzle cells edited or solution completed |
| Daily chess | PASS for opening and live daily board loading. No chess solution played in browser |
| Aquarium | PASS for rendering one canvas, feeding seven pellets and adding a plant. Initial input dispatch timed out during heavy startup, then the dialog/canvas and controls were verified |
| Mouse office | PASS for night-only entry and Escape exit. Gait timing remains covered by the existing logic tests |
| Environment preview | PASS for day/night/rain/golden-hour captures. Existing live controls restored afterward |
| Console error/warning sample | No entries returned for the sampled session. This is not a complete uncaught-exception audit |

The requested sizes were desktop 1920x1080 and 1440x900, tablet landscape 1180x820, tablet portrait 820x1180, phone portrait 390x844 and phone landscape 844x390. These are browser viewport simulations. Actual JPEG pixel dimensions differ from the CSS viewport and are recorded in layout JSON/reference manifests. Do not stretch screenshots to their filename dimensions.

Raw browser evidence is in `art-production/references/verification.json`, the 30 floor layout records and transition `layouts.json`. Full-section screenshots exist at desktop and mobile. Hero/Contact include day, night, rain and golden-hour references at desktop, tablet portrait and phone portrait. The four transitions each have six adjacency captures.

## Unverified or pending

- Physical devices, system reduced-motion preference, screen-reader operation and exhaustive 200% text-zoom behavior.
- Explicit uncaught runtime exception instrumentation, long-running animation performance and GPU memory/resource disposal.
- Full puzzle/chess completion, telescope pinch/clue completion, cat audio and mouse-gait visual timing across every state.
- New artwork quality, profile transforms, extraction registration, portrait object moves, conditional night/golden-hour requirements and production performance. They remain proposals.
- Actual final artwork storage. Budgets are estimates, and conditional exports are not commissioned.

## Source/configuration files changed by this batch

1. `src/App.vue`
2. `src/config/floors.ts` (new)
3. `src/services/floorNavigation.ts` (new)
4. `src/composables/useActiveFloor.ts`
5. `src/components/FloorNavigator.vue`
6. `src/components/FloorTransition.vue`
7. `src/components/SiteNavigation.vue`
8. `src/components/AlleyFooter.vue`
9. `src/sections/OfficeHero.vue`
10. `src/sections/AboutSection.vue`
11. `src/sections/ProjectsSection.vue`
12. `src/sections/ExperienceSection.vue`
13. `src/sections/ContactSection.vue`
14. `src/data/about.ts`
15. `src/style.css`
16. `package.json` (extends the existing local test command)
17. `scripts/floor-navigation.test.mjs` (new)

The prior telescope, mouse, aquarium, puzzle, AppShell, README and weather-note work was preserved. The existing WorldWelcome deletion and untracked AGENTS/artwork remain. A pre/post aggregate SHA-256 over the protected interaction files and every public file matched `5ADEFEBB5D49BE6E9CA3AAC592A500FAA4DF146C6EA0B5A9F900859DE14F9385`.

## Documents and reference deliverables

Authoritative documents are this report, the index, master standards, responsive profile review, package contract, global JSON inventory and six independent Markdown briefs under `docs/art-production/`. All reference files, original-file provenance/checksums, captures and guides are enumerated in each package's `reference-manifest.json`. `created-files.json` enumerates the new documentation/reference deliverables and the three new source/test files. Measured archive sizes are recorded in `art-production/reference-packages/package-index.json`.

The reference ZIPs contain existing copied artwork and coordinate diagrams only. No replacement scene artwork was generated or integrated. No files were staged, committed, pushed or deployed.

All six reference ZIPs passed archive integrity and path checks. They total 18.75 MiB and contain 91 screenshots across their packages. Proposed asset IDs/production paths are unique, all six briefs name every corresponding export, copied artwork matches its public-source SHA-256, and coordinate SVGs parse as XML. Per-file checksums and image dimensions are recorded in the reference manifests.
