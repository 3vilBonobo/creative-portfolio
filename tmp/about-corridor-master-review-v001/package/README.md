# Athens Cyberpunk — Floor 03 About — Desktop master composition approval candidate

This archive is **not a final production artwork pack**. It contains only a clean desktop architectural plate and a composition proof, because desktop geometry approval is the current gate.

## Supplied visual references
The reference directory includes the user-supplied desktop, tablet and phone composition screenshots, plus the previous corridor reference with 03 baked in. They are reference-only: **do not** use these as deployable backgrounds. The standalone clean plate removes the baked 03; the numeral in the composition proof is a separate design overlay.

## Assets
- `candidate/floor-03-about-corridor-desktop-clean-preview.webp`: new empty corridor background at 1920×1080; no portrait, floor digits or UI. The industrial picture frame is empty and the warm lighting is baked in **for composition exploration only**. Not an unlit lighting-separation master.
- `previews/desktop-composition-proof.jpg`: deterministic raster composition proof built from the above plate, the **exact existing site portrait** and the copy visible in the supplied layout references. Text, navigation and 03 are overlay-only in this proof. **Not** a website screenshot or implementable background.
- `references/actual-site-portrait.webp`: unmodified image from the earlier user-provided Floor 03 v002 reference package, included only as a reference. Keep the existing site photo authoritative.
- `geometry.json`: proposed portrait aperture corners and UI region estimates; requires visual approval.

## Review questions
1. Is the corridor perspective and empty physical frame correct, relative to the reference screenshots?
2. Does the physical frame occupy the right amount of the desktop scene, with enough quiet left wall for readable biography and tabs?
3. Is the additional contextual 03 placement appropriate for accessible HTML/SVG overlay?
4. Are baked atmospheric lamps acceptable as a **design proof**? Real light-on/off separation, if still desired, must be built later from approved locked geometry, not from this proof.

## IMPORTANT
The image generation's native output was 1672×941, exported to 1920×1080 via a documented proportional resize. This is not additional native detail. The proof uses a perspective-cropped **copy** of the exact site photo, without regenerating anyone's face or altering the original file. No CSS, repository changes, dependencies, commits or deployments were made. Do not use this preview alone as a final production integration asset.

After approval only: refine/export desktop production base, derive a properly composed tablet and phone scene, then generate additional overlays/masks if requested and after geometry locks.
