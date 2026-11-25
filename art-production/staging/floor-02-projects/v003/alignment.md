# Floor 02 v003 — alignment and layering

Exports: base, registered emission and registered wall spill, plus *NEW* quiet wall continuation WebP per profile.

Both lamp PNGs share exact canvas size and origin with their base. Layer base z0, spill z1, emission z2 (emission should sit visually on top). Keep PNGs as straight-alpha images; use normal source-over composition.

Fixture centers intentionally left at source geometry: desktop approximately (1072.5,147), mobile approximately (600,92). These deviate from v002 nominal placement and require explicit approval before acceptance.

Continuation tile is not a photographic extension of the exact wall: it uses the matched base texture. It is intended for a CSS long non-architectural backdrop *only after* the top plate. Mask/fade bottom 100–120 CSS pixels of the foreground plate into the continuation, rather than stretching, cropping or repeating the entire architectural scene. No lamp layers extend beyond plate.

The emitter is geometrically narrowed and holes for visible vertical cage-wire positions are retained. This is deterministic approximate matting and requires pixel-level human QA on the real page.
