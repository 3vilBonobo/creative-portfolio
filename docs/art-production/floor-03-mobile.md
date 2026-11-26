# Floor 03 mobile redesign — 26 November 2026

Implemented within the approved Floor 03 phone scope. Existing uncommitted Floor 04 work was reused and preserved. Other concurrent workspace changes were left untouched. No dependencies, artwork generation, Git staging/commit/push or deployment were performed.

## Components and presentation

- `src/sections/AboutSection.vue`: uses the existing `usePhoneLayout` mode, keeps one scene and one tab interaction tree, and preserves the active tab and keyboard focus across orientation changes. A 260px portrait scene window crops the registered artwork/portrait composition together. Phone copy follows immediately, with facts, horizontal tabs, a single orientation invitation and a direct Projects link. Landscape uses the existing panoramic artwork with a compact left introduction; details continue in document flow. No fullscreen, orientation lock or nested reading scroll container.
- Phone CSS lives in the About component and opts in through `about--phone`, `about--portrait`, and `about--landscape`. Existing desktop/tablet rules remain intact. The new scene wrapper uses `display: contents` outside phone mode.
- `src/data/about.ts`: adds phone editorial copy, reusing the existing journey/principles where appropriate. Desktop copy is unchanged. Name, verified facts, toolkit and backend qualification remain shared. Engineering Mindset and Beyond the Code information is integrated into the phone tabs.
- `src/components/SiteNavigation.vue`: extends Floor 04's existing compact menu to About phones. About gets a header anchor offset and hides the redundant fixed floor rail. Desktop navigation is unchanged.
- `src/components/EnvironmentPreview.vue`: updates the existing development phone-touch toggle label to include Floor 03. The preview remains development-only; its floating trigger is hidden while browsing About on a phone to avoid obscuring reading content. Set the toggle on Floor 04 before checking phone landscape.

## Asset reuse

| Context | Existing assets |
| --- | --- |
| Phone portrait | v003 `floor-03-about-corridor-base-mobile.webp`, matching mobile aperture SVG and geometry |
| Phone landscape | v004 `floor-03-about-corridor-base-desktop.webp`, matching desktop aperture SVG and geometry |
| All layouts | `/about/irene-portrait.webp`, unchanged source crop and perspective projection |
| Reading surface | v003 `floor-03-about-corridor-quiet-wall-tile.webp` |
| Rotation invitation | `/hero/loft-mobile-v1/rotate-phone.svg`, existing Floor 04 treatment |
| Tablet/desktop | Their existing profile selection and artwork |

There is one responsive scene image and one portrait element. The scene image is lazy-loaded. A fresh portrait DOM inspection confirmed only the mobile scene URL and matching mask were selected. Desktop artwork is selected when phone landscape becomes active. Actual network-transfer profiling was not available through this browser interface. No missing artwork requirement was identified. The existing v004 panoramic file remains comparatively heavy; no replacement or recompression was performed.

## Measurements

Complete-app browser measurements in CSS pixels, Background active. These include the default visible panel and natural document flow; there is no fixed-height reading container. Minor subpixel variation is expected after fonts/layout settle. Production at 390px measured 1,440px, consistent with the development result below.

| Viewport | Before height | After height | Reduction |
| --- | ---: | ---: | ---: |
| 320 × 568 | 3,012 | 1,622 | 46.2% |
| 360 × 800 | 2,830 | 1,573 | 44.4% |
| 390 × 844 | 2,720 | 1,438 | 47.1% |
| 430 × 932 | 2,573 | 1,415 | 45.0% |
| 667 × 375 | 2,420 | 980 | 59.5% |
| 844 × 390 | 2,067 | 912 | 55.9% |
| 932 × 430 | 2,021 | 912 | 54.9% |
| 1440 × 900 | 1,676 | 1,676 | unchanged |
| 1920 × 1080 | 1,362 | 1,362 | unchanged |
| 820 × 1180 | 2,053 | 2,053 | unchanged |
| 1180 × 820 | 1,925 | 1,925 | unchanged |

At 390px, tabs moved from approximately 1,890px to 668px below the section start. Other tabs grow naturally with their content; default Background measurements are used for the reduction target.

## Verification

- PASS: all three tabs at all 11 sizes above (33 combinations): no document horizontal overflow, no active-panel horizontal overflow, exactly one visible panel. Raw data: `tmp/floor03-mobile-review/after-metrics.json`; baseline: `before-metrics.json`.
- PASS: desktop and tablet default section heights match baseline exactly within recorded browser precision. Existing desktop content and layout remain present. Desktop and both tablet orientations were visually inspected; this is not a pixel-diff certification.
- PASS: ArrowRight, Home and End select/focus the corresponding tabs; Tab enters the active panel and then reaches the Projects link. Visible cyan focus was observed. Selected Toolkit and its focused tab survive portrait → landscape → portrait.
- PASS: compact Menu, Escape dismissal and focus return to Menu; direct Selected Projects link sets `#projects` and active floor `projects`.
- PASS: phone anchors place the section at the 56px header edge after settling; reading headings and tab row remain unobscured. Bottom floor navigation is absent on About phones. Final text, invitation and Projects control remain reachable in ordinary document scrolling.
- PASS: local production preview at 390 × 844: phone layout, mobile scene URL, no Scene Preview control, no Vue development toolbar, no horizontal overflow and no browser console errors in the sampled flow.
- PASS: Node 22.13.1 `npm run build`, separate `vue-tsc --noEmit`, and `npm test` (23/23). Existing >500kB bundle warning and installed npm 12's Node patch compatibility warning remain. No tooling configuration was changed. `git diff --check` passed for the affected files.
- PASS by source inspection: existing reduced-motion startup guard/CSS remain in effect; media listeners and ResizeObserver are cleaned up, and the added component watch is lifecycle-scoped. No new motion system was added.
- UNVERIFIED: physical phones, browser chrome/safe-area behavior on actual devices, screen readers, native zoom and live reduced-motion preference changes. Landscape used the existing Scene Preview phone-touch simulation, not physical touch input. Network-transfer counts were not measured.

The initial production preview attempt failed on the local Console Ninja connection in the sandbox. An approved retry outside the sandbox started normally. An intermediate development HMR error occurred while the component and new content export were being edited separately; a fresh built production preview recorded no errors. Later, while final captures were being reviewed, concurrent Floor 01 edits briefly caused the shared dev app to report a missing `floor01-mobile.css` import. No unrelated source was changed to address it. The build/test results above describe the successfully verified workspace snapshot before that concurrent edit.

## Screenshots

Evidence is under `tmp/floor03-mobile-review/`:

- `before-390x844.jpg`: original portrait layout.
- `before-1440x900.jpg`: original desktop capture, taken during the existing entrance animation; use the matching geometry measurements rather than a pixel diff of text opacity.
- `production-390x844.jpg`: final public portrait layout without development overlays.
- `after-390x844-details.jpg`: details, orientation invitation and final Projects link (development toolbar is visible only in this development capture).
- `after-WIDTHxHEIGHT.jpg`: all 11 requested sizes listed above, including landscape, desktop and tablet.
- `capture-alignment.json`: complete-app viewport/header/section alignment observations made before the final screenshot replacements.

The 33 viewport/tab measurements and navigation checks used the complete application. Final `after-WIDTHxHEIGHT.jpg` captures use `tmp/floor03-mobile-review/isolated.html?touch#about`, importing the actual About, AppShell and navigation components with existing global styles. This isolates captures from concurrent changes on other floors, supplies the existing development touch override and disables smooth anchor scrolling. The earlier complete-app harness `qa.html` is retained for reproducibility. Viewport changes and final screenshot saves were separated to allow rendering to settle. Production behavior was separately checked at `http://localhost:4173/#about`; its screenshot is `production-390x844.jpg`. Earlier captures affected by scrolling/repaint timing were replaced. Development screenshots may contain the existing Vue developer toolbar; production does not. The temporary production preview was stopped after verification.

Floor 03 is ready for owner visual review. No work on Floor 02 was performed by this task.
