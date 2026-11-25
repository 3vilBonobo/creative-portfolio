# Floor 03 corridor verification

25 November 2026. Implemented locally, pending owner visual acceptance. No dependencies installed and no Git mutation/deployment.

## Changed by this task

- `src/sections/AboutSection.vue`: shared coordinate scene, responsive art/mask selection and separate projected existing portrait. Large decorative wall 03 removed at owner's request; existing section/eyebrow/navigation numbering retained. Tab semantics and keyboard handlers retained.
- `src/data/about.ts`: owner-requested corrections and shorter description grounded in the updated CV; no contact details or original CV published.
- About rules in `src/style.css`: obsolete accumulated About rules replaced, About-only shared gutter overrides removed. Unrelated CSS edits preserved.
- `public/environments/floor-03-about-corridor/v003/` and `/v004/`: versioned supplied assets/instructions and final owner-provided desktop source with measured geometry/mask and lossless runtime encoding.
- `docs/about-artwork.md`, this report; temporary QA/extracted handoff/evidence under `tmp/about-corridor-v003/`.

Extensive Hero/Experience work was already modified and continued changing during this task. Other floors, navigation components, inter-floor transitions and package configuration were not edited by this task. The owner later supplied an updated CV and requested text correction; `src/data/about.ts` was then updated from that document, without publishing the document or personal contact details.

## Browser checks

The complete application at `http://127.0.0.1:5188/#about` and an isolated harness importing the actual production AboutSection, SiteNavigation, FloorNavigator and global styles were exercised. No raster proof was used as a background. Synthetic copy/resizing/failure/preferences are temporary harness scenarios only.

| CSS viewport | Profile | All three tabs | Horizontal overflow |
| --- | --- | --- | --- |
| 1920×1080 | desktop | PASS | None |
| 1440×900 | desktop | PASS | None |
| 1180×820 | tablet-landscape | PASS | None |
| 820×1180 | tablet | PASS | None |
| 390×844 | mobile | PASS | None |
| 844×390 | tablet-landscape | PASS | None |

- PASS: all three tabs/selected state/visible panels at all six dimensions in the final complete application; raw records `compact-app-metrics.json`. Final normal-size isolated measurements are `compact-normal-metrics.json`, also covering 2560×1440.
- PASS: portrait visually inside the physical frame in all four profiles. Shared scene dimensions/mask registration maintained through profile and scrollbar changes. Final desktop uses the new image and its new aperture, never the old mask. Artist-level subpixel approval remains visual.
- PASS: final exact doubled-font checks for all three tabs at all six sizes. Each About element was set to twice its pre-mutation computed font size (desktop intro 20.16→40.32px; mobile intro 18→36px), so viewport-based clamps could not understate the enlargement. No detected horizontal text clipping or document overflow. Raw records: `compact-exact200-metrics.json`. Earlier root-font-doubling checks also passed. Neither claims native browser zoom or physical-device testing.
- PASS: final eight-extra-paragraph scenario with Approach at all six sizes. Section heights grew to approximately 1,560–2,750px while scene proportions remained constant. The corridor is not tiled or vertically stretched. Raw records: `compact-long-metrics.json`.
- PASS: keyboard ArrowRight→Toolkit; End→Approach; Home→Background; Tab→visible Background panel. Focus and selected state agree and cyan outline is visible. Roles, aria-controls and roving tabindex retained.
- PASS: complete-app Floor 04→03 returned both hash and active floor to About.
- PASS: simulated reduced-motion startup sets no GSAP inline opacity/transforms; reduced-motion CSS forces visible stationary text. About has no animated lights. UNVERIFIED: native OS preference switching and screen-reader operation.
- PASS: deliberately missing background/photo requests leave readable HTML, functioning tabs and no horizontal overflow. Intended scenery/photo is unavailable in that failure scenario.
- PASS: fresh complete-app console sample empty. Earlier HMR tab recorded provider/emitsOptions errors during concurrent unrelated updates; a fresh application tab did not reproduce them. No unrelated fix was attempted.
- Used existing dev-only Scene preview to inspect live/day-clear presentation. About does not reuse incompatible old light passes. Lamp-off testing is inapplicable to baked static-light assets.

The owner supplied a new desktop background, requested wider use of the wall and CV-based corrections, then requested smaller type, a shorter section, lighter backing and removal of the wall number. Final `compact-*` evidence reflects all those changes. Earlier captures are superseded. Tablet/mobile artwork is unchanged. Additional 2560×1440 checks cover the wide-wall composition. Default section height is now about 953px there and 844px at 1920×1080, instead of reserving the entire ~1440/~1080px plate. The full portrait remains visible in all tested normal-size states; the lower scenic foreground is deliberately cropped. Long content still expands naturally.

## Automated verification

- PASS: Node 22.13.1 `npm run build`; existing bundle-size warning remains.
- PASS: Node 22.13.1 `node node_modules/vue-tsc/bin/vue-tsc.js --noEmit`.
- PASS: Node 22.13.1 `npm test`, 22/22 tests.
- PASS: v003 supplied asset sizes/hashes/dimensions and portrait equality; v004 source/lossless runtime pixel equality and manifest hashes.
- Installed npm 12 warns that this Node 22 patch is older than its supported range, but commands complete. No tooling configuration was changed.

## Evidence and limits

Current screenshots are `about-ui-2560x1440.jpg`, `about-ui-1920x1080.jpg`, `about-ui-1440x900.jpg`, `about-ui-1180x820.jpg`, `about-ui-820x1180.jpg`, `about-ui-390x844.jpg` and `about-ui-844x390.jpg` under `tmp/about-corridor-v003/screenshots/`. These are actual browser renders of production components in the isolated harness, with entrance motion reduced and normal text size. Fixed navigation appears at its viewport position within full-page captures. Older screenshots are retained as intermediate evidence only.

## Latest owner-directed information layout

The owner found the compact iteration too short and requested a more engaging presentation. The current section restores a minimum of max(95svh, 90% of proportional scene height), approximately 1028px at 1920×1080 and 1370px at 2560×1440. The large wall number remains absent. Existing fonts are used deliberately for display, reading and metadata; the owner's name, highlighted professional role and a three-fact overview establish hierarchy. A lightly tinted detail panel, amber selected tab and cyan focus feedback distinguish interaction without an opaque full-height black backing. No new artwork or dependency was added. The new name/facts are taken from the same owner-supplied CV; biography wording is unchanged in this iteration.

Repeated verification for the latest layout:

- PASS: all three tabs, no horizontal overflow, no detected text clipping and no intro/portrait overlap at all six requested sizes in both isolated and complete application checks; normal-size proof also includes 2560×1440. Records: `refined-normal-metrics.json`, `refined-app-metrics.json`.
- PASS: exact computed font sizes doubled, all three tabs, all six sizes, including the new facts/name. Intro 24→48px at 1920px and 18→36px on mobile; no clipping/overflow. Records: `refined-text200-metrics.json`.
- PASS: eight extra biography paragraphs with Approach at all six sizes, section approximately 1840–2994px tall, fixed proportional scene and no clipping/overflow. Records: `refined-long-metrics.json`.
- PASS: keyboard ArrowRight selects/focuses Toolkit, End selects Approach, Tab reaches its panel; visible focus remains.
- PASS: current complete-app console sample empty. Build, type check and all 22 existing tests were rerun after this change.
- Reduced-motion CSS disables the new panel animation and tab/panel transitions; the existing GSAP startup guard remains. OS preference switching and screen-reader/native browser zoom remain unverified, as before.

## Selected Projects-inspired information styling

The owner approved the large-screen composition but rejected the muted information styling. This iteration inspected `ProjectsSection.vue` and `ProjectCard.vue` and adapted their actual amber active-control treatment, cool/dark panel surfaces, bold uppercase labels and angular corner accents. The approved artwork, portrait mapping, section minimum height, 48% reading area, responsive breakpoints and tab handlers were retained. Changes in this iteration are only About markup/styling and these documents; CV biography wording and source images are unchanged.

- Role: black text on a saturated amber highlight; name: uppercase cyan monospaced type; body: cool off-white on navy surfaces.
- Facts: three compact cards with amber, cyan and magenta accents. Biography: clearly labelled Production work and Legal foundation cards; labels describe the existing paragraphs rather than adding claims.
- Tabs: filled amber selected state, decorative aria-hidden symbols, cyan focus, familiar Projects control styling. Toolkit items use compact monospaced tags; long prose remains sentence case.
- Normal-size isolated checks: all three tabs at the six requested dimensions plus 2560×1440; no horizontal overflow, clipped text or introduction/portrait overlap. Records: `about-ui-normal-metrics.json`.
- Exact 200% computed text sizes: all three tabs at all six required sizes, including new labels and symbols; no clipping/overflow. Records: `about-ui-text200-metrics.json`.
- Eight extra biography paragraphs plus Approach: all six sizes passed, no overflow/clipping. Records: `about-ui-long-metrics.json`.
- Complete application: all 18 viewport/tab combinations passed; fresh console sample empty. Records: `about-ui-app-metrics.json`.
- ArrowRight, Home/End and Tab-to-panel focus work; decorative tab symbols do not alter accessible tab names. Focus-visible remains true.
- Build, type check and all 22 existing tests rerun. Prior limits for native browser zoom, OS motion switching, screen readers and physical-device tests remain. No formal glyph-level contrast certification is claimed.

Current default heights remain approximately 1028px at 1920×1080 and 1370px at 2560×1440; longer tabs grow. The large wall number remains absent. Final visual acceptance concerns the information styling; other floors were inspected only and were not modified by this work.

Final owner acceptance is needed for the compact placement, measured frame inset, lower reading-deck blend and supplied narrower compositions. New desktop runtime WebP is lossless and 1,692,864 bytes; it preserves the supplied pixels but is heavier than the v003 desktop candidate. Portrait source is untouched. Native zoom, screen readers and physical devices remain unverified; no formal glyph-level WCAG contrast certification is claimed for textured artwork.
