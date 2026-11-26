# Floor 04 mobile implementation and review

Implemented 2026-11-26 from the owner's approved `floor04-mobile-handoff.zip`.
Floor 04 has a portrait portfolio and an explicitly entered landscape studio.
Desktop and tablet artwork, masks, composition and discovery mechanics are retained.
No artwork generation, dependencies, commits, pushes, merges or deployments were performed.

## Layout and state

- Portrait: width at most 600 CSS px and portrait orientation. The artwork occupies
  44svh, preserves its full width, and uses `object-position: center 44%`. An optional
  full-artwork button reveals the uncropped image. Intrinsic dimensions are 941×1672;
  responsive sources are 720×1279 and 941×1672. Images are never stretched.
- Landscape: width at most 1000 CSS px, height at most 500 CSS px, landscape orientation
  and `any-pointer: coarse`. This excludes the tested 768×1024 and 1024×768 tablets
  and mouse-only desktop layouts. Existing responsive CSS changes at 760/761px;
  phone selection is deliberately narrower and checks height and input as well.
- Normal landscape document flow exposes the introduction, project/about links and
  an Enter immersive studio button. Following owner approval of the cover refinement,
  the landscape scene fills its frame. Immersive mode covers the full dynamic viewport;
  compact controls overlay the artwork and respect safe areas. View entire studio
  switches to contain; Fill the screen restores cover without remounting discoveries.
- Rotation never enters studio mode automatically. Leaving landscape exits that
  presentation; returning to landscape offers entry again. Dialog instances, Sudoku
  input, chess hints, aquarium state, cat logic and the full-artwork preference survive
  orientation changes. Explicit exit restores the recorded scroll position. Orientation
  handlers make no URL/history calls and never request fullscreen or orientation lock.
- The compact header replaces shared navigation only while Floor 04 is active on a
  phone. The floating floor bar remains available on the other floors. Menu Escape
  returns focus to its button. Dialog return focus and Tab containment are handled
  for the phone flow; existing desktop handlers remain in place.
- Scene preview includes a development-only Phone touch layout checkbox. This simulates
  the coarse-input gate for landscape QA because the browser reports mouse input even
  at phone viewport sizes. The override cannot enable production phone layouts.

## Asset registration and weather

All eight installed files under `public/hero/loft-mobile-v1/` are byte-identical to
the ZIP. The supplied manifest and draft masks are retained as provenance, not enabled
as runtime geometry. Portrait telescope, aquarium, chess, Sudoku and cat actions use
the discovery disclosure and existing component handlers. No estimated portrait
hotspots are enabled. Chess and some lower landmarks are outside the initial crop;
the full-artwork action and discovery menu remain available.

Portrait day/night plates contain small registration/detail differences, including
foliage, window/frame details and monitor content. They switch directly rather than
crossfading. Baked cat, clouds and night moon receive no duplicate overlays. The
portrait scene is static: all weather/sky/ambient overlays are absent, including during
storm preview. HTML text displays the shared Athens time, weather and temperature,
with existing fallback/stale-data status; no new weather API was introduced.

Landscape retains the existing panoramic artwork, masks and SVG viewBoxes. A shared
1672×941 canvas scales the artwork and all overlays together. Cover uses the larger
of the viewport width and the width required to fill its height, with vertical framing
at 70% to retain the lower puzzle target. Entire-studio mode uses the smaller dimension
and centers the full scene. At the three tested landscape sizes, map/plate rectangle
differences remain below 0.03px. Storm/night preview showed atmosphere confined to
the existing exterior masks.
Small scene targets have equivalent menu actions with at least 44px control height.

| Supplied plate | Native dimensions | Compressed image payload |
| --- | --- | --- |
| day-720.webp | 720×1279 | 176,646 bytes / 172.5 KiB |
| night-720.webp | 720×1279 | 167,482 bytes / 163.6 KiB |
| day-941.webp | 941×1672 | 294,714 bytes / 287.8 KiB |
| night-941.webp | 941×1672 | 279,516 bytes / 273.0 KiB |

The rotation SVG is 342 bytes. Only the active portrait phase is rendered, using
`srcset`/`sizes`; the browser selects the density-appropriate source. A fresh 390px QA
load selected day-720.webp and contained no desktop hero image elements. The desktop
day preload is media-qualified and its condition was false on that fresh portrait
load. These are file payload sizes; browser cache, HTTP overhead and high-density
device selection affect actual transferred bytes. A cold-network HAR was not captured.

## Verification

Local route: `http://localhost:5173/`, including `#office` and direct `#projects` navigation.
Checks ran on Node 22.13.1, using the installed Node 22 npm entrypoint without changing
the user's global Node selection.

| Check | Result and evidence |
| --- | --- |
| Separate vue-tsc --noEmit | PASS |
| npm test | PASS, all 23 tests, after final logic edits |
| npm run build | PASS; existing >500kB JavaScript chunk warning remains |
| git diff --check | PASS |
| Portrait 320×568, 360×800, 390×844, 430×932 | PASS: no horizontal overflow, artwork adjacent to readable introduction, no vertical intro tab or blank gap |
| Initial professional content | PASS: name, role and project action visible at 360/390/430 widths. At 320×568, action bottom is about 568.6px, requiring a very small normal scroll |
| Landscape 568×320, 844×390, 932×430 | PASS in viewport simulation with dev touch gate: full scene contained, visible 44px return control, menu fallback |
| Tablet 768×1024 and 1024×768 | PASS: original layout; hero and scene rectangles equal before/after |
| Desktop 1440×900 and 1920×1080 | PASS: original layout; hero and scene rectangles equal before/after; matched day/clear/frozen-parallax captures visually compared |
| Breakpoint edges | PASS: portrait at 600px; original at observed 602px. Landscape simulation at 1000×500; original at observed 1002×500 and 932×502. Actual observed dimensions are saved in breakpoint-checks.json |
| Portrait day/night and storm | PASS: correct phase image; no duplicate cat/moon or environmental overlay elements; readable weather status |
| Landscape night/storm | PASS: original scene/mask geometry and exterior weather; night capture saved |
| All five discoveries | PASS: opened telescope, Sudoku, chess and aquarium; closed dialogs; cat returned Prrrr response |
| Rotation with dialogs open | PASS: telescope image source retained; Sudoku value 3 retained; chess hint state retained; aquarium count 25 retained. Dialogs remain open |
| Immersive chess to portrait | PASS: dialog stays open; closing restores body/root scrolling |
| Explicit studio exit | PASS: entry/exit scroll both 461.600006px in the exercised flow |
| Rotation below hero | PASS: #projects remains the URL and immersive mode stays off |
| Full-artwork preference | PASS: survives portrait to landscape to portrait |
| Keyboard | PASS: menu Enter/Escape and focus return; discovery focus return; puzzle reverse Tab contained; Escape dismisses. Controls have visible focus styles |
| 320px puzzle dialog | PASS after fixing intrinsic spread overflow; scrollWidth equals clientWidth |
| Console errors/warnings | PASS: none observed in the exercised UI flows |
| OS reduced-motion emulation | UNVERIFIED: new invitation/plate UI adds no perpetual animation; existing reduced-motion rules retained |
| Text enlargement / browser zoom | UNVERIFIED: attempted browser zoom shortcuts did not change observed viewport metrics |
| Physical phone / iOS Safari / real safe-area and browser chrome | UNVERIFIED: no physical device available; viewport sizes and safe-area CSS are simulations |
| Deployed hosting badge overlap | UNVERIFIED: local preview has no hosting badge; no deployment authorized |
| Forced weather-network failure | UNVERIFIED: existing fallback wiring retained, not forced offline during QA |
| Uncaught exception instrumentation | UNVERIFIED: console inspection performed, no dedicated exception listener installed |

Screenshots and raw metrics are under `tmp/floor04-mobile-review/`:

- `before-WIDTHxHEIGHT.jpg` / `after-WIDTHxHEIGHT.jpg` for all eleven requested sizes.
- `after-portrait-night-storm.jpg`, `after-landscape-night-storm.jpg` and discovery captures.
- `before-metrics.json`, `after-metrics.json`, `landscape-metrics.json`,
  `desktop-tablet-comparison.json`, `breakpoint-checks.json`, `interaction-results.json`.

The first telescope text comparison changed while its image was still resolving; the
subsequent settled image-source comparison passed. An initial telescope focus-return
check exposed focus returning to the scene target; this was fixed and rechecked with
focus returning to the Telescope menu action. Raw interaction results retain both
initial observations and the passing follow-up checks.

## Changed files

- `index.html`: media-scope the existing desktop hero preload.
- `src/App.vue`, `src/components/SiteNavigation.vue`: active-floor scoped compact header.
- `src/sections/OfficeHero.vue`: phone composition, discovery entrypoints, studio mode and focus/scroll handling.
- `src/composables/usePhoneLayout.ts`: phone thresholds and cleaned-up media-query listeners.
- `src/components/MobileStudioPlate.vue`, `src/floor04-mobile.css`: portrait artwork and phone-only presentation.
- `src/components/HeroVisual.vue`: disable desktop parallax only in compact phone presentation.
- `src/components/HeroCat.vue`: reuse pet logic without a duplicate portrait cat drawing.
- `src/components/TelescopeExperience.vue`, `DailyPuzzleBook.vue`, `DailyChessPuzzle.vue`,
  `AquariumExperience.vue`: expose existing entrypoints and suppress unregistered portrait overlays.
- `src/components/EnvironmentPreview.vue`: development-only touch classification preview.
- `public/hero/loft-mobile-v1/*`: supplied files, unchanged.
- This documentation and the review captures/metrics.

Owner review is the next step. Portrait draft masks/hotspots remain intentionally
disabled; enabling them or expanding to other floors is outside this milestone.

## Approved landscape cover refinement

The owner approved replacing the original landscape contain requirement with a
cover presentation. Only `src/sections/OfficeHero.vue`, `src/floor04-mobile.css`,
this documentation and `tmp/floor04-landscape-cover/` were changed for this refinement.
Concurrent About/Projects/other-floor work in the shared tree was preserved.

The new canvas is `display: contents` outside landscape phones, preserving the
existing desktop, tablet and portrait structure. Normal landscape framing now uses
`min(100svh, 56.2799043vw)` rather than the former 65svh miniature presentation.
Immersive framing removes the reserved toolbar band and borders. Controls remain
44px or taller, with the discovery menu providing the existing equivalent actions.
Artwork files and interaction coordinates were not edited.

| Refinement check | Result |
| --- | --- |
| Cover at 568×320, 844×390, 932×430 | PASS: no page overflow or letterbox gutters; all five mapped target rectangles fit within each viewport |
| Scale at 844×390 | Artwork width increases from approximately 587px to 844px; central skyline, developer, workstation and discoveries retained |
| Map alignment | PASS: maximum map/plate rectangle difference below 0.03px |
| Entire-studio toggle | PASS: Enter and Space switch modes, aria-pressed reflects state and focus stays on the control |
| Discoveries | PASS: mapped telescope target opens; puzzle/chess/aquarium/cat menu actions work |
| Orientation | PASS: open Sudoku and its existing value 3 survive rotation; return to landscape does not auto-enter studio |
| Night/storm | PASS: cover canvas and exterior masking visually inspected; screenshot saved |
| Portrait 320/360/390/430 widths | PASS: no horizontal overflow; existing composition retained |
| Tablet/desktop regression | PASS visual inspection at 768×1024, 1024×768, 1440×900 and 1920×1080; dimensions differ from prior saved captures by at most 1.2px rather than matching bit-for-bit. Captures have different pixel rounding; raw comparisons retained |
| Node 22.13.1 typecheck, npm test, production build | PASS; all 23 configured tests pass. Existing >500kB build warning remains |
| Browser logs | An existing Three.Clock deprecation warning appeared after aquarium use, and a temporary Vite ProjectsSection reload error appeared during concurrent edits. The production build subsequently passed; no Floor 04 cover error was identified |
| Physical device, OS reduced motion, text zoom, hosting badge | UNVERIFIED; same limits as the original milestone |

Before screenshots in `tmp/floor04-landscape-cover/` are copied unchanged from the
previous milestone's final day/clear landscape captures. Current day/clear cover,
night/storm and entire-studio captures are alongside `cover-metrics.json`,
`interaction-results.json`, `regression-after.json` and `regression-comparison.json`.
The initial attempt to capture a new baseline was blocked by an incomplete concurrent
About import; no unrelated code was changed to bypass it.
