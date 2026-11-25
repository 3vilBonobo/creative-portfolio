# Wide hero runtime assets

The current hero uses the owner's expanded studio image at `public/hero/loft-v2/day.png` (1672×941), with a complete regenerated dark night plate at `public/hero/loft-v2/night.png` (1671×941). `src/config/heroScene.ts` defines the shared 1672×941 coordinate system. Both plates fill the same scene frame; the one-pixel night size difference is scaled into that frame. Mobile contains the same full composition.

Day/night blending uses complete images. No polygon cuts through the developer's face, hair, earring or body. Weather and sky masks clip atmosphere only; `scripts/prepare_wide_hero_masks.py` regenerates those two SVGs without altering artwork. Weather stops above the workstation.

Moon, Acropolis lighting, live clock, screen activity and interaction hotspots share the scene frame. The left monitor types code, the centre uses slow orbital motion, and the vertical monitor shows independently timed telemetry. There is no shared descending scan. Paused and reduced-motion behavior remains supported. Cloud movement follows weather/wind and pauses when wind is zero.

See `docs/art-production/floor-04-wide-hero.md` for night-image provenance, prompt and verification. Original assets below are retained for comparison and rollback; the wide hero does not load their layered compositor.

## Legacy layered prototype

All generated raster assets use the canonical 1536×1024 coordinate system. Mobile uses the same stack and a shared portrait viewport crop; no layer is independently cropped.

## Regeneration

Run `scripts/generate_hero_layers.py` from the repository root using Python with Pillow. The script reads `public/hero/athens-coder-loft-day.webp` and deterministically overwrites the prototype assets under `public/hero/layers/`.

## Editable masks

- `exterior-window-mask.svg`: six glass panes minus approximate workstation, monitor, developer and desk polygons. It clips all outdoor atmosphere, precipitation, glass and storm effects.
- `interior-occlusion-mask.svg`: inverse window ownership plus the grouped workstation occlusion. It protects the apartment and clips interior lighting.

## Generated assets

- Five phase variants each for `sky`, `distant-terrain`, `acropolis`, `background-city` and `near-buildings`: 25 transparent WebPs.
- `office-shell.webp`: canonical interior with the visible window openings removed.
- `workstation-foreground.webp`: grouped developer, chair, desk, monitors, lamps and nearby equipment.
- `window-frame.webp`: derived pane-edge and mullion cutout.
- `interior-lighting-overlay.svg`: independent monitor, lamp and aquarium/practical-light glows.

## Prototype limitations requiring manual replacement

- Masks are hand-authored polygonal approximations. Hair, chair, cables, lamps and monitor edges need manual roto refinement.
- Hidden city behind the workstation is not genuinely reconstructed. Overlapping exterior bands use source pixels and small overscan to avoid empty page-background gaps.
- The office shell and workstation overlap in stationary areas. Pixels are identical, so the overlap is visually safe but not production-optimal.
- Time variants are mechanical colour grades. Night apartment lights and Acropolis illumination are deliberately crude and should be art-directed later.
- The frame extraction uses morphology around the editable pane geometry and will need edge cleanup.

These assets establish correct ownership: exterior effects remain behind the glass/frame/interior/foreground stack, while interior lighting is a separate layer. The original flattened desktop and mobile images remain the exclusive failure/comparison fallback.
