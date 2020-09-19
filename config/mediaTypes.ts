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
  season?: any;
  overview?: string;
}

export interface MediaInfoState {
  [key: string]: MediaInfoAdd;
}

export interface MediaDiaryAdd extends MediaBaseInfo {
  id: string;
  diaryDate: firebase.firestore.Timestamp;
  addedDate: firebase.firestore.Timestamp;
  loggedBefore: boolean;
  rating: number;
  episodes?: number[];
}

export interface MediaDiaryState {
  [key: string]: MediaDiaryAdd;
}

export interface MediaSelected extends MediaInfoAdd {
  id: MediaDiaryAdd["id"];
}
