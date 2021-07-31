export type DataPopularFetch = MoviePopular | false;

export interface MoviePopular {
  page: number;
  results: MoviePopularResult[];
  total_pages: number;
  total_results: number;
}

export interface MoviePopularResult {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: MoviePopularLanguage;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: Date;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export enum MoviePopularLanguage {
  CN = "cn",
  En = "en",
}
