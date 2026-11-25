# Floor 00 Contact and entrance production brief

Create the ground-floor entrance and Athens back alley for a portfolio descending from rooftop 04 to ground 00. Preserve the contact display, location rail, entrance action, pavement, hanging wires, plants and night mouse. Floor 00 is valid. Its number, contact information and actions remain accessible HTML.

## References and evidence

Supply the complete reference ZIP with `artwork/alley-day-extended.webp`, `alley-night-extended.webp`, `alley-sky.svg` and `alley-exterior.svg`. Six viewport screenshots, full sections, day/night/rain/golden-hour states and the preserved mouse-office view document the current implementation.

Current wide geometry is 1746x901. Below 900 px, the application crops a wide upper scene and places a contact content block below it. That existing crop remains an interim option. The portrait composition below requires owner approval before production or integration.

## Proposed responsive geometry

| Profile | Export / master / ratio | Composition and HTML safe areas |
|---|---|---|
| Desktop and tablet landscape | 1746x901 / 3492x1802 / 1746:901 | Preserve left alley. Contact x43.25%, y19%, w14.2%; rail x61.7%, y15.5%, w6%; door x76.4%, y23%, w14.4%, h34% |
| Phone and tablet portrait | 768x1344 / 1536x2688 / 4:7 | Proposed alley/sky x5-38%, y2-28%; display x6%, y34%, w62%, h45%; door x72%, y25%, w24%, h57%; pavement/mouse baseline y92% |

The portrait display, door and mouse positions are proposed moves requiring approval. Tablet portrait shares the same portrait master at larger scale. At approximately 805 CSS px width its natural height is about 1409 px, so scrolling is deliberate. No third independent tablet generation is requested. Phone landscape can use the wide stage with vertical scrolling.

Keep social/control targets at least 44 CSS px, targeting 48. Let HTML display height grow if text zoom or contact copy exceeds the initial rectangle. Reserve bottom-navigation clearance. Keep the physical display and door surfaces blank. Preserve a coherent pavement baseline and hatch position for the mouse. Do not bake Contact, Enter, social icons or 00 into the scene.

Use plausible Athens facades, exposed functional electrical systems, restrained local neon and a modest distant future skyline. Derive portrait by controlled architectural compositing/outpainting from the same building references. Derive night from a registered geometry, never an independently generated entrance.

## Layers and environment

Use base alley, sky replacement through the skyline/wire mask, procedural distant haze, optional pavement wetness, practical emission/spill, street precipitation and accessible HTML. Full canvases anchor at center and share profile coordinates. The entire street is exterior, so rain may pass in front of facades and paving. Limit strong fog to distant space, preserving display readability.

Wide and portrait share the existing Athens environmental provider. Use dawn/day/goldenHour/dusk/night with clear/partlyCloudy/cloudy/fog/rain/storm/snow. Combine the chosen profile base/mask and existing procedural recipe; do not generate a background per weather/time combination. No snow accumulation is requested.

The neutral-day base is dry. Night has authored ambient/practical illumination with the same geometry. A fixed baked lamp may remain fixed. To make a source controllable, remove its emitter/spill from the base before adding separate emission/illumination. Never double a baked glow. Wetness masks affect paving, not mirrored interface text on walls.

Required and recommended assets are stationary. Conditional wide background/foreground extraction is a later depth proof. It replaces the corresponding complete wide base, with background movement <=0.2% scene height and 12 export pixels of reconstructed overlap. Disable motion under reduced motion and on portrait devices. No additional portrait depth family is requested initially.

## Sequence, feasibility and acceptance

Approve wide geometry and the portrait sketch, neutralize contradictory baked sunset direction, derive registered night, trace sky masks around wires, then produce a wetness and practical-light proof. Only then attempt depth extraction. Difficulty is moderate to high for registered relighting and portrait composition. Hanging wires, plants and reflective paving need careful manual or assisted masking. Hidden-background reconstruction remains experimental.

Production root is `public/environments/floor-00-contact/`. Sky masks and wetness/light passes match the selected profile dimensions. Base is z0, sky replacement z1 through the mask, wetness z3, emission z4, spill z5, precipitation above scenery and HTML above effects.

Acceptance requires one recognizable entrance across lighting states, preserved wire silhouettes, correct HTML display/door placement, usable Floor 00 navigation, readable contact copy, preserved mouse baseline/hatch, clean alpha and realistic pavement wetness. Portrait phone/tablet should feel intentional without squeezing the wide alley into a tiny image. Conditional depth layers must composite without gaps.

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
| `floor-00-contact.alley-day.desktop` | `floor-00-contact-alley-day-desktop.webp` | 1746x901 webp, opaque | required, 500 KiB | edit common geometry and relight. Dry alley/entrance, blank display and door signs |
| `floor-00-contact.alley-night.desktop` | `floor-00-contact-alley-night-desktop.webp` | 1746x901 webp, opaque | required, 500 KiB | edit common geometry and relight. Dry alley/entrance, blank display and door signs |
| `floor-00-contact.sky-visible-mask.desktop` | `floor-00-contact-sky-visible-mask-desktop.svg` | 1746x901 svg, alpha | required, 24 KiB | trace skyline/wires. Sky replacement preserving hanging wires |
| `floor-00-contact.pavement-wetness-mask.desktop` | `floor-00-contact-pavement-wetness-mask-desktop.png` | 1746x901 png, alpha | recommended, 96 KiB | derive mask/illumination. Rain wetness limited to paving |
| `floor-00-contact.practical-emission.desktop` | `floor-00-contact-practical-emission-desktop.png` | 1746x901 png, alpha | recommended, 96 KiB | derive mask/illumination. Door/window/sign emitter |
| `floor-00-contact.practical-spill.desktop` | `floor-00-contact-practical-spill-desktop.png` | 1746x901 png, alpha | recommended, 160 KiB | derive mask/illumination. Light spill on wall and pavement |
| `floor-00-contact.alley-day.mobile` | `floor-00-contact-alley-day-mobile.webp` | 768x1344 webp, opaque | required, 400 KiB | edit common geometry and relight. Dry alley/entrance, blank display and door signs |
| `floor-00-contact.alley-night.mobile` | `floor-00-contact-alley-night-mobile.webp` | 768x1344 webp, opaque | required, 400 KiB | edit common geometry and relight. Dry alley/entrance, blank display and door signs |
| `floor-00-contact.sky-visible-mask.mobile` | `floor-00-contact-sky-visible-mask-mobile.svg` | 768x1344 svg, alpha | required, 24 KiB | trace skyline/wires. Sky replacement preserving hanging wires |
| `floor-00-contact.pavement-wetness-mask.mobile` | `floor-00-contact-pavement-wetness-mask-mobile.png` | 768x1344 png, alpha | recommended, 96 KiB | derive mask/illumination. Rain wetness limited to paving |
| `floor-00-contact.practical-emission.mobile` | `floor-00-contact-practical-emission-mobile.png` | 768x1344 png, alpha | recommended, 96 KiB | derive mask/illumination. Door/window/sign emitter |
| `floor-00-contact.practical-spill.mobile` | `floor-00-contact-practical-spill-mobile.png` | 768x1344 png, alpha | recommended, 160 KiB | derive mask/illumination. Light spill on wall and pavement |
| `floor-00-contact.background-day.desktop` | `floor-00-contact-background-day-desktop.webp` | 1746x901 webp, alpha | conditional, 350 KiB | extract/reconstruct after depth proof. Alternative wide-profile depth representation |
| `floor-00-contact.background-night.desktop` | `floor-00-contact-background-night-desktop.webp` | 1746x901 webp, alpha | conditional, 350 KiB | extract/reconstruct after depth proof. Alternative wide-profile depth representation |
| `floor-00-contact.foreground-day.desktop` | `floor-00-contact-foreground-day-desktop.webp` | 1746x901 webp, alpha | conditional, 350 KiB | extract/reconstruct after depth proof. Alternative wide-profile depth representation |
| `floor-00-contact.foreground-night.desktop` | `floor-00-contact-foreground-night-desktop.webp` | 1746x901 webp, alpha | conditional, 350 KiB | extract/reconstruct after depth proof. Alternative wide-profile depth representation |
