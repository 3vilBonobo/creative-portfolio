# Inter-floor infrastructure production brief

Create four shallow architectural cross-sections connecting 04-to-03, 03-to-02, 02-to-01 and 01-to-00. These represent approximately half a metre of building infrastructure conceptually. They are not rooms, corridors or separately numbered floors.

Use modest cable bundles, conduits, small junction boxes, ventilation and concrete slab edges. Preserve a shared industrial building identity. Avoid room-sized machinery, brass gears, extensive neon and ornamental architectural noise.

## References and responsive constraints

Supply the complete reference ZIP. `artwork/service-void-pipes.png` and `service-void-cables.png` are existing tall source references. The screenshot folder shows all four actual strips at desktop 1920x1080 and 1440x900, tablet 1180x820 and 820x1180, phone 390x844 and landscape 844x390. Each clipped image includes approximately 50 CSS px of adjacent architecture above/below. `layouts.json` records the actual strip dimensions.

Current final rendered height is clamp(4.333rem,8.667vw,8.333rem), roughly 69-133 CSS px at a 16 px root. Produce four universal 2560x256 WebPs, ratio 10:1, working master 5120x512. No separate tablet or phone generation is justified initially. Use center cropping, keeping meaningful infrastructure around y28-72% and x25-75%. Application slab-edge treatment can preserve the shallow section on ultrawide screens.

These are fixed strips, not tileable textures. A future modular tiling system would need a separate proof. Do not mirror repeated machinery to manufacture variety.

## Layering, light and movement

Each opaque strip sits between adjacent floor backgrounds, with center anchor and its own transition alignment group. Use constant subdued artificial illumination. No time/weather variants, floor digits, arrows, portfolio content or interface controls. Keep pipes/equipment physically believable when reduced to 69 px high.

Stationary strips are preferred. If retained, limit movement to 2% of rendered height with at least 4% edge coverage and disable under reduced motion. The current +/-5% movement with 1.06 scale is an existing coverage risk to revisit during integration. It does not justify huge full-resolution layers now.

## Production and acceptance

Production root is `public/environments/transitions/`. The four exact filenames appear in the inventory. All are required after the one-strip proof. Budget is 180 KiB each.

Approve one strip at actual 69, 102 and 133 px heights. Establish slab thickness and material continuity, then vary rooftop power/data, studio distribution, archive conduit and ground drainage for the four pairs. Difficulty is low to moderate. Provide an adjacency preview against both neighboring floors for each pair.

Acceptance requires exactly four canonical identities, no independent floor numbers, meaningful mobile center crops, shallow architectural scale, compatible seams, no empty motion edges, no mirrored equipment and complete dimension/budget validation.

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
| `transitions.04-to-03.universal` | `transition-04-to-03-universal.webp` | 2560x256 webp, opaque | required, 180 KiB | approve one strip then derive related variations. Rooftop power/data |
| `transitions.03-to-02.universal` | `transition-03-to-02-universal.webp` | 2560x256 webp, opaque | required, 180 KiB | approve one strip then derive related variations. Studio distribution |
| `transitions.02-to-01.universal` | `transition-02-to-01-universal.webp` | 2560x256 webp, opaque | required, 180 KiB | approve one strip then derive related variations. Archive conduits |
| `transitions.01-to-00.universal` | `transition-01-to-00-universal.webp` | 2560x256 webp, opaque | required, 180 KiB | approve one strip then derive related variations. Ground feeds/drainage |
