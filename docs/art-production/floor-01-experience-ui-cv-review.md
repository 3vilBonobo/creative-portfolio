# Experience UI and CV update

Superseded presentation: [approved editorial and interaction revision](floor-01-experience-editorial-review.md)
now uses four main chapters, supporting history and ordinary page scrolling. This
document records the earlier seven-record iteration.

25 November 2026. Local implementation for owner visual review. No commit, push,
deployment or dependency installation.

## Scope and source

The owner requested the existing Experience background with an overlay resembling
the supplied desktop/tablet/mobile reference, then explicitly supplied
`Irinella_Boutsika_CV_2026.pdf` as the source of professional information. Both PDF
pages were extracted and visually inspected. The PDF remains outside public assets;
its phone number and email were not added to the Experience section.

Seven career records now replace the four profile-informed placeholders:

| Role | Organisation | Dates in the CV |
|---|---|---|
| Software Engineer | Agritrack SA | Jan 2025 - Present |
| Web Developer | Internet Now | Sep 2022 - Feb 2025 |
| Web Manager, volunteer | Rainbow School NGO | Nov 2021 - Jan 2025 |
| Frontend Developer | Freelance | May 2021 - Sep 2024 |
| Lawyer | Boutsika & Associates | 2011 - Dec 2020 |
| Legal Counsellor & Founding Member | Enargeia NGO | Nov 2013 - Jun 2014 |
| Seminar Tutor | Peri Psychis | Feb 2013 - Jun 2014 |

Current role first, followed by most recent end date; overlapping dates are retained.
Descriptions and key-focus copy are condensed from the CV. Role technologies are
limited to those supported by its relevant experience text. FreeCodeCamp training
and selected personal projects are no longer presented as employment records.
No unsupported outcomes, employment types or dates were added.

## Presentation and interaction

- Full-row native timeline buttons, amber selection, connected nodes and an arrow.
- Serif role titles, larger selected-record typography, cyan corner/border treatment,
  technology pills and a native Key focus disclosure.
- Desktop/tablet use timeline and details columns. Mobile stacks the selected detail
  below the complete timeline, with Key focus initially collapsed.
- On tall viewports the two reading regions can scroll independently. Keyboard focus
  reveals the selected timeline item without scrolling the document. The scrolling
  detail article is keyboard focusable with a visible outline.
- Short viewports (height <=820px), phones and reduced-motion layouts use document
  flow. Short screens/phones use manual record selection; taller desktops retain
  scroll-driven selection. Seven records cannot be forced into the old four-row
  viewport without clipping or unreadable text.
- Manual selection remains stable through browser focus/layout scrolling. Deliberate
  page wheel/touch/scroll keys resume automatic selection. Input inside either
  reading region does not override the selected record.
- Record counts and career-progress markers derive from the seven-entry data.
- Accessible floor labeling and canonical Floor 01 remain. No additional number was
  painted over the existing architectural stencil.
- The image assets, fixture masks and lamp service are unchanged. The environment's
  existing long-content fade also applies to short-height document-flow layouts,
  preventing the painted floor from crossing the middle of a long timeline.
- Site navigation and other floors were not redesigned. Category filters from the
  reference were not introduced in this presentation/content pass.

## Files changed in this follow-up

- `src/data/experience.ts`: CV-backed career information and provenance.
- `src/sections/ExperienceSection.vue`: heading/toolbar, selected-record panel,
  technology pills/disclosure, responsive selection and input-listener cleanup.
- `src/components/ExperienceTimeline.vue`: native full-row buttons and contained
  active-item visibility.
- `src/style.css`: replaced the old Experience-only rules and removed its obsolete
  late overrides. Other floors' existing/concurrent CSS was preserved.
- `src/components/ExperienceEnvironment.vue`: short-height continuation fade only.
- This review record. Screenshot artifacts are under
  `tmp/experience-ui-review/screenshots/`.

## Verification

- PASS: Node 22.13.1 type check with `vue-tsc --noEmit`.
- PASS: all 22 existing tests, including the Experience and Projects lamp suites.
- PASS: production build; existing >500kB chunk-size advisory remains.
- PASS: CV-backed presentation visually inspected at 1920x1080, 1440x900,
  1024x768, 768x1024 and 390x844. Additional 320x844 measurement had no horizontal
  document overflow and a 280px-wide detail card. These are browser simulations.
- PASS: seven records, correct current role/date, full-row click, Tab/Enter selection,
  visible keyboard focus and live announcement. An observed scroll/focus selection
  regression was corrected and rechecked: Internet Now stayed selected after Enter.
- PASS: earliest record selectable; timeline scroll reveals it. Page Down outside the
  reading regions resumed automatic selection (Web Manager observed). Page Down in
  the focused laptop detail panel scrolled its content ~167px without changing role.
- PASS: mobile Key focus opens/closes and retains Software Engineer selection.
- PASS: tall portrait tablet detail bottom (~928px) clears bottom navigation
  (~958px). Short-height tablet switches to normal flow rather than clipping records.
- PASS: no horizontal overflow in sampled layouts; decorative corners no longer
  generate a horizontal panel scrollbar. Long titles and CV technology pills wrap.
- PASS: development Scene preview switched to day with the same portrait background
  and correct Software Engineer content; live settings restored afterward. QA tab
  closed and temporary viewport override reset.
- Browser log inspection recorded temporary concurrent About/App/Hero HMR failures
  while unrelated files were being updated. No Experience-specific error appeared in
  that sample. The affected page was subsequently reloaded and the final Experience
  checks completed. This is not a claim that the whole application has no errors.
- UNVERIFIED: OS reduced-motion emulation/live preference changes, physical devices,
  screen-reader speech, 200% text zoom and uncaught-exception instrumentation. Existing
  motion-preference handling and stable-light fallback remain; listeners are removed
  on unmount. Accessibility checks were keyboard/DOM/render inspections, not a formal
  conformance audit.

The previous handoff report describes the initial environmental integration; this
follow-up supersedes its four-record content/layout descriptions. Owner review is
still appropriate for typography, panel treatment and portrait composition.
