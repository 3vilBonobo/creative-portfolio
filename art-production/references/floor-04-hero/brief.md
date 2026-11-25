# Floor 04 Hero production brief

Create the rooftop developer office and layered Athens panorama for canonical Floor 04, the top of a five-floor descent ending at 00. Preserve the developer, workstation, telescope, puzzle book, chess, aquarium, cat, monitors and clock. The current application still uses its existing whole-room composition. The square tablet and portrait mobile treatments below require owner approval before production.

## References and verified constraints

Supply the whole reference ZIP. Principal files are `artwork/athens-coder-loft-day.webp`, `athens-coder-loft-night.png`, `athens-coder-loft-mobile.webp`, the four copied hero weather masks, and the exterior/interior prototype masks. Screenshots cover six viewports, open-intro references, full sections, telescope/aquarium views and day/night/rain/golden-hour states. Layout JSON records current geometry and actual JPEG dimensions.

Desktop source geometry is 1536x1024. At 390x844, the current canvas is approximately 375x250 inside a much taller section. The current day/night mullions differ. Choose and approve one geometry before relighting. The existing portrait reference crops established objects and cannot replace the whole interaction map directly.

## Proposed responsive geometry

| Profile | Export / master / ratio | Window region | Intro, navigation and overflow |
|---|---|---|---|
| Desktop | 1536x1024 / 3072x2048 / 3:2 | x18-78%, y16-54% | Preserve the collapsible left HTML panel and compact exterior floor control; no horizontal overflow |
| Tablet portrait | 1024x1024 / 2048x2048 / 1:1 | x10-90%, y12-49% | Intro above the scene; bottom floor control; vertical scrolling permitted |
| Mobile portrait | 768x1024 / 1536x2048 / 3:4 | x6-94%, y12-43% | Intro above the scene, approximately 180-240 CSS px initially; reserve at least 72 CSS px after content for bottom navigation |

Tablet landscape shares desktop artwork. Landscape phones may use a full-width panorama with vertical scrolling rather than shrinking everything to the short viewport. At about 375 CSS px width the proposed portrait scene is approximately 500 CSS px tall. Use the current materials/perspective to derive tablet and phone compositions through cropping, compositing and selective outpainting. Do not ask for three unrelated offices.

| Feature | Existing desktop center % | Proposed tablet center % | Proposed mobile center % |
|---|---|---|---|
| Telescope | 24.3,50.8 | 20,49 | 14,48 |
| Puzzle book | 16.4,83 | 22,82 | 22,82 |
| Chess | 27,84.6 | 43,82 | 49,82 |
| Aquarium | 90.5,60.5 | 86,62 | 83,64 |
| Cat couch | 12,74 | 13,73 | 12,71 |
| Cat table | 27.6,81.5 | 43,92 | 46,93 |
| Cat rug | 64.6,90.3 | 69,90 | 76,90 |

All tablet/mobile moves above require owner approval. Target 48x48 CSS px hit areas, minimum 44x44, with approximately 8 px separation. Hit areas must not shrink with raster scale. Check all three cat destinations for collisions. Keep the monitor housings and developer in a coherent foreground cohort. Do not alter anatomy when reframing.

Supply a profile placement manifest with object centers/scales, monitor quadrilaterals, clock rectangle, window polygon, developer/screen occlusion and cat anchors. The source desktop clock plane is x450,y610,w51,h34. Its tablet/mobile planes must be derived explicitly, not assumed to use those coordinates. The live monitor overlays likewise need registered corner/occlusion geometry. Existing cat animation, audio and interaction logic remain shared application elements.

## Core depth architecture

Four exterior photographic planes are core requirements.

1. Mountains, horizon and far residential fabric combined.
2. Acropolis and its hill/recognizable landmark mass.
3. Midground Athens apartment fabric.
4. Foreground buildings/rooftops, including the nearer futuristic tower mass.

All use a common 1536x1024 geography. Each office profile positions that shared exterior through its own aperture. Do not independently generate a different city for each device. The Acropolis silhouette, scale and position are stable between lighting states. Its independent emission mask follows the landmark plane.

Back-to-front order is procedural sky, moon/clouds, horizon, landmark, midground, foreground city, exterior precipitation, glass, office shell/frame, interior foreground cohort, shared object cutouts, practical light, live screens/cat and accessible HTML. Office and foreground remain stationary. The window mask clips weather. Nearer city alpha hides distant sky/haze, while foreground alpha protects the workstation. Retain developer occlusion for the screen overlays.

Maximum desktop depth travel is 0.25% scene height for horizon, 0.35% for landmark, 0.6% for midground and 1% for near city. Halve on tablet, disable on phone and under reduced motion. Reconstruct at least 16 export pixels behind overlapping city silhouettes. Emission uses the same parent transform. Inspect travel extremes before enabling motion.

## Lighting and environmental combinations

The preferred core interior has diffuse neutral ambient with controllable practical sources dark in the base. Profile-specific source emission and surface spill add illumination. Acropolis illumination is independently controllable. Recommended city emission masks follow their own depth plane. Never add a second glow over a source already baked bright in the base.

If the neutral interior cannot serve a credible day/night pair, commission the six conditional shell/foreground night replacements. If directional golden-hour light cannot be achieved convincingly by controlled grading, commission the ten conditional golden-hour exports, four exterior planes and six interior planes. Decide from small proofs before full production. Do not independently generate lighting states.

Reuse Athens dawn/day/goldenHour/dusk/night and clear/partlyCloudy/cloudy/fog/rain/storm/snow. Clouds, rain, snow, haze, sky gradients, moon and preview controls remain procedural/shared. Combine the selected profile aperture, shared exterior lighting family and existing weather recipe for all 35 state combinations. Strong sunlight or weather should never be baked into every base.

## Production sequence and feasibility

1. Approve desktop, tablet and mobile geometry overlays and the proposed interaction moves.
2. Approve shared exterior geography and landmark placement.
3. Extract four exterior planes, reconstruct hidden edges and derive night from common geometry.
4. Assemble neutral profile shells and foreground cohorts. Extract the four shared objects, removing their originals from the cohort to avoid duplication.
5. Trace aperture and screen/developer occlusion. Derive source emission and illumination.
6. Test one practical light and landmark relighting, then decide conditional night/golden-hour families.
7. Assemble and flatten fallbacks. Validate target sizes, crops, screen geometry and cat destinations before optimization.

Difficulty is high for hair/plant extraction, hidden-city reconstruction and a believable portrait composite. These need manual masking or AI-assisted editing with visual inspection. Free compositors such as GIMP/Krita can maintain registration. Begin with one small portrait and one window extraction proof before funding the complete inventory.

## Acceptance and production location

Production root is `public/environments/floor-04-hero/`. Full-scene profile assets anchor at center. Shared objects use their local center with profile placement transforms. Exterior planes use `hero-city-v002`, object cutouts use `hero-objects-v002`, and each office profile has its own registered group.

- Owner approves profile guides and moved interactions.
- Desktop composition and interaction identities remain recognizable.
- Acropolis and other silhouettes register across lighting states.
- Four planes composite without seams, duplicate light or exposed hidden regions.
- Weather stays outside the office and screens remain behind the developer where appropriate.
- Alpha edges are clean on bright and dark backgrounds.
- Every interaction remains usable and keyboard-addressable in future integration.
- Changing clock/screen text and floor digits stay out of artwork.
- Fallbacks match approved composites and individual dimensions/budgets pass validation.

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
| `floor-04-hero.horizon-day.universal` | `floor-04-hero-horizon-day-universal.webp` | 1536x1024 webp, alpha | required, 350 KiB | derive and relight common master. Mountains, horizon and far residential fabric |
| `floor-04-hero.horizon-night.universal` | `floor-04-hero-horizon-night-universal.webp` | 1536x1024 webp, alpha | required, 350 KiB | derive and relight common master. Mountains, horizon and far residential fabric |
| `floor-04-hero.acropolis-day.universal` | `floor-04-hero-acropolis-day-universal.webp` | 1536x1024 webp, alpha | required, 350 KiB | derive and relight common master. Acropolis and hill, stable landmark mass |
| `floor-04-hero.acropolis-night.universal` | `floor-04-hero-acropolis-night-universal.webp` | 1536x1024 webp, alpha | required, 350 KiB | derive and relight common master. Acropolis and hill, stable landmark mass |
| `floor-04-hero.city-midground-day.universal` | `floor-04-hero-city-midground-day-universal.webp` | 1536x1024 webp, alpha | required, 350 KiB | derive and relight common master. Athens apartment midground |
| `floor-04-hero.city-midground-night.universal` | `floor-04-hero-city-midground-night-universal.webp` | 1536x1024 webp, alpha | required, 350 KiB | derive and relight common master. Athens apartment midground |
| `floor-04-hero.city-foreground-day.universal` | `floor-04-hero-city-foreground-day-universal.webp` | 1536x1024 webp, alpha | required, 350 KiB | derive and relight common master. Near towers, buildings and rooftops |
| `floor-04-hero.city-foreground-night.universal` | `floor-04-hero-city-foreground-night-universal.webp` | 1536x1024 webp, alpha | required, 350 KiB | derive and relight common master. Near towers, buildings and rooftops |
| `floor-04-hero.acropolis-emission.universal` | `floor-04-hero-acropolis-emission-universal.png` | 1536x1024 png, alpha | required, 96 KiB | derive from dark-source landmark. Independent Acropolis illumination |
| `floor-04-hero.shell-neutral.desktop` | `floor-04-hero-shell-neutral-desktop.webp` | 1536x1024 webp, alpha | required, 400 KiB | derive profile composite. Office shell/window frame, diffuse ambient, practical emitters dark |
| `floor-04-hero.foreground-neutral.desktop` | `floor-04-hero-foreground-neutral-desktop.webp` | 1536x1024 webp, alpha | required, 400 KiB | derive profile composite. Desk/developer/monitor cohort; remove separately placed objects |
| `floor-04-hero.window-aperture-mask.desktop` | `floor-04-hero-window-aperture-mask-desktop.svg` | 1536x1024 svg, alpha | required, 24 KiB | trace approved geometry. Weather and glass clip in profile coordinates |
| `floor-04-hero.interior-emission.desktop` | `floor-04-hero-interior-emission-desktop.png` | 1536x1024 png, alpha | required, 96 KiB | derive lighting pass. Visible practical sources, no duplicate baked light |
| `floor-04-hero.interior-spill.desktop` | `floor-04-hero-interior-spill-desktop.png` | 1536x1024 png, alpha | required, 160 KiB | derive lighting pass. Wall, furniture and object illumination |
| `floor-04-hero.fallback-day.desktop` | `floor-04-hero-fallback-day-desktop.webp` | 1536x1024 webp, opaque | recommended, 400 KiB | flatten validated composite. Complete profile fallback without HTML |
| `floor-04-hero.fallback-night.desktop` | `floor-04-hero-fallback-night-desktop.webp` | 1536x1024 webp, opaque | recommended, 400 KiB | flatten validated composite. Complete profile fallback without HTML |
| `floor-04-hero.shell-night.desktop` | `floor-04-hero-shell-night-desktop.webp` | 1536x1024 webp, alpha | conditional, 400 KiB | registered relighting after proof. Authored interior replacement only if lighting proof requires it |
| `floor-04-hero.foreground-night.desktop` | `floor-04-hero-foreground-night-desktop.webp` | 1536x1024 webp, alpha | conditional, 400 KiB | registered relighting after proof. Authored interior replacement only if lighting proof requires it |
| `floor-04-hero.shell-goldenHour.desktop` | `floor-04-hero-shell-goldenHour-desktop.webp` | 1536x1024 webp, alpha | conditional, 400 KiB | registered relighting after proof. Authored interior replacement only if lighting proof requires it |
| `floor-04-hero.foreground-goldenHour.desktop` | `floor-04-hero-foreground-goldenHour-desktop.webp` | 1536x1024 webp, alpha | conditional, 400 KiB | registered relighting after proof. Authored interior replacement only if lighting proof requires it |
| `floor-04-hero.shell-neutral.tablet` | `floor-04-hero-shell-neutral-tablet.webp` | 1024x1024 webp, alpha | required, 400 KiB | derive profile composite. Office shell/window frame, diffuse ambient, practical emitters dark |
| `floor-04-hero.foreground-neutral.tablet` | `floor-04-hero-foreground-neutral-tablet.webp` | 1024x1024 webp, alpha | required, 400 KiB | derive profile composite. Desk/developer/monitor cohort; remove separately placed objects |
| `floor-04-hero.window-aperture-mask.tablet` | `floor-04-hero-window-aperture-mask-tablet.svg` | 1024x1024 svg, alpha | required, 24 KiB | trace approved geometry. Weather and glass clip in profile coordinates |
| `floor-04-hero.interior-emission.tablet` | `floor-04-hero-interior-emission-tablet.png` | 1024x1024 png, alpha | required, 96 KiB | derive lighting pass. Visible practical sources, no duplicate baked light |
| `floor-04-hero.interior-spill.tablet` | `floor-04-hero-interior-spill-tablet.png` | 1024x1024 png, alpha | required, 160 KiB | derive lighting pass. Wall, furniture and object illumination |
| `floor-04-hero.fallback-day.tablet` | `floor-04-hero-fallback-day-tablet.webp` | 1024x1024 webp, opaque | recommended, 400 KiB | flatten validated composite. Complete profile fallback without HTML |
| `floor-04-hero.fallback-night.tablet` | `floor-04-hero-fallback-night-tablet.webp` | 1024x1024 webp, opaque | recommended, 400 KiB | flatten validated composite. Complete profile fallback without HTML |
| `floor-04-hero.shell-night.tablet` | `floor-04-hero-shell-night-tablet.webp` | 1024x1024 webp, alpha | conditional, 400 KiB | registered relighting after proof. Authored interior replacement only if lighting proof requires it |
| `floor-04-hero.foreground-night.tablet` | `floor-04-hero-foreground-night-tablet.webp` | 1024x1024 webp, alpha | conditional, 400 KiB | registered relighting after proof. Authored interior replacement only if lighting proof requires it |
| `floor-04-hero.shell-goldenHour.tablet` | `floor-04-hero-shell-goldenHour-tablet.webp` | 1024x1024 webp, alpha | conditional, 400 KiB | registered relighting after proof. Authored interior replacement only if lighting proof requires it |
| `floor-04-hero.foreground-goldenHour.tablet` | `floor-04-hero-foreground-goldenHour-tablet.webp` | 1024x1024 webp, alpha | conditional, 400 KiB | registered relighting after proof. Authored interior replacement only if lighting proof requires it |
| `floor-04-hero.shell-neutral.mobile` | `floor-04-hero-shell-neutral-mobile.webp` | 768x1024 webp, alpha | required, 400 KiB | derive profile composite. Office shell/window frame, diffuse ambient, practical emitters dark |
| `floor-04-hero.foreground-neutral.mobile` | `floor-04-hero-foreground-neutral-mobile.webp` | 768x1024 webp, alpha | required, 400 KiB | derive profile composite. Desk/developer/monitor cohort; remove separately placed objects |
| `floor-04-hero.window-aperture-mask.mobile` | `floor-04-hero-window-aperture-mask-mobile.svg` | 768x1024 svg, alpha | required, 24 KiB | trace approved geometry. Weather and glass clip in profile coordinates |
| `floor-04-hero.interior-emission.mobile` | `floor-04-hero-interior-emission-mobile.png` | 768x1024 png, alpha | required, 96 KiB | derive lighting pass. Visible practical sources, no duplicate baked light |
| `floor-04-hero.interior-spill.mobile` | `floor-04-hero-interior-spill-mobile.png` | 768x1024 png, alpha | required, 160 KiB | derive lighting pass. Wall, furniture and object illumination |
| `floor-04-hero.fallback-day.mobile` | `floor-04-hero-fallback-day-mobile.webp` | 768x1024 webp, opaque | recommended, 400 KiB | flatten validated composite. Complete profile fallback without HTML |
| `floor-04-hero.fallback-night.mobile` | `floor-04-hero-fallback-night-mobile.webp` | 768x1024 webp, opaque | recommended, 400 KiB | flatten validated composite. Complete profile fallback without HTML |
| `floor-04-hero.shell-night.mobile` | `floor-04-hero-shell-night-mobile.webp` | 768x1024 webp, alpha | conditional, 400 KiB | registered relighting after proof. Authored interior replacement only if lighting proof requires it |
| `floor-04-hero.foreground-night.mobile` | `floor-04-hero-foreground-night-mobile.webp` | 768x1024 webp, alpha | conditional, 400 KiB | registered relighting after proof. Authored interior replacement only if lighting proof requires it |
| `floor-04-hero.shell-goldenHour.mobile` | `floor-04-hero-shell-goldenHour-mobile.webp` | 768x1024 webp, alpha | conditional, 400 KiB | registered relighting after proof. Authored interior replacement only if lighting proof requires it |
| `floor-04-hero.foreground-goldenHour.mobile` | `floor-04-hero-foreground-goldenHour-mobile.webp` | 768x1024 webp, alpha | conditional, 400 KiB | registered relighting after proof. Authored interior replacement only if lighting proof requires it |
| `floor-04-hero.telescope-object.universal` | `floor-04-hero-telescope-object-universal.webp` | 320x400 webp, alpha | required, 128 KiB | mask/clean approved object. Shared telescope cutout |
| `floor-04-hero.puzzle-book-object.universal` | `floor-04-hero-puzzle-book-object-universal.webp` | 384x256 webp, alpha | required, 128 KiB | mask/clean approved object. Shared puzzle-book cutout |
| `floor-04-hero.chess-object.universal` | `floor-04-hero-chess-object-universal.webp` | 384x256 webp, alpha | required, 128 KiB | mask/clean approved object. Shared chess object cutout |
| `floor-04-hero.aquarium-object.universal` | `floor-04-hero-aquarium-object-universal.webp` | 384x320 webp, alpha | required, 128 KiB | mask/clean approved object. Shared aquarium cutout, existing interaction retained |
| `floor-04-hero.horizon-emission.universal` | `floor-04-hero-horizon-emission-universal.png` | 1536x1024 png, alpha | recommended, 96 KiB | derive dark-source emission. Windows/neon following their depth plane |
| `floor-04-hero.city-midground-emission.universal` | `floor-04-hero-city-midground-emission-universal.png` | 1536x1024 png, alpha | recommended, 96 KiB | derive dark-source emission. Windows/neon following their depth plane |
| `floor-04-hero.city-foreground-emission.universal` | `floor-04-hero-city-foreground-emission-universal.png` | 1536x1024 png, alpha | recommended, 96 KiB | derive dark-source emission. Windows/neon following their depth plane |
| `floor-04-hero.horizon-goldenHour.universal` | `floor-04-hero-horizon-goldenHour-universal.webp` | 1536x1024 webp, alpha | conditional, 350 KiB | registered directional relighting after proof. Mountains, horizon and far residential fabric with golden-hour light |
| `floor-04-hero.acropolis-goldenHour.universal` | `floor-04-hero-acropolis-goldenHour-universal.webp` | 1536x1024 webp, alpha | conditional, 350 KiB | registered directional relighting after proof. Acropolis and hill, stable landmark mass with golden-hour light |
| `floor-04-hero.city-midground-goldenHour.universal` | `floor-04-hero-city-midground-goldenHour-universal.webp` | 1536x1024 webp, alpha | conditional, 350 KiB | registered directional relighting after proof. Athens apartment midground with golden-hour light |
| `floor-04-hero.city-foreground-goldenHour.universal` | `floor-04-hero-city-foreground-goldenHour-universal.webp` | 1536x1024 webp, alpha | conditional, 350 KiB | registered directional relighting after proof. Near towers, buildings and rooftops with golden-hour light |
