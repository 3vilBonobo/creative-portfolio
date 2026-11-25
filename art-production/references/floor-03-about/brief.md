# Floor 03 About production brief

Create an enclosed creative studio behind a separate portrait, biography and Background/Toolkit/Approach tabs. This is canonical Floor 03 in an Athens portfolio descending from 04 to 00. Use calm worn plaster/concrete, graphite conduits, one credible practical lamp and restrained cyan detail. Keep the personal photograph separate and unaltered.

## References and current layout

Supply the complete reference ZIP. Principal files are `artwork/about-wall.webp`, `about-wall-mobile.webp` and `irene-portrait.webp`. Six viewport screenshots, full-section captures and layout measurements document the implemented content.

At 1180x820 the identity/narrative appears above the tabs within the responsive two-column structure. At 820x1180 the portrait-friendly content arrangement stays readable. Landscape tablet can share the desktop wall. Portrait tablet can share mobile framing with a checked crop. No independent tablet generation is requested.

## Responsive geometry and light

Desktop export is 1956x804, working master 3912x1608, ratio 163:67. Mobile export is 848x1855, master 1696x3710. Derive mobile framing through crop/outpaint from approved architecture. Keep desktop x18-90%, y15-85% quiet. Keep mobile x12-88%, y12-94% quiet, extending the matching wall below the plate when text is taller.

Anchor the plate and light passes at top-center and preserve proportions. Future integration should use a proportional architectural plate plus quiet wall continuation, not stretch pipes to total section height. Keep header and desktop right-navigation space clear. Reserve bottom-control clearance on phone/tablet portrait. Text zoom and longer tab content must fit normal document flow.

Use constant artificial ambient. No weather or time-of-day variants, motion or overscan are required. Proposed lamp centers are (76%,14%) desktop and (81%,13%) mobile. The base has its controllable fixture dark. Derive visible emission and affected wall spill as separate, full-canvas passes. Keep maximum spill away from reading regions. Reduced motion uses steady light.

## Production and acceptance

Production root is `public/environments/floor-03-about/`. Stack base at z0, emission z1, spill z2 and accessible HTML above. Each lighting pass matches its base dimensions and alignment group.

Approve the desktop wall under real content, derive portrait framing, lock unlit geometry, then produce light-on/off proofs from the same project. Difficulty is moderate for clean light extraction. Do not generate independent lamp-on and lamp-off rooms.

Acceptance requires no portrait/UI/floor digits baked into the wall, consistent building materials, quiet text zones, a clean lower continuation, exact light registration, clean alpha and readable text at maximum illumination. Budgets and exact filenames follow in the individual inventory.

## Status and production rules

This v002 pre-production proposal requires approval of geometry and the listed owner decisions before commissioning. Required assets are the candidate core after approval. Recommended assets are additional exports from approved masters. Conditional assets are produced only when a named proof requires them. Existing artwork and functionality remain in the application until integration is separately approved.

Use cinematic, plausible industrial Athens architecture with worn plaster/concrete, graphite metal, functional equipment, restrained cyan, muted magenta and warm amber. Avoid steampunk ornament, generic purple cities, random glowing panels, copied game assets and malformed equipment. Keep portfolio text, floor digits and controls in accessible HTML/SVG.

Normalized coordinates run from top-left (0,0) to bottom-right (1,1). Preserve intrinsic proportions. Aligned variants share origin, framing and silhouettes. Export full canvases without trimming alpha. Transparent means actual alpha, never a checkerboard or black matte. SVG masks use white visible geometry on transparent surroundings. Raster light masks use lossless straight-alpha PNG. Register hard edges within one deployed pixel and inspect against light and dark diagnostic backgrounds.

Each asset row has a stable ID and exact production filename. The reference ZIP's `inventory.json` gives the individual master/export dimensions, production path, purpose, priority, method, anchor, alignment group, weather/light state, layer order, motion, overscan, budget, dependencies and acceptance criteria. Raster working masters target twice the deployed dimensions, without implying extra native detail in supplied references. SVG dimensions are viewBox coordinates. Keep masters outside deployed assets.

## ZIP contract

The supplied `<package>-reference-v002.zip` is evidence for the artwork conversation. It contains the brief, `inventory.json`, existing source artwork/masks under `artwork/`, saved captures under `screenshots/`, layout measurements, coordinate guides and a reference manifest. Screenshots describe the current implementation. Proposed coordinate guides describe future geometry and have not been implemented.

The future `<package>-production-v002.zip` contains `manifest.json`, `production/`, `reference/`, `previews/`, `alignment.md`, `production-notes.md` and `known-limitations.md`. Its manifest records asset IDs, relative paths, dimensions, format, alpha, alignment group, profile, lighting, weather, purpose, budget and checksums. Include one useful master reference per composition, not duplicate masters for each mask. Optional editable free-tool project files are welcome. Document omitted conditional assets. Deliver into `art-production/staging/<package>/v002/`, never directly into `public/`.

Use only useful approved variants. Independently regenerating the same room with different lighting is unreliable. Approve the composition, lock geometry, derive extraction/masks, derive relighting, validate registration, and then optimize exports. Keep transparency and relational geometry under visual review instead of trusting a generation prompt to enforce them.

## Individual asset inventory

| Asset ID | Exact filename | Export / format / alpha | Priority and ceiling | Derivation and purpose |
|---|---|---|---|---|
| `floor-03-about.wall-base.desktop` | `floor-03-about-wall-base-desktop.webp` | 1956x804 webp, opaque | required, 350 KiB | edit master. Quiet wall, constant ambient, controllable fixture unlit |
| `floor-03-about.light-01-emission.desktop` | `floor-03-about-light-01-emission-desktop.png` | 1956x804 png, alpha | recommended, 32 KiB | derive fixture emission. Visible practical emitter |
| `floor-03-about.light-01-spill.desktop` | `floor-03-about-light-01-spill-desktop.png` | 1956x804 png, alpha | recommended, 96 KiB | derive illumination pass. Localized wall/object illumination outside text |
| `floor-03-about.wall-base.mobile` | `floor-03-about-wall-base-mobile.webp` | 848x1855 webp, opaque | required, 250 KiB | derive crop/outpaint. Quiet wall, constant ambient, controllable fixture unlit |
| `floor-03-about.light-01-emission.mobile` | `floor-03-about-light-01-emission-mobile.png` | 848x1855 png, alpha | recommended, 24 KiB | derive fixture emission. Visible practical emitter |
| `floor-03-about.light-01-spill.mobile` | `floor-03-about-light-01-spill-mobile.png` | 848x1855 png, alpha | recommended, 80 KiB | derive illumination pass. Localized wall/object illumination outside text |
