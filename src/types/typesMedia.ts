import type { MDbTV } from "./typesMDb";

/** MediaType include all of the current available types for mediaDiary */
export type MediaType = "movie" | "tv" | "album";

/** MediaLogType includes all the types of media that we can filter by based on the user's preference */
export type MediaLogType = "bookmark" | "memory" | "diary";

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
  /** Bookmark is designated here because the "Selection" process between Info > Log | Edit requires
   * that we _CAN_ have a previous diary item. If we have selected a previous item, then it MIGHT be
   * true, if it's selected through a search or a new item, then bookmark is always false.
   */
  bookmark: boolean;
  /** For SpotifyAPI we require an artistId */
  artistId?: string;
}

/** A diaryItem that we add towards Fuego, we don't have "seasons" */
export interface MediaDiary extends MediaSelected {
  /** When the mediaItem was added to Fuego */
  addedDate: string;
  /** Year of the mediaItem, this is calculated and not from the API */
  releasedYear: number;
  /** Decade of the mediaItem, this is calculated and not from the API */
  releasedDecade: number;
  /** Rating -1-10 */
  rating: number;
  /** What date the user recorded this memory */
  diaryDate: string | null;
  /** What year the user recorded this memory (calculated) */
  diaryYear: number | null;
  /** Whether the user has logged this media before or not */
  loggedBefore: boolean;
  /** MediaType TV - what episodes did the user see */
  seenEpisodes?: number[];
}

/** For bookmark route, these are items we should have*/
export interface MediaBookmark extends MediaDiary {
  diaryDate: null;
  diaryYear: null;
  bookmark: true;
}

/** For logged items which include a date, we must make them non-optional or non-null */
export interface MediaDiaryDate extends MediaDiary {
  diaryDate: string;
  diaryYear: number;
}

/** When we MediaAdd we don't have an id, until AFTER firebase creates one. */
export interface MediaDiaryWithId extends MediaDiary {
  id: string;
}

/** A list of diaryItems with ids */
export interface MediaDiaryState {
  [key: string]: MediaDiaryWithId;
}

export interface MediaBookmarkState {
  [key: string]: MediaBookmark;
}
