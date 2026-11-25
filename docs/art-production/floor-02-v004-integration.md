# Floor 02 v004 local integration

25 November 2026. Local implementation authorized by the owner. Publishing, committing and pushing are not authorized. Final owner visual review is pending.

## Explicitly approved exceptions

- Desktop and mobile are independently generated but visually coordinated compositions.
- Sources have deployment-resolution 1x detail; no native 2x masters are supplied or claimed.
- Retain desktop fixture center approximately (1072.5,147), mobile (600,92), with corrected header clearance.
- Use base z0, spill z1, emission z2, with HTML above the decorative scene.

These are approved deviations from v002, not full unchanged v002 compliance. Staging manifests and candidate review notes remain historical records; their previous unapproved status is superseded for these four decisions by the owner's explicit final-integration instruction.

## Implementation

The eight validated files from `art-production/staging/floor-02-projects/v004/production/public/environments/floor-02-projects/` are copied unchanged to `public/environments/floor-02-projects/`. Existing artwork is retained.

`ProjectsEnvironment.vue` owns decorative artwork only. Its container is the full section width, independent of the navigation gutter. Base, spill and emission share one proportional plate (1370:1148 desktop; 768:2048 through 620px). A 110 CSS px lower fade joins the compact repeating continuation. Container-relative units keep continuation placement tied to the plate, not section height or card count.

A ResizeObserver watches scene width and the fixed header. Clearance uses the section's anchor margin and the conservative upper edge of the fixture housing, plus 12px clearance. Portrait retains a minimum 82px inset. Measurements do not depend on the current scroll position, so the wall does not chase the header during scrolling. The observer disconnects on unmount. The complete scene passes move together; artwork geometry is unchanged.

The scene is aria-hidden, pointer-transparent and independent of Athens time/weather. `--projects-light-intensity` defaults to 1 for both light passes; an off state is exercised only in the disposable QA entry. The subsequent owner-authorized lamp refinement multiplies both passes by one shared intensity from `projectsLamp.ts`: a random 20–60 second quiet interval, then a single dip, a short outage, or two dips separated by a recovery gap. There is no public control, brightness overshoot or animation loop. Reduced motion, hidden pages and offscreen scenes cancel the pending timeout and restore steady intensity. Media/visibility listeners and both observers are cleaned up on unmount. Background geometry and assets are unchanged. The title gets a bounded grid cell and can break a long word when text enlargement needs it. Cards, data, disclosure logic, navigation and native dialog handlers are retained.

### Lamp refinement verification

The Node 22 build, type check and 18 tests pass, including four virtual-clock lamp cases. The focused suite can run instantly with `node --experimental-strip-types --test scripts/projects-lamp.test.mjs`; it advances minutes of scheduling without sleeping. It covers the 20/60 second boundaries, single outage, double dip/recovery gap, pause mid-event, duplicate activation, cancellation and irreversible disposal. The existing large-bundle warning remains.

`tmp/floor02-lamp-refinement/index.html` is a disposable browser QA entry importing the actual app. It intercepts only lamp scheduling, provides a virtual step button, and simulates preference/visibility events. It is not imported by `/` or included in the production build. Activate Projects in the top navigation (or focus Floor 02 and press Enter), then Next lamp step to advance a whole waiting interval or one event segment immediately. The QA panel can overlap the bottom floor navigation on small viewports. Toggle reduced motion during a dip to verify immediate steady light, zero pending lamp timers, and a fresh quiet interval when re-enabled. Unmount portfolio verifies cancellation. Native OS preference and physical-device tests are not claimed. Raw browser observations are in `tmp/floor02-lamp-refinement/browser-trace.json`.

Browser refinement checks: PASS at 1440x900 and 390x844 for shared 0.65 emission/spill opacity with identical layer bounds; simulated reduced-motion changes restore both to 1 and leave no scheduled lamp work; hidden-page and offscreen cancellation and unmount cancellation pass. Normal app checks at desktop, phone and 621px preserve grid columns, no horizontal overflow, and Info/Escape focus restoration. Sampled browser logs returned no errors/warnings. `tmp/floor02-lamp-refinement/normal-browser.json` holds the focused layout observations. Existing v004 assets and all project-card/data files match their pre-refinement hashes.

## Verification

All checks below were performed locally with the existing Node 22.13.1 installation and existing dependencies. No dependency installation or global Node change was performed.

| Check | Actual result |
|---|---|
| `npm run build` | PASS on final source; 124 modules transformed. Existing >500 kB JS chunk warning remains (about 1008 kB before gzip). |
| `node node_modules/vue-tsc/bin/vue-tsc.js --noEmit` | PASS, exit 0. |
| `npm test` | PASS, 14 tests, zero failures. Node emits its expected experimental type-stripping notice. |
| `git diff --check` | PASS. |
| Staged v004 to runtime asset checksums | PASS for all eight files; no artwork modifications. |
| Six original viewports plus 621/640/720/760/761px | PASS across 1/6/12 cards and normal/200% text: 66 layout cases. No horizontal document overflow; heading contained; grid breakpoints and navigation clearance retained. |
| Fixture and registered passes | PASS: spill/emission bounding boxes equal the plate in every case. Conservative fixture housing top clears the fixed header by at least 12.7 CSS px at anchor entry. |
| Lamp off/on | PASS at all eleven sizes: 22 cases. Both passes share intensity 0/1; base and coordinates remain unchanged. |
| Environmental consistency | PASS: all 35 time/weather combinations at desktop 1440x900 and phone 390x844 (70 states). Base, continuation, spill and emission backgrounds, opacity, filter and blending stay unchanged. Existing card night styling remains. |
| Long mobile scroll | PASS: twelve-card enlarged-text list; Projects remains active and scene offset stays at 82px through Page Down. No repeated equipment/floor or conspicuous tile seam in sampled views. |
| Keyboard/dialog | PASS at desktop, phone and 621px: Tab to Info, Enter opens the named native dialog, Escape closes it, focus returns to Info with existing cyan focus-visible treatment. Dialog handlers and markup are unchanged. |
| Reduced motion | PASS in disposable-page simulation: plate has no animation; existing card transitions use the application's reduced-motion styles. Native OS preference testing remains unverified. |
| Console sample | No errors/warnings returned in the exercised live-app and QA sessions; not an exhaustive uncaught-exception audit. |
| Preservation | Existing tracked source/artwork hashes changed only for the intended ProjectsSection and five-line night-wall removal. Project data, ProjectCard, navigation, unrelated floors and existing artwork were not edited. Git index unchanged. |

Viewports: 1440x900, 1920x1080, 1180x820, 820x1180, 844x390, 390x844; additional widths 621, 640, 720, 760, 761 at 844px height. These are CSS viewport simulations, not physical-device tests. Screenshot pixel dimensions can differ from viewport dimensions.

The disposable entry at `tmp/floor02-integration/index.html` imports the actual app, CSS and environment component with no artwork/layout overrides. It changes the project array only in browser memory for 1/12-card fixtures, uses the real Show more handler, doubles computed text sizes for text-only tests, and activates existing reduced-motion rules for that simulation. Default `/` still uses the original six project records.

Raw evidence: `tmp/floor02-integration/browser-layouts.json`, `lighting.json`, `environment-states.json`, and `keyboard-reduced-motion.json`. Before/after screenshots are `before-1440.jpg` / `after-1440.jpg`, `before-390.jpg` / `after-390.jpg`, and `before-621.jpg` / `after-621.jpg`. Enlarged text is captured in `after-200-text-390.jpg` and `after-200-text-621.jpg`. `long-mobile.jpg` covers a long-list sample. The dev preview remains available locally for owner review; no publishing operation occurred.

## Known limits

- Text-only enlargement and reduced-motion QA use a disposable entry importing the actual application. Native OS preference and physical-device checks must be distinguished from these simulations.
- Continuation has subtle periodic microtexture by design; sampled browser proof does not establish artifact-free rendering on every display.
- Calculated decoded RGBA payload is approximately 20 MiB for one active profile including both light passes and continuation, excluding project previews and the rest of the application. This is not measured total GPU/process memory.
- Baked magenta/cyan ambient remains constant; the amber service source and spill are the controllable passes.
