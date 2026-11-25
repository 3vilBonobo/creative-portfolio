# Floor 03 — About | v004 Alignment and Rendering

This package contains **only the Floor 03 About environment**. It does **not** contain the between-floor pipe/cable transition sections.

## Two rendering modes (choose by actual section height)

### Mode 1 — Short section
Use `wall-base-{device}.webp` as one top-centered proportional image. Avoid `cover`, nonuniform scaling or stretching. The bottom skirting/floor stays where it was composed.

### Mode 2 — Section taller than the intrinsic plate at its rendered width
Build one decorative wrapper (absolute, non-interactive, `aria-hidden=true`) containing these sublayers:

1. Underlying quiet wall extension from `wall-continuation-{device}.webp`, tiled **vertically only** at proportional native width.
2. **Top clip of the original wall base** down to the device cut line (do not show its original floor/endcap in the middle of the section).
3. `wall-endcap-{device}.webp` pinned to the actual section bottom, at matching proportional width.
4. `light-01-emission-{device}.png` positioned at top-center with exactly the same rendering rectangle as the uncut full base image.
5. `light-01-spill-{device}.png` positioned identically to the emission and full base.
6. All accessible HTML content above the decorative wrapper.

Do not repeat the entire room image, pipe cluster, electrical panels, lamp or floor. The `continuation` is a text-safe repeating **interior wall surface**, not a separate floor connection section.

## Geometry in native (export) pixels

| Property | Desktop | Mobile |
|---|---:|---:|
| Intrinsic base | 1956×804 | 848×1855 |
| Top crop ends at Y | 650 | 1607 |
| Continuation texture | 1956×1100 | 848×1536 |
| Endcap | 1956×154 | 848×248 |
| Light passes | 1956×804 | 848×1855 |
| Full-canvas light alignment | base top-center | base top-center |
| Lamp bulb approximate center | (1566,164) | (748,255) |

For an environment rendered at width `w`, scale native Y values by `w/baseWidth`. Do **not** independently center light masks or apply CSS transforms to one light pass. Keep identical `width:100%`, `height:auto`, and `top:0` alignment for base and both masks. The provided mobile lamp is near the upper-right edge, so real content overlap must be tested at portrait-tablet widths.

The original v002 safe areas are *guides*, not CSS constraints. UI reading zones remain an implementation responsibility. The wall continuation can be repeated for arbitrary height, but longer-than-typical sections should be checked for visible repetition at 200% text zoom.

## Lighting

Keep constant ambient visible regardless of fixture state. Treat emitter and spill as transparent layers whose opacity may be adjusted together. Reduced-motion means steady visible state, not forced flickering. No Three.js or other 3D engine is needed. Lighting is artistically derived and requires in-browser proof with actual HTML content.
