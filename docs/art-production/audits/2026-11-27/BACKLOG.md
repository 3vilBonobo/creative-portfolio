# Prioritized refinement backlog

27 November 2026. See [audit report](REPORT.md) and [visual gallery](index.html). A = low-risk refinement; B = moderate composition/interaction improvement; C = substantial creative change. **Every production item below awaits owner approval.** No C artwork commission is currently justified. Complexity is relative effort, not a delivery promise: S = focused component/style change; M = coordinated responsive/state change; L = multiple flows and substantial verification.

## 1 — Reliable phone menu Escape

- **Priority/class/complexity:** P1 · A · S. All phone floors, portrait and short landscape.
- **Problem/evidence:** menu stays expanded when Escape is pressed immediately after opening; it closes when focus is first moved into the nav. `metrics/followup.json`, Menu Escape focus boundary. See [menu capture](screenshots/states/390x844-menu.jpg).
- **Cause:** Escape handler lives on nav; opening keeps focus on sibling toggle in `src/components/SiteNavigation.vue`.
- **Change/benefit:** handle Escape across the header/disclosure boundary, retaining navigation semantics; predictable dismissal.
- **Reuse:** entire existing menu and styles. **Risks:** interfering with an open modal's Escape handler or closing unrelated content.
- **Acceptance:** Enter/Space open; Escape from toggle and every link closes and restores toggle focus; click/tap destinations and orientation still work; no modal-close double handling. **Approval:** implementation scope only; no visual redesign required.

## 2 — Telescope equivalent controls and discoverable subjects

- **Priority/class/complexity:** P1 · B · M. Phone/desktop telescope; orientation edges.
- **Problem/evidence:** focused 390px test: ArrowRight does not change pan at 1.62×; drag does. Four anomaly buttons share one name and lie beyond the lens in the sampled view. [Lens](screenshots/states/390x844-telescope.jpg), `metrics/followup.json`; source `src/components/TelescopeExperience.vue`.
- **Cause:** pointer pan implementation without keyboard equivalent; generic clue names; discovery points depend on pan/zoom.
- **Change/benefit:** keyboard/button pan and reset, unique meaningful clue names, focus-visible reveal/recentering, clearer first-use instruction. Keep city/sky, random views, artwork, zoom and messages.
- **Reuse:** all current telescope images and handlers. **Risks:** spoiling discovery, changing zoom anchoring, scroll conflicts, focus after rotation. The ordinary Escape return passes; orientation focus still needs a dedicated test.
- **Acceptance:** every discovery can be reached and inspected without pointer gestures; no clipped focused control; pan limits work at min/max zoom; drag/pinch unchanged; exit and orientation return focus reliably. **Approval:** agree control design and discovery cues before implementation; new artwork only if a separate native-detail proof fails.

## 3 — About reading composition

- **Priority/class/complexity:** P1 · B · M. 1101–1599px desktop and 768/820px portrait tablet first; preserve phone work.
- **Problem/evidence:** long single-column lower desktop; narrow tablet prose/facts. [1440 comparison](overview/1440x900-about-comparison.jpg), [tablet comparison](overview/820x1180-about-comparison.jpg), `metrics/proposal-*.json`.
- **Cause:** 48% desktop reading width plus stacking below 1600px; tablet identity constrained to 34–40%.
- **Change/benefit:** wider tablet prose below the opening portrait/headline; coordinated lower reading zones; calm tabs/frame. Preserve every factual paragraph. Prototype: desktop ~1670→1289px; tablet ~2056→1658px.
- **Reuse:** current corridor variants, portrait, aperture, geometry, quiet tile. **Risks:** copy overlapping portrait; tab wrapping; texture-to-reading-deck seam; tab-dependent height; text enlargement.
- **Acceptance:** portrait and mask stay registered; comfortably readable prose; all tabs and facts reachable; no forced heights/internal scroll; compare single-column tablet lower deck against the demonstrated two columns. **Approval:** owner selects lower-deck composition and hierarchy. Prototype CSS is evidence, not ready to copy wholesale.

## 4 — Projects tablet density and fixed card space

- **Priority/class/complexity:** P1 · B · M. 768–1024px tablets, 1366/1440px desktops; phone retained.
- **Problem/evidence:** 820px floor ~5834px; featured artwork delays catalogue; supporting card content reserves 31rem plus action space. [Tablet proposal](overview/820x1180-projects-comparison.jpg), [desktop proposal](overview/1440x900-projects-comparison.jpg), `src/components/ProjectCard.vue`.
- **Change/benefit:** compact tablet feature; content-sized card bodies; quieter edges and inline metadata; keep useful preview scale. In the experiment tablet Projects is ~4596px; desktop ~3258px. Preserve all 12 projects, notices and links.
- **Reuse:** existing covers/previews, category data and dialogs. **Risks:** letterboxed application screenshots, cropped baked concept lettering, long-title imbalance, loss of current equal-card rhythm.
- **Acceptance:** complete catalogue in every category; HTML visual-source/confidentiality notices stay legible; role/contributions reachable; no tiny card text; two-column and compact-row candidates judged at native tablet sizes; no forced image stretching. **Approval:** choose preferred tablet catalogue/card presentation and acceptable cover crop.

## 5 — Explicit Projects desktop scrolling model

- **Priority/class/complexity:** P2 · B · M. Large desktop, keyboard, enlarged text.
- **Problem/evidence:** 1920px results client height ~576px vs ~3576px content; 1440px falls back to a ~3781px section. `metrics/summary.json`; [1920 entry](screenshots/1920x1080-projects-entry.jpg).
- **Cause:** viewport/available-height/category-rail gate in `ProjectsSection.vue`.
- **Change/benefit:** choose a deliberate bounded exhibition or document-flow catalogue, with consistent affordances/fallback. The isolated document-flow experiment is an alternative, not a universal improvement; it lengthens large-desktop pages.
- **Reuse:** current catalogue/cards and region semantics. **Risks:** wheel/touchpad scroll handoff, hidden results, stale scroll hints, focus after filter, mobile regression.
- **Acceptance:** keyboard reaches every project and can leave the region; active-floor navigation remains correct; enlarged text chooses a readable fallback; filtering and dialog return preserve location. **Approval:** owner chooses model; update Vue behavior and hints together, not CSS alone.

## 6 — Consistent middle-floor color/type hierarchy

- **Priority/class/complexity:** P2 · A/B · M. Floors 03–01, all profiles.
- **Problem/evidence:** simultaneous cyan/magenta/amber labels, tags, badges and panels; Experience adds serif roles to condensed and monospaced headings. [Experience comparison](overview/1440x900-experience-comparison.jpg); all original overviews.
- **Change/benefit:** off-white reading hierarchy, neutral metadata, restrained amber selection/action, cyan focus. Prototype removes repeated pill/tag emphasis and simplifies framing. Increase necessary phone metadata rather than shrinking text.
- **Reuse:** existing fonts, palette and assets. **Risks:** selected state too quiet, loss of personal typographic character, ambiguous inline tag grouping, worse contrast over artwork.
- **Acceptance:** active state identifiable without color alone; focus obvious; important labels readable; sampled contrast verified on actual text backgrounds in day/night; owner approves serif retention or sans-serif role option. **Approval:** approve visual direction before token/style consolidation.

## 7 — Measured resource loading and animation lifecycle

- **Priority/class/complexity:** P1 · B · M/L. Initial desktop/phone load, offscreen interactions.
- **Problem/evidence:** desktop ~12.99MB encoded resources, phone ~2.25MB; mouse sprite ~1.17MB on initial phone visit; both large studio plates and moon fetched on initial desktop visit. `metrics/production-diagnostics.json`. Closed telescope continually schedules animation frames in source.
- **Change/benefit:** defer unnecessary offscreen/night resources; optimize derivatives from approved source pixels; lazy-load optional heavy experience code; gate telescope loop to open/moving state. Measure each change independently.
- **Reuse:** exact artwork masters, current handlers and async UI states. **Risks:** phase-switch flashes, delayed discovery opening, texture decode stalls, alpha/registration damage, offline failures.
- **Acceptance:** cold initial bytes lower with image quality/alignment retained; no duplicate phase downloads without reason; visible loading/failure states; keyboard entry works before/after load; frame work stops closed/offscreen. Re-test under throttled network/CPU and on hardware. **Approval:** scope and image-quality acceptance; dependency installation not required.

## 8 — Tablet Hero framing

- **Priority/class/complexity:** P2 · B · M. 768×1024, 820×1180 and 1024×768.
- **Problem/evidence:** large black containment bands and tall intro over the scene. [768 hero](screenshots/768x1024-office-entry.jpg).
- **Change/benefit:** prototype content-driven scene proportions and a separate intro reading flow using the same artwork/canvas; preserve optional discoveries. No crop of the developer/hotspots without a shared transform.
- **Reuse:** wide studio, masks, hotspot maps and mobile action fallbacks. **Risks:** hiding targets, changing default hero composition, excessive hero length, registration drift.
- **Acceptance:** artwork remains coherent and proportionate; work action/identity readily accessible; discoveries reachable by touch/keyboard; tablet orientations tested. **Approval:** explicit composition approval required before production changes; no replacement artwork recommended.

## 9 — Navigation, rotation invitations and connective rhythm

- **Priority/class/complexity:** P2 · A/B · M. Whole journey; tablet and portrait phone.
- **Problem/evidence:** duplicate destination systems on desktop/tablet; five portrait rotation invitations; conspicuous floor rail. [820 overview](overview/820x1180.jpg), [phone full page](screenshots/390x844-full.jpg).
- **Change/benefit:** compare a compact floor index and one orientation invitation with quieter later access. Preserve active-floor identity, portrait essentials and explicit immersive entry. Keep transitions initially; their ~357px phone total is a smaller issue than the catalogue.
- **Reuse:** current navigation, rotation icon and transitions. **Risks:** less discoverability, losing building identity or repeated visitors' access, anchor overlap.
- **Acceptance:** every floor reachable with keyboard/tap; portrait completes all professional tasks; no automatic rotation/fullscreen; expanded menus don't obscure essential actions; direct anchors verified. **Approval:** owner selects navigation/invitation treatment; no silent removal.

## 10 — Enlarged-text composition

- **Priority/class/complexity:** P2 · A/B · M. 390px and narrow tablet, then desktop.
- **Problem/evidence:** 32px root-text simulation preserves zero document overflow but fractures Selected Projects and Experience midword and increases header competition. `screenshots/accessibility/*-text200-settled.jpg`, `metrics/text200-settled.json`.
- **Change/benefit:** let titles span the header grid, move decorative level labels to a supporting row, make header clearance responsive to its actual dimensions.
- **Reuse:** existing content/fonts. **Risks:** fixed-header jump, extra vertical space, changed anchors.
- **Acceptance:** native 200% text and browser zoom checked on actual browsers, with ordinary words wrapping naturally and all actions visible/reachable; no clipping or hidden disclosure content. **Approval:** coordinated layout change required; root-font simulation alone is insufficient acceptance.

## 11 — Contact terminal readability

- **Priority/class/complexity:** P3 · A · S/M. Desktop/tablet terminal and phone decoration.
- **Problem/evidence:** terminal copy/links small relative to the cinematic street; screen ornament competes. [Desktop night](screenshots/states/1440x900-street-night-rain.jpg), [phone](screenshots/390x844-street-entry.jpg).
- **Change/benefit:** larger main contact copy/action within the current terminal safe area; quieter supporting ornament. Keep alley/perspective and phone reading surface.
- **Reuse:** all current street variants/masks and semantic contact links. **Risks:** text exceeds projected display, terminal no longer feels architectural, focus outline clipped.
- **Acceptance:** contact immediately identifiable; email/social actions comfortably usable; day/night/rain, enlarged text and mask alignment verified. **Approval:** visual refinement approval; no contact text/destination changes proposed.

## Implementation gates

Approve a bounded first tranche: menu/telescope interaction fixes, About lower reading direction, tablet card density and middle-floor hierarchy. Use the existing build, type check and logic suite; add focused logic coverage only for state/geometry changes where it adds value. Verify real-app desktop/tablet/phone entries, expanded states, both scroll directions, orientation, keyboard, focus, reduced motion and loading failure after each floor. Physical-device/native zoom checks remain a release gate. Commit/push/deploy require separate explicit authorization.
