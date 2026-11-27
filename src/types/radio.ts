export interface RadioTrack {
  id: string;
  title: string;
  artist: string;
  src: string;
  duration?: number;
  artwork?: string;
}

export interface RadioStation {
  id: string;
  frequency: string;
  name: string;
  description: string;
  genre: string;
  accent: string;
  /** Owner-supplied square WebP/AVIF cover URL; omitted until covers arrive. */
  artwork?: string;
  ambient: string;
  artworkStyle: "concrete" | "glitch" | "nocturne" | "club" | "haze";
  shortGenre: string;
  /** A small typographic identity, editable alongside the station. */
  signature: string;
  playlist: RadioTrack[];
}

export type RadioStatus = "idle" | "loading" | "playing" | "buffering" | "paused" | "offline" | "error";
export interface RadioState {
  stationId: string;
  trackIndex: number;
  status: RadioStatus;
  volume: number;
  muted: boolean;
  activated: boolean;
  error: string | null;
}
