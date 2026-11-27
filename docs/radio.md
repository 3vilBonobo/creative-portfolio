# ATHENS // ON AIR

The radio is an optional local-playlist experience. Open it from the laptop on
Floor 04, the mobile **Explore Studio → Athens radio** action, or the persistent
mini-player. Opening it is silent. Press **Play** to start music.

## Station cover artwork

Each station in `src/data/radio.ts` supports `artwork: "/audio/radio/covers/your-cover.webp"`
(or `.avif`). Add your square cover under `public/`, then set that one URL; the
expanded player, station browser and mini-player all reuse it. No component edits
are needed. Until custom covers arrive, `artworkStyle` selects a temporary CSS
placeholder. Missing images also fall back to that placeholder.

Keep `accent` and `ambient` alongside the cover as its curated palette: `accent`
colors selected controls and `ambient` tints the player background. Colors are
configured from the cover's identity, not extracted from image pixels at runtime.
`shortGenre` is available for compact browsing metadata, while `genre` retains the
full description. See [the visual redesign review](radio-ui-redesign.md).

## Adding, removing and reorganizing music

Everything needed to curate songs is in `src/data/radio.ts`.

1. Copy an MP3 into `public/audio/radio/`, optionally in a station subdirectory.
   Preserve your source file elsewhere. Nothing renames, transcodes or changes it.
2. Add one entry to `RADIO_TRACKS`:

   ```ts
   eveningTrack: {
     id: "evening-track", // unique and stable
     title: "Your actual song title",
     artist: "Irinella", // configurable per track
     src: "/audio/radio/unpaid-overtime/your-file.mp3",
     // duration: 240, // optional seconds
     // artwork: "/audio/radio/artwork/your-cover.webp", // optional
   },
   ```

3. Place the reference in a station's `playlist`:

   ```ts
   playlist: [RADIO_TRACKS.eveningTrack, RADIO_TRACKS.andStillICall],
   ```

Reorder that array to reorder playback. Move a reference between station arrays
to recategorize a song; the physical MP3 does not need to move. The same track
may appear on more than one station without duplicating the file. Remove an
entry from an array to remove it from that station. Remove its `RADIO_TRACKS`
definition only after removing all references to it. Delete an unused runtime
MP3 separately if desired. An empty `playlist: []` keeps the station visible and
shows **Transmission pending**; no player-component edits are necessary.

Names, frequencies, genre labels, descriptions, accent colors and the large
typographic `signature` are beside each station's playlist. Frequencies are
fictional identities, not real broadcasts. Files under `public/` use URLs without
the `public` prefix. Filenames with spaces and parentheses work; exact spelling
and capitalization matter on deployed hosts. Use unique track and station IDs.

The supplied file is provisionally assigned to **404 FM** because its genre was
not independently classified. Its full supplied title is retained, its artist is
**Irinella**, and it can be moved with one playlist edit. The runtime copy and the
original Downloads file have identical SHA-256:

```text
C31939FCB23C06F563B8E0BBC7E34D05ADCC0D795CA9216460131D5C5BC2961E
```

No music was downloaded, generated or substituted.

## Playback and keyboard behavior

- Startup and reload are silent. Remembering a station and volume does not
  restore playback. Only station ID and volume are stored in `athens-radio-v1`.
- Opening, minimizing and floor navigation do not start or stop music.
- Selecting another playable station continues music only if it was already
  requested. Selecting an empty station stops the previous transmission and
  exposes that station's identity. Returning to a playable station then requires
  Play. Previous/next buttons deliberately include all five stations.
- Playlists advance in array order and loop. A one-song station loops that song.
- Pause stops playback; mute leaves its clock running. Volume zero also leaves
  the clock running. Unmute from zero restores a modest 45% volume.
- **Optional shortcuts are off by default.** Enable them inside the player:
  `[` previous playable station, `]` next playable station, `M` mute/unmute.
  `Escape` minimizes the open player. No modifier or browser-navigation shortcut
  is captured. Shortcuts ignore typing, form controls, editable regions, repeats,
  composing input and the other active interactive experiences. Cycling while
  silent never starts music.
- Mute is one click/tap in the global utility and in the player's sticky header.
  When another discovery dialog opens, the same utility moves inside it so native
  modal inertness and existing focus traps do not block mute/pause. Opening a
  second station dialog is disabled until that discovery closes.

## Architecture

`src/services/radioController.ts` owns one lazily created `HTMLAudioElement`.
It has no Vue dependency and accepts a media factory/storage adapter for tests.
Source generations, play-operation tokens and native resource/state checks
prevent obsolete promises and queued media events from overwriting a new track.
Release detaches source listeners, pauses and clears the previous resource.
Disposal cancels pending work, removes listeners and removes the media element.

`provideRadio()` in `AppShell` exposes a Vue injection with readonly reactive
snapshots and derived station, track, audible, loading and status values. The
laptop, player and global utility all consume it; floor changes never recreate
the controller. No state-management or audio dependency was added.

The media element is absent until Play. Merely opening the player or browsing
stations does not set a media source. `preload="none"` and explicit source
release avoid eagerly downloading station catalogues. Playback may buffer the
current MP3 according to the browser's native media policy.

## Artwork and accessibility

`RadioLaptop.vue` uses the existing 1672×941 SVG frame. An affine screen plane
fits a miniature radio website inside the original bezel: browser/address strip,
station directory, frequency, station title, transport, signal bars and status.
The original laptop, desk and both hero plates remain unchanged. A restrained
glass layer and phase-dependent opacity/brightness integrate it with lighting.

The telescope's existing `telescope-hotspot-target` animation classes are reused,
including its halo scale, timing, focus ring and rising label. The radio supplies
its own matching gradient ID so it does not depend on the telescope being mounted.
Three small musical glyphs rise/fade only while actually playing, unmuted and
above zero volume. They stop when the scene leaves the viewport or the document
is hidden. Reduced-motion CSS hides notes and disables the equalizer, station
transition and hotspot transitions. All decorative content is aria-hidden.

Portrait uses the existing separate artwork and the discovery-menu/global
entrypoints, without estimating a hotspot on that different composition.
Landscape cover and contain both retain the shared scene coordinates. A scoped
fix prevents the desktop closed-introduction height rule from clipping portrait
copy and its discovery menu after a desktop-to-phone resize.

The expanded player uses a native modal dialog, visible focus indicators,
explicit Tab wrapping, Escape dismissal, focus return and a polite status region.
Mobile puts current identity/playback before the five-station directory; choosing
a station returns the dialog to its identity. Core buttons are at least 44px.
The global utility sits above the tablet floor bar and near the bottom edge on
phone layouts where that bar is replaced by the compact header. At 320px, the
development-only Scene preview toggle is moved above the utility.

## Verification and review

See [the implementation report](radio-verification.md) for actual checks, known
limits and before/after screenshots. Development screenshots and raw browser
observations are under `tmp/radio-review/`.

Run with Node 22:

```sh
npm test
node node_modules/vue-tsc/bin/vue-tsc.js --noEmit
npm run build
npm run dev
npm run preview
```

The ordinary playlists are deliberate. Live scheduling, jingles, presenters,
ads and narrative segments are future creative work, not an implemented framework.
