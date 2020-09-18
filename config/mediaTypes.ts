export type MediaTypes = "movie" | "album" | "tv";

export interface MediaBaseInfo {
  releasedDate: Date | "";
  type: MediaTypes;
}

export interface MediaInfoAdd extends MediaBaseInfo {
  artist: string;
  title: string;
  poster: string;
  genre: string;
  count: number;
  overview?: string;
}

export interface MediaInfoState {
  [key: string]: MediaInfoAdd;
}

export interface MediaDiaryAdd extends MediaBaseInfo {
  diaryDate: firebase.firestore.Timestamp;
  addedDate: firebase.firestore.Timestamp;
  id: string;
  episode?: number | undefined;
  season?: number | undefined;
  loggedBefore: boolean;
  rating: number;
}

export interface MediaDiaryState {
  [key: string]: MediaDiaryAdd;
}

export interface MediaSelected {
  id: string;
  artist: string;
  title: string;
  poster: string;
  releasedDate: Date | "";
  type: MediaTypes;
  overview?: string;
  genre?: string;
}
