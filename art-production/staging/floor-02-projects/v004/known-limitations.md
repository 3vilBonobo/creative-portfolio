# Acceptance blockers / exceptions

1. Native 2× master artwork is absent. Upscaling 1× would not satisfy the genuine source-detail requirement.
2. Mobile and desktop scenes were generated independently, so the same-geometric-master v002 requirement is not met. Explicit owner exception needed or source rework.
3. Fixture center deviations are not approved; mobile header-aware 82px positioning is only a proposed integration treatment. Test fixed header at all breakpoints.
4. The v004 emitter approximates guard-wire occlusion from manual inspection. No pixel-level acceptance in the real browser has yet occurred; require zoomed review and owner approval.
5. Compact continuation has a periodic microtexture by design; check for visible repetition or seams at six and twelve cards and around fade join.
6. v002 light-pass z order differs from this package's proposed base/spill/emission ordering; explicitly approve or reorder based on actual DOM/CSS.
7. Separate existing application defects: night-background replacement and mobile Selected Projects heading clipping at simulated 200% text scaling. These are not artwork issues and need implementation authorization.
8. No physical-device runtime memory/performance tests, full accessibility audit, or actual repository integration were performed.
