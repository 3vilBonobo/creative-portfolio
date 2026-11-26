# Floor 01 mobile career archive

Implemented 26 November 2026 after owner approval of the inspected scope. This
milestone covers Floor 01 phone portrait and landscape only. No publication,
dependency installation, artwork generation, staging, commit, push or merge.
The owner separately approved an official portable Node 22 runtime for checks.

## Result

- Shared `usePhoneLayout` detection and existing Menu navigation. Global
  breakpoints and tablet classification are unchanged.
- Fresh phone entry highlights Agritrack in amber with all four chapters closed.
  Desktop/tablet retain their original current-role selection and original text.
- Compact portrait spacing, 76px role buttons, 16px gutters and 15.2px body copy.
  Dates, roles, employers and career data are unchanged.
- Phone panels omit repeated dates/employer headings, reuse `mobileSummary`,
  expose every existing technology and retain native contributions disclosures.
- One interactive timeline tree. Landscape reflows that same tree into two
  columns when the content container is at least 46rem wide. Narrow landscape
  and enlarged text retain the inline accordion. No nested scrolling.
- Initial collapsed state is created once, never on orientation events.
  Contributions are retained by career ID, including across desktop/phone
  transitions. Community stays mounted and preserves its native open state.
- Existing rotation icon and exact approved invitation; concise Projects footer.
  The existing Menu provides Contact navigation, so no additional footer link
  was needed. Phone Floor 01 hides the redundant floating floor navigator and
  dev Scene preview toggle; desktop/tablet controls retain their behavior.

## Files changed by this milestone

- `src/sections/ExperienceSection.vue`
- `src/components/ExperienceTimeline.vue`
- `src/components/ExperienceDetail.vue`
- `src/components/ExperienceEnvironment.vue`
- `src/components/SiteNavigation.vue`: add Experience to the existing phone Menu.
- `src/components/EnvironmentPreview.vue`: update the existing simulation label.
- `src/floor01-mobile.css`
- `src/services/experienceArchive.ts`
- `scripts/experience-archive.test.mjs` and its `package.json` test command entry.
- This report. Temporary references, runtime and QA evidence are under
  `tmp/floor01-mobile-review/`.

Concurrent changes to other floors and shared files were preserved. The Floor 01
career data, shared content types and global stylesheet have no task changes.

## Asset reuse

Portrait uses the existing `floor-01-experience-wall-base-mobile.webp`, mobile
continuation tile and four registered wall/ceiling attenuation passes. Phone
landscape uses the existing panoramic desktop profile and its matching passes
from `src/config/experienceEnvironment.json`. The full plate and its passes
remain in the same coordinate space; no independently repositioned fixtures.
Portrait image elements request the mobile profile, not a second desktop tree.
The rotation icon remains `/hero/loft-mobile-v1/rotate-phone.svg`, already used
by the other mobile floors. No runtime assets or manifest contents changed.

## Measurements

CSS pixels; section height excludes other floors. Before means the original
fresh default (Agritrack open), after means the requested fresh phone default
(all closed). This measures the complete requested default-state improvement,
including changing that initial expansion; it is not a like-for-like comparison
of two manually collapsed states.

| Viewport | Before | After | Reduction |
|---|---:|---:|---:|
| 320×568 | 1543.5 | 845.3 | 45.2% |
| 360×800 | 1412.4 | 822.5 | 41.8% |
| 390×844 | 1372.3 | 822.5 | 40.1% |
| 430×932 | 1350.0 | 822.5 | 39.1% |
| 667×375 | 1268.1 | 703.0 | 44.6% |
| 844×390 | 1377.3 | 686.2 | 50.2% |
| 932×430 | 1381.5 | 686.2 | 50.3% |
| 768×1024 | 1401.3 | 1401.3 | unchanged |
| 1024×768 | 1053.3 | 1053.3 | unchanged |
| 1440×900 | 1110.9 | 1110.9 | unchanged |
| 1920×1080 | 1080.0 | 1080.0 | unchanged |

At 390×844, the heading begins around y=114 and the fourth chapter ends around
y=578; the fixed header ends at y=56. All four headers fit comfortably. At
320×568 the fourth ends around y=602, requiring approximately 34px more scroll;
readability was preserved instead of squeezing the smallest screen.

## Verification

PASS — Node 22.13.1: `npm test`, all 27 tests, including four new archive tests.
These cover phone default, desktop/tablet default, single-open/toggle behavior,
and state retained when activation changes between display modes.

PASS — `node node_modules/vue-tsc/bin/vue-tsc.js --noEmit`, production
`npm run build`, and scoped `git diff --check`. Build retains the existing
large-bundle advisory. No dependencies were added.

PASS — Browser simulations at every viewport in the table, using Scene preview
and the shared phone-touch simulation for landscape. No horizontal overflow or
nested vertical scroll areas in the measured Floor 01 states. Desktop/tablet
heights match the baseline exactly, screenshots retain their original layout,
and desktop retains full text, technologies and contributions.

PASS — All four phone roles open individually and expose both contributions.
Exactly one panel remains visible. Enter opens; Space closes. Tab reaches the
contribution disclosure with visible focus. Desktop focus/Tab does not select
another role; activation selects it and repeat activation keeps it selected.
Explicit compact activation keeps the selected heading around 72px below the
viewport top with the 56px header. No scrolling role-selection handler added.

PASS — Selected chapter, expanded contributions and Community survive phone
portrait → landscape → portrait, and a transition through desktop. Wide phone
landscape shows two columns; 667px landscape falls back to an accordion.
Community retains Rainbow School's Volunteer label, Enargeia and Peri Psychis.
Menu Escape closes the menu and returns focus. Selected Projects targets
`#projects`.

PASS — 200% text simulation via a local QA page with a 32px root font (body copy
becomes 30.4px). Title wraps instead of clipping; role/detail content wraps, with
no forced panel heights or internal scroll. At 844×390 enlarged text switches
to the inline accordion. This is a text-size simulation, not OS text zoom.

PASS — Existing steady (100%) and minimum (0%) wall/ceiling attenuation settings
in portrait and landscape. Asset loading reported ready in both orientations.
The supplied lit artwork remains lit at minimum attenuation, as documented by
the original environment implementation; no new off-state art was invented.

PASS — Production preview on port 4178: 390×844 height 822.5px, four collapsed
roles, role activation works, no Scene preview element, no horizontal overflow.
Fresh production browser error/warning log returned no entries. An earlier dev
HMR log recorded the brief missing CSS import while the new file was being
created; it was resolved. This was not present in production.

UNVERIFIED — Physical phones/tablets, screen-reader speech, native OS text zoom,
live OS reduced-motion preference changes and CSS motion emulation, formal
accessibility conformance, and dedicated uncaught-exception instrumentation.
Existing reduced-motion lamp cancellation and restoration pass the logic tests;
the existing reduced-motion CSS was retained. Other floors were not subjected
to a comprehensive regression pass during concurrent owner work; all task CSS
is scoped to Floor 01 and shared navigation changes are conditional on that
floor. No other floor implementation was edited by this milestone.

## Screenshot evidence

Directory: `tmp/floor01-mobile-review/`.

- `before-390x844.jpg`, `before-1440x900.jpg`: aligned real-app captures before
  implementation. The early `baseline.json` records measurements but its initial
  scroll positions were not aligned; do not use its other screenshot positions
  as section-entry comparisons.
- `before-reference-{width}x{height}.jpg`: aligned original-component reference
  captures for all 11 viewports. `baseline-reference.json` contains their
  measurements. The isolated `baseline/` fixture uses the four original Floor 01
  components from HEAD, which were unchanged at task entry, without reverting
  working files. Its body minimum matches the existing shared phone layout.
- `after-{width}x{height}.jpg`: full-app entry captures for all 11 viewports;
  `after.json` also records role targets, header clearance and overflow checks.
- `before-full-390x844.jpg`, `portrait-expanded-390x844.jpg`,
  `landscape-open-844x390.jpg`, `landscape-fallback-667x375.jpg`.
- `text200-portrait.jpg`, `text200-landscape.jpg`.
- `portrait-lights100.jpg`, `portrait-lights0.jpg`, `landscape-lights0.jpg`.
- `production-portrait-390x844.jpg`: final production smoke check.

Temporary QA pages and the portable runtime are evidence tools, not production
features. Browser viewport overrides were reset and temporary QA tabs closed.
