# Athens Cyberpunk — Inter-Floor Asset Reference Pack

This pack contains **every generated reference from this conversation (7 original PNGs)** for the four half-meter-ish infrastructure cutaways connecting the site's five floors. All originals remain unchanged, with descriptive file names for handoff. The five newest, shallow-slice designs are in `references/preferred`; two initial, oversized studies are retained under `references/early_exploration` for completeness, not as recommended production layouts.

**Start with `CODEX_HANDOFF.md`.** Codex must first inspect the live site and the repository (including `AGENTS.md`, `git status` and real rendered layouts) before making changes. Do not assume the current implementation matches an earlier discussion.

## Canonical intended sequence

04 Rooftop/Hero → 03 About → 02 Projects → 01 Experience → 00 Contact; four infrastructure connectors between five floors. The current repository may use historical numbering; inspect the actual code/content and do not renumber in this focused task.

## Asset inventory

| File | Notes | Candidate use |
| --- | --- | --- |
| `references/preferred/REF_01_shallow_baseline.png` | Narrow first approved baseline | Upper distribution 04–03 |
| `references/preferred/REF_02_complex_distribution.png` | Cable-dense variant with more modules | Data distribution 03–02 |
| `references/preferred/REF_03_low_light.png` | Restrained lighting and worn service tray | Lower degraded distribution 01–00 |
| `references/preferred/REF_04_ducts_and_power.png` | Alternate ducts, cabinets, cable risers | 03–02 or 02–01 |
| `references/preferred/REF_05_dense_cooling_and_wiring.png` | Maximum cable and cooling-system complexity | Main infrastructure 02–01 |
| `references/early_exploration/ARCHIVE_01_oversized_service_bay.png` | Early tall/decorative study | Materials ONLY |
| `references/early_exploration/ARCHIVE_02_tall_service_wall.png` | Early oversized wall section | Materials ONLY |

`webp_previews/` contains web-friendly convenience exports of the five preferred designs. Production optimization and actual cropping must be based on observed website needs; these are not pre-approved placements.

`CONTACT_SHEET.jpg` gives a quick labeled comparison of all seven images.

`asset-manifest.json` records dimensions, source file names, intended uses and SHA-256 checksums.

## Nonnegotiable composition notes

- This is a **0.5-meter-deep building-floor cross-section**, not a walkable service corridor. The visible cavity should be shallow.
- Geometry matters more than an image's native aspect ratio: the 2172×724 source files are broad reference plates, and the actual website may require careful cropping/masking/edge treatment.
- The service layer is connective architecture, NOT a separate web page or artistic display panel.
- Preserve the established palette and floor layouts. Create visual continuity across all four transitions, plus enough mechanical distinction to suggest movement down through real building systems.
- Asset use may be partial or recomposed; if cropping makes an image unusable, report the constraint rather than stretching or wrecking the room composition.
