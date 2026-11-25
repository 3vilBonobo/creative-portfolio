> Current professional case study: [Enterprise Traceability Platform refinement](enterprise-traceability-case-study.md). The Agritrack/HarborTrace presentation below is historical and has been replaced for this project only.

> Follow-up: Meme Generator is removed, and Agritrack now appears in Professional Work using the owner-supplied dark HarborTrace concept mockup. Both original light/dark mockups are available in Details, explicitly distinguished from production screenshots. There are six records: ISS, three creative supporting projects, Agritrack and Orthobyron. Unconfirmed Agritrack technology tags and public links are omitted. The original six-project inventory below is historical; Meme Generator no longer needs a cover. Desktop internal scrolling was subsequently explicitly approved and implemented; see the latest follow-up below.

# Floor 02 visual-fidelity correction — local review

Implemented 25 November 2026 under the owner's visual-fidelity correction request. This supersedes the earlier minimal presentation proposal. The two supplied reference images are visual targets for presentation; their fictional content, controls and environment have not been copied. No publishing operation is authorized or performed.

## Implemented composition

- ISS is the sole featured placement. Its desktop frame devotes approximately 55% to media and 45% to information. Full description, all actual technology tags, Project Details, Live Demo and Source Code remain visible and wrap naturally.
- Four Creative & Interactive projects follow in their existing relative order: Magic Herbs, Fashion Show, Tip Calculator, Meme Generator. Three desktop columns flow as 3 + 1, two tablet columns as 2 + 2, then one mobile column. Cards retain their natural heights.
- Orthobyron occupies Professional Work, using the same chamfered frames, material surfaces, media treatment, technology pills and actions. A wider horizontal case-study panel on desktop becomes stacked below 981px. Future professional records use the same category and flow below it; none have been invented.
- At 1400px and above, a compact left rail filters All Projects (6), Creative & Interactive (5, including ISS), or Professional Work (1). The existing right floor-navigation gutter is retained. Below 1400px, categories become wrapping horizontal controls; at 620px and below, a labelled native select replaces them. Counts derive from actual records. Technology chips are metadata, not decorative filter controls.
- Charcoal surfaces, amber primary actions, fine material highlights, project-specific accents, angular corners, visible focus, and subtle elevation give the presentation a richer identity. Authored covers may receive a restrained hover scale; genuine screenshots are never cropped, distorted or animated. No continuous panel animation or scroll-entry effect was added. Reduced-motion CSS removes panel/control transitions and transformations.
- The content header measures the existing fixed header to preserve clearance, including enlarged text, without moving the environmental plate. Its ResizeObserver is disconnected on unmount.

The v004 environment component, all environmental artwork, continuation, lighting registration, periodic flicker, global navigation and shared systems were left byte-for-byte unchanged. Accessible Level 02 lettering remains in HTML.

## Source/data boundaries

Changed application files: `src/sections/ProjectsSection.vue`, `src/components/ProjectCard.vue`, `src/types/content.ts`, `src/data/projects.ts`. Existing global card CSS was left in place to avoid unrelated cleanup; the new presentation uses scoped `work-panel` and `projects-showcase` classes.

The only additions to actual records are explicit `category` values matching the owner's requested classification. Original IDs, titles, display titles, summaries, roles, technologies, URLs, attribution, preview metadata and legacy featured flags remain unchanged. Placement explicitly selects `iss-tracker`, so the legacy Orthobyron featured flag does not produce a second badge.

`Project.cover` is optional: `{ src, width, height, alt, srcSet?, objectPosition? }`. Cards prefer this image, otherwise use the original preview with `object-fit: contain`. Cover images may use `object-fit: cover` with a supplied focal position; validate cropping on delivery. The detail dialog still uses `preview` exclusively, including its source label and attribution. Width/height reserve image space; supporting images are lazy loaded. Meme Generator retains an honest source-project frame and no demo link.

## Comparison with the supplied references

| Criterion | Implemented result | Remaining difference |
|---|---|---|
| Featured hierarchy / imagery | Dedicated amber feature, 55/45 desktop split, stacked tablet/mobile | Existing ISS screenshot is a map application, not a cinematic cover; containment creates letterboxing in tall desktop frames |
| Architectural integration | UI overlays unchanged v004 wall, registered fixture and ambient colors; both navigation clearances retained | The reference's different environment is intentionally not reproduced |
| Graphic richness | Chamfered frames, layered charcoal surfaces, amber actions, project accent colors, technology pills, border/elevation feedback | Custom project covers are essential to reach the references' image quality and coordinated palette |
| Desktop navigation | Functional category rail at wide sizes; horizontal controls before two rails would crowd content | No fictional category counts, video playback, pagination or decorative view toggles |
| Supporting density | Large media, complete descriptions/tags/actions, natural card heights | Four supporting records require 3 + 1 rather than the reference's three-card page; showing real complete content makes the section longer |
| Tablet/mobile | Stacked feature, two/one support columns, native mobile category control, full-width mobile actions | Full content and the existing floor navigation mean a longer scroll than the fictional reference screen |
| Professional work | Coherent full-width case-study panel in the same system | Orthobyron's bright genuine screenshot needs a cover for closer palette coordination |

The interaction/layout milestone is implemented and ready for owner review. Full reference-level artwork fidelity remains pending the six supplied covers. Do not describe screenshot fallbacks as finished cinematic covers or claim unchanged full v002 compliance; the previously approved environmental exceptions remain in force.

## Required cover artwork

Supply one coordinated but project-specific **16:10 composition per project**, exported as **1600×1000 WebP** plus **800×500 WebP** derivative. Opaque sRGB, natural source detail, no baked headings, controls, badges or fabricated telemetry/UI. Preserve a central focal subject and allow for minor focal cropping in desktop feature/case-study frames. Keep titles and actions in HTML. The Featured badge overlays the top-left corner, so do not put essential content there. Deliver masters separately from runtime files, with dimensions, SHA-256, usage/attribution and focal-position notes. No environment export is requested.

Proposed paths under `public/projects/covers/` (not created):

| Full export | Priority / art direction | Full-file target |
|---|---|---|
| `iss-tracker-cover.webp` | Highest: orbital/Earth composition grounded in the real ISS project; no fabricated current telemetry | ≤160 KiB |
| `magic-herbs-cover.webp` | Real custom plant/character illustration vocabulary, richer intentional composition | ≤160 KiB |
| `fashion-show-cover.webp` | Actual runway/SVG visual identity and original artwork | ≤160 KiB |
| `tip-calculator-cover.webp` | Actual calculator identity; graphic composition without fake screenshot content | ≤120 KiB |
| `meme-generator-cover.webp` | Original caption/layout illustration, explicitly cover art; no implied published demo | ≤120 KiB |
| `orthobyron-cover.webp` | Professional practice identity and clean geometry grounded in the real project | ≤200 KiB |

Derivative filenames: `<project-id>-cover-800.webp`, target ≤70 KiB each. Native larger masters are welcome when genuinely available; do not upscale and claim new source detail. Asset delivery is separate from this implementation and requires visual QA against the live frames before deployment.

## Verification actually performed

| Check | Result / evidence |
|---|---|
| Node 22 type check | PASS — `node node_modules/vue-tsc/bin/vue-tsc.js --noEmit` |
| Existing test suite | PASS — `npm test`, 18/18 including deterministic lamp timing, reduced-motion/visibility cancellation and disposal cases |
| Production build | PASS — `npm run build`, 126 modules; existing large-chunk warning remains (~1,013 kB JS, ~302 kB gzip) |
| Git whitespace | PASS — `git diff --check` |
| Responsive browser layout | PASS — widths 360, 390, 621, 640, 720, 760, 761, 768, 980, 1180, 1399, 1400, 1440, 1920; actual height 1000 for this matrix. All six records present, no page horizontal overflow or sampled heading/description/tag/action clipping. Settled anchor header clearance ≥16px |
| 200% text-only proof | PASS — 390, 621, 768, 980, 1180, 1440 ×1000. Disposable fixture doubles computed font sizes without scaling geometry; no project text clipping or horizontal page overflow. This is a simulation, not a native browser preference change |
| Category controls | PASS — desktop keyboard categories produce 1/5/6 actual projects; mobile native select filters correctly; selection remains focused and result count is announced |
| Dialogs | PASS — all six open with keyboard Enter, original previews/attribution retained, Escape closes, focus returns to the originating Details button |
| Native Tab behavior | Observed Close → Demo → Source → browser focus boundary → Close. No underlying application control entered during modal traversal. Visible link/button outlines observed; native dialog behavior retained |
| Day/night and weather | PASS — Scene preview day/night × clear/rain/storm: panel/heading colors unchanged, v004 plate unchanged, spill/emission bounds identical; controls reset to live afterwards |
| Reduced motion | PASS for deterministic lamp service tests and static scoped CSS inspection. Native OS/browser reduced-motion media emulation was not run in this pass |
| Long section / continuation | Full actual-section screenshots captured at desktop/tablet/mobile. Unchanged compact continuation supports the longer document flow; no artwork or tiling adjustments made |
| Console | No error/warn entries in sampled normal and text-proof tab logs; broad runtime exception coverage unverified |
| Preservation | Pre-edit SHA-256 audit of existing src/public files found changes only in the four scoped application files listed above. All runtime imagery, lamp/environment code, shared styles, navigation, and unrelated floor source files unchanged |

No dependency installation, staging, commit, push, merge, deploy or background-artwork change. Physical-device, native text-size preference, screen-reader and native reduced-motion testing remain unverified. At doubled text size the pre-existing global top navigation uses its own horizontal scrolling; that shared navigation was preserved.

## Actual screenshot evidence

All captures come from the real rendered Vue application, not reconstructed mockups. Temporary proof controls are outside production. Normal desktop/tablet/mobile captures use 1440×1000, 768×1024 and 390×844 viewport overrides; document widths exclude the scrollbar. Full-section captures preserve the actual long-scroll compositions.

- `tmp/floor02-visual-fidelity/before-after.jpg`: same desktop viewport and settled anchor, before/after comparison. The aligned baseline is rendered from preserved pre-edit ProjectsSection/ProjectCard copies in a disposable Vue entry; only their import paths are adjusted. The untouched initial before capture is also retained.
- `tmp/floor02-visual-fidelity/responsive-comparison.jpg`: labelled desktop/tablet/mobile viewport captures.
- `tmp/floor02-visual-fidelity/after-desktop-full.jpg`
- `tmp/floor02-visual-fidelity/after-tablet-full.jpg`
- `tmp/floor02-visual-fidelity/after-mobile-full.jpg`
- `tmp/floor02-visual-fidelity/text-200-desktop.jpg`, `text-200-mobile.jpg`.
- JSON measurements: `responsive-checks.json`, `text-scale-checks.json`, `scene-checks.json`, `interaction-checks.json`, `keyboard-focus.json` in the same evidence folder.

Preview: `http://127.0.0.1:5175/#projects` while the existing local dev server remains running. The disposable text-proof page is under `/tmp/floor02-visual-fidelity/index.html#projects`; reload between cases before pressing 200% text. It is not imported by the normal application or production build.


## Agritrack mockup follow-up

Original owner PNGs copied unchanged: `public/projects/agritrack-mockup-dark.png` (2,133,676 bytes) and `agritrack-mockup-light.png` (2,200,288 bytes), both 1672×941. SHA-256 comparisons against the supplied attachments pass. They remain full-resolution originals (~4.13 MiB combined), with supporting card and second dialog image lazy loaded. Optimized responsive derivatives remain a later improvement; no image alteration or regeneration was performed.

The project preview kind now supports `mockup`; optional `additionalPreviews` supplies the second concept. `repositoryUrl` can be null and both card/dialog links are conditional, so private work does not gain an invented public repository. Empty technology lists are omitted. Other project records retain their existing links, screenshots and detail behavior. Old hard-coded Meme Generator fallback labels were replaced with actual project titles/source metadata.

PASS: type check, desktop 1440×1000 and simulated mobile 390×844, both images loaded at original dimensions and contained without cropping, no mobile dialog/page horizontal overflow, concept label and source attribution visible, no fake public links, Escape focus restoration to Agritrack Details. No sampled console errors/warnings. Build passes with the pre-existing large-chunk warning. Evidence: `tmp/floor02-agritrack/professional-work-desktop.jpg`, `details-desktop.jpg`, `details-mobile.jpg`, `checks.json`. Environment, lamp and other floor implementations remain untouched. No internal-scroll implementation, installation, commit, push or deployment.


## Approved desktop internal-scroll follow-up

The owner approved a bounded desktop project window after clarification. Only `src/sections/ProjectsSection.vue` changed for this step; a fresh src/public SHA-256 audit confirms the environment component, registered light layers, lamp service, all imagery, project records and unrelated files are unchanged from the post-Agritrack baseline.

The results pane scrolls inside a fine amber frame. Wall, lamp, heading, category rail, footer and floor navigation stay stationary during inner scrolling. Native scrolling, visible scrollbar, focusable named region and focus outline support pointer/keyboard browsing. Category changes reset the pane to its top. Dialogs remain outside the scrolling pane, retaining native modality and return focus. No wheel capture, scroll lock, body interception or animated scrolling is introduced; existing floor links remain usable.

The pane is eligible at width ≥1400px and height ≥780px, only if the measured remaining viewport height is at least 360px and the category rail fits entirely. Header, footer, padding and fixed-header clearance are measured, rather than assuming fixed text heights. Shorter/narrower windows and enlarged text that no longer fit use normal document scrolling. ResizeObserver/resize handlers are cleaned up on unmount. This changes presentation containment, not the background's camera perspective, proportional plate sizing or approved asset coordinates.

Verification:

- PASS: Node 22 type check, 18/18 existing tests, production build and scoped `git diff --check`. Existing >500kB bundle warning remains.
- PASS: 1440×1000, 1440×900 and 1920×1080 use the bounded pane. Section height is approximately one viewport (rounding within ~1px).
- PASS: 1440×780, 1440×700, 1399×900, 1180×900, 768×1024 and 390×844 fall back to document flow; no horizontal overflow or sampled project text clipping in any of these nine cases.
- PASS: actual pointer scrolling moves pane scrollTop from 0 to 1000 while document scrollY and heading position remain identical. Native Page Down changes pane scrollTop by ~489px while document/heading/plate positions remain identical after focus settles.
- PASS: Professional Work filters to two records, All Projects to six, each reset pane scrollTop to zero. Agritrack Details closes with Escape and restores its trigger inside the pane. Floor 01 navigation successfully reaches Experience.
- PASS: simulated 200% text at 1440×1000 returns to document flow with no horizontal overflow or sampled project text clipping. The disposable proof doubles computed fonts; native preference changes and physical-device tests remain unverified.
- No sampled browser console error/warn entries. No new continuous animation; existing reduced-motion handling remains intact. Native OS reduced-motion preference was not re-exercised in this step.

Evidence in `tmp/floor02-internal-scroll/`: `desktop-start.jpg`, `desktop-scrolled.jpg`, `text-200.jpg`, `responsive-checks.json`, `scroll-checks.json`, `wheel-check.json`, `interactions.json`, `text-scale-check.json`, `before-hashes.json`.

Background perspective note: the desktop artwork is a close wall composition, scaled proportionally from its 1370px source width across the section. At very wide viewports this magnifies architectural details; the current rendering is not a `cover` crop. A wider camera view would require separately approved artwork/layout work. No zoom/perspective correction was made.


## Owner-supplied Orthobyron cover

The supplied 2511×1256 PNG is copied unchanged to `public/projects/covers/orthobyron-cover.png` (3,001,164 bytes; SHA-256 equals the attachment). The Orthobyron record now uses the optional cover field with centered focal placement. This changes card imagery only; its original `/projects/orthobyron.webp` application screenshot remains in the detail dialog. No project text, link, environment or scrolling implementation changes.

PASS: desktop 1440×1000 and simulated mobile 390×844 show the supplied cover without horizontal page overflow; the detail dialog still uses its original screenshot. Type check and production build pass, with the existing large-chunk warning. Evidence: `tmp/orthobyron-cover/desktop.jpg`, `mobile.jpg`. The source PNG remains unoptimized; a smaller WebP derivative can be supplied later. No dependencies, commit, push or deployment.
