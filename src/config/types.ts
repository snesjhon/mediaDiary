/**
 * MediaTypes include all of the current available types for mediaDiary
 */
export type MediaTypes = "movie" | "album" | "tv";

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
  type: MediaTypes;
  season?: number;
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

export interface DiaryAddWithId extends DiaryAdd {
  id: string;
}

export interface DiaryState {
  [key: string]: DiaryAdd;
}

export interface MediaSelected
  extends Omit<MediaBase, "releasedYear" | "releasedDecade"> {
  mediaId: DiaryAdd["mediaId"];
  artistId?: DiaryAdd["artistId"];
}

export interface MediaEdit {
  diaryId: string;
  diary: DiaryAdd;
}

export interface Filters {
  filterMediaType: MediaTypes;
  filterRating: number;
  filterReleasedDecade: number;
  filterReleasedYear: number;
  filterDiaryYear: number;
  filterLoggedBefore: boolean;
  filterGenre: string;
}

export interface FilterState {
  filterMediaType: MediaTypes[] | null;
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
  mediaType: MediaTypes[];

  /** User's choice of theme set during NewUserFlow */
  theme: "light" | "dark";
}

export type FuegoUserPref = UserPref | null | false;
