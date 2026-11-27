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
