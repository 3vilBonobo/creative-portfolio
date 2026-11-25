# CODEX HANDOFF — ATHENS CYBERPUNK / FLOOR 03 ABOUT

I am attaching `floor-03-about-corridor-handoff-v003.zip`. **Implement the Floor 03 About redesign now** using the real production backgrounds inside `production/`, not the example screenshots.

Read `README.md`, `geometry.json`, `manifest.json` and `reference/codex-review-and-plan.txt` before editing. Check AGENTS.md, the repository Git status, AboutSection.vue, current About styles and existing assets. Preserve unrelated modifications and current About data/tab logic.

**Asset contract**
- Four real scene images: desktop 1920×1080, tablet-landscape 1180×820, tablet portrait 1536×1280, mobile 1080×1296. Every image is clean: NO person, UI, 03 or text baked in.
- Four corresponding white-on-transparent SVG aperture masks with measured coordinates in `geometry.json`. Use the existing portrait image from `public/about/irene-portrait.webp` as the only portrait source. It must occupy the projected inner opening, with the real photographed frame visible around it. No AI lookalikes, no portrait replacement.
- One shared low-contrast `quiet-wall-tile.webp` for normal-flow content beneath the scene on smaller or taller layouts. Use a soft transition to a deliberate reading deck, not tiled corridors or stretched pipes.
- Lamps in these base images are intentionally **baked and static**. Do not reuse unrelated v004/v005 lighting overlays, do not pretend these backgrounds can be switched off, and do not animate a fake flicker. Further lighting work needs separately approved true unlit masters.
- The real Floor 03 text and label remain accessible HTML/SVG. Only 03, never 04, and order 04/03/02/01/00.

**Implementation**
1. Keep the desktop About text on the dark left wall; position the existing portrait inside the frame center-right and leave corridor visible on right. Use a local semi-transparent left scrim in CSS for contrast as needed, not a new opaque card.
2. Tablet portrait: upper intro beside frame, biography/tabs below. Tablet landscape may use its supplied crop or desktop plate at correct ratio. Mobile: framed portrait scene above all readable content. Never put text across the face.
3. Do not force every tab into the height of the scenic image. The Approach tab is taller, especially at 1440px. Let About grow in normal document flow and blend into the supplied neutral wall reading area without duplicating floor/doors/lamps. Use a scene wrapper with the appropriate aspect ratio, top-centered scaling and one coordinate space for photo/mask/HTML 03. All masks/images must move together when the scrollbar changes the available width.
4. Fix the known 200% text resize clipping in About heading and tab labels as part of About-only layout work. Keep tab semantics, focus, keyboard arrow/End and reading order. On mobile use touch-friendly controls; do not shrink text to fit the scene.
5. Existing site portrait currently lives under a GSAP-transformed identity ancestor. Do not attach an absolute scene overlay to that transformed ancestor; use a shared untransformed scene host, or animate text descendants only.
6. Modify only Floor 03 About markup/styling, versioned About asset files and documentation. Other floors and infrastructure transitions MUST remain unchanged. No dependency installation, commits, push, merge or deploy.

**Verification**
Render actual browser screenshots at 1920×1080, 1440×900, 1180×820, 820×1180, 390×844 and 844×390. Check all tabs, short/long copy, portrait frame aperture, 03 label, responsive crops, physical corridor depth, no plant in tablet/mobile, 200% text resize, focus/keyboard, no horizontal overflow, image failures and reduced motion. Run build, vue-tsc and existing tests. Report any limitations honestly, with screenshots and changed-file list.

This is an **implementation request**, not an invitation to create another unrelated artwork study. Use the supplied images; if a specific crop or masking edge is problematic, make a focused correction and explain it. Do not redesign the project or generate a substitute room.
