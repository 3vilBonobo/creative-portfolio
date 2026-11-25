# Floor 02 — NERVE ENDING integration

Added locally as the ninth manually curated project, under Creative & Interactive with the public category label **Games & Interactive Experiences**. Title **NERVE ENDING**, genre **Psychological tech-horror · Investigative mystery · Interactive fiction**, visible understated **In Development** status. Existing eight project records are semantically unchanged, including Athens Therapy, Madlen V and the enterprise engineering case study.

## Repository verification, without story disclosure

The actual local Nerve Ending repository was inspected read-only. It already contains substantial uncommitted work; that work was preserved. Portfolio content uses only technical findings and the owner's spoiler-safe concept. No narrative documents, character secrets, ending names, transcripts or confidential records were copied into portfolio assets or prose.

| Portfolio claim | Technical evidence inspected |
|---|---|
| Angular 21 / TypeScript | Game package manifest, installed Angular core 21.2.25, TypeScript dependency and Angular source |
| Deterministic state/narrative engine | Shared TypeScript engine entry point, state/session layer and state-gated transitions |
| Natural-language intent recognition | Deterministic interpretation entry point and authored conversation routing; optional local semantic recognition is separate from rule execution |
| Evidence-based investigation | Observation/state modules and record exploration integration |
| Prototype branching paths | Outcome/state transition implementation and corresponding test coverage present; no outcome details published |
| Browser persistence | Session adapter uses browser localStorage through a SaveStore abstraction; versioned save decode/load/write and save tests inspected |
| Automated gameplay/narrative testing | Existing Angular unit-test configuration, Vitest dependency, game/conversation/scenario/save test files |
| Retro corporate terminal direction | Current welcome/interface templates and source styles; authentic existing build inspected |

These are source-verified prototype implementations, not a claim that the game is finished or all intended narrative/interaction coverage is complete. Game tests were inspected, not executed during portfolio integration. No game build, dependency install, validation generator or narrative export was run.

The detail dialog separates **Concept & player experience**, **Implemented in the prototype**, **Planned & still in development**, **Technical architecture**, and **Artistic direction**. Planned work is limited to documented wider-narrative/later-stage refinement and further human playtesting. No release date, playtime, completion percentage, metrics, unrestricted generative conversation or new feature promise is invented.

## Public links and spoilers

`liveUrl` and `repositoryUrl` are deliberately null. A suitable portfolio-linked public playable build was not verified. The public source repository's README/author materials contain story information, so a source action is withheld for this spoiler-safe presentation. No Play Now, Play prototype or source action renders. The image's existing start button is part of a clearly described static screenshot, not an interactive portfolio control.

## Screenshot provenance

A fresh neutral landing screenshot was captured from the game's **pre-existing built artifact** served read-only on a temporary loopback preview. The opening matches the current welcome template. No investigation was started and no story records were opened. Older existing captures were excluded from production use because they did not meet the spoiler-safe requirement.

The temporary server was stopped after capture. All 289 fingerprinted game source/configuration/document/asset files remained unchanged. Browser caches are separate from repository files. The preview server and game are not imported or embedded in the portfolio.

Runtime assets:

- `public/projects/nerve-ending/welcome-1440.jpg`: 1440×796, 58,036 bytes.
- `public/projects/nerve-ending/welcome-800.jpg`: 800×442, 23,211 bytes.

The genuine 1920×1061 source capture is retained privately in the task evidence folder. Runtime JPEG derivatives preserve proportions and use the existing OS encoder at quality 90. No generated artwork, montage, retouched content, game files, model weights or story data are included. Total runtime image size is 81,247 bytes. Dimensions/checksums are recorded in `nerve-ending-assets.json` next to this report.

## Modified portfolio files

- `src/data/projects.ts`: one spoiler-safe project record, nullable public links, status, genre and structured development details.
- `src/types/content.ts`: optional typed status (`In Development` or `Released`), genre and development-detail fields.
- `src/components/ProjectCard.vue`: optional static status chip and project accent. Existing projects have no new badge unless their record supplies a status.
- `src/sections/ProjectsSection.vue`: optional development sections and status/genre display inside the existing dialog. No navigation, focus handler or scene geometry changes.
- Two screenshot derivatives and this report/asset manifest.

Pre-edit SHA-256 comparison confirms these four are the only pre-existing src/public files changed. Environmental artwork, lamp, shared systems and unrelated floors are untouched. Current counts are All 9 / Creative & Interactive 6 / Professional Work 3.

## Updating the project later

Update `status`, `developmentDetails`, `preview`/`additionalPreviews` independently as the prototype evolves. Once a reviewed public build is suitable, set `liveUrl` and retain or update `liveLabel` (currently Play prototype). Set `repositoryUrl` only for a suitable public-facing source location. Existing conditional link rendering handles availability; no component code changes are needed to make links appear. Changing status alone does not add a playable URL or imply a completed release.

## Verification actually performed

- PASS: Node 22 TypeScript check, `node node_modules/vue-tsc/bin/vue-tsc.js --noEmit`.
- PASS: Portfolio `npm test`, all 18 existing tests.
- PASS: Portfolio production build; existing large-chunk warning remains.
- PASS: scoped `git diff --check`.
- PASS: actual application at desktop 1440×1000, simulated tablet 768×1024 and simulated mobile 390×844. Status visible; six implemented and two planned items appear under distinct headings; screenshot loads; no sampled heading/metadata/list clipping or horizontal dialog overflow.
- PASS: no public links render for this project; Escape closes and focus returns to `work-title-nerve-ending`.
- PASS: category counts 6 / 3 / 9, with desktop pane reset to top on selection.
- PASS: all eight prior records unchanged; existing enterprise case study and the new professional/poetry records remain in the catalogue.
- PASS: all 289 fingerprinted game files unchanged after capture and integration.
- No sampled portfolio console errors/warnings. Full game playthroughs, physical-device tests, native assistive technology and native text/motion preferences were not exercised in this portfolio-only task.

Actual browser screenshots and measurements are in `tmp/nerve-ending-integration/`: `dialog-desktop.jpg`, `dialog-tablet.jpg`, `dialog-mobile.jpg`, `browser-checks.json`, `category-checks.json`, `portfolio-preservation.json`, `game-preservation.json`.

No dependencies installed; no game edits; no commit, push or deployment.
