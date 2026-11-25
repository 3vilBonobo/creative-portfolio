# Floor 03 About — v004 integration verification

25 November 2026. **Implemented locally; final visual acceptance pending.** The desktop base remains approved. Mobile composition, the corrected lighting and the continuation/endcap seam still need owner visual acceptance. No transitions were changed.

## Implementation

- `src/sections/AboutSection.vue`: new decorative architecture only, plus its resize/profile lifecycle. One shared profile and proportional origin drives the base, emission and spill. Short sections use the full base. Tall sections clip at native Y650 desktop / Y1607 mobile, vertically tile the quiet continuation and anchor the original endcap at the actual bottom. ResizeObserver and media-query listener are cleaned up on unmount. Initial media selection avoids first rendering a desktop URL on a portrait layout.
- `src/style.css`: About-only decorative rules; no cover/nonuniform scaling, no time-dependent wall filters, no old floating conduit/pseudo-pipe. Light intensity is a shared CSS variable, steady by default and under reduced motion. Content layout, portrait styles and tab styles were preserved.
- `public/environments/floor-03-about/`: ten byte-identical supplied assets plus runtime manifest. Original handoff paths are retained as `source_path`, with runtime-relative `path` values. Existing background/portrait files were not overwritten.
- `docs/about-artwork.md`: provenance, geometry, responsive selection, asset inventory and light control.

All five requested handoff documents were read before implementation. Source archive and original manifest are retained in `art-production/staging/floor-03-about/v004/`. Instructions in the ZIP were applied only within the user's explicit About-only authorization. No dependencies, new product controls or new artwork were added. Temporary QA HTML/config/scripts live under `tmp/` and are not used by the production entry/build.

## Asset checks

PASS: ten SHA-256 values, exact dimensions, actual formats/modes and file lengths match the manifest. Six core files meet their original ceilings. Four conditional continuation/endcap exports have no original byte ceilings. PNGs have actual transparency: emitter alpha range 0–225, desktop spill 0–35, mobile spill 0–50. Full canvases and original pixels were preserved.

The ten raster assets total 842,530 bytes (822.8 KiB). Active tall desktop files total 564,599 bytes; tall mobile files total 277,931 bytes. These are asset byte totals, not measured route transfer. Short portrait tablet does not mount the continuation/endcap. Browser cache can retain previously used profiles during responsive testing.

## Responsive checks

Tested the native application at `http://127.0.0.1:5174/#about`, then the same source app through a temporary local fixture at `http://127.0.0.1:5176/tmp/floor03-v004-qa.html#about`. The fixture supplies only test controls/data: lamp intensity, additional biography paragraphs, doubled text size, reduced-motion simulation and screenshot saving. It does not replace or reconstruct the integrated architecture.

All sizes below were confirmed through actual `innerWidth/innerHeight`. All six exercised light off and on. Base/emission/spill bounding rectangles matched to <0.02 CSS px. Tall-mode endcaps matched the decorative wrapper bottom to <0.001 CSS px (the wrapper lies inside the section's existing subpixel border). No horizontal document overflow occurred at normal text size.

| CSS viewport | Profile / mode | Section / proportional base height | Screenshot evidence |
|---|---|---:|---|
| 1920×1080 | Desktop, tall | 1025.2 / 783.0 | [Off](../../art-production/staging/floor-03-about/v004/browser/desktop-1920x1080-off.jpg), [On](../../art-production/staging/floor-03-about/v004/browser/desktop-1920x1080-on.jpg), [right-side lamp/tabs](../../art-production/staging/floor-03-about/v004/browser/desktop-1920x1080-right-on.jpg) |
| 1440×900 | Desktop, tall | 1108.3 / 585.7 | [Off](../../art-production/staging/floor-03-about/v004/browser/desktop-1440x900-off-confirmed.jpg), [On](../../art-production/staging/floor-03-about/v004/browser/desktop-1440x900-on.jpg), [right-side lamp/tabs](../../art-production/staging/floor-03-about/v004/browser/desktop-1440x900-right-on.jpg) |
| 1180×820 | Desktop, tall | 1206.4 / 478.8 | [Off](../../art-production/staging/floor-03-about/v004/browser/tablet-1180x820-off-confirmed.jpg), [On](../../art-production/staging/floor-03-about/v004/browser/tablet-1180x820-on-confirmed.jpg) |
| 820×1180 | Mobile, short | 1126.0 / 1760.5 | [Off](../../art-production/staging/floor-03-about/v004/browser/tablet-820x1180-off.jpg), [On](../../art-production/staging/floor-03-about/v004/browser/tablet-820x1180-on.jpg) |
| 390×844 | Mobile, tall | 1407.9 / 820.8 | [Off](../../art-production/staging/floor-03-about/v004/browser/mobile-390x844-off.jpg), [On](../../art-production/staging/floor-03-about/v004/browser/mobile-390x844-on.jpg), [native app after final initialization change](../../art-production/staging/floor-03-about/v004/browser/mobile-native-final.jpg) |
| 844×390 | Desktop, tall | 1128.3 / 340.7 | [Off](../../art-production/staging/floor-03-about/v004/browser/mobile-844x390-off.jpg), [On](../../art-production/staging/floor-03-about/v004/browser/mobile-844x390-on.jpg) |

These are viewport simulations, not physical-device tests. The screenshot service crops some wide/tall capture surfaces: for example the 1920 viewport screenshot is 1084×1072 and portrait tablet is 805×1020. Supplementary document-coordinate crops cover the desktop lamp/tabs and lower seam. Full-page/full-section capture failed/timed out; no screenshots have been stretched to imply a complete viewport. Earlier intermediate screenshots are retained; `*-confirmed` files supersede same-state intermediate captures where provided.

## Interaction, growth and motion

- PASS: portrait, biography, tabs and floor identity remain HTML; architecture is aria-hidden, empty-alt and pointer-inert. Normal-size text/tabs remained visually readable with light off and on. This is a visual check, not a numerical WCAG contrast certification.
- PASS: mobile ArrowRight selected Toolkit and its panel, End selected Approach, Home restored Background. Keyboard focus moved with selection and had the existing cyan outline. Accessible roles/names/selected state remained present.
- PASS: header navigation to Projects and floor-navigation return to About updated hash, scroll and active floor. Existing desktop gutter and final mobile tab clearance were preserved. Fixed navigation can pass over content while scrolling, as before.
- PASS: six additional temporary biography paragraphs grew mobile to 2312px while the base/light height remained 820.75px; endcap stayed at the bottom. Portrait tablet grew from 1126px short mode to 1873.25px tall mode, with base/light height unchanged at 1760.5px. [Tablet long-content proof](../../art-production/staging/floor-03-about/v004/browser/tablet-long-biography-bottom.jpg).
- PASS geometry / FAIL content-layout acceptance: a 200% text-size simulation grew phone to 3017px, preserving 820.75px base/light height and bottom endcap. The heading overflowed its existing portrait/headline column and was clipped; the tab area also slightly exceeded the inner width. These content-layout rules were not changed by the decorative integration. [Heading evidence](../../art-production/staging/floor-03-about/v004/browser/mobile-200percent-text-top.jpg). This doubles computed text sizes in the fixture; native browser zoom/text-only zoom remains unverified.
- PASS simulated reduced motion: the fixture forced the reduced preference before app creation and applied the application's reduced-motion declarations. Recorded fixture preference/match were true; heading opacity was 1, transform none, and both lights were steady, animation none. The browser's actual OS preference was not changed. [Simulation screenshot](../../art-production/staging/floor-03-about/v004/browser/mobile-reduced-motion-simulation.jpg).
- PASS sampled night/rain: Scene preview did not change the base filter (none) or light opacity (1). Existing portrait/header time treatment remains. Live environment settings were restored. Console error/warning samples returned no entries; uncaught exception instrumentation was not performed.

## Remaining visual issues

1. **Continuation/endcap seam remains visible**, especially across desktop's lower wall: an abrupt mottled/vertically streaked band precedes the skirting. [Direct browser detail](../../art-production/staging/floor-03-about/v004/browser/desktop-endcap-seam.jpg). The layers meet geometrically without a gap; the difference is in the supplied texture treatment. No blur, stretched strip or elaborate CSS was added to hide it. Request a better texture/endcap boundary, or obtain explicit acceptance of the current seam.
2. **Mobile and lighting require final owner approval.** Revised emission is visibly centered much better than the earlier candidate. Portrait tablet places the large fixture/halo close to the introduction; sampled copy remained readable, but the composition is still a candidate.
3. **200% text clipping needs a separate content-layout decision.** Architecture growth is correct; this report does not claim accessibility acceptance while the heading clips. Screen readers, physical devices, native OS reduced motion and numerical contrast remain unverified.

## Verification commands and preservation

Node 22.13.1: `npm test` PASS, 14/14; `node node_modules/vue-tsc/bin/vue-tsc.js --noEmit` PASS; `npm run build` PASS; `git diff --check` PASS. Build retains the existing >500kB JavaScript chunk warning. The installed npm also reported a Node-version support warning but both scripts completed successfully; no toolchain changes were made.

Before integration, checksums were captured for all existing `src/`, `public/` and `docs/` files. The only changed existing files were AboutSection.vue, style.css and docs/about-artwork.md. Other floors, transition component/assets, biography data and original artwork/portrait files remained byte-identical to that baseline. Ten runtime art hashes were rechecked after copying. The Git index was not changed; no commit, push, merge or deployment occurred.

**Acceptance decision:** the bounded decorative integration is available for review, but final acceptance is withheld pending the visible seam, mobile/lighting approval and the documented text-size accessibility issue. The implementation was not broadened to redesign content or fix another floor.
