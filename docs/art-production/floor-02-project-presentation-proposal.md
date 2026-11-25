> Historical proposal, superseded by the owner's visual-fidelity correction. The earlier minimal direction and Orthobyron featured recommendation were rejected. See [implemented correction and evidence](floor-02-visual-fidelity-review.md).

# Floor 02 project presentation proposal — approval pending

Assessment only. No project-card, data, cover artwork, navigation or dialog redesign has been implemented. The approved v004 environment, registered lamp and responsive scene placement remain the background for this proposal.

## Reading the supplied references

Reference 1 establishes the useful hierarchy: a prominent featured project, then a scannable set of supporting projects, with media and text grouped coherently across sizes. Reference 2 makes the featured project particularly clear on desktop, but its persistent left filter rail would consume valuable width alongside the existing right floor navigation. Neither image is a production blueprint: keep canonical Floor 02, existing typography, navigation and actual projects. Do not reproduce their fictional titles, video durations, category counts, controls, logo or background environment.

The strongest transferable ideas are a single dominant project, larger project imagery, quieter card chrome, readable descriptions/tags, and obvious actions. Six real projects do not justify category filtering, technology filtering, grid/list toggles or pagination. No passive live/online indicator should imply health monitoring; the present AD-NET/LIVE and online labels are decorative, not evidence of site availability. Removing or replacing those labels is proposed presentation work, not a content change made now.

## Real content and featured choice

The repository has six projects: Orthobyron, Where Is the ISS Now?, Magic Herbs, Fashion Show, Tip Calculator and Meme Generator. Both Orthobyron and ISS Tracker currently have `featured: true`. That boolean cannot uniquely select one prominent placement.

Recommend Orthobyron as the initial prominent project: it is first in the current order and describes a complete practice website. ISS Tracker is a valid alternative if the owner wants API/mapping work to lead. This is an editorial recommendation requiring approval, not a change to either existing flag. A section-level `featuredProjectId` can select exactly one record; all other records remain supporting projects in their current relative order. Never duplicate the selected record in the supporting list. For a one-project collection, omit the empty supporting region. For twelve projects, keep existing progressive disclosure rather than inventing page counts.

The selected placement should own the single Featured badge. Supporting-card presentation must not create a second Featured badge from the legacy boolean; preserve both existing data flags until an editorial data change is separately requested.

## Layout proposal

| Layout | Featured project | Supporting projects | Navigation/content |
|---|---|---|---|
| Desktop, above 980px | Full available content width; approximately 55% cover and 45% text/actions, growing naturally with content | Three columns; five supporting records flow as 3 + 2 | Preserve right floor-navigation gutter, Level 02 header and global navigation; no left filter rail |
| Tablet, 621–980px | Cover above text; one full-width feature, including portrait tablet | Two columns, flowing 2 + 2 + 1 | Keep header-aware scene positioning and bottom floor navigation where already used |
| Mobile, through 620px | Cover, title, description, tags, then actions in document flow | One column with cover above complete text; no tiny unreadable horizontal thumbnails | Keep long-scroll continuation and existing navigation clearance; do not constrain section height |

At 1180px, the available width inside the reserved gutter is still sufficient for a horizontal feature, with checks for text/action wrapping. Keep current 980px and 620px card-grid thresholds unless later visual QA demonstrates a material problem. Test all eleven previously accepted viewports, 1/6/12 projects, long titles, missing covers and 200% text-only scaling before approval of the implementation.

Keep familiar site typefaces. Reduce ornamental terminal mounts/browser-bar labels where they compete with information; make titles and descriptions the strongest text hierarchy. Use opaque charcoal surfaces, restrained cyan/amber accents, consistent spacing, comfortable text sizes and natural card heights. Show full existing descriptions; avoid hover-only text or arbitrary truncation. Technology tags wrap and remain readable, with the full list available in the existing details dialog. They are labels, not nonfunctional filter buttons.

The primary action should clearly say Project details and open the existing native dialog. Demo appears only when `liveUrl` exists; Code remains available for every record. Meme Generator must not acquire a fabricated demo or video preview. Retain external-link behavior, accessible names, keyboard focus styles, dialog close/backdrop/Escape handlers and focus restoration. Avoid making the entire card a button containing nested links. Optional jump-to-supporting navigation must use a real anchor and is unnecessary if the feature/supporting grouping is already obvious.

## Cover image data assessment

`Project.preview` currently supplies both the card image and the dialog screenshot, including source attribution and a source-project fallback for Meme Generator. There is no separate cover property. Replacing `preview.src` with a marketing cover would incorrectly replace the evidence screenshot in the dialog.

After approval, add an optional `cover` property with `src`, `width`, `height`, `alt`, optional `srcSet`, and optional `objectPosition` (or a normalized focal point). Layout-specific sizes belong to the card components. Reuse the existing optional-image pattern; no new dependency is needed. Cards choose cover first and fall back to the existing preview/source frame. Screenshot fallbacks should use contain/letterboxing rather than cropping real UI to a cover ratio. Dialogs continue to use `preview` exclusively. Decorative cover artwork beside the same HTML title can use empty alt; meaningful content needs concise truthful alt. Authored covers must not be presented as real application screenshots. Existing titles, summaries, technologies, URLs, role and attribution remain unchanged.

## Proposed cover delivery inventory

One composition per actual project, **16:10**, with **1600×1000 WebP** full export and **800×500 WebP** responsive derivative. Work at 2400×1500 or 3200×2000 if native source detail permits; do not upscale and claim new detail. Supply sRGB opaque artwork, a central safe subject, and room for proportional display at all sizes. No baked project title, badge, tags, button, UI control, floor digits or unrelated logos. HTML owns labels. Cover-only paths are separate from existing screenshots.

| Project | Full filename under `public/projects/covers/` | Suggested visual direction | Full-file target |
|---|---|---|---|
| Orthobyron | `orthobyron-cover.webp` | Restrained practice identity and clean geometry consistent with the actual orthodontic site | ≤200 KiB |
| Where Is the ISS Now? | `iss-tracker-cover.webp` | Orbital/Earth imagery; no fabricated real-time position or telemetry | ≤160 KiB |
| Magic Herbs | `magic-herbs-cover.webp` | The project's actual illustrated plants/character vocabulary | ≤160 KiB |
| Fashion Show | `fashion-show-cover.webp` | The actual custom runway/SVG design vocabulary | ≤160 KiB |
| Tip Calculator | `tip-calculator-cover.webp` | Clear calculation/typographic composition related to the existing app | ≤120 KiB |
| Meme Generator | `meme-generator-cover.webp` | Original caption/layout illustration; no implication of an available live demo | ≤120 KiB |

Derivative names are `<project-id>-cover-800.webp` (for example `orthobyron-cover-800.webp`), target ≤70 KiB each. These are recommendations for new, separately supplied cover assets; none exist or have been commissioned by this change. Keep editable masters outside public and deliver covers to a separate artwork staging package with a manifest, dimensions, checksums and usage/attribution notes. Native source artwork is preferable to AI approximations of screenshot text.

16:10 is the recommended media ratio for both featured and supporting cards, so one cover can serve all layouts without a second independent mobile scene. Preserve the entire cover where practical. Any crop or focal adjustment must be checked at the actual display sizes; supply another crop only if the proof requires it. Load only the appropriate 800/1600 derivative via srcset/sizes, give the feature intentional loading priority, lazy-load supporting covers and retain width/height to avoid layout shift.

## Files/components that would change after approval

- `src/sections/ProjectsSection.vue`: select one feature, split supporting records, retain disclosure and current dialog state/handlers.
- `src/components/ProjectCard.vue`: readable supporting-card composition and optional cover handling; retain real links and emitted detail action.
- New `src/components/FeaturedProjectCard.vue`: featured layout using the same Project record and detail event. Extract shared actions only if duplication warrants it.
- `src/types/content.ts`: optional cover type/property only.
- `src/data/projects.ts`: add supplied cover metadata only; preserve existing project content and URLs.
- `src/style.css` and/or focused component styles: replace the overlapping terminal/card presentation rules with scoped featured/supporting rules, preserving unaffected floors and existing responsive grid thresholds.
- New cover files and their manifest after artwork delivery; no background/environment changes.

Approval requested for the hierarchy, Orthobyron as the featured record (or ISS Tracker instead), 16:10 cover family, responsive layout, and functional action labels. Only after that approval and cover delivery should the card redesign be implemented and browser-verified.
