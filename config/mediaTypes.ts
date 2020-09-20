export type MediaTypes = "movie" | "album" | "tv";

export interface MediaBase {
  releasedDate: Date | "";
  type: MediaTypes;
}

export interface MediaAdd extends MediaBase {
  artist: string;
  title: string;
  poster: string;
  genre: string;
  count: number;
  season?: number;
  episodes?: number;
  overview?: string;
}

export interface MediaState {
  [key: string]: MediaAdd;
}

export interface DiaryAdd extends MediaBase {
  id: string;
  diaryDate: firebase.firestore.Timestamp;
  addedDate: firebase.firestore.Timestamp;
  loggedBefore: boolean;
  rating: number;
  seenEpisodes?: number[];
}

export interface DiaryState {
  [key: string]: DiaryAdd;
}

// Omit<TypographyProps, "variant">
export interface MediaSelected extends Omit<MediaAdd, "count"> {
  id: DiaryAdd["id"];
}

export interface MediaEdit {
  diaryId: string;
  diary: DiaryAdd;
  media: MediaAdd;
}
