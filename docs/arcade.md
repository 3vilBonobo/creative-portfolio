# Athens arcade

The shelf above the studio sofa opens `AthensArcade.vue`. Portrait phones use
the Athens arcade button in Explore Studio. The dialog owns its lifecycle,
focus return, scroll lock, keyboard and pointer controls. Its playfield uses a
720 × 440 coordinate space independent of the hero's 1672 × 941 hotspot map.

Neon Breakout is the first playable cartridge: ten sectors, three lives,
25 points per cleared billboard, a paddle-angle bounce, and a win after all ten
sectors. Each sector has its own layout, district, palette and skyline landmark.
Later sectors add reinforced two-hit signs, faster balls and smaller paddles.
Clearing a sector preserves points and lives; Next sector starts the next board.
Retry sector restores three lives and removes points earned in that failed sector.
Restart journey returns to sector one. Start is always explicit; switching tabs or windows pauses play. Closing
the dialog pauses an active session; reopening allows it to resume. Restart
returns to a fresh, unlaunched game. Focus game hides the library, settings and
footer on every device; small screens start focused. Show arcade restores them.
Pointer positions are projected into SVG space, including letterboxed focused
views. The same playfield supports mouse, pen, touch and keyboard.

Signal Snake is a ten-district campaign. The first two districts require ten
packets each; later districts add two packets every other level, up to eighteen.
Each district adds route blockers (from zero to twenty) and gently increases the
movement pace from 0.22 seconds per tile toward 0.166 seconds. Eating grows the
snake; clearing a district starts the next route with a short courier again.
Walls, blockers and the snake's own body end a run. Direction keys and the
on-screen pad use the same queued-turn rule, and Space starts or resumes play.

Rooftop Invaders is a ten-wave defense run. Hold Space, mouse-click, or the touch
fire button to keep up a steady, straight-ahead stream; each volley stays in its
lane. The skiff starts with one bolt, unlocks twin bolts at wave two and triple
bolts at wave five. Losing a life drops the weapon one tier, and later wave
rewards restore the unlocked tier. Enemy volleys widen to two lanes at wave four
and three at wave eight, while their firing cadence and formation speed rise.
Formations grow from fifteen to forty-five drones and later waves add armored
commanders. A formation reaching the roof or losing all three lives ends the
run. Clearing a wave awards a bonus and pauses at the next ready screen; the
last wave wins the run.

## Local progress

One save per game is stored for the current browser profile/device, without an
account or cloud sync. The board, sector, score, lives and ball position autosave
every two seconds of play, on scoring/life changes, and on pause/page hide. Save
progress also saves manually. Reload restores active play paused, never running.
The settings show save status and a two-step Delete saved progress action; deletion
resets the current game and only removes this game's key. Future play starts a
new save. Storage denial, incompatible saves and corrupt data leave play available.
Clearing browser data also removes the save; private browsing may not retain it.

`src/data/breakoutLevels.ts` is the ten-sector definition pattern for future games;
future cartridges still need their own simulation, level rules and versioned save
validation. `arcadeProgress.ts` validates every restored board against its layout.

Sound effects and music have separate opt-in switches and a shared volume slider.
The default sounds are original Web Audio synth tones, including collision,
launch, miss and win cues and a short bass/arpeggio loop. Audio starts only after
a user gesture and stops on pause, close, tab hiding or window blur. Contexts,
nodes and optional asset requests are cleaned up on unmount. If audio is blocked,
the game remains playable silently.

To substitute supplied audio, set the optional URLs in `src/data/arcadeAudio.ts`.
Use same-origin paths under `public/audio/arcade/` and browser-supported audio
such as MP3 or OGG. The service decodes each configured asset once, loops music,
and uses synth fallbacks while loading or if an asset fails. Balance file levels
before shipping; keep music loops seamless and short effects free of silence.

The pure simulation is in `src/services/neonBreakout.ts`, covered by `npm test`.
Artwork is currently SVG geometry. Custom billboard sprites, paddle artwork,
drone silhouettes and skyline details can be added without changing the physics.
Respect reduced motion for decorative effects; ball movement is the gameplay.

## Cartridge roadmap

Two cartridges are playable. Remaining proposals are scoped for short,
single-screen games using the same shell and no backend.

| Order | Game | Athens treatment | Effort | Useful custom art | Status |
| --- | --- | --- | --- | --- |
| 1 | Signal Snake | Collect data packets around a city grid | Lowest | Packet icons and metro-style grid | Playable |
| 2 | Rooftop Invaders | Protect antennas from waves of drones | Low–medium | Drone sprites, rooftop skiff | Playable |
| 3 | Orbital Courier | Dodge debris above Athens | Medium | Courier craft, debris silhouettes | Planned |
| 4 | Midnight Pinball | Hit neon signs, metro bumpers and antenna ramps | Higher | Table art, flippers, bumpers | Planned |

Pinball should follow the simpler games: stable contacts, flipper impulses,
table tuning and touch controls need more iteration than Breakout's bounded
ball-and-paddle simulation. Choose its physics approach when that game is scoped.
