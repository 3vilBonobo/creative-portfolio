# Floor 03 About — artwork assessment

25 November 2026. Recommendation: **needs another artwork revision before production integration**. Preserve the artistically approved desktop base. Correct lighting and resolve wall continuation; retain mobile as an approval candidate.

## Scope and evidence

Read AGENTS.md, current About component, accumulated About CSS, environment styles, reference brief/inventory, and candidate manifest/review notes. The supplied reference ZIP is byte-identical to the repository ZIP. All six candidate SHA-256 values match their manifest. Package instructions were treated as reference requirements, not execution authorization.

No tracked application files, production assets, content, dependencies, Git index, or other floors were changed. Existing working-tree modifications were preserved. New assessment files exist only in this temporary directory and `../floor03-assessment-inspect.py`. Build refreshed ignored `dist/` outputs. Candidate assets were extracted here, outside `public/`.

An isolated HTML entry imports the existing `/src/main.ts`, mounts the actual Vue app, and replaces only About's decorative architecture in that temporary document. Original, candidate-cover, and candidate-proportional modes are available, with lamp off/on and synthetic tall-section controls. The preview's plain lower fill intentionally exposes the unresolved continuation; it is not a finished integration or a wall-extension proposal. It suppresses the old HTML decorative conduit in candidate mode to avoid an unrelated floating accent. Existing content, portrait, navigation, tabs, and entrance animation remain.

## Asset validation

| File suffix (prefix `floor-03-about-`) | Actual format / pixels | Actual KiB / ceiling | Result |
|---|---|---:|---|
| wall-base-desktop.webp | WebP RGB, 1956×804 | 211.9 / 350 | Technical PASS; composition approved by owner |
| wall-base-mobile.webp | WebP RGB, 848×1855 | 89.3 / 250 | Technical PASS; visual approval pending |
| light-01-emission-desktop.png | PNG RGBA, 1956×804 | 12.8 / 32 | Technical PASS; visual FAIL |
| light-01-spill-desktop.png | PNG RGBA, 1956×804 | 46.0 / 96 | Technical PASS; realism needs revision |
| light-01-emission-mobile.png | PNG RGBA, 848×1855 | 13.0 / 24 | Technical PASS; visual refinement needed |
| light-01-spill-mobile.png | PNG RGBA, 848×1855 | 35.8 / 80 | Technical PASS; realism needs revision |

All PNGs have genuine varying alpha with fully transparent surroundings: emission alpha 0–247, spill 0–72. They are full-canvas, not trimmed cutouts. No baked portrait, portfolio text, floor numbers, or controls were observed. The mobile electrical warning marking is environmental artwork. Alpha presence is verified; that alone does not certify perfect edge extraction. Diagnostic normal-alpha composites and lamp crops were inspected.

## Artwork corrections

1. **Emitter placement.** Desktop emission peaks at (1545,145), 79.0%,18.0% of the source. It visibly glows left of the glass, near the underside of the shade, leaving the central glass dark. Mobile peaks at (733,243), 86.4%,13.1%; its spot is closer but still left-biased. Rebuild each emission from its own fixture glass, respecting cage/hood occlusion. Approximate visual correction is about 20 pixels right and 10 down on desktop, and 8–10 right and several down on mobile; these are starting estimates, not calibrated transforms. Trace and validate against the actual fixture before export. Do not translate whole room layers to fix a local emission defect.
2. **Spill.** Both passes read as broad soft amber washes rather than surface-aware practical illumination. Desktop nonzero alpha spans x760–1955, y0–691; mobile x279–847, y0–952. Spill reaches the top canvas edge (maximum alpha 16 desktop, 12 mobile) above the hood, without convincing fixture occlusion. Shape illumination below the shade, retain wall detail, and provide credible local falloff and contact shadows. On portrait tablet, the large mobile lamp/halo also reaches the heading/introduction area; validate that crop with actual HTML.
3. **Continuation.** Both bases include skirting/floor geometry. Simply fading their bottom edge into a flat fill makes a floor end midway through the scrolling content. Supply or approve a matching wall-only continuation region with a documented seam; consider separately compositing the existing lower architectural trim at section end if composition approval permits it. Do not stretch or repeat the whole room. Do not alter the approved desktop composition without owner direction.

## Desktop/mobile differences

Materials and dark industrial character are coordinated. The mobile is a different reconstruction, with changed peeling plaster, cable routing and electrical cabinet position/design, and without desktop's cyan cabinet indicator. This is not rejected for failing pixel-preserving derivation: the owner explicitly allows a candidate reconstruction. It still needs visual approval.

Approved desktop geometry takes precedence over the older proposed 76%,14% lamp guide. Current fixture placement and mobile cropping need their own documented anchors; do not force approved artwork back onto the old diagram. The original runtime selects desktop above 760px, including portrait tablet. The assessment tests mobile artwork on 761–1100px portrait viewports as a proposal, not an implemented project breakpoint.

## Browser findings

Test URL: `http://127.0.0.1:5174/tmp/floor03-assessment-20261125/review.html#about`. Node 22.13.1 Vite dev server. Initial sandbox-hosted page timed out; an authorized server outside the sandbox was reachable. These are browser viewport simulations, not physical devices. Browser screenshot output sometimes cropped wide captures, so right-side content was inspected with separate document-coordinate crops and DOM measurements. Screenshots were examined in the session; no browser image files are stored in this folder. The saved JPEG diagnostics are direct asset composites, not browser captures.

| CSS viewport | Proposed profile | Section height / plate height, CSS px | Findings |
|---|---|---:|---|
| 1920×1080 | Desktop | 1025 / 783 | Portrait/copy/tabs readable; right navigation clear; lower discontinuity |
| 1440×900 | Desktop | 1108 / 586 | Readable with existing panels; floor edge crosses content before plain fill |
| 1180×820 | Desktop | 1206 / 479 | Narrative above tabs; most lower content requires continuation |
| 820×1180 | Mobile candidate | 1126 / 1761 | Lower plate clipped proportionally; lamp/halo approaches intro; crop needs approval |
| 390×844 | Mobile candidate | 1408 / 821 | Readable portrait and biography; plate ends just before tab region; continuation essential |
| 844×390 | Desktop | 1128 / 341 | Vertical scrolling required; lamp remains visible proportionally; plain fill dominates later content |

Lamp off/on exercised at all six sizes. No horizontal document overflow observed. Desktop navigation cleared content; mobile tab region cleared bottom floor controls at the section end. Fixed bottom controls naturally overlay passing content during scrolling, as in the baseline; the assessment toolbar itself also overlays content and must not be mistaken for a production defect.

PASS: Background→Toolkit via ArrowRight; Approach via End; Background via Home; selected tab and visible panel updated; keyboard focus received the existing cyan outline. Header navigation to Projects and back updated hash, scroll position and active floor. Synthetic section expansion to 2200px left the phone plate exactly 820.75px tall, with its layers aligned. This proves height independence, not arbitrary long-copy or 200% text-zoom acceptance. Current cover rendering was compared: it preserves proportions but enlarges/crops architecture with section height, hiding the lamp on landscape phone. Neither cover nor `100% 100%` stretching is the target architecture.

Visual readability passed in sampled states, but numerical WCAG text contrast was not measured. Scene preview night/rain confirmed no animation or time filter on candidate plate images; the current portrait and navigation still retain their existing night treatment. Live environment settings were restored. Console error/warning sample returned no entries; this is not uncaught-exception instrumentation.

## Minimal integration plan — approval required

1. Validate corrected derivatives in staging. Preserve original files and paths for rollback.
2. Modify `src/sections/AboutSection.vue` only in its decorative architecture block: introduce one shared plate wrapper; responsive base picture, emission picture, and spill picture; all aria-hidden, empty alt, pointer-events none. Stack base→emission→spill→existing accessible content. Keep all content and tab logic intact. Use consistent responsive source selection for every pass.
3. Modify scoped About rules in `src/style.css`: top-center plate at intrinsic aspect ratio; identical layer dimensions and origin; independent growing wall continuation; section overflow clipping; constant interior light; steady light under reduced motion. Explicitly supersede obsolete About background time filters and reconcile decorative conduit/pseudo-elements so old decoration does not float over new architecture. Preserve existing portrait styling and content layout. Avoid changing AppShell, weather providers, other floors, or adding Three.js/dependencies.
4. Only after approval, add the six validated files under `public/environments/floor-03-about/` and update `docs/about-artwork.md` with provenance, selection rules, continuation and alignment. A continuation export, if required, needs its own approved inventory row and budget. No new JPG fallback is assumed; retain existing files and choose fallback behavior explicitly.
5. Recheck six sizes, every tab, keyboard/focus, direct anchors and both scroll directions, image failures, night/day, maximum light, actual expanded content, 200% text scaling, OS reduced motion and real phone/tablet. Require no clipping, no horizontal overflow, no navigation-obscured final content, stable architecture with growth, and corrected source alignment within one deployed pixel. Measure contrast and loading cost after integration.

## Project verification

Node 22.13.1: configured logic suite PASS (14/14); `vue-tsc --noEmit` PASS; Vite build PASS (124 modules). Build retains the existing >500kB chunk warning. No dependencies installed. These checks validate the existing application baseline; the temporary HTML preview is not part of the production build.

Unverified: physical devices, screen readers, OS reduced-motion runtime preference, 200% text zoom, numerical contrast, final continuation, production asset loading/fallbacks, and final registered lighting. A production handoff should also extend the review manifest with stable asset IDs, alignment groups, anchors, layer order, alpha conventions, checks and limitations.

Decision: keep the approved desktop base; request targeted lighting corrections and a continuation solution; approve/refine mobile and portrait-tablet framing in the isolated preview; then authorize the bounded About-only integration.
