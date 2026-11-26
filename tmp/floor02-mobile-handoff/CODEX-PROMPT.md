# Athens Cyberpunk — Floor 02 mobile redesign

## Goal and scope
Implement a compact, cinematic mobile project exhibition with progressive disclosure. Preserve the existing desktop appearance, behavior, featured project, artwork, scrolling pane, filters and project data. Do not redesign other floors or introduce a new orientation system. Reuse the shared responsive/navigation strategy from Floors 04 and 03. Inspect the actual repository and current implementation first; do not assume historical documentation is current.

## Evidence and baseline
The supplied screenshots show 12 projects (5 Professional Work, 7 Creative & Interactive), a featured Nerve Ending project, large vertically stacked cards, repeated CTA rows, nested panel padding and persistent controls obscuring content. Desktop is outside scope. Capture the current mobile section height, card dimensions, navigation overlap and interactions before modifying it. Confirm the counts and category membership against the actual data.

## Portrait phone layout
1. Compact Level 02 / Selected Projects heading and a single short introductory sentence. Use the existing shared mobile header, not an additional floor header/navigation bar.
2. Compact category controls: All Projects, Professional Work, Creative & Interactive, with counts from the catalogue. Use a single row if readable, otherwise a compact accessible select or wrapping layout. Preserve the existing category terminology.
3. Show Nerve Ending once as a compact featured card when its category is included. Retain its In Development status and concept-art disclosure. Never duplicate it in the creative list. Keep the featured image approximately 16:9 or wider, without distortion; one brief summary and one Project Details action.
4. In All, display up to two non-featured entries from each category initially. In a single-category filter, display up to two non-featured entries in that category initially (plus the featured project if applicable). Keep existing editorial ordering unless the owner approves a change. Do not invent or remove projects.
5. Render each non-featured project as a compact horizontal thumbnail + title + short category/type label + chevron. Entire row is a semantic button opening existing details. Use about 88–104 CSS px thumbnail width as a starting point; allow stacking at very narrow widths or enlarged text. No fixed text height that clips names. Keep relevant status/confidentiality labels visible or immediately accessible, including illustrative interface concept labels for the enterprise work.
6. Under each category, show a button with the actual remaining count, e.g. Show 3 more professional projects / Show 4 more creative projects (assuming current counts and featured membership). Expand only that category inline; provide Show fewer projects after expansion. Hide the button if no items remain. Never use infinite scroll. On collapse, maintain sensible focus and scroll position; no jump to page top. Announce updated counts politely if helpful. Use shared state keyed by category; preserve selection and expansion across orientation changes. All counts and slices must derive from the catalogue, not hardcoded values.
7. Add compact orientation invitation and an unobtrusive next-floor link to Experience. Do not repeat global navigation unnecessarily.

## Information hierarchy and existing details
Remove long descriptions, repeated technology chips, full-width CTA stacks and technology overview from default mobile list rows; preserve meaningful information in the existing project detail experience. Keep the featured summary concise. Do not delete data or links. Every project remains reachable in at most one expansion and one selection after choosing its category. Preserve Live Demo, Source Code, project details, and existing external links where available. Do not invent links or imply Nerve Ending is released. Keep actual project screenshots and existing labels for mockups/concept art. Preserve confidential-work restrictions and existing LinkedIn pathway if present. Reuse existing accessible details dialogs; make them usable on short viewports with a clear close control, focus management, scrollable content as necessary and focus return. Avoid nested scrolling in the catalogue itself.

## Landscape phone: immersive exhibition
Reuse the existing panoramic Floor 02 artwork and exhibition styling, but do not enable desktop CSS blindly. Compact horizontal navigation/filter row, short header, and a gallery with two compact columns where width permits. Retain progressive disclosure and access to all details; allow normal document scrolling. Keep the scene visible without sacrificing readable text. Handle safe areas and dynamic browser chrome; avoid forcing fullscreen or orientation locks. Preserve selected filter, expanded categories, open project and sensible focus/scroll on rotation. Reuse Floor 04/03 orientation detection and rotation icon. Portrait copy:

Explore the full exhibition
Rotate your phone sideways for the immersive experience.

Show once on this floor in portrait; hide on landscape and desktop. No blocking overlay.

## Artwork and performance
Reuse existing mobile/tablet/desktop Floor 02 backgrounds, registered lighting layers, wall continuation and real project thumbnails. No new artwork needed for the initial implementation. Preserve cyan/magenta industrial architecture, amber accent and typography. Reduce nested black panels, excessive margins and decorative chrome; retain contrast. Use responsive image selection and lazy loading for noncritical thumbnails; avoid loading hidden desktop gallery or both orientations unnecessarily. Keep shared project content and logic; avoid duplicate mounted dialog trees and duplicate IDs. Use existing dependencies. Preserve reduced motion and keyboard/touch accessibility.

## Navigation
Reuse shared mobile navigation. Prevent fixed header and bottom floor controls obscuring text or project actions; account for safe areas and anchor offsets. If Scene Preview is development-only, hide it on public mobile using existing conventions. If shared navigation fixes would affect other floors, report the dependency and use the existing shared solution rather than silently redesigning unrelated floors. Keep desktop unchanged.

## Acceptance and testing
- Portrait 320x568, 360x800, 390x844, 430x932; landscape 667x375, 844x390, 932x430; tablets 768x1024 and 1180x820; desktop 1440x900 and 1920x1080.
- Default All shows at most five previews (one feature + two per category); no duplicate feature. All 12 catalogue projects remain accessible if counts are unchanged.
- Filter counts and remaining counts correct for every category, including zero/one item cases. Show more/fewer affects only its category; filtering and rotation preserve intended state.
- No horizontal overflow, obscured controls, excessive black gaps, clipped titles, forced rotation, nested catalogue scroll or giant blank cards. Verify 200% text enlargement and keyboard navigation, focus, reduced motion, touch targets around 44px where practical.
- Details and existing external links work for all project types; close/return focus works. Test rotation while a dialog is open.
- Aim for at least 50% reduction in default portrait Floor 02 height versus baseline at 390x844; report actual measurement, not a guaranteed target. No desktop visual/functional regression; compare screenshots under same state. Verify tablet unaffected unless existing shared mode intentionally covers it.
- Run build and targeted tests, including filtering, count calculation, featured deduplication, progressive disclosure, rotation/state and dialog accessibility. Do not claim real-device testing unless performed.

## Deliverables and stop point
Implement Floor 02 mobile only. Return before/after screenshots in both orientations and desktop regression screenshots, measured default/expanded heights, file change summary, asset reuse report, targeted test results, and any outstanding issues or decisions. Do not regenerate art, commit, push, merge or deploy without approval. Preserve unrelated working-tree changes. Stop after this milestone.
