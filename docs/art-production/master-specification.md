# Master environmental standards v002

Status is proposed. The bounded source migration is separate from approval to commission or integrate artwork. The previous 49-file inventory is superseded by `asset-inventory.json`.

## Architecture and art

Canonical floors are 04 Hero, 03 About, 02 Projects, 01 Experience and 00 Contact. Exactly four shallow infrastructure strips connect them. Preserve `office`, `about`, `projects`, `experience` and `street` anchors. Do not change project ordinals, career-record counters, fictional telescope identifiers or the aquarium's Tank 05 identifier as part of architectural numbering.

Keep the established desktop hero camera and composition. Materials are weathered concrete/plaster, graphite industrial metal, believable wiring, restrained cyan, muted magenta and amber practical light. Visible Athens should retain apartment density, balconies, roofs, terrain and the Acropolis. Avoid ornamental machinery, noisy repeating AI textures and fake equipment. Maintain the current typography and accessible HTML content hierarchy.

Use roughly charcoal #111615, concrete shadow #343833, worn plaster #8C877A, graphite #252D2C, cyan #8ED8D0, muted magenta #A65A85 and amber #E2B271 as references, not compulsory flat fills. Match the approved image's perspective and apparent viewing height. No numeric camera calibration can be recovered reliably from the existing raster artwork.

## Proposed file counts

| Package | Required after approval | Recommended | Conditional after proof | Maximum |
|---|---:|---:|---:|---:|
| Hero | 28 | 9 | 16 | 53 |
| About | 2 | 4 | 0 | 6 |
| Projects | 2 | 4 | 0 | 6 |
| Experience | 2 | 4 | 0 | 6 |
| Contact | 6 | 6 | 4 | 16 |
| Transitions | 4 | 0 | 0 | 4 |
| Total | 44 | 27 | 20 | 91 |

The baseline including recommended derivatives is 71 files. The 20 conditional exports are six authored interior night planes, ten authored golden-hour planes and four Contact depth-extraction planes. Do not commission them before the corresponding proof. This is an export count, not a count of independent AI generations. Most masks, cutouts, profile derivatives and flattened fallbacks come from approved common masters.

The Hero's four shared exterior depth planes are important artistic requirements. Its three profile shells/foregrounds are separate registered composites, while landscape imagery, local interactive-object cutouts, cat sprites, weather, moon and interaction logic stay shared. Profile geometry and relocated object positions need owner approval.

## Environmental state matrix

The existing provider already uses Athens coordinates and Europe/Athens time. Retain its cache, fallback and shared rooftop/alley state. No visitor-geolocation change is proposed. Existing development preview supports time, weather, moon and cat choices. A profile selector, intensity controls and light-isolation controls are future proposals only.

| Phase | Base and illumination recipe |
|---|---|
| dawn | Day exterior with cool ambient/warm horizon and neutral interior |
| day | Day exterior and neutral diffuse interior |
| goldenHour | Day exterior with controlled warm treatment; authored conditional family only if proof requires it |
| dusk | Geometry-locked day/night crossfade and increasing practical illumination |
| night | Authored night exterior plus neutral-darkened interior with authored practical emission/spill; conditional authored interior night planes if proof fails |

| Weather | Effects and artwork requirements |
|---|---|
| clear | Procedural clear sky; suppress cloud banks |
| partlyCloudy | Existing cloud-bank asset at partial coverage |
| cloudy | Dense cloud bank, cooler exterior grading |
| fog | Procedural distance haze, stronger behind nearer planes |
| rain | Cloud cover, existing canvas rain and optional pavement wetness |
| storm | Dense cover, existing rain/lightning and optional wetness |
| snow | Existing canvas flakes and cloud cover; no accumulation plates |

All 35 phase/weather combinations use the selected profile's aperture, the shared exterior plane set and the corresponding effect recipe. There is no separate background generation per cell. Morning/midday/afternoon share day. Sunset maps to goldenHour and blue hour to dusk. Light/heavy rain remain intensity levels of rain. Enclosed floors stay artificially lit for every combination.

## Occlusion and lighting

Back-to-front order is procedural sky/moon/clouds, four exterior planes with local emission, exterior rain/haze, glass, shell/frame, interior foreground, object cutouts, interior illumination, live screen/cat overlays and accessible UI. Rain uses the profile aperture. City alpha occludes distant sky/haze. Developer/monitor geometry must keep live screens behind the developer. Do not apply a static skyline mask to an independently moving skyline.

For a controllable light, remove its source and spill from the base, then supply registered source emission and surface illumination. Drive them from a shared intensity. Fixed baked practical lights can remain fixed, but cannot also receive a duplicate emitter overlay. Give the Acropolis its own dark-source light mask and intensity. Its mask follows the landmark layer, not the viewport.

The neutral interior must be deliberately authored with diffuse ambient and subdued practical sources. The current hard-sun day plate cannot simply be darkened and called a production night. Compare neutral relighting against a small authored night proof. Golden-hour direction, local shadows and reflected sunlight require their own proof before commissioning conditional variants.

## Responsive and performance standards

Read `responsive-compositions.md` for profile geometry and approval gates. Use 48 CSS px interaction targets where possible, minimum 44, with about 8 px separation. These are project interaction requirements, not an accessibility conformance claim. Text zoom must not clip contact content or make image position a prerequisite for access.

The summed per-file ceilings are 14.75 MiB for the 71 baseline exports and 22.17 MiB if all 20 conditional exports are justified. Actual optimized files should be smaller. These ceilings exclude working masters and negligible manifest metadata. Initial route transfer should target roughly 3 MiB after conditional media loading is designed. These are proposed budgets, not measured current transfer or memory values.

A 1536x1024 RGBA plane is about 6 MiB decoded. Multiple day/night planes and masks can consume much more GPU memory than their compressed files suggest. Load only active profile lighting families, cap precipitation DPR, pause offscreen motion and avoid mounting aquarium/telescope detail media eagerly in a future loading pass. No new rendering library is required for the artwork architecture. Profile GPU memory and frame time after integration.

Current runtime media measured 48.1 MiB before this work. Adding every proposed export to public without approved archival could increase it substantially. Masters, references and staging remain outside public. No existing assets are deleted in this task. Reference ZIPs currently provide evidence only.

Estimated future master/reference production storage is about 150-400 MiB combined, with roughly 0.8-3 GiB if layered editable working files and revisions are retained. These are estimates dependent on proof outcomes. Reference ZIP sizes delivered by this task are measured separately.

## Integration sequence

1. Review the three Hero guides and portrait Contact guide.
2. Prove one interior lamp and one hero window/landmark extraction before full production.
3. Commission an approved composition package into staging, then validate manifest, paths, dimensions, alpha, registration and budgets.
4. Integrate interiors individually without changing their content hierarchy. Apply the documented proportional Projects plate/continuation strategy at that time.
5. Integrate infrastructure, then the core Hero planes and profile transforms, then Contact under the existing provider.
6. Add conditional lighting/depth only when proofs justify it.
7. Verify direct anchors, both scroll directions, long content, sticky sections, keyboard/focus, reduced motion, image failures, text zoom and performance after each environment.

Nothing in this document authorizes a whole-application redesign, dependency installation, destructive cleanup, Git mutation or deployment.
