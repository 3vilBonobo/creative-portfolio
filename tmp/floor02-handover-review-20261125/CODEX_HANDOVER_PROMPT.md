# Codex handover — Athens Cyberpunk / Floor 02 Selected Projects

You are acting as a senior frontend engineer and technical reviewer. The current repository and observed runtime are the implementation source of truth. This handover contains the authoritative v002 artwork brief plus unapproved visual candidates.

## Task authorization — inspection and planning ONLY

1. Read repository instructions including AGENTS.md, relevant project documentation, and existing uncommitted changes before work. Do not overwrite other work.
2. Unpack and inspect `floor-02-projects-reference-v002.zip`: READ `brief.md`, `inventory.json`, viewport measurements, screenshots, both existing wall WebPs, safe-area guides and reference manifest.
3. Inspect current Floor 02 implementation and verify current canonical numbering: 04 Hero, 03 About, 02 Projects, 01 Experience, 00 Contact. Identify selectors/components, asset loading, CSS background sizing, project-card layout, floor label ownership, current lighting behavior and breakpoints.
4. Inspect three images under `artwork-candidates/` purely as references. Read `ARTWORK_STATUS.md`. The latest image is NOT a deployable base: it contains baked floor digits and illuminated elements. Do NOT silently integrate it.
5. Produce a precise integration/readiness assessment and a non-destructive plan that can be executed after approval of the final master and export ZIP. Call out any conflicts between the v002 specification and actual code.

## Intent to preserve

- One enclosed, frontal, plausible post-apocalyptic Athens cyberpunk wall (not steampunk or a separate exhibition), with rich but controlled peripheral wiring/conduit, worn concrete and functional architectural fittings; no windows/plants. Center must remain quiet so real HTML projects dominate.
- More vivid cyan/magenta/amber ambience is desired compared with the first dark candidate; avoid overpowering project cards.
- User-supplied vibrant reference is visual direction, not an authorized exact copy or exact dimensions.
- Floor digits must stay accessible HTML/SVG, NOT baked into background.
- Keep project screenshots, project titles, links, filters, dialogs and real navigation in HTML. Do not bake or redesign them.
- One controllable service lamp near normalized (0.80,0.08) desktop / (0.84,0.05) mobile. Base contains constant ambient but controllable emitter is OFF. Registered independent emission/spill full-canvas PNGs share exact alignment. Reduced-motion = steady light.
- No weather/time variants, parallax or overscan for this enclosed floor.

## v002 target assets (NOT YET PROVIDED)

Production path: `public/environments/floor-02-projects/`, but do NOT write there now. Final staging path per brief: `art-production/staging/floor-02-projects/v002/`.

- floor-02-projects-wall-base-desktop.webp, 1370×1148, opaque, <=350 KiB
- floor-02-projects-light-01-emission-desktop.png, 1370×1148, straight alpha, <=32 KiB
- floor-02-projects-light-01-spill-desktop.png, 1370×1148, straight alpha, <=96 KiB
- floor-02-projects-wall-base-mobile.webp, 768×2048, opaque, <=250 KiB
- floor-02-projects-light-01-emission-mobile.png, 768×2048, straight alpha, <=24 KiB
- floor-02-projects-light-01-spill-mobile.png, 768×2048, straight alpha, <=80 KiB

Working masters target 2740×2296 desktop / 1536×4096 mobile. Derive portrait from same master composition; no repeated ceiling/lamps. Background should be a top-centered proportional plate with quiet continuation, not stretched to match variable section height. Layers base z0 / emission z1 / spill z2 / HTML above. Detail dialogs must remain legible.

## Validation to plan for

Confirm desktop 1440×900 and 1920×1080, tablet 1180×820 and 820×1180, mobile 390×844 and 844×390; test one, six and twelve cards plus 200% text scaling, mobile long scroll, 1-pixel light registration, nonempty true PNG alpha, compressed budgets, filenames, checksum manifest, and top-center anchoring. Ensure no repeated architecture in long sections.

## Deliverable NOW

Write a concise report to the user containing:
- Verified current implementation vs proposed v002 changes
- Any requirements that conflict with runtime or existing styling
- The safe implementation plan with phases and exact files likely affected
- A clear assessment of whether the available art is production-ready (expected: NO), and a short checklist for the artwork creator
- Validation approach and blockers

Do not generate new artwork, alter the app, install packages, modify files, commit, push, deploy or remove assets. Ask for approval before any implementation. Do not misrepresent illustrative imagery as final approved art.
