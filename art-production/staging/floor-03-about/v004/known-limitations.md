# Floor 03 — About | Known limitations

1. **Mobile architecture:** The current portrait base resembles the desktop's industrial materials but was not generated as a true crop/outpaint of identical geometry. Confirm visual continuity at the transition into About and in portrait-tablet sizes.
2. **Practical lighting:** Desktop/mobile masks are registered to the corresponding bulbs based on visual measurements, but the final incident-light direction and text-safe falloff require browser inspection with real content. Decrease opacity if the halo competes with text.
3. **Tall-section continuation:** New wall continuation avoids repeated panels, lamps, floor and pipes-as-objects. Some surface marks recur when tiling indefinitely, especially for extreme text zoom or unusually long content. Use as an interior surface fallback only; do not build a transition floor from it.
4. **Top/bottom seam:** The continuation was visually checked in static composites, not across CSS layout breakpoints. A subtle vertical seam or pattern mismatch may appear with browser scaling/compression.
5. **Asset budget:** The six core asset budgets are met. The four conditional in-section continuation/endcap assets were not part of the original six-file budget and increase shipped bytes if all are loaded. Load only the active responsive assets where possible.
6. **Master resolution:** Working 2× raster masters are not provided; the approved exported desktop/mobile plate is the current best available source. Avoid claiming real extra detail from interpolation.
