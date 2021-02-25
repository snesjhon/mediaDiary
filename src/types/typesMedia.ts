import type { MDbTV } from "./typesMDb";

/** MediaType include all of the current available types for mediaDiary */
export type MediaType = "movie" | "tv" | "album";

/** In Fuego we save the MediaType by key in a boolean because we want to know what options to omit */
export type MediaTypes = {
  [key in MediaType]: boolean;
};

/** In MD Settings, we want an array format to always be of this structure. This is useful for Promise.All fns */
export type MediaTypesArr = ["movie", "tv", "album"];

/** MediaBase is the structure for a mediaItem. */
export interface MediaBase {
  /** Artist for the selected mediaItem  */
  artist: string;
  title: string;
  poster: string;
  genre: string;
  releasedDate: string;
  type: MediaType;
  season?: number;
  seasons?: MDbTV["seasons"];
  episodes?: number;
  overview?: string;
}

export interface MediaDiary extends MediaBase {
  /** MovieDB or MovieDB_TV or SpotifyID */
  mediaId: string;
  diaryDate: string;
  diaryYear: number;
  addedDate: string;
  loggedBefore: boolean;
  releasedYear: number;
  releasedDecade: number;
  rating: number;
  /** For SpotifyAPI we require an artistId */
  artistId?: string;
  seenEpisodes?: number[];
}

/** When we MediaAdd we don't have an id, until AFTER firebase creates one. */
export interface MediaDiaryWithId extends MediaDiary {
  id: string;
}

export interface MediaDiaryState {
  [key: string]: MediaDiaryWithId;
}

// TODO: I don't think we need releaseYear in MediaBase
export interface MediaSelected extends MediaBase {
  mediaId: MediaDiary["mediaId"];
  artistId?: MediaDiary["artistId"];
}
