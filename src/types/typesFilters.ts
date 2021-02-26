import type { MediaType } from "./typesMedia";

export interface FilterBase {
  mediaType: MediaType;
  releasedDecade: number;
  releasedYear: number;
  genre: string;
}

export interface FilterBookmark extends FilterBase {
  addedDate: string;
}

export interface FilterMemory extends FilterBase {
  rating: number;
}

export interface FilterDiary extends FilterMemory {
  diaryYear: number;
  loggedBefore: boolean;
}

// export interface FilterState {
//   mediaType: MediaType[] | null;
//   rating: FilterMemory["rating"] | null;
//   releasedDecade: FilterBase["releasedDecade"] | null;
//   diaryYear: FilterDiary["diaryYear"] | null;
//   loggedBefore: FilterDiary["loggedBefore"] | null;
//   genre: FilterBase["genre"] | null;
// }

type FilterMediaType = {
  mediaType: MediaType[] | null;
};

export type FilterState = FilterMediaType &
  {
    [K in keyof Omit<FilterDiary, "mediaType">]: FilterDiary[K] | null;
  };

export type FilterData = {
  diaryYear: {
    [key: string]: number;
  };
} & {
  [K in keyof Omit<FilterDiary, "diaryYear">]: {
    [key: string]: {
      [key: string]: number;
    };
  };
};

export type FilterBookmarkState = FilterMediaType &
  {
    [K in keyof FilterBookmark]: FilterBookmark[K] | null;
  };
