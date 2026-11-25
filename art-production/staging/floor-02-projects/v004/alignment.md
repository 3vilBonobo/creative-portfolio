# Floor 02 v004 layer geometry

Desktop base, spill and emission: 1370 × 1148 with identical canvas origin. Mobile counterparts: 768 × 2048. Straight-alpha PNG overlays are not globally opaque; they must be composed without resizing independently. Physical lamp coordinates are retained from the underlying images, not moved independently.

Desktop emission center: approximately (1072.5, 147) pixels / (78.28%, 12.80%). Mobile emission center: approximately (600, 92) pixels / (78.13%, 4.49%). Both diverge from v002 proposals; neither deviation is approved.

**Proposed mobile header-aware treatment:** Place entire mobile architectural plate 82 CSS pixels below its section entry, behind the actual fixed navigation; do not shift either light overlay independently. At width 390 CSS px fixture center is roughly 129 CSS px from viewport top, below the measured 98 CSS px header. See previews/mobile-header-clearance-proof.jpg. This does not alter artwork geometry, and must be tested in app at every viewport and scroll offset. If browser proof fails, regenerate/change the base and its registered layers together.

**Continuation:** The companion low-detail tile is 1370 × 384 desktop or 768 × 640 mobile. It has no equipment or floor. Apply below the top plate, repeat only the quiet continuation tile, and fade the architectural plate over 110 CSS px. Avoid a forced fixed-height wall: 1, 6, and 12 cards have different section lengths. Both continuation assets have explicit budgets in manifest. Small periodic noise may show pattern on close scrutiny; approval depends on browser proof.

**Layer order proposal:** base z0, spill z1, emission z2, cards above all. v002 listed a different order: do not silently accept this exception. The lamp masks replace v003's hard rectangular cutouts with feathered thin-wire occlusion; this is approximate, not a guarantee of pixel-perfect matting.
