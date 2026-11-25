# Athens Cyberpunk — Floor 03 About / responsive architectural backgrounds v003

This package is for the **new corridor design**. It supersedes the older flat wall, old floor-04 artwork and unrelated image-generation boards. Real production assets contain **no portrait, page content or floor digits**. Keep the site's existing portrait as HTML and put the real 03 on the wall with accessible HTML/SVG.

## Files
- `production/`: four responsive opaque WebP architecture plates, four matching transparent-opening portrait masks (SVG), one quiet neutral wall tile.
- `geometry.json`: exact crop rectangles and measured portrait quadrilaterals at every output size.
- `previews/`: clean background contact sheet and portrait-placement proofs (separate, not deployable backgrounds).
- `reference/`: original unchanged portrait for verification plus Codex's measured review and asset specification.
- `CODEX-HANDOFF.md`: exact scoped implementation instruction.

## Artistic direction
Approved camera and geometry: quiet dark wall left; physical lit portrait frame center-right; industrial service corridor receding on the right; weathered concrete, exposed graphite piping, amber practical lamps and distant cyan/magenta light. **No palms or foliage in either tablet or mobile crop**, as requested. The desktop full composition keeps its small far-left reference greenery; do not automatically introduce it into narrower views.

## Lighting
The supplied approved scenic source has permanently baked amber light and reflections. These assets are for a **static atmospheric page**. There is deliberately no fake lamp-off base or misregistered lighting mask. Previous v004/v005 light overlays are incompatible with this new perspective and should NOT be reused. If interactive light switching becomes required, generate a true registered unlit master and emission/spill masks as a separate scoped task.

## Long content
A proportionally rendered image cannot determine the entire section height. Use scenic image at top of the About page and allow any remaining biography/tabs to flow into a dark reading area surfaced with `production/floor-03-about-corridor-quiet-wall-tile.webp`, with a controlled gradient between them. Never repeat the entire 3D corridor or stretch the floor into a taller region. The shared tile does not claim perspective continuity; it is intentionally a subdued lower content surface. Keep the transition between floors entirely separate.

## Quality/source disclosure
The approved clean desktop plate was exported at 1920×1080 from an original AI image of approximately 1672×941 native pixels. Tablet and mobile assets are **deterministic reframes of that same approved art**, not new independently generated scenes, preserving architectural identity and precise frame geometry. Reframing/resampling cannot create new original detail. Portrait aperture masks use the refined Codex-measured candidate (not a production/browser-verified final 1-pixel inset). The actual Vue browser layout still needs visual acceptance. Crop labels and generated contact sheets must not be deployed as background layers.
