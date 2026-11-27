# Athens Cyberpunk — visual and UX refinement audit

27 November 2026. **Audit and isolated proposals only; production approval pending.**

Start with the [visual evidence gallery](index.html), then the [prioritized backlog](BACKLOG.md). The gallery opens offline after extracting the complete audit folder. Its live experiment link requires the local Vite server. Original-resolution images are linked from each comparison and viewport overview.

## Most important conclusions

1. **Keep the world. Improve its reading surfaces.** The studio, corridor, infrastructure and street form a distinctive place. The main competition comes from interface furniture: repeated colored headings, category labels, tags, borders, badges and navigation layers. This is a design judgment supported by the floor captures, not a measured user preference.
2. **Tablet is the largest remaining composition gap.** Phone portrait now has deliberate layouts; tablet preserves the longer exhibition. At 820×1180, About is 2,056px and Projects 5,834px. At 390×844, they are 1,417px and 1,570px. These are different disclosure states/catalogue presentations, so the numbers demonstrate browsing burden rather than equivalent-content compression.
3. **Fix the professional core before commissioning artwork.** Existing assets support the isolated experiments. At 1440px, About's experiment reduces its height from about 1,670 to 1,289px; at 820px, from 2,056 to 1,658px, without deleting its prose. Projects experiments reduce fixed empty space and button/color competition. They remain review candidates with tradeoffs.
4. **Separate real defects from taste.** Menu Escape fails while focus remains on its toggle; it succeeds after moving focus into the navigation. Telescope keyboard panning is absent. Neither finding justifies throwing away those interactions.
5. **Optimize specific loading costs.** A fresh production desktop visit fetched approximately 12.99 MB of encoded resource bodies; phone fetched 2.25 MB. Large environmental/sprite images dominate. Keep visual identity while changing when and how those assets load.

## Scope, evidence and limitations

Read AGENTS.md, current sections/components/composables, shared styles, mobile styles, data modules, artwork geometry and relevant implementation reports. Git was clean at entry. Production components, data and artwork were not edited; no dependency installation, artwork generation, staging, commit, push or deployment occurred.

The authoritative implementation is the current source and browser. The older responsive specification and first About wall/light integration describe historical work. Current mobile milestones and About corridor documents take precedence where they match source.

### Capture matrix

| Family | CSS viewports | Baseline evidence |
| --- | --- | --- |
| Desktop | 1366×768, 1440×900, 1920×1080, 2560×1440 | Full page, five floor entries, five complete floor images per size |
| Tablet | 768×1024, 1024×768, 820×1180 | Same |
| Portrait phone | 320×568, 360×800, 390×844, 430×932 | Same |
| Landscape phone | 667×375, 844×390, 932×430 | Same; existing dev phone-touch preview enabled |

Chromium on Windows, device pixel ratio 1. Browser screenshots were reviewed through all 14 five-floor overviews, plus original-size entries, complete floors and focused interaction/enlargement images. Night/rain entries cover all five floors at 1440×900, 820×1180, 390×844 and 844×390. Normal baselines use day/clear and frozen hero parallax; lamps and other animations can vary between captures.

This Chromium reports a fine pointer even with Playwright's touch context option. The documented Scene preview touch override activates actual phone-landscape components; it does not validate physical touch gestures. Before selecting it, landscape widths showed the fallback wider layout. The final baseline files supersede those intermediate captures.

Full-page images show the state after traversing all floors, including the hero introduction's normal auto-collapse. Entry images show initial section arrival. Complete-floor screenshots can contain fixed navigation at its capture position; judge overlap in viewport entries, not stitched long images. Images were not stretched to imply another viewport. Final proposal captures explicitly load/decode floor thumbnails; otherwise native lazy loading leaves unvisited cards blank in long screenshots.

The first enlargement pass was affected by scroll anchoring during reflow. **Use `screenshots/accessibility/*-text200-settled.jpg` and `metrics/text200-settled.json`**, which supersede the non-settled enlargement captures. An early telescope rotation sample read focus after an additional resize; use the focused ordinary entry/exit results in `metrics/followup.json` for focus-return conclusions. Orientation retained the image source, but exhaustive orientation focus restoration is still open.

No participant research, physical-device testing, Safari/Firefox, screen-reader speech, real pinch gestures, native text-only/browser zoom, safe-area hardware validation, exhaustive contrast certification or throttled mobile performance benchmark was performed. Audience assessments below are expert walkthroughs, not usability-study results.

## Current implementation established

| Floor | Present in source and rendered | Important constraint |
| --- | --- | --- |
| 04 | Portrait studio asset and professional actions; discovery disclosure; explicit landscape immersive entry; wide day/night studio, masks and discoveries retained | Portrait uses static artwork; landscape is not entered automatically |
| 03 | v004 desktop corridor, v003 smaller artwork profiles, separate projected portrait, phone-specific introduction/journey/principles and shared tab tree | Keep image, portrait aperture and geometry together; no independent background crop |
| 02 | 12 projects: seven creative including featured Nerve Ending, five professional; phone compact previews and show-more controls; category filter and native detail dialogs | Catalogue must remain complete; current phone initial All view shows five projects |
| 01 | Four career chapters and Community & earlier work; desktop selected detail, compact accordion, phone initially collapsed chapters | Preserve dates, employment facts, backend qualification and contribution disclosures |
| 00 | Phone uses a wide street plate above a readable terminal; phone landscape uses ultrawide plate; tablet/desktop use responsive original profiles | Older claim that portrait phone still shows the tall mobile alley is superseded by source |

`src/composables/usePhoneLayout.ts` defines phone portrait through 600px and portrait orientation. Phone landscape also depends on short viewport and coarse pointer, with a dev-only simulation. Tablet does not simply inherit the new phone compositions. Styles also contain independent 620/760/980/1100/1300/1400/1600px thresholds; their interaction matters more than any single breakpoint.

## Floor-by-floor findings

### 04 — Hero / Developer Studio

**Retain:** the lived-in studio, skyline, environmental changes, games and explicit immersive entry. Phone portrait gives professional identity and Projects/About actions their own readable space. Immersive landscape at 844×390 is visually convincing and has visible exit and entire-studio controls.

**Verified composition issue:** at tablet portrait, the contained wide scene sits between large black bands while the tall introduction drawer covers a substantial part of it. See [768×1024 hero](screenshots/768x1024-office-entry.jpg). This is a framing/intro relationship problem, not missing artwork. Test a proportionally sized scene with the introduction in document flow for tablet; keep the existing canvas and registered hotspots. Owner approval needed before altering the default composition.

**Judgment:** desktop introduction teaches the world, games, weather and return visits before work is shown. Retain essential identity and work access; make the invitation's supporting explanation an optional disclosure. Do not silently rewrite the approved copy. At 320px, even the improved portrait requires a little scrolling to the Projects action. Dev overlays worsen this locally, but are absent from the production check.

### 03 — About

**Retain:** corridor perspective and framed portrait; personal statement; keyboard tabs and meaningful personal material. The current phone presentation is substantially more intentional than the superseded long-form mobile layout.

**Verified layout cause:** at 1440px the desktop reading area remains about 48% wide and stacks biography then tabs. At 820px, introductory prose and facts occupy a narrow column beside a large portrait. The resulting short lines and stacked facts delay the deeper content. See [tablet entry](screenshots/820x1180-about-entry.jpg) and [1440 full floor](screenshots/1440x900-about-floor.jpg).

**Proposal:** retain the portrait's architecture; give the introduction a wider reading band below the initial tablet headline/portrait encounter, then place biography and tabs in a coordinated lower reading area. At 1440px, use both lower columns rather than extending one narrow column. Calm the cyan/magenta heading competition and panel frame. The experiment retains every existing prose block; it does not resolve all conceptual repetition between the introduction, Engineering mindset, Approach and career journey.

**Tradeoff:** the tablet experiment's lower columns are still narrow and its tabs wrap. It proves asset reuse and a better first reading width, not a final tablet layout. Prefer a single-column lower reading area or introduce disclosure at the smallest tablet width in the next approved prototype. Do not introduce a rigid height to hit a page-length target.

### 02 — Selected Projects

**Retain:** complete catalogue, confidentiality/illustrative-art notices, professional/creative categories, individual contributions, demo/source links and detail dialogs. Current compact phone previews and show-more controls are useful.

**Verified:** 820px Projects is approximately 5,834px tall; 768px is 5,715px. The featured image dominates the first tablet screen. Supporting desktop cards impose a 31rem content minimum plus reserved action space. At 1920px the results region instead scrolls internally: measured client height 576px against approximately 3,576px of scroll content. At 1440×900, the current conditions do not enable that window, and the full floor grows to approximately 3,781px.

**Judgment:** repeated amber Details buttons, tags, outlined cards, media labels, statuses and the technology sidebar compete with the work. The featured project is explicitly in development yet takes the strongest initial position for every audience. That is an editorial choice to confirm, not a factual error.

**Proposal:** flatter category controls, restrained card edges, inline technology metadata, natural content heights, and a compact featured tablet composition. Reuse the existing covers. The experiment preserves project actions and notices. It hides only the redundant cross-catalogue technology overview; full stacks remain in project details.

**Tradeoffs:** two-column horizontal cards can letterbox application screenshots. Some original concept-art lettering is cropped in the compact featured tablet crop; the concept-art notice remains HTML. The CSS-only experiment substitutes document flow for the desktop project window, which would increase page length at large desktop widths. Do not adopt that globally without choosing a browsing model. An approved implementation must update Vue's windowed state, focus/scroll hints and fallback logic together; the preview hides the now-inapplicable scroll hint.

### 01 — Experience

**Retain:** the actual chronology, four chapters, compact accordion, current-role cue, expandable contributions and Community. Selection persisted through the exercised clicks; focusing alone did not select another role. Entry/exit never required a résumé rewrite.

**Judgment:** the spaced uppercase section heading, serif role titles, monospaced dates, cyan company labels, amber selection and beveled detail panel feel like several interface systems. Some dates are only 10.4px on phone. This is a readability and coherence issue even where sampled contrast is adequate.

**Proposal:** use the existing condensed section-heading family with normal tracking; consistent sans-serif role titles; quieter company/date text; simple selected-state framing; inline technology lists. Increase small phone metadata. Retain the closed-on-entry phone archive behavior unless the owner chooses otherwise. The phone experiment becomes slightly taller to improve legibility.

### 00 — Contact / Street Level

**Retain:** the alley composition, architectural terminal and conspicuous contact action. On phone, the full-width readable terminal below scenery is a sensible accommodation. See [390px entry](screenshots/390x844-street-entry.jpg) and [desktop night/rain](screenshots/states/1440x900-street-night-rain.jpg).

**Judgment:** Contact can carry richer color than the reading floors. Its cyan/magenta headline, screen scanlines, bolts, signature, environmental labels and footer still compete at small scale. On desktop the contact copy is comparatively small within an enormous scene. Enlarge important terminal copy and email where the existing safe area permits; keep decoration lower contrast. Do not globally flatten the street or remove its perspective.

Phone now shows a wide street plate rather than deploying the older portrait source. Reuse that choice first. No new alley art is justified by this audit. Email/social destinations were inspected; no mail, social message or external submission was sent. The night mouse office opened, closed with Escape and restored focus in the focused check.

## Continuous journey and audience walkthrough

| Visitor | Path supported today | Friction / proposed emphasis |
| --- | --- | --- |
| Recruiter | Identity → Projects/Experience → Contact through navigation | Tablet's long catalogue and desktop intro delay evidence; keep direct work access and readable role facts |
| Senior engineer | Project details, role and contribution information, source links | Distinguish shipped work, confidential concept visuals and in-development work before deep exploration; preserve existing notices |
| Creative studio | Hero discoveries → featured interactive work → other creative projects | Strong fit; controls and excessive labels compete with the actual visual work |
| Artistic collaborator | About's interests/principles → creative projects → Contact | Related ideas are distributed across several panels; group and disclose without changing facts |
| Casual visitor | Games, cat, environment, telescope, mouse office | Discovery menu is useful on phone; keep a clear route back and optional exploration |

Main and floor navigation duplicate destinations on desktop/tablet. That can help spatial orientation, but the large right rail competes with the portrait/corridor and the tablet bottom rail consumes precious vertical space. Compare a compact floor index, preserving active-floor identity and one reliable navigation route. Phone already hides the redundant floor rail.

Five portrait rotation invitations repeat the same instruction. They are not forced-rotation blockers, but can imply that the readable portrait experience is incomplete. Test one initial invitation plus a quiet later affordance; preserve essential content and discoveries in portrait. This is an owner decision, not an automatic deletion.

Transitions preserve architectural continuity. Their combined height is approximately 357px at 390px width and 693px at 1920px width; they are not the largest contributor to page length. Refine their crop/seams only after the much larger Projects/About improvements. No obvious new mask drift was found in visual spot checks, but pixel-perfect layer registration/checksum validation was not repeated for every export.

## Proposed color, typography and spacing discipline

Use existing colors with clearer jobs; no new palette is required.

| Role | Proposed treatment |
| --- | --- |
| Primary readable content | Existing warm off-white `#f3eee4` family |
| Secondary facts/metadata | Existing pale neutral/sage family; retain contrast and usable size |
| Main action / selected state | Restrained amber; concentrate filled amber on the primary action or active control |
| Focus and navigation state | Existing cyan outline/indicator; never color alone |
| Environment | Preserve cyan, amber and magenta lights in the artwork |
| Decorative UI accents | Fewer cyan/magenta headings and glowing borders in 03–01; Contact/Hero retain more expressive treatments |
| Status | Keep explicit words such as In Development and illustrative/confidential notices; color supports the text |

Keep Barlow Condensed for prominent floor headings, Manrope for reading/role information and IBM Plex Mono for short technical metadata. The isolated Experience sans-serif titles are an option for owner review; retaining the serif with a more coherent surrounding hierarchy is also valid. No font-size reduction is proposed.

Use a small consistent spacing rhythm (8/16/24/32/48 CSS px as a starting proposal), comfortable prose widths, natural panel heights and content-based grids. Target roughly 16px body reading text on phones; classify smaller labels as supporting metadata rather than hiding necessary information there. Root-text doubling exposed awkward heading word breaks in Projects and Experience even without horizontal overflow. Let enlarged titles span a full grid row and reduce decorative level-column competition before shrinking type.

Sampled About introduction backgrounds produced minima around 8.8:1 desktop and 14.2:1 phone in the exercised day/night states. Other grid minima were contaminated by borders/descendant text and are **not verified contrast failures**. Full rendered contrast across text, weather, selection, focus and active animation states remains open. Use actual text-background pairs; W3C's [contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum) defines the relevant normal/large-text thresholds.

## Accessibility and performance results

| Check | Actual result |
| --- | --- |
| Normal-size document overflow, 14 final profiles | PASS: zero horizontal overflow recorded |
| About tabs, four representative profiles | PASS: one visible panel, selected state, Home/ArrowRight focus behavior and visible outline |
| Project categories and disclosure | PASS in exercised four profiles; phone expands both categories; catalogue retained |
| Project dialog | PASS: opens, reverse Tab remains inside, Escape closes, trigger focus restored in exercised four profiles |
| Career roles/contributions/community | PASS for exercised state changes at four profiles; no forced nested reading scroll on phone |
| Menu Escape from toggle | FAIL: remains open at 390px and simulated landscape; Escape inside navigation succeeds |
| Contact menu link / anchors | PASS in production desktop and portrait-phone navigation samples; active floor correct. Section top can sit behind header where decorative inset is intentional; this is not proof of text occlusion |
| Telescope / puzzle / chess / aquarium ordinary Escape return | PASS in focused 390px check; mouse office also passes. No full game-completion audit |
| Telescope keyboard pan | FAIL for equivalent exploration: ArrowRight leaves pan unchanged at 1.62×; drag changes it. Anomalies have duplicate names; sampled 32px buttons were outside the lens bounds at that view |
| Studio immersive entry/exit | PASS in simulated 844×390 landscape; image source retained across exercised telescope rotation |
| Text enlargement | Root-font 32px simulation at 390/1440: no document overflow; settled screenshots reveal awkward title breaks and enlarged chrome. Not native browser text-only zoom or a complete reflow certification |
| Reduced motion | Production `prefers-reduced-motion` emulation exercised; CSS/logic inspected and lamp tests pass. Exhaustive visual motion and live OS preference testing UNVERIFIED |
| Development controls | Production preview has no Scene preview toggle. Dev Scene preview/DevTools can obscure phone content; do not attribute those overlays to the published UI |
| Runtime logs | No pageerror in captured baseline/production samples. Aquarium emits existing `THREE.Clock` deprecation warning in focused use |

Target measurements identify small wordmark/inline links, but minimum-size exceptions and spacing need manual judgment. Prefer generous touch areas for standalone controls. W3C's [target-size explanation](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum) distinguishes the 24px criterion and exceptions from a more generous product target. The menu recommendation follows the [disclosure navigation example](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/), whose Escape behavior closes an open disclosure and restores the toggle focus. This audit does not certify WCAG conformance.

### Measured production resource priorities

Fresh production contexts at 1440×900 and 390×844, unthrottled localhost, initial load plus settling:

- Desktop encoded resource bodies: **12,988,124 bytes**. Day studio PNG 3,186,278; night studio PNG 2,272,327; moon PNG 2,522,920; About desktop WebP 1,692,864; cat sprites 1,293,368; mouse gait 1,174,701.
- Phone encoded resource bodies: **2,253,252 bytes**. Mouse gait 1,174,701; JavaScript 320,889 compressed bytes; current portrait plate 167,482; featured project cover 170,924.
- Build: 1,073.75kB raw main JS / 320.89kB gzip; CSS 269.88kB raw / 55.43kB gzip. Existing >500kB chunk advisory remains.
- Recorded layout-shift sums excluding recent input: approximately 0.014 desktop / 0.015 phone. Local LCP observations about 1.99s / 0.79s. These single runs are diagnostic observations, **not production field scores**.
- Two-second idle CDP task-duration samples: approximately 0.56s desktop / 0.16s phone. Different environment/effects and shared machine load prevent a controlled device comparison. No specific effect's CPU cost is established by these aggregate numbers.

Defer offscreen mouse/cat and night-only moon/plate work where appropriate; derive optimized formats from approved pixels and compare quality before replacement. Preserve instant phase transitions and preload strategy where needed. `TelescopeExperience.vue` continuously schedules its easing frame loop even when closed; gate it by open state and stop it when settled, then measure. Consider deferring optional heavy experiences from initial JavaScript, preserving interaction entrypoints and loading feedback. Do not install a performance framework or optimize every layer speculatively.

## Artwork reuse and missing requirements

All three professional-core visual proposals reuse current assets. Retain the studio plates, corridor/portrait projection, Projects registered plate/continuation/light passes, Experience architecture, street variants and transition artwork. Content must remain accessible HTML. Derived image optimizations are separate from regenerating a scene and still require visual review.

**No genuinely missing replacement artwork is demonstrated.** The first implementation tranche should require none. A future telescope asset brief is conditional on proving that the chosen views cannot support useful discoveries at an approved zoom. Inspect native detail, reachable subjects and text placement first; do not commission another random image batch.

## Recommended implementation sequence and approval boundary

1. Approve narrowly scoped interaction fixes: menu Escape, telescope keyboard equivalents/unique names and robust focus after orientation. Preserve all features.
2. Approve About's lower reading composition and Projects' tablet density direction using the comparisons. Decide between compact two-column and single-column lower About reading at tablet. Confirm the featured-project editorial priority.
3. Apply a shared but restrained color/type/spacing vocabulary to 03–01, using the existing palette and assets. Verify on the full journey, not isolated floors alone.
4. Resolve Projects' large-desktop scrolling model deliberately; do not copy the CSS-only experiment as production architecture. Keep the phone catalogue/disclosure work.
5. Refine tablet Hero framing and navigation; consolidate rotation instructions. Preserve the default studio artwork and explicit landscape entry.
6. Optimize the measured image/initial-load costs and optional animation lifecycle. Re-measure cold production loading and interaction readiness.
7. Perform physical phone/tablet, Safari, screen-reader, native zoom and slow-device/network checks before release approval.

The [backlog](BACKLOG.md) gives evidence, complexity, risks and acceptance criteria per recommendation. **Stop here for owner direction.** The isolated experiments are concrete review materials, not approved production layouts.

## Verification and reproducibility

Node 22.13.1 from the pre-existing portable runtime. **`npm test`: all 32 tests PASS** across the eight configured suites; separate `vue-tsc --noEmit` PASS; `npm run build` under Node 22 PASS. The same suites also passed an earlier direct Node invocation. Final npm output is saved in `metrics/npm-test.txt`. No dependencies or global toolchain configuration changed.

Scripts under `scripts/` use the existing bundled Playwright/sharp libraries and installed Chromium; their absolute tool paths are specific to this machine. `capture.mjs` creates the 14-profile baseline, `experiments.mjs` the interaction pass and comparisons, `diagnostics.mjs` production resources/contrast samples, `followup.mjs` focused discovery/menu tests, `text.mjs` settled enlargement captures, and `gallery.mjs` the offline evidence index. Browser contexts created by successful runs were closed. Two initial failed capture attempts are not verification evidence; corrected final captures supersede them.

Raw evidence is in `metrics/`; screenshot filenames encode viewport, floor and state. Temporary scripts intentionally change only disposable browser state/styles, including enabling lazy images for complete screenshot capture. Performance measurements use fresh unmodified production contexts instead. No screenshot-matrix result is a physical-device claim.
