## Status and production rules

This v002 pre-production proposal requires approval of geometry and the listed owner decisions before commissioning. Required assets are the candidate core after approval. Recommended assets are additional exports from approved masters. Conditional assets are produced only when a named proof requires them. Existing artwork and functionality remain in the application until integration is separately approved.

Use cinematic, plausible industrial Athens architecture with worn plaster/concrete, graphite metal, functional equipment, restrained cyan, muted magenta and warm amber. Avoid steampunk ornament, generic purple cities, random glowing panels, copied game assets and malformed equipment. Keep portfolio text, floor digits and controls in accessible HTML/SVG.

Normalized coordinates run from top-left (0,0) to bottom-right (1,1). Preserve intrinsic proportions. Aligned variants share origin, framing and silhouettes. Export full canvases without trimming alpha. Transparent means actual alpha, never a checkerboard or black matte. SVG masks use white visible geometry on transparent surroundings. Raster light masks use lossless straight-alpha PNG. Register hard edges within one deployed pixel and inspect against light and dark diagnostic backgrounds.

Each asset row has a stable ID and exact production filename. The reference ZIP's `inventory.json` gives the individual master/export dimensions, production path, purpose, priority, method, anchor, alignment group, weather/light state, layer order, motion, overscan, budget, dependencies and acceptance criteria. Raster working masters target twice the deployed dimensions, without implying extra native detail in supplied references. SVG dimensions are viewBox coordinates. Keep masters outside deployed assets.

## ZIP contract

The supplied `<package>-reference-v002.zip` is evidence for the artwork conversation. It contains the brief, `inventory.json`, existing source artwork/masks under `artwork/`, saved captures under `screenshots/`, layout measurements, coordinate guides and a reference manifest. Screenshots describe the current implementation. Proposed coordinate guides describe future geometry and have not been implemented.

The future `<package>-production-v002.zip` contains `manifest.json`, `production/`, `reference/`, `previews/`, `alignment.md`, `production-notes.md` and `known-limitations.md`. Its manifest records asset IDs, relative paths, dimensions, format, alpha, alignment group, profile, lighting, weather, purpose, budget and checksums. Include one useful master reference per composition, not duplicate masters for each mask. Optional editable free-tool project files are welcome. Document omitted conditional assets. Deliver into `art-production/staging/<package>/v002/`, never directly into `public/`.

Use only useful approved variants. Independently regenerating the same room with different lighting is unreliable. Approve the composition, lock geometry, derive extraction/masks, derive relighting, validate registration, and then optimize exports. Keep transparency and relational geometry under visual review instead of trusting a generation prompt to enforce them.
