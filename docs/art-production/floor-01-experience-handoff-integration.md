# Floor 01 Experience handoff integration

25 November 2026. Implemented locally; owner artistic acceptance pending. No commit,
push, deployment, dependency installation, or changes to career information.

Follow-up: the owner subsequently requested a reference-led UI and CV-backed career
content. See [UI and CV review](floor-01-experience-ui-cv-review.md) for the current
seven-record presentation; the four-record descriptions below document the initial
environment integration.

## Selected assets

The supplied `athens-cyberpunk-floor-01-experience-asset-handoff.zip` was extracted
under `tmp/experience-handoff-review/`. All ten file hashes, intrinsic dimensions
and RGB/RGBA modes matched its manifest. The archive's README was supporting
material; implementation authorization came from the owner's integration request.

- Desktop: `desktop-candidate-a.png`, native 1672x941. Candidate B has the same
  SHA-256 and is not separately deployed.
- Landscape tablet through 1100px: `tablet-environment.png`, native 1448x1086.
- Phones through 760px and portrait tablets through 1100px:
  `mobile-environment.png`, native 941x1672. Portrait tablets retain their existing
  two-column HTML layout while using the taller architectural plate.
- The earlier 1920x1080 OFF-looking candidate is retained in temporary source
  staging only. It lacks the new stencil and is not a registered OFF counterpart
  of the selected plate.
- All five supplied lighting overlays are rejected for runtime animation. Their
  wall, cable, pipe and fixture pixels are independently composed; fading them
  would replace architectural detail. They remain reference material.

The baked `01 FLOOR` stencil is retained. The duplicate visible HTML floor marker
was removed; its accessible floor label and four career progress indicators remain.

## Preparation and alignment

`scripts/prepare-experience-assets.py` uses the existing Pillow/numpy environment.
It takes the extracted handoff root as its sole argument. It does not generate new
artwork, infer a physical OFF state, or resample the base plates. It exports:

- Three quality-90 WebP base plates at their native dimensions.
- Three small, low-contrast mirrored wall-continuation tiles.
- Twelve cropped straight-alpha PNG attenuation passes: emitter and
  wall/pipe-spill/reflection for the wall and ceiling channels, per profile.
- A manifest recording original hashes, dimensions, crop bounds, deployment file
  sizes and hashes. The same preparation writes runtime-only alignment data to
  `src/config/experienceEnvironment.json`; runtime code does not import public files.

The localized attenuation passes are alpha-only black masks derived in each
selected base's own coordinates. Surface masks include a warm-color gate. They
contain no replacement architecture. At light intensity 1 they are invisible;
at intensity 0 their full, bounded attenuation is applied. Both passes in a
channel use `opacity: 1 - intensity`, normal compositing, and the same transform.
The spill pass includes its associated floor-reflection region. Cropping the
transparent canvases reduces decoded storage; recorded crop offsets preserve
registration. No full-screen animated blur, filter, WebGL, or extra package.

All 18 image exports total 1,165,170 bytes (about 1.11 MiB). Active profile image
totals are desktop 389,355 bytes, tablet 382,721 bytes and portrait 393,094 bytes.
Estimated RGBA pixel storage is about 8.5-9.1 MiB per profile, excluding browser
compositor buffers/caches. These are file/pixel calculations, not measured GPU
memory or a frame-time benchmark.

## Runtime behavior

`ExperienceEnvironment.vue` owns the isolated decorative environment. It scales
each plate proportionally by width, top-centered, with measured fixture/header
clearance. The same containing block positions all cropped passes. A shared fade
blends the plate into quiet wall continuation. Long/mobile/reduced-motion layouts
fade before the painted floor, so the floor cannot repeat midway down a timeline.

An IntersectionObserver starts profile-specific image loading within 600px of the
viewport. Only the current profile is mounted. Animation waits for the base and
all its passes to load. Profile changes and image failures restore steady light.

`createExperienceLamp` follows the existing Projects injectable-clock pattern but
does not modify Projects. There is at most one scheduled timeout. Random rests
last 25-75 seconds; events are shallow dips, a rare brief interruption, or an
uneven sequence with recovery. Intensities stay between .08 and 1, and each
sequence returns to 1. Ceiling intensity stays 1 in normal operation.

The component disables/cancels flicker when offscreen, hidden, reduced motion is
requested, images are unavailable, or manual development lighting is selected.
It restores stable light and cleans up timers, observers, media listeners and the
visibility listener on unmount. CSS additionally suppresses attenuation under
`prefers-reduced-motion: reduce`.

The existing dev-only Scene preview has independent wall/ceiling 100%, 50% and
minimum settings. These values attenuate baked illumination; minimum is not a
claim that the original scene has been physically reconstructed with power off.
Reset to live restores automatic scheduling and both preview values.

The Experience timeline, data, GSAP selection behavior, announcements, anchors and
transitions are retained. The only presentation adjustments are the decorative
background, removal of duplicate numbering, stronger reading shade and improved
inactive-record opacity.

## Verification

Node 22.13.1 was used (an existing local installation; no version switch/install).

- PASS: `node node_modules/vue-tsc/bin/vue-tsc.js --noEmit`.
- PASS: `npm test`, 22 tests including four new Experience lamp tests. Tests cover
  bounded timing/recovery, sparse intervals, cancellation during a dip, fresh
  restart, duplicate enable notifications and disposal.
- PASS: production `npm run build`; existing large-bundle warning remains.
- PASS: archive manifest integrity for all ten supplied images.
- PASS: browser visual inspection at 1920x1080, 1440x900, 1024x768, 768x1024 and
  390x844. These are simulated viewports, not physical-device testing.
- PASS: sampled 760px document flow and above-boundary sticky layout. The browser
  rounded requested 761px to 762px, and 1101px to 1102px; 1100px was exact.
- PASS: no horizontal document overflow in sampled views; native aspect ratios
  retained, images complete, no duplicate HTML numeral, no repeated architecture.
- PASS: first/last record content inspected; Tab focus visibly selects the next
  record, Enter activates it and updates the live announcement. Scroll selection
  changed to record 3 on descent and back to record 1 on ascent.
- PASS: manual wall minimum and half intensity synchronize both wall passes while
  leaving ceiling independent; ceiling minimum was also visually checked. No
  architectural replacement/morphing was visible at sampled intensities.
- PASS: day/clear and night/storm keep the same interior base and `filter: none`.
  Live environment/lighting settings were restored after inspection.
- PASS: navigation to Contact and four existing transition identities remain.
- PASS: sampled browser error/warning log returned no entries.
- UNVERIFIED in-browser: operating-system reduced-motion preference and its live
  change, hidden-tab suspension, complete offscreen suspension, missing-image
  recovery, enlarged text, and uncaught-exception instrumentation. Motion and
  visibility wiring were inspected; cancellation was exercised with fake clocks.
  The available browser surface does not expose motion emulation/network routing.
- UNVERIFIED: sustained frame-time/GPU-memory profiling and physical devices.

Screenshots are under `tmp/experience-handoff-review/screenshots/`, including all
five target viewports, the continuation and independent lighting settings. The QA
tab was closed and its viewport override reset.

## Limitations and artistic acceptance

This is a stable, synchronized attenuation rig over already-lit artwork. It does
not recover a true unlit material pass, moving soft shadows, or physically based
bounce light. Some warm ambient remains at minimum intensity. The conservative
mask reconstruction avoids a misleading independently generated ON/OFF morph.
Native desktop detail is 1672x941; large-screen display mildly upscales it.

Owner review should accept or revise the room composition, portrait-tablet use
of the supplied portrait plate, quiet continuation, reading shade and flicker
strength. True OFF lighting would need authored registered relighting assets.

## Files in this implementation

Created: `src/components/ExperienceEnvironment.vue`,
`src/services/experienceLamp.ts`, `src/composables/useExperienceLightPreview.ts`,
`src/config/experienceEnvironment.json`,
`scripts/prepare-experience-assets.py`, `scripts/experience-lamp.test.mjs`, this
report, and `public/environments/floor-01-experience/` (18 images plus manifest).

Modified: `src/sections/ExperienceSection.vue`, `src/components/EnvironmentPreview.vue`,
the four Experience-only rules in `src/style.css`, and the test command in
`package.json`. Existing and concurrent About/Hero work is unrelated and has not
been restored, staged or included as part of this implementation.
