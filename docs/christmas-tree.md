# Seasonal Christmas tree

The hero's Christmas tree appears every year from December 1 at 00:00 through
January 7 at 23:59:59 in Europe/Athens. The existing environment clock refreshes
eligibility each minute and on returning to the tab. Production ignores preview
overrides. No tree images are rendered or requested outside the season.

`ChristmasTree.vue` layers transparent 1024 × 1536 day/night photographs over the
existing plates, in their shared scene coordinate systems. Wide artwork places
the tree in front of the plant beside the left window, behind the sofa. Portrait
artwork keeps it partially outside the left edge and preserves the telescope
through the foreground clip. The room artwork is unchanged.

The night layer follows the room's lighting blend (day 0, dawn .18, dusk .6,
night 1). Thirty-three registered bulbs gently vary opacity at staggered periods
of 3.8–5.68 seconds. There is no flashing or color switching. Reduced motion
disables animation and transitions; hidden tabs and offscreen scenes pause the
twinkle. Observers and listeners are cleaned up on unmount.

Development: Scene preview → Christmas tree → Show tree / Hide tree / Automatic.
Reset to live restores the calendar. Native select controls support keyboard use;
the decorative tree is hidden from assistive technology and ignores pointer input.

## Generated assets and prompts

Tool: built-in `image_gen`, transparent background enabled for both images.
Both PNGs were checked as 1024 × 1536 RGBA with transparent corners.
Runtime paths: `public/hero/christmas/tree-day.png` and `tree-night.png`.

Day generation prompt:

> Create a production photorealistic transparent cutout PNG of ONE decorated indoor Christmas fir tree, for compositing into a cinematic realistic industrial Athens loft. Reference the attached room only for photographic realism and lighting. Tree ONLY, no room, no background, no floor plane, no gifts, no text. A slim natural dense deep-green fir, full tree visible with generous transparent margin, upright, viewed from eye level with a slight view down at its base, asymmetric organic needle branches, small tasteful red and gold glass baubles, a modest gold star topper, thin strings of tiny multicolored Christmas bulbs (red green blue amber magenta) naturally wrapped in several diagonal spirals. Daytime version: soft daylight from behind/right, subtly warm interior fill from left, detailed natural needles, modest bulbs without exaggerated halos. Tree in a dark unobtrusive small pot, believable material and depth. Composition portrait 1024x1536, tree centered with star at approximately 9% canvas height, pot base at 94%, widest branches between 17% and 83% canvas width. Keep background genuinely transparent, including between branches. No cast opaque floor shadow.

Night edit prompt (day tree as the reference/edit target):

> Use case: lighting-weather. Edit target is this transparent Christmas tree cutout. Create its MATCHING NIGHT version for the same photorealistic Athens loft. Preserve the exact tree silhouette, branch locations, star, pot, ornaments, colored bulb positions, framing, canvas dimensions and transparent alpha background. Change ONLY lighting: dim cool night ambient from right and soft warm interior fill from left; deeper evergreen needles and richer shadows; colored red green blue amber magenta bulbs more luminous, tiny restrained realistic colored glow onto nearby needles. Keep glass baubles detailed. Do not add objects, text, floor, room or opaque background. Preserve genuine transparency between branches and all around tree. Do not reshape or reposition anything.

## Verification

- PASS: date boundary tests, including Athens midnight, January 7 inclusion,
  annual recurrence, other months, and invalid dates.
- PASS: browser `/`, desktop 1280 × 720, day/night placement and brighter night
  lights; no horizontal overflow. Computed bulb opacity changes over time.
- PASS: browser simulated phone portrait 390 × 844, framed and full artwork,
  day/night; simulated phone landscape 844 × 390 using Scene preview's phone
  layout. Tree and foreground remain aligned; no horizontal overflow.
- PASS: keyboard selection and Tab traversal of the native seasonal select;
  decorative tree has `aria-hidden` and `pointer-events: none`.
- PASS: Reset to live hides the tree and removes its image elements on November 28.
- PASS: captured browser warning/error logs were empty during the exercised flow.
- UNVERIFIED: physical devices, actual OS reduced-motion preference, tab hiding,
  and uncaught runtime exception detection. Reduced-motion and pause handling
  were inspected in code; browser checks do not establish those runtime paths.

The installed Console Ninja extension has injected a build hook into the local
Vite CLI which times out connecting to its unavailable loopback service. The
development preview used Vite's `createServer` API without changing dependencies
or the repository's Vite configuration.
