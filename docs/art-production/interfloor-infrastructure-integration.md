# Inter-floor infrastructure integration

25 November 2026. Local integration, uncommitted and undeployed.

The owner approved the audited connector scope, then requested removal of the
hero's gray threshold, real concrete above and below each utility cavity, and
concrete at least twice as thick as the first textured version. Those directions
take precedence over the older production brief. The supplied ZIP's README,
handoff and manifest were reference material, not independent authorization.

## Audit and implementation

The repository was clean at the initial audit. Canonical numbering already ran
04 Hero, 03 About, 02 Projects, 01 Experience, 00 Contact, with four connectors.
The old component alternated two PNGs (4,602,856 bytes), a decorative readout and
GSAP +/-5% vertical parallax. Its final CSS already reduced the strips to 69–133px.
Saved repository captures showed repeated artwork and obstructive mobile labels.

Browser access initially returned no browsers. It became available during
implementation. The deployment was subsequently inspected at 1440x900 and
390x844, including navigation through all five floors, all four connector images,
full-page captures and overflow measurements. It still uses the two original
alternating PNGs and the gray hero threshold. Live captures are under
`tmp/interfloor-audit-20261125/screenshots/live-*`.

The existing component, metadata and application sequence are reused. Four WebP
plates replace the alternating artwork. Both original PNGs remain untouched.
The decorative readout and connector parallax are removed. Local CSS opacity
attenuation affects selected baked illumination without adding a second light
source. Image and light mask share a 2160x216 center-cropped coordinate space.
No new dependency, Three.js system, timer, listener or animation frame is added.
Reduced motion disables the light animation through CSS.

The owner-identified gray band was `.hero-threshold`, a separate 68px overlay
inside OfficeHero. Its markup and obsolete styling are removed; the existing
artwork is revealed and meets the connector's upper concrete slab. The scroll
cue now sits near the real boundary. Hero scene geometry and interactions are
otherwise unchanged by this work.

## Assets and proportions

All runtime additions are under `public/environments/transitions/`.
All seven references were reviewed in the contact sheet; the five preferred
designs supplied the direction. REF_04 informed the heavier utility treatment;
the two archived oversized studies are not runtime assets.

| Pair | Source | Source crop (x,y,w,h) | Runtime bytes |
|---|---|---|---:|
| 04-to-03 | REF_01 shallow baseline | 186,270,1800,180 | 40,168 |
| 03-to-02 | REF_02 complex distribution | 6,282,2160,216 | 79,878 |
| 02-to-01 | REF_05 dense cooling and wiring | 6,300,2160,216 | 82,810 |
| 01-to-00 | REF_03 low light | 6,282,2160,216 | 46,324 |

Each plate exports to 2160x216 without distorting its aspect ratio. The first
crop is proportionally enlarged by 1.2; this does not add native source detail.
Native-width exports avoid the older proposal's unnecessary 2560px upscale.
All four remain below the proposed 180KiB-per-plate ceiling.

Shared `concrete-upper.webp` (24,948 bytes) and `concrete-lower.webp` (16,114 bytes)
are actual REF_01 concrete crops at (6,176,2160,84) and (6,462,2160,84).
The six new images total 290,242 bytes, about 283.4KiB. The rendered concrete
bands are twice the first textured version's height. Increasing the outer strip
height preserves the utility cavity's height. Outer shading follows each pair's
adjacent floor colors, with contact shadows facing the cavity.

| CSS viewport | Full connector height | Concrete per edge |
|---|---:|---:|
| 2560x1440 | 173.325px | 40px |
| 1920x1080 | 173.325px | 40px |
| 1440x900 | 160.8px | 36px |
| 820x1180 | 91.5625px | 20.5px |
| 390x844 | 89.325px | 20px |

Source extraction, optimization recipe, hashes, full-page screenshots and
measurements remain under `tmp/interfloor-audit-20261125/`. The preparation
script uses the existing bundled Sharp library; nothing was installed.

## Verification

- PASS: final `npm run build` using installed Node 22.13.1 and npm 10.9.2.
- PASS: separate `node node_modules/vue-tsc/bin/vue-tsc.js --noEmit`.
- PASS: `npm run preview` on isolated localhost port 53173; browser smoke check
  at 1440x900 found four loaded connector images, 36px concrete edges, no gray
  hero threshold, no horizontal overflow and no sampled console warnings/errors.
  The default preview port reached a different local app and was not used as
  evidence. Sandboxed server runs timed out on a local development extension;
  approved server retries outside the sandbox were reachable.
- PASS: `npm test`, 23 tests; includes distinct connector artwork, WebP signatures,
  per-plate budgets, registered light anchors and existing floor navigation cases.
- PASS: `git diff --check`.
- PASS: all four images loaded at all five viewports above, with exactly four
  connectors and no horizontal document overflow. Measured neighboring element
  gaps were below 0.001px, consistent with floating-point layout rounding.
- PASS: complete desktop Page Down descent and mobile Page Down descent passed
  through office/about/projects/experience/street with no observed overflow.
- PASS: About ArrowRight tab selection, visible focus, Background restoration;
  project dialog open, Escape close and focus return; Experience role selection
  and restoration. These are targeted regression checks, not exhaustive testing
  of the telescope, aquarium, mouse, chess or daily book.
- PASS: dev-only Scene preview exercised day/clear and night/rain. Live values
  were restored; temporary viewport overrides and QA tabs were cleaned up.
- PASS: decorative connectors have empty image alternatives, `aria-hidden` and
  no focusable controls. CSSOM inspection confirms the reduced-motion override.
- UNVERIFIED: OS/emulated reduced-motion activation, physical devices, screen
  readers, formal CLS instrumentation and prolonged performance profiling.

Full-page screenshots were cropped into `all-seams-1440.jpg`,
`all-seams-820.jpg`, `all-seams-390.jpg` and corresponding wide-desktop sheets.
These are real browser captures with approximately 65px of neighboring floors;
the earlier `crop-studies.png` is an offline study, not browser evidence.
Some full-page captures include fixed navigation or keyboard focus overlays.

The existing build warning about a JavaScript chunk above 500kB remains.
A development console error occurred while ContactSection was temporarily
incomplete during concurrent work; the page recovered after that file was saved.
No Vite error overlay remained in final development checks. Uncaught-exception
instrumentation was not installed.

Concurrent About documentation, Contact implementation/assets and their temporary
captures appeared during this task. They were preserved and are not authored by
this connector change. Source changes owned here are FloorTransition.vue,
config/floors.ts, the narrow OfficeHero threshold removal, connector/threshold
rules in style.css, the floor-navigation test and this report. No Git staging,
commit, push, deployment, dependency installation or existing-asset deletion was
performed.
