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
  /** Artist for the selected media  */
  artist: string;
  /** Title for the selected media */
  title: string;
  /** Poster for movie or album art */
  poster: string;
  /** Genre from media or from spotify artist */
  genre: string;
  /** Date the media was released */
  releasedDate: string;
  /** Add the type as this expands */
  type: MediaType;
  /** Optional season number */
  season?: number;
  /** All of the seasons for the current TV item, this isn't saved  */
  seasons?: MDbTV["seasons"];
  /** All of the episodes for the current TV Season, this is saved */
  episodes?: number;
  /** Overview is optional because it's not always provided by the APIs */
  overview?: string;
}

/** An item that's been selected after being searched and clicked on */
export interface MediaSelected extends MediaBase {
  /** MovieDB or MovieDB_TV or SpotifyID */
  mediaId: string;
  /** For SpotifyAPI we require an artistId */
  artistId?: string;
}

/** A bookmark aren't full diaryItems, so they only need a few additions*/
export interface MediaBookmark extends MediaSelected {
  /** When the mediaItem was added to Fuego */
  addedDate: string;
  /** Year of the mediaItem, this is calculated and not from the API */
  releasedYear: number;
  /** Decade of the mediaItem, this is calculated and not from the API */
  releasedDecade: number;
}

/** When we add a bookmark, we don't have an Id, but when we Get then we do! */
export interface MediaBookmarkWithId extends MediaBookmark {
  id: string;
}

/** A memory is a sort of like a diaryItem, but only require a rating*/
export interface MediaMemory extends MediaBookmark {
  /** Rating 0-10 */
  rating: number;
}

/** A diaryItem that we add towards Fuego, we don't have "seasons" */
export interface MediaDiary extends Omit<MediaMemory, "seasons"> {
  /** What date the user recorded this memory */
  diaryDate: string;
  /** What year the user recorded this memory (calculated) */
  diaryYear: number;
  /** Whether the user has logged this media before or not */
  loggedBefore: boolean;
  /** MediaType TV - what episodes did the user see */
  seenEpisodes?: number[];
}

/** When we MediaAdd we don't have an id, until AFTER firebase creates one. */
export interface MediaDiaryWithId extends MediaDiary {
  id: string;
}

/** A list of diaryItems with ids */
export interface MediaDiaryState {
  [key: string]: MediaDiaryWithId;
}
