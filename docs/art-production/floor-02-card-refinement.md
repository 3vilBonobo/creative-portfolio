# Floor 02 card refinement — 25 November 2026

- NERVE ENDING is the sole featured project, with a visible In Development status. Its authentic prototype screenshot remains in Details. Two generated green-terminal illustrations are explicitly labelled as non-canon visual development concepts, not game screenshots.
- Professional Work appears before Creative & Interactive. ISS remains available as a supporting project.
- Project Companion uses an authentic deployed-app screenshot, the supplied live URL and public repository URL. Its concise entry describes local project planning and task progress. All 65 fingerprinted Companion source/configuration files remain unchanged.
- Standard cards share a vertical layout, equal body height and equal three-line description space. Concise card summaries are separate from full dialog descriptions. Supporting cards show three technology tags and a remaining-tag count; dialogs retain all tags.
- Environmental artwork, lamp behavior, navigation and dialog implementation are preserved.

## Verification

- Node 22: TypeScript check passed; 18 existing tests passed; production build passed. Vite's large-chunk warning remains. The installed npm also reports a Node-version compatibility warning; no dependencies or tooling were changed.
- Browser checks at 1440×1000, 768×1024 and 390×844: all nine supporting cards have equal height at each width, equal description-block height, no sampled card-content overflow and no horizontal page overflow.
- Project Companion preview and both external links render. NERVE ENDING has one authentic screenshot and two labelled concept images; no public play/source action is exposed.
- Evidence: `tmp/card-refinement/browser-checks.json`, `desktop-feature.jpg` and `desktop-professional.jpg`.
- Physical-device and native assistive-technology testing were not performed in this refinement.

No dependency installation, staging, commit, push or deployment was performed.
