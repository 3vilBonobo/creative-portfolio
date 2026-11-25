# Floor 01 Experience production brief

Create the enclosed professional-history environment for canonical Floor 01. Preserve left-side service infrastructure, the career timeline and readable selected-record content. Use plausible conduit and small service panels, avoiding theatrical machinery and busy wall detail behind text.

## References and verified behavior

Supply the complete reference ZIP and `artwork/experience-wall-clean.png`. Six viewport captures include first/last-record references and full sections. Desktop full-section images include the sticky scroll runway; use the selected-record views to judge content composition.

At 1180x820 the sticky timeline/detail structure has navigation clearance. At 820x1180 its two reading columns are bounded inside the scene after a focused width correction. A shared wide architectural composition with controlled cropping is sufficient for those observed tablet layouts. No tablet-only generation is requested.

At <=760 px the archive becomes normal document flow. Career counters and four record-progress indicators remain separate from the five-floor building navigation. Never bake career dates or timeline graphics into the wall.

## Responsive geometry and lighting

Desktop export is 1935x812, working master 3870x1624. Mobile export is 768x2048, master 1536x4096, ratio 3:8. Preserve desktop x31-90%, y12-88% as a reading zone, emphasizing structure around x0-25%. Mobile needs quiet x10-95% across its long timeline.

Use a top-centered proportional architectural plate and matching wall continuation for taller content. No stretched pipes or repeated room boundaries. Keep top navigation and the right desktop gutter clear. Reserve bottom-control clearance in portrait layouts.

Constant artificial ambient needs no time/weather variants, parallax or overscan. A restrained new service light is proposed at (13%,30%) desktop and (90%,8%) mobile. These are proposed fixture positions, not measurements of an existing lamp. The base has the controllable fixture off, with emission and wall spill derived in the same project. Keep spill outside text regions and steady under reduced motion.

## Production and acceptance

Production root is `public/environments/floor-01-experience/`. Each full-canvas light pass uses the matching base dimensions, top-center anchor and alignment group. Stack base z0, emission z1, spill z2 and HTML above.

Approve a wall against every career selection, derive mobile framing, lock geometry, and make a light proof before the full lighting set. Difficulty is moderate. Risks are pipes competing with the timeline, cover crops losing intended structure and mobile text extending beyond a painted room.

Acceptance requires readable first/last selections, no baked dates/counters/floor digits, clean mobile continuation, quiet reading areas, exact registered lighting, correct dimensions and no distorted equipment. Verify longer text and increased text size during integration.

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
| `floor-01-experience.wall-base.desktop` | `floor-01-experience-wall-base-desktop.webp` | 1935x812 webp, opaque | required, 350 KiB | edit master. Quiet wall, constant ambient, controllable fixture unlit |
| `floor-01-experience.light-01-emission.desktop` | `floor-01-experience-light-01-emission-desktop.png` | 1935x812 png, alpha | recommended, 32 KiB | derive fixture emission. Visible practical emitter |
| `floor-01-experience.light-01-spill.desktop` | `floor-01-experience-light-01-spill-desktop.png` | 1935x812 png, alpha | recommended, 96 KiB | derive illumination pass. Localized wall/object illumination outside text |
| `floor-01-experience.wall-base.mobile` | `floor-01-experience-wall-base-mobile.webp` | 768x2048 webp, opaque | required, 250 KiB | derive crop/outpaint. Quiet wall, constant ambient, controllable fixture unlit |
| `floor-01-experience.light-01-emission.mobile` | `floor-01-experience-light-01-emission-mobile.png` | 768x2048 png, alpha | recommended, 24 KiB | derive fixture emission. Visible practical emitter |
| `floor-01-experience.light-01-spill.mobile` | `floor-01-experience-light-01-spill-mobile.png` | 768x2048 png, alpha | recommended, 80 KiB | derive illumination pass. Localized wall/object illumination outside text |
