# Floor 02 Selected Projects production brief

## Approved v004 local integration — 25 November 2026

The owner authorized bounded local integration of the staged v004 exports. Approved exceptions are independently generated but coordinated desktop/mobile compositions, deployment-resolution 1x sources without genuine native 2x masters, retained v004 fixture coordinates with corrected header clearance, and base/spill/emission rendering order. These supersede the corresponding v002 proposals below; this is **not full unchanged v002 compliance**. Publishing is not authorized. See [integration verification](../floor-02-v004-integration.md) for implementation, acceptance evidence and limitations.

Create an enclosed project-display wall for canonical Floor 02. Existing HTML provides project previews, terminal frames, titles, descriptions, ordinals, links and detail dialogs. Preserve that immediate project discovery. Use restrained mounting infrastructure, graphite conduit and a modest service lamp; keep the wall subordinate to the cards.

## References and tablet evidence

Supply the complete reference ZIP, especially `artwork/projects-wall-tall.webp`, `projects-wall-clean.webp`, all six viewport references and the project-detail screenshot. At 1180x820 the grid has three columns inside its navigation space. At 820x1180 it has two columns. Both orientations can share the desktop architectural master. No tablet-only generation is justified by the inspected content geometry.

At 390x844, six cards produce approximately 3868 CSS px of content. A scene designed around exactly two rows or one screen is unsuitable. Project counters 01-06 describe cards, not floors.

## Responsive geometry and lighting

Desktop export is 1370x1148, master 2740x2296, ratio 685:574. Mobile export is 768x2048, master 1536x4096, ratio 3:8. Derive portrait architecture by crop/outpaint from the same approved wall. Reserve desktop x4-90%, y14-94% for content, and central mobile x5-95% across the entire content height. Keep header/right floor navigation clear in layout.

The current background uses full-section stretching. Do not copy that behavior into the production design. The proposed integration uses a top-centered proportional plate, matching quiet wall fill below and a controlled lower transition. Attach emission and spill to the plate frame, not the variable-height section. Avoid repeating ceilings, lamps or slabs down a long mobile list.

Use constant artificial ambient, with no day/night/weather families, parallax or overscan. Proposed service-light centers are (80%,8%) desktop and (84%,5%) mobile. Keep its controllable source dark in the base, then derive emitter and wall spill. Reduced motion uses steady light. Mounting details must not require fixed card positions or counts.

## Production and acceptance

Production root is `public/environments/floor-02-projects/`. Anchor bases and their full-canvas light passes at top-center. Stack base z0, emission z1, spill z2 and HTML cards above. Portrait and desktop each have their own alignment group.

Approve a wall under temporary real-card overlays, remove overlays for production, derive portrait framing, then make registered light passes. Check one, six and twelve cards plus 200% text scaling before integration. Difficulty is low to moderate. The main risk is architecture stretching or repeating as content grows.

Acceptance requires no baked previews, titles, frames, buttons or floor digits, no fixed-row dependency, quiet description regions, aspect-correct equipment, clean lower continuation, exact light alignment and complete manifest/budget validation.

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
| `floor-02-projects.wall-base.desktop` | `floor-02-projects-wall-base-desktop.webp` | 1370x1148 webp, opaque | required, 350 KiB | edit master. Quiet wall, constant ambient, controllable fixture unlit |
| `floor-02-projects.light-01-emission.desktop` | `floor-02-projects-light-01-emission-desktop.png` | 1370x1148 png, alpha | recommended, 32 KiB | derive fixture emission. Visible practical emitter |
| `floor-02-projects.light-01-spill.desktop` | `floor-02-projects-light-01-spill-desktop.png` | 1370x1148 png, alpha | recommended, 96 KiB | derive illumination pass. Localized wall/object illumination outside text |
| `floor-02-projects.wall-base.mobile` | `floor-02-projects-wall-base-mobile.webp` | 768x2048 webp, opaque | required, 250 KiB | derive crop/outpaint. Quiet wall, constant ambient, controllable fixture unlit |
| `floor-02-projects.light-01-emission.mobile` | `floor-02-projects-light-01-emission-mobile.png` | 768x2048 png, alpha | recommended, 24 KiB | derive fixture emission. Visible practical emitter |
| `floor-02-projects.light-01-spill.mobile` | `floor-02-projects-light-01-spill-mobile.png` | 768x2048 png, alpha | recommended, 80 KiB | derive illumination pass. Localized wall/object illumination outside text |
