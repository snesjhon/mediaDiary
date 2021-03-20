import type { MediaType } from "./typesMedia";

export interface FilterDiary {
  mediaType: MediaType;
  releasedDecade: number;
  releasedYear: number;
  genre: string;
  rating: number;
  diaryYear: number;
  loggedBefore: boolean;
}

export interface FilterBookmark
  extends Omit<FilterDiary, "rating" | "diaryYear" | "loggedBefore"> {
  addedDate: string;
}

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

interface FilterMediaType {
  mediaType: MediaType[] | null;
}

export type FilterState = FilterMediaType &
  {
    [K in keyof Omit<FilterDiary, "mediaType">]: FilterDiary[K] | null;
  };

export type FilterBookmarkState = FilterMediaType &
  {
    [K in keyof FilterBookmark]: FilterBookmark[K] | null;
  };
