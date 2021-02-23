import type { MediaType } from "./types";

export interface Filters {
  mediaType: MediaType;
  rating: number;
  releasedDecade: number;
  releasedYear: number;
  diaryYear: number;
  loggedBefore: boolean;
  genre: string;
}

export interface FilterState {
  mediaType: MediaType[] | null;
  rating: Filters["rating"] | null;
  releasedDecade: Filters["releasedDecade"] | null;
  diaryYear: Filters["diaryYear"] | null;
  loggedBefore: Filters["loggedBefore"] | null;
  genre: Filters["genre"] | null;
}

export type FilterDataNoYear = {
  [K in keyof Omit<Filters, "diaryYear">]: {
    [key: string]: {
      [key: string]: number;
    };
  };
};

export type FilterData = {
  diaryYear: {
    [key: string]: number;
  };
} & {
  [K in keyof Omit<Filters, "diaryYear">]: {
    [key: string]: {
      [key: string]: number;
    };
  };
};
