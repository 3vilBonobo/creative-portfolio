# Night mouse Easter egg

## Articulated animation

`MouseRunner.vue` renders eight gallop poses with flexing legs and changing tail curves, followed by a planted turn, a rear three-quarter pose and alternating rear-view paw steps. A shared 8.5-second clock slows the approach and fades the whole mouse into the entrance, with a slight movement into its depth and no moving mask. The larger entrance scales with the mouse, and its threshold shares the mouse's pavement baseline. The atlas crop windows align paw baselines across rows. Animation frames stop when the visit is inactive, the tab is hidden, the scene leaves view, the modal opens, or reduced motion is requested.

Asset: `public/contact/mouse/house-mouse-gait.png`. Generated with the built-in image tool. The generator baked checkerboards into its transparent-sheet attempts; the final RGB sheet uses a black matte removed at render time with an SVG luminance filter. The original cutout and office artwork are retained.

Validation: `node --test scripts/mouse-motion.test.mjs` covers run-frame cycling, turn/rear-paw order, smooth entry opacity and visit deadlines.

### Final gait-generation prompt
Create a transparent-background PNG cutout asset, with genuine transparency like the provided cutout. There is NO visible background: no checkerboard pattern, no white, no gray, no texture, no floor. Output RGBA with alpha 0 outside the subjects.
The subjects are twelve photographs of this SAME realistic little brown house mouse, arranged as an exact 4-column 3-row grid with each mouse fitting completely inside its equal-size cell. Camera and scale consistent. Image canvas 1536x1024.
Top row and middle row: eight sequential running gait poses facing right, with different bent and extended leg positions and different curved tail shapes. Preserve soft brown fur, cream belly, round pink ears, clean appealing house mouse look. Entire tail must fit in each cell.
Bottom row: side profile beginning to turn away, rear three-quarter turned away, directly from behind with left rear paw lifted, directly from behind with right rear paw lifted. Rounded rump, ears and trailing tail. Same physical size as running mice, not larger.
Keep bodies centered at 62% of each cell width, feet at 82% cell height. These are small animal cutouts, not a diagram. No labels, no cell borders, no background squares. Real transparent background is essential.

### Final black-matte edit prompt
Replace the entire gray checkerboard background of this twelve-mouse sprite sheet with PERFECTLY FLAT PURE BLACK RGB(0,0,0). Keep all twelve mice and all their fur, legs, tails and poses exactly unchanged. Do not attempt transparency. Deliver an ordinary opaque RGB image with a solid black background. Remove all checker squares, stray artifacts, wisps outside the animals. Keep the exact canvas dimensions 1536x1024 and 4-column 3-row arrangement. This is a black-matte animation asset for a night scene. Every non-mouse pixel must be absolute black, no gradients or shadows.

The street-level scene uses the existing Athens `night` phase. The entrance stays visible and clickable throughout the night, darker between visits and brighter during a visit or on hover/focus. After 2.2 seconds in view, a house mouse crosses the pavement for 8.5 seconds and slips into the hinged mouse hole under the contact/location controls. The entrance remains bright for another 4.5 seconds, then dims while the next visit starts after 26 seconds. Reduced motion exposes a stationary entrance at night without the chase. Leaving the scene, hiding the tab, or switching to daylight cancels visits. The native modal supports Escape, focus containment, a return button, and restores page scrolling.

Preview: open Scene preview, select Time → night, then visit Contact. Click the little opening beneath the location rail.

Assets generated with the built-in image generation tool, saved in `public/contact/mouse/`:
- `night-office.png`: edited from `public/hero/athens-coder-loft-night.png`.
- `house-mouse.png`: transparent house mouse sprite.

## Final generation prompts

### Office
Use case: precise-object-edit. Edit target: attached rooftop office night image. Create a secret mouse office version for a portfolio Easter egg. Preserve the exact wide camera composition, Athens Acropolis through windows, industrial loft architecture, desk screens and blue/amber night lighting. Replace the human developer completely with a charming realistic soft brown house mouse seated on a miniature chair raised to keyboard level: rounded ears, delicate paws typing, cream belly, clean soft fur; natural animal anatomy, no clothes, not a rat, not grotesque. Tasteful mouse-sized adaptations: small cheese wedge on saucer beside keyboard, spool of thread as footstool, tiny bottle-cap mug. No human remains. Detailed cinematic photorealism. Preserve landscape aspect ratio.

### Mouse
Use case: photorealistic-natural. Asset type: transparent game sprite for a tiny mouse running across a night pavement. A single realistic adorable clean small brown house mouse in full-body exact side profile facing RIGHT, mid-scurry, paws visible, soft brown fur, cream underside, rounded pink ears, bright black eye, delicate whiskers, slender gently curved tail trailing left. Natural house mouse proportions, not rat, no clothing, no cartoon, no grotesque features. Entire mouse and tail inside image, tight landscape framing with minimal transparent padding. Genuine transparent alpha background, no ground, no scenery, no text. Warm soft light on fur with subtle cool night fill.
