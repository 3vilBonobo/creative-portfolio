# Floor 00 responsive review — 26 November 2026

Implemented the owner-approved handoff in `floor00-handoff.zip`. The handoff was treated as design/reference material; its screenshots were not deployed as artwork. No backgrounds were generated, dependencies installed, or Git staging, commits, pushes, merges or deployments performed.

## Changes and scope

- `ContactSection.vue`: shared `usePhoneLayout` modes, full-width short establishing image in portrait, the approved headline, shorter phone supporting copy, existing email/social URLs, rotation invitation using the existing studio icon, visible rooftop link, compact footer and a local wall threshold instead of the duplicated pavement photograph.
- Landscape phone: complete panoramic street plate followed by a compact, level, two-column HTML terminal. Natural document scrolling, no fixed-height contact pane or nested scroll. Rotation is optional; contact remains available in either orientation.
- Desktop: terminal width changes from 26.7% to 25% on standard desktop and from 26.2% to 25% on ultrawide. Font sizes, height, mounting material and perspective remain intact. The existing ResizeObserver recalculates the top-edge projection for the narrower panel. Tablet geometry is unchanged.
- `SiteNavigation.vue`: adds Street to the existing compact phone-menu condition. Contact-local CSS hides the floating floor bar only while the phone Street section is active. Other floors' navigation and desktop appearance are outside this change.
- `MouseEasterEgg.vue`, used only by Contact: an open dialog survives its approach lane moving offscreen during rotation. Night ending or tab hiding still closes it; Escape restores hatch focus and body overflow. One interaction tree remains mounted across orientation changes.

Unrelated working-tree changes were preserved. Other floors were also being changed independently during this work; the full repository diff therefore includes work beyond this milestone. This task edited only the three source files above and this report.

## Desktop framing diagnosis

The close camera framing is in the artwork. The runtime stage follows each selected image's intrinsic aspect ratio. The image has no transform; `object-fit: cover` does not meaningfully crop an image in its matching-ratio stage. For example, the initial runtime check showed a 1448×814 image filling a 1617×909 stage with no transform. The final ultrawide check showed artwork and image sharing exactly the same 3425×1467.59 rectangle.

The existing panorama has a different composition, not an established wider camera view with more overhead architecture. It was reused for landscape phones and retained for ultrawide desktop rather than substituted indiscriminately on ordinary desktop.

The desktop correction reduces terminal dominance and exposes more of its mounting wall. It is **not a true camera zoom-out**. No image was shrunk into letterbox voids, stretched, or substituted. A materially wider architectural view still needs approved outpainting.

### Precise optional outpainting brief

For an approximately 20% reduction in apparent architectural scale while retaining all existing image content:

1. Standard plate: expand 1448×814 to **1810×1018**. Keep the original unchanged at **x=181, y=102**; add 181px on each side and 102px above/below. Preserve perspective, vanishing point, lens character and all existing signs, cables, vegetation, textures, ENTER door and Acropolis. Continue facade, overhead infrastructure and street at the boundaries. This is a proposed framing target for owner review, not a generated asset.
2. Panorama, if the same camera-distance change is wanted: expand 1916×821 to **2396×1027**, retaining the original at **x=240, y=103**. Add 240px per side and 103px above/below.
3. Supply exactly registered day/night pairs with identical geometry, clean empty terminal mounting surfaces, no baked contact text or UI, and no invented foreground objects obscuring existing details. Keep light fixtures in identical positions.
4. After art approval, regenerate conservative sky masks from the new geometry and remap door, lamp, mouse lane and terminal anchors. For the standard proposal, old pixel coordinates map to `(x+181, y+102)`; panorama coordinates map to `(x+240, y+103)`, then normalize against the new canvas. Recheck terminal legibility before accepting the new camera distance.

No additional artwork is required for the implemented phone layouts.

## Measurements

CSS px, measured from Floor 00 entry. Baseline and final daylight measurements use the same viewport dimensions and default contact state. The vertical scrollbar reduces actual content width by 15px in this browser. All 13 requested sizes were captured before/after; the final night/rain set covers the same sizes.

| Portrait viewport | Before section height | After section height | Reduction | Email top before → after | Email bottom after |
| --- | ---: | ---: | ---: | ---: | ---: |
| 320×568 | 1378.48 | 795.20 | 42.31% | 870.16 → 393.64 | 461.22 |
| 360×800 | 1395.25 | 795.30 | 43.00% | 886.92 → 393.73 | 461.31 |
| 390×844 | 1429.16 | 815.94 | 42.91% | 940.22 → 414.38 | 481.95 |
| 430×932 | 1481.61 | 845.23 | 42.95% | 991.48 → 443.67 | 511.25 |

At 390px viewport width the establishing shot is 210.80px tall. The final night hatch adds 44px to each phone section; the terminal and art do not shift. At 320px the complete email action remains within the first viewport after anchor entry, including the 56px compact-header clearance.

Landscape section heights, daylight: 643.44px at 667×375; 719.28px at 844×390; 733.98px at 932×430. These views use natural page scrolling from the complete panoramic image into the terminal. The 932px baseline previously used a mounted tablet layout, so its percentage reduction is smaller than the other landscape sizes.

Tablet heights remain 1348.89px at 768×1024 and 870.75px at 1024×768. Desktop art-stage ratios and overall heights remain unchanged: 869.06px at 1440×900; 1138.89px at 1920×1080; 1498.67px at 2560×1440; 1535.59px at 3440×1440, including their footer.

## Asset reuse and environmental registration

All eight runtime WebPs remain unchanged. Verified dimensions: phone 941×1672, tablet 1448×1086, standard desktop 1448×814, ultrawide 1916×821, with day/night pairs. SHA-256 inventory is in `tmp/floor00-review/assets.json`.

- Portrait phones reuse standard desktop day/night artwork and its existing sky mask; no tall phone photograph or separate pavement background is requested in a fresh production portrait load.
- Landscape phones reuse ultrawide day/night artwork, its sky mask and its fixture/door coordinates.
- Tablets and desktops retain their previous source-selection rules and masks. The legacy small non-phone fallback is preserved.
- The rotation icon remains `/hero/loft-mobile-v1/rotate-phone.svg`; mouse sprites/interior, fonts and contact destinations are reused.
- Artwork, sky mask and precipitation have identical art rectangles in final phone checks. For example, landscape 844×390 produces matching 829×355.22 rectangles. Rain ends at the art boundary before the HTML terminal. Door and cyan fixture anchors are expressed relative to that same rectangle.
- Dawn/day/golden hour select day, dusk/night select night. All five phases were exercised without resizing the art stage. Existing dusk 10% and night 25% veil rules remain intact. Shared time/weather state, offscreen/hidden effect suspension, motion preferences and cleanup remain in use.
- Fresh production portrait resource inventory records one street background and its matching mask: `floor00-desktop-16x9-day.webp` and `floor00-desktop-16x9-sky-mask.svg`. Evidence: `tmp/floor00-review/production-assets.json`. Source changes during the development matrix were checked through loaded `currentSrc`, native image dimensions and masks.

## Verification

PASS:

- Development Scene Preview: day and night/rain at 320×568, 360×800, 390×844, 430×932, 667×375, 844×390, 932×430, 768×1024, 1024×768, 1440×900, 1920×1080, 2560×1440 and 3440×1440. Phone landscape used the established development touch-layout override.
- No horizontal Contact overflow or terminal-content overflow in all 26 final day/night layout checks. Phone social targets are 44px high; transformed desktop/tablet terminal targets remain at least 48px high.
- Approved headline, one email action, real email/social URLs, one portrait rotation invitation, visible rooftop action, environmental door hotspot and compact footer.
- Keyboard Enter opens the mouse office; close button receives focus; Escape closes; hatch regains visible focus and body scroll locking clears. Dialog remains open across portrait-to-landscape rotation with one mounted dialog and terminal.
- Tab from the mail action reaches X with visible focus. Rooftop action reaches `#office`. Mail and third-party social destinations were inspected, not submitted/opened.
- Production preview at port 4310: portrait layout, correct loaded artwork, no Contact overflow, no Scene Preview controls, and no recorded console errors/warnings in the fresh production session. `AppShell.vue` retains its `import.meta.env.DEV` gate.
- Node 22.13.1: final `npm test` passed **27 tests** (the independently updated repository suite), and both separate contact-screen-projection tests passed. Separate vue-tsc check, final production build and scoped `git diff --check` passed.

Limits and observed warnings:

- Physical devices, OS/browser reduced-motion emulation and 200% text enlargement are UNVERIFIED. The available browser capabilities expose viewport sizing but no reduced-motion/text-scale emulation; a zoom shortcut produced no measurable scale change. Reduced-motion and lifecycle rules were reviewed in source. These are not claimed as simulated passes.
- Other floors' desktop visuals were not exhaustively re-tested; the task's source/CSS changes are scoped to Street, except for adding Street to the existing phone-menu condition. Independent working-tree edits to other floors remain present.
- The longer development session recorded an unrelated transient Vite reload error for `ExperienceSection.vue` while independent changes were underway. The fresh production session had no recorded errors/warnings. Instrumented uncaught-exception detection was not added.
- Existing Vite large-chunk warning remains. The shell's npm 12 wrapper warns about Node 22.13.1 compatibility; the requested Node 22 runtime completed tests/typecheck/build. Production preview used the bundled npm CLI; the existing Console Ninja hook required preview outside the sandbox.
- True desktop camera zoom-out remains an artwork limitation; the outpainting brief above is pending owner direction.

## Review evidence

Directory: `tmp/floor00-review/`.

- `before-{width}x{height}.jpg`: baseline screenshots at all 13 requested sizes.
- `after-day-{width}x{height}.jpg`, `after-night-{width}x{height}.jpg`: final viewport captures.
- `landscape-terminal-844x390.jpg`: compact terminal after scrolling from the panorama, with visible keyboard focus.
- `production-390x844.jpg`: production phone view without Scene Preview.
- `before.json`, `after-day.json`, `after-night.json`: measured section heights, email positions, sources and geometry.
- `phases.json`: five-phase source-selection evidence; veil targets in this file describe the preserved CSS targets rather than settled opacity samples.

Stopped at the Floor 00 review checkpoint. No commit or deployment was made.
