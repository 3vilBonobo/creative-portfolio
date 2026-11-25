# Floor 03 About corridor

Implemented locally on 25 November 2026; awaiting owner visual acceptance. Scope is About markup, About CSS, versioned art and documentation. Other floors and inter-floor transitions are unchanged by this task. Existing unrelated modifications, including shared stylesheet work, were preserved.

## Sources

The original `floor-03-about-corridor-CODEX-HANDOFF-v003.zip` is preserved in `tmp/about-corridor-v003/package/`. Nine supplied production assets plus original manifest, geometry and instructions are copied under `public/environments/floor-03-about-corridor/v003/`. Byte lengths, SHA-256 hashes and raster dimensions were verified. The separate runtime portrait `public/about/irene-portrait.webp` is byte-identical to the supplied reference; it was not regenerated, re-encoded or filtered.

During implementation the owner requested a smaller portrait, then supplied a new wider desktop background. That final image supersedes **desktop only**. Its source PNG, lossless WebP runtime encoding, newly measured aperture SVG, geometry and checksums are in `public/environments/floor-03-about-corridor/v004/`. Lossless WebP RGB pixels were verified identical to the 1672×941 source. The old desktop files remain intact. The new measured aperture has approximately 2px inner-frame clearance and requires final visual acceptance.

## Rendering

| Selection in priority order | Profile | Source rectangle |
| --- | --- | --- |
| Width <=760px | v003 mobile | 1080×1296 |
| Width <=1100px, portrait | v003 tablet | 1536×1280 |
| Remaining width <=1300px | v003 tablet-landscape | 1180×820 |
| Wider | v004 desktop, new owner image | 1672×941 |

Desktop fills the available width proportionally; the wider camera naturally reduces the portrait to about 181×350 CSS px at 1920px width (about 136×263px at 1440px). The temporary 1280px cap used for the previous camera is superseded on desktop. The left wall uses 48% of the scene width. The owner approved that large-screen composition and requested more cyberpunk information styling informed by Selected Projects. About now adapts its amber filled controls, angular corner details and dark navy surfaces. Cool-white reading text, cyan technical accents and magenta history accents replace the muted beige palette. The name uses uppercase monospaced type, the role has a black-on-amber highlight, and the experience/stack/location overview uses compact accented cards. Biography paragraphs are grouped as Production work and Legal foundation; wording is unchanged. Biography and tabbed details sit side by side at >=1600px; smaller desktops stack the lower content. The giant wall 03 remains removed; floor identification remains in the eyebrow, section data and existing navigation. Other profiles retain supplied v003 scene/masks. Tablet intro sits beside the photo; biography/tabs follow. Mobile scene comes first with all reading copy below.

The background, full-canvas aperture mask and separate photo share one untransformed scene host. A resize observer measures actual width, including scrollbar changes. A projective CSS matrix maps the handoff's unchanged native portrait crop `[204,0,642,730]` onto the measured profile quad. There is no independent image/mask `cover` crop and no transformed text ancestor affecting the photo. Resize observer, media listeners and GSAP context clean up on unmount.

Content sets section height. The owner found the compact iteration too short, so desktop now reserves the larger of 95svh and 90% of its proportional scene height, with the reading composition vertically centred where space permits. Default measured section heights are approximately 1370px at 2560×1440 and 1028px at 1920×1080; longer tabs/content grow naturally. Excess lower foreground is clipped, never stretched. Only the supplied quiet 512×512 wall texture repeats under a subdued dark overlay. When the section extends beyond its scene, a gradient blends into this deliberate reading deck. This is the handoff's revised long-content strategy, not a perspective-continuous extension or relocated floor endcap. Infrastructure transitions remain separate.

Lighting is baked and static. About no longer renders old emission/spill images, fake lamp-off or flicker. A short 180ms content-settle effect and restrained tab/panel transitions give interaction feedback; reduced motion disables them and bypasses entrance animation. Accessible tab behavior remains. Wrapping controls, flexible heights and breakable text prevent the former heading/tab clipping when text grows.

The owner subsequently supplied `Irinella_Boutsika_CV_2026.docx` to correct the copy. Only `src/data/about.ts` was updated from its facts: software engineer with a frontend specialism, Angular/TypeScript production work at Agritrack, legal background, mentoring, and growing Java/Spring Boot/SQL/API experience. No seniority was invented and backend experience is qualified as developing. The original CV and its personal contact details were not published or changed. This later instruction supersedes the initial copy-preservation restriction for About only.

## Verification

See [verification report](art-production/floor-03-corridor-verification.md). Current browser evidence and metrics are `about-ui-*` under `tmp/about-corridor-v003/screenshots/`. Earlier `refined-*`, `compact-*`, `updated-*`, `wall-layout-*`, `composition-*` and `app-*` captures show superseded iterations. Current composition captures mount the real production About and navigation components alone; `about-ui-app-metrics.json` records complete portfolio checks. Some early app viewport captures were taken during smooth anchor scrolling and are not top-aligned proofs.

Final visual acceptance remains open for the new desktop scale/aperture and transition into the reading deck, plus supplied tablet/mobile crops. The four v003 crops were derived from approximately 1672×941 native art; no extra native detail is claimed. Native browser text-only zoom, physical-device and screen-reader tests were not performed. Text resizing and reduced-motion startup were simulated in temporary QA without modifying production content.
