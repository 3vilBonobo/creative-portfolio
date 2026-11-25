# Portfolio development

- Finish the existing five-floor portfolio. Preserve artwork, composition, typography,
  scene alignment, motion character, and interaction intent. Get owner direction
  before redesigning, replacing artwork, or changing the default hero composition.
- Check Git status before editing. Preserve existing edits and untracked assets.
  Keep diffs scoped. Stage, commit, push, or deploy only when requested.
- Follow the local Vue 3 and TypeScript patterns. Use `src/sections/` for floor
  composition, `src/components/` for interactions, and existing composables,
  services, and data modules for shared logic. Follow the nearby CSS conventions.
- Keep scene artwork, masks, and hotspots aligned in their shared coordinate space.
  Check runtime assets under `public/` with the code that references them. Run
  artwork generators only for an explicitly requested asset change.
- Preserve keyboard access, reduced-motion behavior, and cleanup of timers,
  listeners, observers, animation frames, and WebGL resources.
- Use Node 22 for project verification, matching `.nvmrc` and Netlify. Use
  `npm run dev`, `npm run build`, and `npm run preview`. Run type checks separately
  with `node node_modules/vue-tsc/bin/vue-tsc.js --noEmit`.
- Run the logic tests with `npm test`. For visible changes, use the dev-only
  Scene preview and check the affected floor on desktop and mobile. Report checks
  run and any gaps.
