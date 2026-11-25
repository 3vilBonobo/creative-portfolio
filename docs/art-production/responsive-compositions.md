# Responsive environment proposals

Revision v002. All future geometry below requires owner approval. Current screenshots and layout JSON files in `art-production/references/` are evidence of the implemented application after structural corrections. Diagrams are coordinate guides, not replacement artwork or runtime prototypes.

## Evidence and coordinate conventions

The six requested CSS viewports were inspected at 1920x1080, 1440x900, 1180x820, 820x1180, 390x844 and 844x390. The browser screenshot service returns content JPEG dimensions that can differ from CSS viewport dimensions. Each `layout-*.json` records both. Do not stretch a screenshot to match its filename.

Normalized positions use the scene's top-left as (0,0), its bottom-right as (1,1). Viewport, scene, local object and background-source coordinates are distinct. A responsive profile must transform artwork, masks, light passes and hotspots together. Physical-device and OS reduced-motion testing remain unverified.

## Hero profiles

| Field | Desktop panoramic | Tablet intermediate | Mobile portrait |
|---|---|---|---|
| Proposed scene/export | 1536x1024, 3:2 | 1024x1024, 1:1 | 768x1024, 3:4 |
| Working master | 3072x2048 | 2048x2048 | 1536x2048 |
| Proposed selection | Wide layouts and tablet landscape | 761-1100 px portrait/intermediate aspect | Portrait layouts at <=760 px |
| Window rectangle | x18-78%, y16-54% | x10-90%, y12-49% | x6-94%, y12-43% |
| Exterior | Full approved panorama | Shared panorama fitted to aperture, landmark retained | Shared panorama fitted to aperture, landmark retained |
| Office shell | Existing geometry preserved | Derived crop/composite and selective outpainting | Approved portrait composite derived from existing materials and geometry |
| Foreground | Established desk/developer cohort | Cohort refit, no anatomical regeneration | Cohort refit, no anatomical regeneration |
| Intro | Existing collapsible HTML treatment, quiet left region | HTML block above scene, optionally collapsible | HTML block above scene, approximately 180-240 CSS px initially |
| Navigation | Existing desktop position, compact over exterior | Bottom navigation with reserved end clearance | Bottom navigation with at least 72 CSS px end clearance |
| Depth motion | Far 0.25%, landmark 0.35%, middle 0.6%, foreground city 1% of scene height maximum | Half desktop travel | Stationary depth planes initially |
| Overflow | No horizontal overflow | Vertical document flow permitted | Vertical document flow permitted, no panoramic letterbox requirement |
| Reduced motion | Static depth and steady practical light | Same | Same |

At 390 CSS px width, a 3:4 scene is approximately 375x500 CSS px after the scrollbar. The current 3:2 scene is approximately 375x250 inside a roughly 965 px section. The proposed portrait family changes that experience deliberately and has not been activated in source.

Landscape phones should retain a full-width panoramic scene with vertical scrolling instead of shrinking every object to fit the short viewport height. Keep scene controls at least 44x44 CSS px, targeting 48x48, independent of artwork scale. Allow a compact HTML action rail as a separately approved accessibility supplement if visual object targets cannot remain distinct.

### Interaction proposals

Each pair below is the hotspot/object center in scene percentages. Desktop coordinates preserve the existing source anchors. Tablet/mobile values are proposed moves requiring owner approval.

| Interaction | Desktop | Tablet | Mobile |
|---|---|---|---|
| Telescope | 24.3,50.8 | 20,49 | 14,48 |
| Puzzle book | 16.4,83.0 | 22,82 | 22,82 |
| Chess | 27.0,84.6 | 43,82 | 49,82 |
| Aquarium | 90.5,60.5 | 86,62 | 83,64 |
| Cat, couch | 12.0,74.0 | 13,73 | 12,71 |
| Cat, table | 27.6,81.5 | 43,92 | 46,93 |
| Cat, rug | 64.6,90.3 | 69,90 | 76,90 |

Give each active target a 48 CSS px square where practical, with a minimum 44 px hit area and approximately 8 px separation. Validate all cat destinations against other targets. The mobile scene needs at least 360 CSS px width or an alternative action list for narrower windows. Preserve each interaction's accessible name, keyboard activation, dialog behavior and focus return.

Keep monitor housings and the developer in the same cohort. Reproject existing HTML/SVG monitor overlays and the clock through profile-specific corner/occlusion maps. Do not merely reuse desktop foreignObject coordinates in the portrait profile. Supply a placement manifest with object centers, scales, screen quadrilaterals, clock rectangle, cat anchors and window polygons for every profile.

## Hero depth and lighting

The minimum recommended exterior has four photographic depth planes, with procedural sky/weather behind and between them.

1. Mountains, horizon and distant residential fabric combined. Atmospheric depth is more valuable here than tiny independent motion.
2. Acropolis and its hill/recognizable landmark mass. It has its own emission mask and stable geometry.
3. Midground Athens apartment fabric.
4. Foreground buildings and rooftops, including the nearer futuristic tower mass.

Office shell/window frame and interior foreground are separate stationary groups. Telescope, book, chess and aquarium cutouts are shared local assets so the proposed responsive placements do not require three independent object generations. The existing cat sprite remains shared.

Render sky, moon/clouds, far plane, landmark, midground, foreground city, exterior precipitation, glass, office shell, interior foreground, object cutouts, illumination, live screens/cat and accessible content in depth order. Nearer alpha silhouettes occlude distant weather appropriately. Clip rain to the window aperture before drawing office/foreground pixels. Apply any screen overlay behind a developer occlusion mask.

Motion values are bounded displacements, not animation promises. Reconstruct at least 16 export pixels behind intersecting city planes and test extrema before enabling movement. Do not move office, furniture and their masks independently. Every light emission follows its parent plane. Use one shared exterior across profiles, with one transform and aperture per profile.

Base pixels for a controllable emitter must be dark. Either retain a fixed baked source with no duplicate emission overlay, or remove its baked emitter/spill and use the supplied light layers. Do not add a luminous mask over an already lit Acropolis. The Acropolis geometry and light mask move together, and its lighting can vary independently from city-window intensity.

A neutral diffuse interior plus authored emission/spill is the preferred small proof. If it cannot produce a credible night, use the six conditional shell/foreground night exports. If golden-hour direction and interior reflections cannot be achieved with controlled grading, use the ten conditional golden-hour planes. Never independently regenerate each lighting state.

## Contact profiles

| Field | Wide desktop / tablet landscape | Proposed portrait phone / tablet portrait |
|---|---|---|
| Scene/export | 1746x901, 1746:901 | 768x1344, 4:7 |
| Working master | 3492x1802 | 1536x2688 |
| Geometry | Preserve existing extended alley | Derived portrait entrance composite, approval required |
| Display safe rectangle | x43.25%, y19%, w14.2%, height content-driven | x6%, y34%, w62%, h45% initial target |
| Door action rectangle | x76.4%, y23%, w14.4%, h34% | x72%, y25%, w24%, h57% |
| Alley/sky | Existing left perspective | x5-38%, y2-28%, preserve distant depth |
| Ground designation | HTML 00 | HTML 00 near upper-left clear architecture |
| Mouse baseline | Existing pavement alignment | Proposed y92%, hatch near x64%, approve against display/door |
| Controls | Current HTML content | HTML display in architectural surface, >=44 CSS px targets |
| Motion | Stationary initially | Stationary |
| Overflow | Aspect-correct wide stage | Height grows if contact copy or text zoom exceeds the panel |

Tablet portrait can share the portrait artwork at a larger scale. At approximately 805 CSS px content width its natural height is roughly 1409 px, so scrolling is deliberate. No third independent Contact composition is requested. Tablet landscape shares the wide pair. Phone landscape may use the wide stage with vertical scrolling.

The existing mobile wide crop remains a transitional option. Its screenshots show the contact display as a separate content block below scenery. It is not presented as the approved final portrait environment.

Wide and portrait require registered day/night pairs and matching sky masks. Both use the same Athens environmental provider. Proposed wetness and light passes align to the selected profile. Future Contact depth extraction is experimental and limited to the wide profile until a proof justifies extra portrait layers.

## Interior tablet evidence

The reference folders contain tablet portrait and landscape screenshots for all three enclosed floors.

| Floor | 1180x820 observed after corrections | 820x1180 observed after corrections | Artwork recommendation |
|---|---|---|---|
| About | Identity and narrative above tab panel in the responsive two-column structure; page scrolls | Existing portrait-friendly content stacking; tab panel remains readable | Shared desktop wall for landscape. Portrait wall can share mobile architectural framing with a distinct crop/position if checked |
| Projects | Three columns within reserved navigation space | Two columns, three rows | Share desktop architecture for both tablet orientations. No tablet-specific generation justified |
| Experience | Sticky timeline and details with gutter clearance | Sticky two-column reading area, bounded after a focused width fix | Shared wide architecture with a controlled crop. No tablet-specific generation justified |

These observations establish that the content layouts can use shared artwork. They do not approve the appearance of unproduced artwork. At 390 px, all three sections become long document-flow experiences and need portrait-safe wall continuation. Current Projects background stretching remains visible in source and is intentionally documented for the future artwork integration.

## Aspect-correct Projects approach

The owner approved local Floor 02 v004 integration on 25 November 2026. `ProjectsEnvironment.vue` now renders a top-centered intrinsic-ratio plate, registered base/spill/emission, and a compact quiet continuation tile under a 110 CSS px fade. Only the continuation repeats; no ceiling, lamp or floor repeats. Cards stay in normal flow, with existing 980px/620px grid breakpoints and the desktop navigation gutter.

The component measures the fixed header and scene width to clear the entire fixture at section-anchor entry, including 621–760px and the 761px header boundary. Portrait retains at least an 82px scene inset. Every layer moves with the same plate. The title can wrap within its grid cell during text enlargement. Approved exceptions and the verification record are in [Floor 02 v004 integration](floor-02-v004-integration.md).
