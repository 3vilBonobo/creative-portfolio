# Floor 00 Contact artwork

Integrated from the owner-supplied `Athens_Cyberpunk_Floor_00_Contact_Assets.zip`.
The eight native optimized WebPs in `public/environments/floor-00-contact/`
are byte-identical to the supplied manifest checksums. PNG masters, preview
sheets and redundant 3840-wide upscales are not deployed.

## Composition and runtime

- `ContactSection.vue` owns the artwork, semantic screen, email action, social
  links and local effects. Shared navigation, transitions and other floors are
  unchanged by this integration. Its scoped styles override legacy Contact CSS.
- Picture sources: mobile up to 600px; tablet from 601–1100px; ultrawide above
  1800px with a viewport aspect ratio of at least 2:1; standard desktop otherwise.
  Source dimensions are 941×1672, 1448×1086, 1916×821 and 1448×814 respectively.
- Each stage follows its artwork ratio. At 900px and below the screen flows
  beneath the complete artwork for legibility. The mouse has a pavement strip
  cropped from the same selected artwork, below the screen.
- Global dawn/day/goldenHour select day; dusk/night select night. The image
  changes in place without resizing the stage. Only the selected picture source
  is requested; images remain lazy-loaded. No duplicate clock or weather API.
- Dusk has a 10% black veil, night 25%. Screen content sits above this layer.
- Four SVG masks reveal conservative feathered windows in the distant open sky,
  below the main cable bundles and above the Acropolis. These are deliberately
  limited sky windows, not full skyline/wire tracing. They reuse existing cloud
  motion and weather strength without painting over architecture or wires.
- The screen follows the wall's slope on wide layouts; small layouts keep text
  level. The original ENTER sign remains visible, with an HTML rooftop link.
- The mouse approach lane is mirrored, approaching from the right and entering
  beneath Contact. The foreground baseline is 94% of the wide artwork height.
- The existing cyan lamp receives a restrained dark attenuation pulse. Motion
  pauses offscreen/when hidden and stops for reduced motion. Listeners and the
  intersection observer are cleaned up on unmount.

## Verification (25 November 2026)

Browser QA on the local development server and its Scene preview:

- PASS: day/night source selection and no horizontal Contact overflow at
  360×800, 390×844, 768×1024, 1024×768, 1440×900, 1920×1080 and 2560×1080.
- PASS: night layout additionally at 3440×1440. After the veil/perspective update,
  all eight night sizes retain content within the stage and load the correct mask.
- PASS: all five time phases map correctly without changing stage height.
- PASS: email/social destinations inspected, visible keyboard focus, Enter on
  the mouse doorway, Escape to close, focus restored, scroll lock restored,
  and Enter on the environmental door link navigates to `#office`.
- PASS: fresh final browser session had no recorded console errors or warnings.
- PASS: all eight deployed WebPs match supplied SHA-256 values.
- Desktop, ultrawide and phone screenshots were captured inline during review.
- Reduced-motion rules were inspected in code; OS/browser reduced-motion
  emulation and physical-device testing were not performed. Mail delivery and
  third-party social pages were not exercised.

PASS with Node 22.13.1: all 23 logic tests, the separate vue-tsc type check,
production build and `git diff --check` for the Contact files. A production
preview on port 4310 loaded the correct night artwork, veil, screen and email
destination, with no Contact overflow or recorded console errors/warnings and
without the dev-only Scene preview controls. The local Console Ninja hook
required launching preview outside the sandbox. Temporary preview processes
and browser tabs were closed after verification. Vite's existing large-chunk
warning is outside the Floor 00 scope.

## Wall-screen revision (26 November 2026)

Owner-approved revision replaces the translucent floating panel with an opaque
recessed display, dark metal bezel, four mounting bolts, close contact shadows,
fine static scan lines and localized cyan/mint and pink illumination. No new
scene artwork, assets, dependencies or shared-floor changes are involved.

The screen now uses artwork-relative dimensions: desktop left 27.2%, top 27%,
width 25%, height 51%; ultrawide left 25.5%, top 22%, width 24.5%, height 50%;
landscape tablet left 27%, top 31%, width 28%, height 49%. A perspective transform
shortens the receding right edge. Below 901px the enclosure keeps the established
readable document flow beneath the artwork. Typography and spacing are tuned
separately for the shorter ultrawide canvas. Display children do not flex-shrink,
preventing the email row from squeezing its text. Links retain existing targets.

The new owner-approved message is “Good ideas start with a hello.”, with a
“Start a conversation” mail action and concise copy about products, interfaces
and unusual projects. Screen texture is static; hover transitions respect
reduced motion.

Browser QA on `http://127.0.0.1:5173/#street`:

- PASS: screen content fits without scroll overflow at 360×800, 390×844,
  768×1024, 1024×768, 1440×900, 1920×1080, 2560×1080 and 3440×1440.
- PASS: mounted-screen bounds stay inside the stage; no horizontal Floor 00
  overflow at those sizes. Transformed link heights remain at least 47px.
- PASS: desktop daylight and nighttime presentation; dedicated phone layout.
  Desktop, ultrawide and phone review screenshots were captured inline.
- PASS: keyboard Tab from the mail action moves to X with visible focus;
  mail address and social URLs are preserved. No mail was sent.
- PASS: no console errors or warnings recorded in the review session.
- UNVERIFIED: physical-device testing, OS reduced-motion emulation and
  instrumented uncaught-exception detection. No new continuous animation was
  added to the contact screen.

Final verification for this revision with Node 22.13.1: all 23 logic tests,
the separate vue-tsc type check, production build and scoped diff whitespace
check pass. The existing Vite large-chunk warning remains.

### Glass and wall-depth refinement

The follow-up material pass replaces the clean green rim with darker graphite,
static scratches/oxidation limited to the frame, and layered contact and cast
shadows. The rim is opaque while the display uses smoked translucent gradients,
2px backdrop blur, a cyan overhead reflection and faint pink side reflections.
Text remains independent HTML above the glass texture. Actions use lighter
surfaces and underlines instead of a row of filled green cards. These effects
are static and require no added timers, listeners, artwork or dependencies.

Revised artwork-relative bounds: desktop left 26.8%, top 26.5%, width 26.7%,
height 50.7%; ultrawide left 25%, top 21.5%, width 26.2%, height 50.7%; landscape
tablet left 27%, top 31%, width 29.2%, height 49%. The opaque bottom rim covers
the decorative label so the wall's hazard stripe cannot show through the bezel.
Small layouts use fixed rim thicknesses and retain the existing document flow.

PASS in the development browser: night layout/content fit at 360×800, 390×844,
768×1024, 1024×768, 1440×900, 1920×1080 and 2560×1080; desktop daylight visual
review; final phone and desktop screenshots; no horizontal Contact overflow;
link heights above 46px after perspective; keyboard focus; preserved link targets;
and no recorded console errors/warnings. Backdrop blur was confirmed active.
Physical devices, older browser filter fallbacks and OS reduced-motion emulation
were not exercised. Artwork, copy, mouse behavior and other floors are unchanged
by this material-only pass.

### Top-edge correction and darker neon finish

The owner accepted the bottom placement and requested a steeper upper edge
aligned to the cyan fixture/cable run. `contactScreenProjection.ts` supplies a
projective correction before the existing wall-perspective transform. It lifts
the upper-left/right corners by 10%/1.5% of panel height on desktop/tablet and
13%/2% on ultrawide, mathematically fixing both lower corners. A ResizeObserver
updates the local matrix when the enclosure changes dimensions and disconnects
on unmount. Small document-flow layouts keep `transform: none`.

Before/after browser measurements at 1024×768, 1440×900, 1920×1080 and 2560×1080
show lower-corner differences below 0.003 CSS px (computed-matrix serialization
rounding). Dedicated projection tests cover both upper targets, the fixed lower
edge and the identity fallback for unmeasurable panels.

The rim is now near-black with stronger surface wear. Display tones are darker,
cyan and magenta lettering/edge emission are more pronounced, and a low-opacity
static SVG grain adds texture. No new animation or image assets were introduced.

PASS in the browser: content and screen bounds fit at 360×800, 390×844,
768×1024, 1024×768, 1440×900, 1920×1080 and 2560×1080; no horizontal overflow;
all transformed link heights at least 48px; daylight/night visual review;
keyboard focus; no recorded console warnings/errors. Physical-device testing
and reduced-motion emulation remain unverified.

The projection tests run separately from the existing npm suite:
`node --experimental-strip-types --test scripts/contact-screen-projection.test.mjs`.
Both projection tests, all 23 existing logic tests, vue-tsc and the scoped diff
whitespace check passed with Node 22.13.1 for this correction.
