export type MediaTypes = "feature-movie" | "Album" | "TV Season";

export interface MediaInfo {
  id: string;
  poster: string;
  title: string;
  published: Date | "";
  artist: string;
  overview?: string;
  backdrop?: string;
  season?: number | undefined;
  episode?: number | undefined;
}

export interface MediaAdd extends MediaInfo {
  date: Date;
  seen: boolean;
  star: number;
  type: MediaTypes;
}

export interface MediaSelected extends MediaInfo {
  watched: string | undefined;
  type: MediaTypes;
}