# Experience editorial and interaction revision

25 November 2026. Implemented after explicit owner approval of the returned editorial
proposal. This supersedes the seven-entry, nested-scroll presentation in the earlier
UI/CV review. No artwork regeneration, dependency installation, commit, push or deploy.

## Current content

Four primary chapters: Software Engineer at Agritrack, Web Developer at Internet Now,
Frontend Developer as Freelance, and Lawyer at Boutsika & Associates. Agritrack is
selected initially. Summaries, two contributions and a short technology list follow
the approved portfolio direction; compact summaries are stored with the same records.
GSAP is not attributed to freelance work because the available CV evidence identifies
it with a personal project. Java/Spring Boot remain in contribution text rather than
the primary technology list. Actual dates, including the 2025 employment overlap, remain.

Rainbow School (marked Volunteer), Enargeia and Peri Psychis have their own titles,
dates and short descriptions in the native Community & earlier work disclosure.
There is a contextual link to Selected Projects. No education or personal project is
presented as an employment record.

## Interaction

- Normal document flow on every screen. No sticky reading viewport, scroll runway,
  internal timeline/detail scrollbars, record auto-scrolling or GSAP record selection.
- Native buttons select only through click, tap, Enter or Space. Focus/hover do not
  change the selected record. Scrolling preserves the reader's selection.
- Above 980px: timeline and selected panel in two columns, growing with their content.
- At/below 980px: a single-open accordion, with details immediately after the selected
  button. Activating it again collapses it. Contributions remain optionally expandable.
- Closing a preceding panel can move the activated heading under the fixed header.
  A compact-layout correction on explicit activation keeps that heading 16px below
  the header; no scroll listener or automatic role selection is involved.
- Existing environmental assets, fixture registration and lighting remain unchanged.

## Implementation

Changed `src/data/experience.ts`, `src/types/content.ts`,
`src/sections/ExperienceSection.vue`, `src/components/ExperienceTimeline.vue`, and
Experience-only rules in `src/style.css`. Added `ExperienceDetail.vue` to share detail
rendering between the desktop panel and inline accordion. Unrelated work was preserved.

## Verification

- PASS: Node 22.13.1 `vue-tsc --noEmit`, all 22 tests, and production build. The existing
  large-bundle advisory remains.
- PASS: browser visual inspection at 1920x1080, 1440x900, 1024x768, 768x1024, 390x844.
  Additional 320x844 checks found no horizontal overflow or forced vertical scroll
  areas within Experience. These are simulated viewports, not physical devices.
- PASS: desktop panes have `overflow-y: visible` and natural content heights. All four
  panels display the intended copy. Tab focus preserved Agritrack selection; Enter
  selected Internet Now and updated the live announcement. Page scrolling retained it.
- PASS: compact panels appear directly after their controlling button; only one is
  visible. Space collapses a panel with visible keyboard focus. The corrected selected
  mobile heading was ~114px from the top with the fixed header ending at ~98px.
- PASS: Community & earlier work opens/closes by keyboard, exposes all three supporting
  roles and Volunteer label. Selected Projects navigates to `#projects`.
- PASS: Scene preview switched to day with images ready; live settings restored afterward.
  Sampled browser error/warning log returned no entries. QA tab closed and viewport reset.
- PASS: scoped `git diff --check` and removal of scroll/preview handlers from the section
  and timeline source.
- UNVERIFIED: physical devices, screen-reader speech, OS-level motion preference
  emulation/live changes, 200% text zoom, uncaught-exception instrumentation and formal
  accessibility conformance. Existing reduced-motion lamp handling is retained.

Screenshots: `tmp/experience-editorial/screenshots/`, including all five representative
viewports and mobile default/selected views. Owner visual review can refine spacing or
copy further; no publication is included in this task.
