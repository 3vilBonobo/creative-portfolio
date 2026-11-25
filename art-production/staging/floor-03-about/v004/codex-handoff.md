# Codex handoff — Athens Cyberpunk / Floor 03 About / Production v004

Integrate the attached `floor-03-about-production-v004.zip` into the **Floor 03 About section only**. This ZIP contains the wall, lamp effects, and optional **within-About wall continuation** for long text. It does **not** contain inter-floor connector/transition art, which is an entirely separate workstream.

## Before changes

- Read `AGENTS.md` and applicable repository guidance.
- Inspect `git status`, preserve unrelated changes, and review actual current `AboutSection.vue`, About-specific CSS in `style.css`, current background/lamp behavior, and existing responsive content.
- Read `manifest.json`, `alignment.md`, `production-notes.md`, `known-limitations.md` and inspect the `previews/` examples.
- Treat current repository/runtime as authoritative and use the ZIP as new art, not an implementation spec overriding existing behavior.

## Authorized scope

- Stage the approved artwork within `public/environments/floor-03-about/` (do not overwrite originals before a successful preview).
- Update only the About decorative layer composition in `src/sections/AboutSection.vue` and corresponding About-specific rules in `src/style.css`, plus minimal documentation/assets manifest as needed.
- Preserve the existing Floor 03 identity, portrait, biography, Background/Toolkit/Approach tabs, floor controls, navigation, accessibility, and content order.
- Keep all environment layers decorative and pointer-inert; do not bake UI into artwork.
- Do not modify other floors or the architectural inter-floor connector components.

## Rendering acceptance

1. Use a single proportional base rectangle: desktop **1956×804**, mobile **848×1855**, each anchored **top-center**. Use the matching overlay pair, with identical origin and scaling.
2. Light order: wall/base, visible bulb emission, localized wall spill, HTML content. Keep the fixture off in the base, allow light on/off with lightweight CSS, and use steady light under `prefers-reduced-motion`.
3. For sections taller than the full base rectangle, clip the top wall at the documented cut line (650 desktop / 1607 mobile native px), fill the middle with the appropriate **in-floor quiet continuation texture** at proportional width using vertical repeat only, and anchor the corresponding endcap to the actual bottom. Never repeat the entire room or stretch its floor/skirting. For short sections use the full base instead.
4. The mobile wall is a stylistically coordinated **candidate**, not a pixel-identical crop of desktop. Evaluate it in portrait tablet before treating the visual as accepted. Lamp/halo must not compromise readable text.
5. Do not add Three.js, dependencies, new UI, new artwork, or unrelated refactoring.

## Verify locally

- Preview desktop and mobile in lamp off/on states at **1920×1080, 1440×900, 1180×820, 820×1180, 390×844, and 844×390**.
- Check long text/200% zoom, seam at the wall continuation, bottom placement of floor, portrait/tab contrast, overflow, keyboard focus, floor navigation, reduced motion, and accessible reading order.
- Run existing relevant build, typecheck and tests; use targeted testing instead of installing packages.
- Stop and report (instead of hiding issues with elaborate CSS) if the lamp registration, tablet crop, or wall continuation is visibly poor.

## Completion report

Provide: files changed, exact art files used, screenshots/preview paths for desktop/tablet/mobile, test results, remaining limitations and whether the integration is ready for user visual approval. Do **not** commit, push, merge or deploy without explicit permission.
