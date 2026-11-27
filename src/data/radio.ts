import type { RadioStation, RadioTrack } from "../types/radio";

// Add a track once here, then place it in any station's ordered playlist below.
// Sources are URLs relative to public/. Audio is fetched only after Play.
export const RADIO_TRACKS = {
  andStillICall: {
    id: "and-still-i-call-remastered",
    title: "And still I call (Remix) (Remix) (Remastered)",
    artist: "Irinella",
    src: "/audio/radio/404-fm/And still I call (Remix) (Remix) (Remastered).mp3",
  },
} satisfies Record<string, RadioTrack>;

export const RADIO_STATIONS: RadioStation[] = [
  {
    id: "concrete-therapy", frequency: "88.6", name: "Concrete Therapy",
    description: "Because actual therapy has a waiting list.",
    genre: "Techno / Industrial / Underground electronic", accent: "#f28b80", signature: "CT_",
    playlist: [],
  },
  {
    id: "404-fm", frequency: "93.4", name: "404 FM",
    description: "Genre not found. Please do not refresh.",
    genre: "Experimental / Glitch / Unconventional electronic", accent: "#c1a4fa", signature: "[404]",
    // Provisional home for the supplied track; move this entry to recategorize it.
    playlist: [RADIO_TRACKS.andStillICall],
  },
  {
    id: "unpaid-overtime", frequency: "97.2", name: "Unpaid Overtime",
    description: "Smooth sounds for questionable life choices.",
    genre: "Jazz / Soul / R&B / Downtempo", accent: "#eac184", signature: "after hours.",
    playlist: [],
  },
  {
    id: "common-disturbance", frequency: "102.8", name: "Common Disturbance",
    description: "Your neighbours already hate us.",
    genre: "Dance / Electronic / Club music", accent: "#81dae2", signature: "CD↗",
    playlist: [],
  },
  {
    id: "existential-fm", frequency: "106.6", name: "Existential FM",
    description: "Still searching for meaning. Excellent reception, though.",
    genre: "Alternative / Indie / Atmospheric experimental", accent: "#a8c8a3", signature: "why?",
    playlist: [],
  },
];
