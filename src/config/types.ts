import type { MDbTV } from "./typesMDb";

/**
 * MediaType include all of the current available types for mediaDiary
 */
export type MediaType = "movie" | "tv" | "album";

/** In Fuego we save the MediaType by key in a boolean because we want to know what options to omit */
export type MediaTypes = {
  [key in MediaType]: boolean;
};

/** In MD Settings, we want an array format to always be of this structure. This is useful for Promise.All fns */
export type MediaTypesArr = ["movie", "tv", "album"];

/**
 * MediaBase is the structure for a mediaItem.
 */
export interface MediaBase {
  /** Artist for the selected mediaItem  */
  artist: string;
  title: string;
  poster: string;
  genre: string;
  releasedDate: string;
  releasedYear: number;
  releasedDecade: number;
  type: MediaType;
  season?: number;
  seasons?: MDbTV["seasons"];
  episodes?: number;
  overview?: string;
}

export interface DiaryAdd extends MediaBase {
  /** MovieDB or MovieDB_TV or SpotifyID */
  mediaId: string;
  diaryDate: string;
  diaryYear: number;
  addedDate: string;
  loggedBefore: boolean;
  rating: number;
  artistId?: string; // for Spotify API
  seenEpisodes?: number[];
}

/** When we MediaAdd we don't have an id, until AFTER firebase creates one. */
export interface DiaryAddWithId extends DiaryAdd {
  id: string;
}

export interface DiaryState {
  [key: string]: DiaryAddWithId;
}

// TODO: I don't think we need releaseYear in MediaBase
export interface MediaSelected
  extends Omit<MediaBase, "releasedYear" | "releasedDecade"> {
  mediaId: DiaryAdd["mediaId"];
  artistId?: DiaryAdd["artistId"];
}

/**
 * FILTERS
 */
export interface Filters {
  filterMediaType: MediaType;
  filterRating: number;
  filterReleasedDecade: number;
  filterReleasedYear: number;
  filterDiaryYear: number;
  filterLoggedBefore: boolean;
  filterGenre: string;
}

export interface FilterState {
  filterMediaType: MediaType[] | null;
  filterRating: Filters["filterRating"] | null;
  filterReleasedDecade: Filters["filterReleasedDecade"] | null;
  filterDiaryYear: Filters["filterDiaryYear"] | null;
  filterLoggedBefore: Filters["filterLoggedBefore"] | null;
  filterGenre: Filters["filterGenre"] | null;
}

export type FilterDataNoYear = {
  [K in keyof Omit<Filters, "filterDiaryYear">]: {
    [key: string]: {
      [key: string]: number;
    };
  };
};

export type FilterData = {
  filterDiaryYear: {
    [key: string]: number;
  };
} & {
  [K in keyof Omit<Filters, "filterDiaryYear">]: {
    [key: string]: {
      [key: string]: number;
    };
  };
};

export type FuegoUser = firebase.User | null | false;
export type FuegoValidatedUser = firebase.User;

/**
 * Structure for a user's preference set during NewUserFlow
 */
export interface UserPref {
  /** User's choice of media to track set during NewUserFlow */
  mediaTypes: MediaTypes;

  /** User's choice of theme set during NewUserFlow */
  theme: "light" | "dark";
}

export type FuegoUserPref = UserPref | null | false;
