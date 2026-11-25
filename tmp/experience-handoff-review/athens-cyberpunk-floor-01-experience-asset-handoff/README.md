# Athens Cyberpunk — Floor 01 / Experience — asset handoff

This package groups the actual generated backgrounds and light overlays from the current creative iteration for Codex to inspect and integrate **only after visual validation**. Files are preserved in their original generated resolution and color/alpha modes; no artificial resampling or claimed registration.

## Contents

- `backgrounds/desktop/` — earlier 1920×1080 WebP candidate and two newer 1672×941 desktop scene candidates.
- `backgrounds/tablet/` — 1448×1086 landscape environment.
- `backgrounds/mobile/` — 941×1672 portrait environment.
- `lighting/desktop/` — 1672×941 transparent amber candidate.
- `lighting/tablet/` — two 1448×1086 transparent lighting candidates.
- `lighting/mobile/` — two 941×1672 transparent lighting candidates.
- `manifest.json` — exact image dimensions, formats, alpha and SHA-256 per file.

## Important caveats

1. These are **generated candidates**, not verified production-ready registered light passes. Independent image generation cannot guarantee identical geometry. Some overlays include architectural details or textured regions; if those do not align, showing/hiding them will visibly change the wall.
2. In the newly generated scene backgrounds, the `01 FLOOR` stencil is already baked into the wall. Choose **either** the baked stencil **or** the existing HTML/SVG number; never both.
3. The lighting images often have large transparent canvases. Validate premultiplied alpha and appropriate blend mode; do not simply assume `screen` works.
4. Don't show `ON` lights through an `OFF` fixture mismatch or blink a broad lit wall aggressively. A synchronized emitter+spill+reflection channel is the desired architecture.
5. The tablet/mobile plates are visual variants rather than guaranteed crops of the desktop image. Keep their local light passes specific to the correct layout; do not cross-use.
6. These images are not genuinely 4K source outputs. Do not treat upscaling as native detail.

## Codex instructions

Inspect `AGENTS.md`, the existing Experience floor Vue and CSS, the current working tree, repository art-production notes, and `manifest.json`. Preview all plates and overlays. First produce a short review with screenshots and a registration check, specifying which plate best preserves content readability and page geometry. If overlays do not fit perfectly, derive geometry-locked masks/lighting from the selected base, using the generated overlays as lighting *references*, rather than blindly animating them. Reuse the existing Projects irregular flicker scheduling pattern where reasonable without modifying Projects behavior. When integrated, lamp source, nearby wall/pipe spill and reflection must share intensity. Keep the timeline and career UI in HTML/CSS and preserve existing scroll/selection/navigation/reduced-motion behavior. Prioritize one subtle wall fixture flicker; keep the ceiling light mostly stable. Respect `prefers-reduced-motion` and visibility/offscreen cleanup. Do not install dependencies, commit, push, deploy, or substantially change UI without approval. Test using project scripts and verify desktop/tablet/mobile before seeking final approval.
