# v004 corrective notes

- Preserves the approved cyberpunk architecture, independent permanent magenta/cyan ambient glow, and existing source lamp hardware.
- Replaces v003 square cutout emitter masks with thin antialiased wire occlusions and a narrow physical tube mask. Derives the wall spill deterministically from the registered base.
- Replaces huge continuation WebPs (desktop 1370 × 5120 and mobile 768 × 15360, approximately 72 MiB combined RGBA when decoded) with compact, repeatable quiet-wall textures, desktop 1370 × 384 (~2 MiB decoded), mobile 768 × 640 (~1.9 MiB decoded). The repeating material is subtle, but requires 6/12-card visual proof.
- Mobile header obstruction is addressed by a proposed CSS offset of the *whole architectural plate*, not by falsifying alignment between source and masks. This is a proposal requiring real browser testing and approval.
- Does not include true native-detail 2× masters and does not derive portrait geometry from a single geometric master. Both are outstanding specification exceptions. Do not claim fully compliant acceptance.
- No application files were changed and no deployment was made.
