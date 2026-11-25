# Codex review request — Floor 02 v004

Read repository AGENTS.md and relevant docs, check working tree, keep all unrelated changes intact. Extract ZIP into `art-production/staging/floor-02-projects/v004/`. **Assessment-only authorization: do not edit the app, replace deployed assets, install dependencies, commit, push, or deploy.**

Read manifest.json, alignment.md, production-notes.md and known-limitations.md. Verify SHA-256, image modes, exact 6 v002 filenames and original size/budget requirements; also verify the two compact continuation tiles and newly declared budgets.

In a disposable test (not a source change), use real ProjectsSection.vue HTML/CSS and test six viewports (1440×900, 1920×1080, 1180×820, 820×1180, 844×390, 390×844) with 1/6/12 cards, 200% text, night/day, light on/off, dialogs/focus, and reduced motion. At mobile width, test proposed 82px scene top offset against the fixed ~98px header; all layer positions must shift together. Check long scroll fade and texture seam/repetition, near-field fixture cage occlusion, actual memory cost, and card readability. Supply real-layout screenshots and a gap report.

**Do not mark fully v002 compliant** without explicit owner decision on the independently generated mobile composition, 1× artwork vs genuine 2× masters, lamp anchors/header strategy, and changed layer ordering. Mobile text heading clipping and night CSS remain separate prospective implementation work.
