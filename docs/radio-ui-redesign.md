# Radio UI redesign review

Local refinement of the existing radio. No dependency installation, commit, push,
or deployment was performed. Audio controller, playlists, laptop screen/hotspot,
discovery animation, note behavior and unrelated floors were not changed.
Concurrent edits to the project catalogue/mobile project preview were left intact.

## Visual decisions

- A 380px square cover anchors the desktop listening area; station title, track
  and circular transport controls follow it. All five stations sit below in a
  compact cover browser. Extra genre metadata is secondary; shortcuts live in Settings.
- Manrope replaces the terminal typography. Mono is limited to frequencies.
  One softly tinted surface, quiet station tiles and a single selected edge
  replace the previous grid of equally weighted borders and labels.
- Mobile has a centered cover/listening view, a horizontal station rail and
  compact transport/volume controls. Short phones scroll; mute/minimize stay pinned.
- The mini-player uses the same cover, proportional type and round controls.
  Mute remains one tap. The idle mini-player is smaller than the active version.
- Five temporary CSS cover identities provide coral folded concrete, violet
  interference, amber nocturnal arcs, cyan rings and green atmospheric haze.
  These are placeholders, not the owner's final custom artwork.

## Installing the owner's covers

Add square WebP or AVIF files under `public/audio/radio/covers/`. Set each station's
`artwork` URL in `src/data/radio.ts`. Set `accent` and `ambient` to its curated
palette in the same entry. The background uses that palette; it does not analyze
image pixels. One shared `RadioArtwork` component updates the large cover, browser
thumbnail and mini-player. Failed images fall back to the station's placeholder.
An existing WebP was temporarily configured for QA: it loaded at 720px natural
width, rendered square and appeared in all three places. That QA URL was removed.
Native AVIF support uses the same image path but no real AVIF file was supplied/tested.

## Verification

Route: `http://localhost:5173/`, also floor navigation with the player minimized.
All dimensions below are browser viewport simulations, not physical devices.

| Viewport | Result | Observed composition |
| --- | --- | --- |
| 1920×1080 | PASS | 697px dialog content height, no vertical/horizontal overflow |
| 1440×900 | PASS | Large cover, readable hierarchy, all five stations and controls visible |
| 1366×768 | PASS | Same 697px content height; entire player fits without scrolling |
| 768×1024 | PASS | 640px content height, adapted station tiles, no dialog scrolling |
| 390×844 | PASS | 750px content height, no dialog scrolling; station rail scrolls horizontally |
| 360×800 | PASS | 731px content height, no dialog scrolling |
| 320×568 | PASS | No horizontal dialog overflow; 701px content scrolls within 550px height; header mute remains visible at scrollTop 151 |

Actual screenshots were opened and visually reviewed, including available 404 FM,
unavailable Concrete Therapy/Existential FM, the other station identities, settings,
and mini-player on another floor. Covers lead the composition, the primary controls
have distinct visual weight, and pending stations have one main message.

| Functional check | Result |
| --- | --- |
| Supplied MP3 | PASS: native readyState 4, paused false and advancing time observed |
| Pause, mute and closure | PASS: pause stops native media, mute leaves playback running, minimize/floor navigation retain shared playback |
| Keyboard | PASS: Settings opt-in works; Tab wraps to mute; Escape minimizes; brackets skip empty stations without starting playback |
| Touch controls | PASS: mini-player open/play/mute buttons measure at least 44×44px |
| Shared artwork | PASS with a real WebP source, reused in all three contexts |
| TypeScript | PASS with Node 22.13.1, separate vue-tsc --noEmit |
| Logic tests | Final full run PASS: 44/44. An earlier concurrent verification run reported 4 failures; the subsequent full run passed without test/logic changes. Initial failure details were not retained, so their cause is unconfirmed |
| Production build | PASS, Node 22; existing >500kB JS chunk warning remains |
| Console | PASS: no warnings/errors in the exercised browser flows |
| Reduced motion | CSS disables new cover/equalizer/control animation; actual OS emulation UNVERIFIED |
| Physical phone/Safari | UNVERIFIED; viewport simulation only |

Raw browser observations: [checks.json](../tmp/radio-redesign/checks.json).
Final test output: [test-output.txt](../tmp/radio-redesign/test-output.txt).

## Screenshots

Before images are archived browser captures from the previous radio implementation
review, reused for reliable full-frame comparison. After images are this local redesign.
The backdrop, scroll framing and playback state can differ between versions.

- [Desktop before](../tmp/radio-redesign/before-1440.jpg) / [desktop after](../tmp/radio-redesign/after-1440-available.jpg).
- [Mobile before](../tmp/radio-redesign/before-390.jpg) / [mobile after](../tmp/radio-redesign/after-390-available.jpg).
- [1920 desktop](../tmp/radio-redesign/after-1920-available.jpg), [1366 laptop](../tmp/radio-redesign/after-1366-available.jpg), [tablet](../tmp/radio-redesign/after-768-available.jpg).
- [Unavailable desktop](../tmp/radio-redesign/after-1440-unavailable.jpg), [unavailable mobile](../tmp/radio-redesign/after-390-unavailable.jpg), [unavailable tablet](../tmp/radio-redesign/after-768-unavailable.jpg).
- [360 phone](../tmp/radio-redesign/after-360-available.jpg), [320 phone](../tmp/radio-redesign/after-320-available.jpg), [320 settings](../tmp/radio-redesign/after-320-settings.jpg).
- [Desktop mini-player](../tmp/radio-redesign/mini-desktop.jpg), [mobile mini-player](../tmp/radio-redesign/mini-mobile.jpg).

## Remaining creative work

Final station covers are still pending from the owner. The placeholders establish
proportions, palette and placement; the interface should be reviewed again with
those covers. Small phones require normal vertical scrolling and swipe/keyboard
browsing of the station rail. The full MP3 title intentionally retains the owner's
repeated Remix/Remastered suffixes. No new audio scheduling or broadcast features
were introduced.
