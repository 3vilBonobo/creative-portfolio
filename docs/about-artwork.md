# About wall artwork

Floor 03 uses the owner-supplied `floor-03-about-production-v004.zip`, integrated for local visual review on 25 November 2026. The desktop base is approved; mobile framing, practical lighting and the continuation seam remain subject to final visual acceptance. This is only About's decorative environment. Inter-floor infrastructure and the other floors are unchanged.

The original archive documents, previews and ten supplied images are preserved under `art-production/staging/floor-03-about/v004/`. Runtime copies live under `public/environments/floor-03-about/`; their manifest records exact filenames, dimensions, checksums, formats and alignment groups. No artwork was regenerated or re-encoded. Existing `public/about/about-wall*` files and their JPEG fallbacks remain available as legacy references, but the new decorative implementation does not select them.

## Rendering

`AboutSection.vue` selects desktop (1956×804) for wide layouts, including landscape phones/tablets. Phones at widths up to 760 CSS px, and portrait layouts from 761 through 1100 CSS px, select mobile (848×1855). All base/emission/spill images use the same profile, full-canvas origin, proportional width and top-center anchor. Only the active profile is requested; switching profile may retain previously fetched assets in browser cache.

A resize observer measures the absolute architectural wrapper, including changes caused by tabs, fonts, viewport size or longer copy. It is disconnected on unmount; the profile media-query listener is also removed. Content stays in normal document flow.

- When the section is no taller than its proportional plate, the full base is used and the wrapper clips excess artwork. On portrait tablet the authored floor can therefore lie below the visible short section, as specified by the handoff's short mode.
- When taller, the top base is clipped at native Y650 desktop / Y1607 mobile. The matching quiet continuation fills the middle, using proportional width and vertical repeat only. The corresponding 154px / 248px endcap stays at the actual bottom, never halfway down the biography. Base/light geometry stays independent of content height.
- Base, emission and spill remain decorative, `aria-hidden`, empty-alt and pointer-inert, with accessible HTML above. Existing contrast scrims and portrait/content styles remain. The obsolete CSS conduit and decorative pseudo-element are no longer composited over the new architecture.
- `--about-light-intensity` controls both light passes (0 off, 1 on; clamped). Default is steady on. There is no new product switch or time/weather dependency. Reduced motion keeps a steady light; the existing entrance-animation guard remains.

## Runtime inventory

The prefix for every file is `floor-03-about-`:

| Suffix | Desktop pixels | Mobile pixels | Use |
|---|---|---|---|
| `wall-base-{profile}.webp` | 1956×804 | 848×1855 | Always, active profile only |
| `light-01-emission-{profile}.png` | 1956×804 | 848×1855 | Full-canvas alpha emission |
| `light-01-spill-{profile}.png` | 1956×804 | 848×1855 | Full-canvas alpha spill |
| `wall-continuation-{profile}.webp` | 1956×1100 | 848×1536 | Conditional tall-section wall |
| `wall-endcap-{profile}.webp` | 1956×154 | 848×248 | Conditional tall-section floor edge |

All six core files meet the original ceilings. The continuation/endcap files have no original budget. Do not trim alpha, independently transform lighting, stretch the architecture or repeat the whole room.

`public/about/irene-portrait.webp` and its JPEG fallback are unchanged. The portrait, biography, tabs, keyboard behavior, navigation and numbering remain separate HTML content. No text or controls are baked into the new environment.

## Review

See `docs/art-production/floor-03-v004-verification.md` for browser evidence, tests, viewport results and outstanding acceptance issues. Screenshots are under `art-production/staging/floor-03-about/v004/browser/`. Temporary QA controls and evidence capture live under `tmp/` and are excluded from the production entry/build.
