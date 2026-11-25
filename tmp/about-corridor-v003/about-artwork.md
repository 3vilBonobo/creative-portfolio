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

Desktop fills the available width proportionally; the wider camera naturally reduces the portrait to about 181×350 CSS px at 1920px width (about 136×263px at 1440px). The temporary 1280px cap used for the previous camera is superseded on desktop. Text stays on the quiet left wall, with a restrained contrast scrim, and tabs follow the biography. The HTML 03 sits separately to the left of the frame. Other profiles retain the supplied v003 scene and masks. Tablet intro sits beside the photo; biography/tabs follow. Mobile scene comes first with all reading copy below.

The background, full-canvas aperture mask and separate photo share one untransformed scene host. A resize observer measures actual width, including scrollbar changes. A projective CSS matrix maps the handoff's unchanged native portrait crop `[204,0,642,730]` onto the measured profile quad. There is no independent image/mask `cover` crop and no transformed text ancestor affecting the photo. Resize observer, media listeners and GSAP context clean up on unmount.

Content sets section height. Only the supplied quiet 512×512 wall texture repeats under a subdued dark overlay. A gradient blends the single scene into a deliberate lower reading deck. The complete corridor never repeats or stretches. This is the v003 handoff's revised long-content strategy, not a perspective-continuous extension or a relocated floor endcap. Infrastructure transitions remain separate.

Lighting is baked and static. About no longer renders old emission/spill images, fake lamp-off or flicker. Reduced motion bypasses entrance animation and keeps content visible. Existing real content and accessible tab behavior remain. Wrapping controls, flexible heights and breakable text prevent the former heading/tab clipping when text grows.

## Verification

See [verification report](art-production/floor-03-corridor-verification.md). Browser evidence and metrics are in `tmp/about-corridor-v003/screenshots/`. `updated-*` screenshots show the final new desktop image; earlier desktop captures show a superseded composition. `composition-*` captures mount the real production About and navigation components alone for full-section review. `app-*` captures come from the complete portfolio; some were captured during smooth anchor scrolling and are not top-aligned proofs.

Final visual acceptance remains open for the new desktop scale/aperture and transition into the reading deck, plus supplied tablet/mobile crops. The four v003 crops were derived from approximately 1672×941 native art; no extra native detail is claimed. Native browser text-only zoom, physical-device and screen-reader tests were not performed. Text resizing and reduced-motion startup were simulated in temporary QA without modifying production content.
