# Floor 03 — About | Production v004

## Scope and provenance

- Only the About floor (canonical Floor 03). **No between-floor transitions** are included or requested here.
- The approved desktop wall (`floor-03-about-wall-base-desktop.webp`) is **byte-for-byte preserved** from v003/v002.
- The mobile portrait wall (`floor-03-about-wall-base-mobile.webp`) remains the existing portrait **candidate**. It is visually coordinated, not a pixel-preserving outpaint of the desktop room.
- Lighting masks are the corrected v003 full-canvas transparent overlays, preserved without further artistic changes.
- New v004 extension assets are derived **from existing room textures** to avoid repeating the lamp, equipment and skirting when About has more text. These are quiet in-section wall surfaces, not new rooms.
- One endcap per layout contains the original lower wall trim and floor, anchored to the section's actual bottom. The first few rows were aligned with the new continuation to reduce a visible horizontal seam.
- A self-contained review preview is provided in `previews/`, including long-content proofs. These are asset composites, **not browser screenshots**.

## Ready for CodeX review

- Desktop base: approved.
- All 10 assets: prepared and checked for geometry, modes, alpha and hashes.
- The six v002 inventory assets meet their v002 byte ceilings.
- Extension and endcap pairs are conditional additions; no v002 budget existed for them.

## Not performed

- No repository integration, modification, commit or deployment.
- No screenshot-based verification of the actual About HTML at six breakpoints.
- No physical-device, 200% text zoom or screen-reader testing.
- No user approval yet for the mobile candidate's portrait-tablet framing.

## File destinations

Proposed integration target: `public/environments/floor-03-about/` for approved files only. The files are staged under `production/` in this ZIP; do not blindly overwrite existing implementation assets. Preserve originals until the browser proof is accepted.
