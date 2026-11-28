# Application architecture

`src/main.ts` mounts `App.vue` and loads global styles. `App.vue` composes five
sections and their four transitions. `src/config/floors.ts` owns floor numbers,
anchors and transition artwork; `useActiveFloor` tracks navigation state.

## Components and ownership

Keep floor composition in `src/sections/`. Place interaction components in the
matching folder under `src/components/`:

| Folder | Responsibility |
| --- | --- |
| `hero/` | Studio artwork, cat, clock, monitor animation, puzzles, telescope, aquarium and radio laptop |
| `projects/` | Project cards, mobile previews and the wall/lamp environment |
| `experience/` | Timeline, selected record detail and wall lighting |
| `contact/` | Alley footer and mouse Easter egg |
| `layout/` | App shell, site navigation, floor navigator and transitions |
| `environment/` | Shared weather, precipitation, moon and scene atmosphere |
| `radio/` | Global player, station artwork and icons |
| `dev/` | Scene preview controls |

The development preview reuses the hero's cat sprite. The studio's radio laptop
uses the shared radio provider. Those dependencies do not make the entire hero
interaction suite global UI.

`AppShell` provides environment and radio state. Composables handle Vue lifecycle
and shared reactive state; services contain domain logic and external adapters.
Content belongs in `src/data/`, scene definitions in `src/config/`, and contracts
in `src/types/`. Existing global and floor styles remain in `src/`; component-local
rules stay with their components.

## Runtime artwork

Public URLs omit the `public` prefix. Keep scene plates, masks, geometry and
hotspots in the same coordinate system. Configuration and templates construct
some URLs dynamically, so a missing literal filename reference alone does not
prove an image is unused.

- Hero uses `public/hero/loft-v2/` for wide day/night plates and masks, with the
  phone composition in `public/hero/loft-mobile-v1/`. Telescope artwork uses
  `public/hero/telescope/discoveries-v2/`.
  `HeroExterior.vue` places the five owner-supplied views from
  `public/hero/exterior/` inside separate wide/portrait window silhouettes.
  Its nested photo coordinates keep the skyline masks, clouds, precipitation
  and Acropolis lights registered together. The overcast photo has its own
  silhouette and registration transform. `heroExterior.ts` selects the view
  from the existing solar phase and weather; dawn shares the sunny reference.
  Scene preview's Weather mask and Sky mask controls show these live apertures.
  Effects pause offscreen, on tab hiding, and with reduced motion.
- About uses `public/environments/floor-03-about-corridor/v004/` on desktop and
  `v003/` for mobile/tablet, including the registered geometry and apertures.
- Projects and Experience use their matching `public/environments/` directories;
  Experience lighting profiles are configured in `src/config/experienceEnvironment.json`.
- Contact uses responsive day/night plates and masks in
  `public/environments/floor-00-contact/`, with mouse artwork in `public/contact/mouse/`.
- Shared transitions, weather, project previews and audio remain under `public/`.

The legacy hero-layer configuration and masks still have source references and
remain in place. Removing that prototype requires a separate review of preview
controls and CSS; it is not part of the folder reorganization.

## Local source material

`local-archive/` preserves historical documents and binary source material outside
Git and the production public tree. A checksum manifest at
`local-archive/maintenance/manifest.json` records the original and destination
paths from the cleanup. Its maintenance scripts are a record of that one-time
operation, not application tooling.

The Blender preparation scripts read `local-archive/assets/` and write production
derivatives to `public/hero/aquarium/`. They require their own Blender/source
environment. The legacy hero generator and Experience preparation script also
overwrite artwork when invoked. Run generators only for an approved asset change;
normal development and builds do not need them.

## Verification and lifecycle

Use the commands in the [README](../README.md) for logic tests, type checking and
production bundling. The contact projection suite is a separate command. Scene
preview supports controlled desktop and mobile checks during development.

Preserve keyboard interaction and focus return, reduced-motion behavior, and
cleanup of listeners, timers, observers, animation frames and WebGL resources.
Weather and puzzle services may depend on external network availability; exercise
their fallback paths when changing those integrations.
