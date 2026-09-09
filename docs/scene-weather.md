# Scene weather layers

`SceneEnvironment.vue` is shared by the rooftop and street. Clear skies are CSS gradients, so the base contains no baked-in clouds and each time phase can be graded independently. `public/weather/cloud-bank.svg` is a lightweight, editable cloud asset; additional cloud families can be added without repainting either scene.

Hero masks use the canonical 1536 × 1024 artwork. Separate day/night sky masks trace the skyline and exclude the lamp and window mullions. Exterior masks protect the workstation while allowing precipitation in front of distant buildings. All hero layers now share the same contained canvas on desktop and mobile; independently translating extracted plate fragments would detach them from these masks.

Alley sky masks use 1746 × 901 coordinates and preserve hanging wires. Atmosphere and time grading cover the full outdoor artwork. Precipitation is rendered separately across the entire street stage, including the full mobile layout, without a façade or street-depth mask. The sky and artwork crop together on mobile.

Cloud transit time is 2400 / windSpeed seconds (Open-Meteo km/h); the farther bank takes 1.65 times longer. This is an artistic perspective scale, not a physical distance simulation. Doubling wind speed doubles apparent movement. Zero wind pauses both banks. Clear conditions suppress clouds even if an old measurement reports cloud cover. Storms force an overcast bank and branch lightning with two brief pulses per 11-second cycle. Reduced-motion preferences disable animation and lightning.

Validation: `node --test scripts/weather-effects.test.mjs`, `node node_modules/vue-tsc/bin/vue-tsc.js --noEmit`, and `npm run build`. Use Scene preview to inspect time/weather combinations in the browser.

PrecipitationCanvas renders independent particles: rain uses velocity-aligned, tapered motion-blur streaks; snow uses soft flakes with varied depth, size, fall speed and sinusoidal drift. Both respond to wind. Density scales with area and intensity, with particle caps and a maximum 2× pixel ratio. ResizeObserver keeps the canvas sharp; animation pauses offscreen, in hidden tabs and under reduced-motion preferences. All observers and animation frames are released on unmount.

