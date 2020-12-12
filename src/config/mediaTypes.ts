import { Document } from "@nandorojo/swr-firestore";

export type MediaTypes = "movie" | "album" | "tv";

export interface MediaBase {
  artist: string;
  title: string;
  poster: string;
  genre: string;
  releasedDate: Date | "";
  type: MediaTypes;
  season?: number;
  episodes?: number;
  overview?: string;
}

export interface DiaryAdd extends MediaBase {
  mediaId: string; // MovieDB or MovieDB_TV
  diaryDate: firebase.firestore.Timestamp;
  addedDate: firebase.firestore.Timestamp;
  loggedBefore: boolean;
  rating: number;
  artistId?: string; // for Spotify API
  seenEpisodes?: number[];
}

export interface DiaryState {
  [key: string]: DiaryAdd & Document;
}

export interface MediaSelected extends Omit<MediaBase, "count"> {
  mediaId: DiaryAdd["mediaId"];
  artistId?: DiaryAdd["artistId"];
}

export interface MediaEdit {
  diaryId: string;
  diary: DiaryAdd & Document;
}
