# Athens Cyberpunk Portfolio

A five-floor interactive portfolio built with Vue 3, TypeScript and Vite. The
rooftop studio leads through About, Projects and Experience to street-level
Contact. The scenes include Athens time and weather, a radio, puzzles and other
optional interactions.

## Development

Use **Node 22.12 or later in the Node 22 release line**, matching `.nvmrc` and
Netlify. Install the locked dependencies with `npm ci` on a fresh checkout.

```sh
npm run dev
```

Vite prints the local URL. The development-only **Scene preview** controls allow
time, weather and phone-layout checks; they are hidden in production.

## Verification

```sh
npm test
node --experimental-strip-types --test scripts/contact-screen-projection.test.mjs
node node_modules/vue-tsc/bin/vue-tsc.js --noEmit
npm run build
npm run preview
```

The build command bundles the application; type checking is a separate step.
Check affected floors on desktop and mobile, including keyboard access and
reduced motion, when changing visible behavior.

## Project structure

| Directory | Purpose |
| --- | --- |
| `src/sections/` | The five floor compositions |
| `src/components/hero/`, `projects/`, `experience/`, `contact/` | Floor-specific interactions and scene components |
| `src/components/layout/` | Application shell, navigation and floor transitions |
| `src/components/environment/` | Shared weather, moon and atmospheric effects |
| `src/components/radio/` | Persistent radio player and its artwork and icons |
| `src/components/dev/` | Development-only scene controls |
| `src/composables/` | Vue state, lifecycle and shared providers |
| `src/services/` | Application logic and external integrations |
| `src/config/`, `src/data/`, `src/types/` | Scene configuration, content and TypeScript contracts |
| `public/` | Shipped images, masks, models, audio and asset metadata |
| `scripts/` | Logic tests and optional artwork preparation tools |
| `docs/` | Current architecture, radio maintenance and asset credits |

See [architecture](docs/architecture.md), [radio maintenance](docs/radio.md), and
[asset credits](docs/asset-credits.md).

## Local archive

`local-archive/` is ignored by Git and is not copied into the production build.
It preserves source artwork, Blender/import files, obsolete public assets,
production handovers, historical documentation, review captures, temporary tools
and ZIP packages in their original directory structure. Historical reports keep
the paths and observations from the versions they describe.

The archive exists only on this computer. Keep a separate backup if needed; a
fresh Git clone will not contain it. Artwork preparation scripts that use source
files read them from `local-archive/assets/`. They are optional and are never run
by the app build. See [architecture](docs/architecture.md) before regenerating art.

Moving files out of the tracked tree keeps them out of future repository snapshots
once the changes are committed. Earlier Git history still contains prior copies.

## Hosting

`netlify.toml` selects Node 22, runs `npm run build`, and publishes `dist/`.
`npm run preview` serves the production build locally. Deployment is a separate
owner-approved operation.
