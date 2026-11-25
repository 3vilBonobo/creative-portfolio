# Codex Handoff — Athens Cyberpunk Inter-Floor Infrastructure

## Mission

Inspect the ACTUAL live portfolio and the CURRENT repository first. Then improve the existing connective sections so the visitor experiences one continuous, vertically descending cyberpunk building from Floor 04 through Floor 00. Use the attached image package for material, design language, and compositions. Treat it as inspiration and reusable assets, **not** a mandate to replace the current composition blindly.

Live website: https://irinella-dev.netlify.app/

## Important: source of truth and permitted scope

- The **current repository and observed runtime** are authoritative for file structure, layouts, responsive behavior, styling and existing functionality; older chats/screenshots are historical references, not evidence of current code.
- Before changing anything, read `AGENTS.md` (root and any relevant nested instructions), project docs, existing section/transition components, styles, assets, and tests. Inspect `git status` and `git diff` for ongoing uncommitted work. Preserve all unrelated changes.
- Visit and visually inspect the **live site** at desktop and mobile widths (and tablet if possible), with special attention to the sequence, scale, floors, transitions, scroll behavior, and clipping. Compare live behavior with the local runtime, recognizing that deployment might be behind the repo.
- If browser access to the live site is not available, state that plainly. Do not pretend you reviewed it. Use existing screenshots/documentation and the local runtime instead and note any remaining gap.
- **Canonical intended descending content order**: 04 Rooftop/Hero → 03 About → 02 Projects → 01 Experience → 00 Contact. There are **exactly four** inter-floor infrastructure transitions. Verify actual repo numbering, which has been reported as potentially outdated. **Do not renumber floors as part of this task**; identify mismatches explicitly and map transitions by content.
- Scope is the four inter-floor infrastructure connectors, their integration/seams with the adjacent floors, and narrowly related responsive/animation/performance improvements. Do not redesign the inhabited floors, hero artwork, content, nav, or global visual system.
- Do not commit, push, deploy, delete assets, install dependencies, or make sweeping refactors without explicit permission.

## Required first phase: audit BEFORE implementation

1. Inspect existing transition components/markup, image layers, CSS geometry, parallax/scroll handling, breakpoints and any pre-existing transitions, effects and asset-loading rules.
2. Visually inspect the live site in scroll order. Measure apparent inter-floor thickness relative to the floors, and record the top/bottom seam treatment, layering and responsive behavior. Identify whether the current transitions feel like complete rooms, random banners, or real floor cutaways.
3. Look through all seven included PNGs and `CONTACT_SHEET.jpg`. Prefer the **five `references/preferred` images**. The two `early_exploration` images are oversized concepts and should **not** dictate scale.
4. Propose a compact mapping for exactly four connector locations, including chosen references, distinguishing infrastructure systems, an evolving lighting level and how adjacent edges visually join. Briefly document the findings and key risks before touching code. Within this approved narrow scope, proceed with a conservative implementation; flag any larger necessary changes instead of expanding the task.

## Nonnegotiable spatial model

The reference is a **slice through a building floor's concealed infrastructure**, roughly **half a meter high in the imagined architecture**, NOT a human-height corridor, basement, hallway, or room. Imagine a horizontal saw cut through a slab where cable trays, ducts, wiring, small cabinets, ventilation and power connections have been exposed.

- Keep each transition shallow and subordinate to its habitable floors. Existing site proportions take precedence over arbitrary new fixed heights. As an initial *visual* test only, the service band might occupy ~10–20% of a screen-height floor, adjusted after inspecting the real design; do not blindly use this as a CSS specification.
- Make upper slab edge → narrow exposed infrastructure cavity → lower structural edge read as one physical cross-section. Avoid empty gutters, doubled concrete borders, visible hard cuts, or panels that float like posters.
- Preserve/extend existing vertical building logic: repeating slab thickness, material wear, beams, occasional vertical cable risers, matching lighting leakage and aligned wall edges. The visitor must understand they are descending through the **same** structure.
- The source PNGs are **reference plates, 2172×724 and one 1916×821**, not intrinsically final 0.5-meter layout dimensions. Carefully crop, mask, position, and, only where necessary, adapt the asset/layer for the actual site. Do not simply set a 3:1 asset to `background-size: cover` and assume the correct shallow cross-section remains visible.
- No baked-in floor numbers, labels, text, UI, or graphic buttons. Any floor transition labels should remain real HTML, if consistent with the existing application.

## Cohesive four-part visual narrative

Treat the connectors as related subsystems in one aging megabuilding, never four interchangeable rectangles. The following is a **suggested functional progression**, not an instruction to contradict the observed floors:

1. **04 → 03 · Upper building distribution.** Relatively orderly but aged communication conduits and thin cable bundles. Sparse diagnostic cyan; controlled light. Starting reference: `REF_01_shallow_baseline`.
2. **03 → 02 · Signal/data network.** Denser intersecting fiber/data trays and service junctions, small controllers, layered electrical cabling. Reference: `REF_02_complex_distribution` or `REF_04_ducts_and_power`.
3. **02 → 01 · Main infrastructure load.** Heavier power runs, industrial cooling and cable risers, substantial metal ducts, slight increase in grime. Reference: `REF_05_dense_cooling_and_wiring` and/or `REF_04_ducts_and_power`.
4. **01 → 00 · Lower degraded distribution.** Worn insulation, patched junctions, water stains, fewer working lights, dimmer ambience drifting into basement/alley. Reference: `REF_03_low_light`.

Use layout and existing palette to decide the actual images and order; do not force a literal gradient if it clashes with the adjacent floor environments. All four should be distinguishable by dominant systems, cable patterns and lighting **yet clearly built from one shared engineering language**.

## Art direction

Dark graphite and reinforced concrete, patched steel, black electrical cabling, occasional muted red/yellow insulation, trays, angular vents, small fan units, functional cabinets, imperfect routing and rich believable dirt. Restrained amber work lights, sparse cyan status LEDs, very rare red warning indicators. There should be more functional infrastructure than decorative sci-fi art. **Never** steampunk, brass, gauges, ornamental gears, neon tubes everywhere, generic server-room décor, clean spaceship walls, or excessive purple/magenta.

## Motion: use light touches, not heavy tech

- Where already supported by architecture, use a few subtle **independently controllable 2D light effects**: gentle flicker on a fixture, occasional LED blink, subtle illumination on nearby concrete. Prefer CSS/pseudo-elements, lightweight overlays or existing animation utilities.
- Do not bake animation into the background, do not introduce Three.js, huge canvases, or dependencies just for service-bay animation. Avoid synchronized blinking across all four transitions and avoid seizure-risk flashing.
- Respect `prefers-reduced-motion`, existing animation conventions, battery/performance budgets and contrast. No constantly distracting motion.

## Responsive/performance engineering

- Test full-screen desktop 1920px/1440px, tablet ~768px and mobile ~390px (adapt to existing breakpoints). No horizontal overflow. Shallow on all screens; mobile may have fewer visible features but must retain the cross-section logic.
- Ensure correct cover/contain or positioned `<img>`/`picture` treatment so central utility cavities and BOTH structural edges remain legible and existing section seams stay aligned. The four variants should not look like unrelated postcards; mask/overlay/border treatment can establish common continuity.
- The `webp_previews` folder contains lower-bandwidth copies for experiments, while originals are in `references`. Optimize chosen production images through the project's established asset pipeline; avoid loading all seven originals or animating large filter-heavy backgrounds.
- Avoid visible layout shifts, excessive scroll-linked repaint, large uncompressed payloads, image decode jank and changes that break current navigation/interactions.

## Implementation guidance

Adapt the existing connective component, if one exists, with a minimal reusable configuration for four distinct sections. Prefer project conventions; if using Vue components, TypeScript mappings, or CSS custom properties, fit into the actual code instead of inventing an alternate architecture. Keep asset choices and lighting optional/configurable, and factor common geometry/seam handling centrally. No artificial new content sections.

Do not change the rest of the building to conform to the images. The infrastructure should conform to the building. Preserve all existing artistic choices not directly in conflict with the requested half-meter service-gap model.

## Verification and deliverables

1. Report the audit of the live site, local implementation, relevant files and existing behavior, including any inability to access the live deployment.
2. State the image-to-connector mapping and why the four make a coherent sequence.
3. Implement only in the agreed limited scope; note modified files and any assets added/derived.
4. Run focused existing checks (build, type-check, tests if applicable) using existing installed tooling, and inspect actual rendered pages at desktop, tablet and mobile. Check all four seams in a continuous scroll and with reduced-motion.
5. Summarize evidence: screenshots or captured observations at representative widths, tested commands and outcomes, unresolved visual trade-offs. Do not say something was verified unless you actually observed/tested it.
6. Leave the working tree uncommitted and undeployed; no commit, push, deploy or dependency installs.

## Acceptance criteria

- Exactly four shallow, structurally credible cross-sections connect the five floors in descending order, respecting the current actual content architecture.
- At least four visually distinct infrastructure treatments, but clearly a consistent building: not separate wall stickers or full-height rooms.
- The upper/lower seams meet the adjacent floors without unwanted gaps, duplicated slab thickness or jarring color/scale jumps.
- Strong technical complexity and more cables, with moderate grime, restrained lighting and no steampunk clichés.
- Desktop and mobile composition work; no major performance regression or needless dependency.
- Current navigation, content, other floor visuals and accessibility preferences remain intact.
