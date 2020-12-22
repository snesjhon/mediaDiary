export type MediaTypes = "movie" | "album" | "tv";

export interface MediaBase {
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
  mediaId: string; // MovieDB or MovieDB_TV or SpotifyID
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
