/**
 * MovieDB Results for TV based on ID
 */
export interface MDbTV {
  backdrop_path: string;
  credits?: TVCredits;
  created_by?: CreatedByEntity[] | null;
  episode_run_time?: number[] | null;
  first_air_date: string;
  genres?: GenresEntity[] | null;
  homepage: string;
  id: number;
  in_production: boolean;
  languages?: string[] | null;
  last_air_date: string;
  last_episode_to_air: LastEpisodeToAir;
  name: string;
  next_episode_to_air?: null;
  networks?: NetworksEntity[] | null;
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country?: string[] | null;
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies?: null[] | null;
  production_countries?: null[] | null;
  seasons?: SeasonsEntity[] | null;
  spoken_languages?: SpokenLanguagesEntity[] | null;
  status: string;
  tagline: string;
  type: string;
  vote_average: number;
  vote_count: number;
}

export interface CreatedByEntity {
  id: number;
  credit_id: string;
  name: string;
  gender: number;
  profile_path?: null;
}

export interface GenresEntity {
  id: number;
  name: string;
}

export interface LastEpisodeToAir {
  air_date: string;
  episode_number: number;
  id: number;
  name: string;
  overview: string;
  production_code: string;
  season_number: number;
  still_path: string;
  vote_average: number;
  vote_count: number;
}

export interface NetworksEntity {
  name: string;
  id: number;
  logo_path: string;
  origin_country: string;
}

export interface SeasonsEntity {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path?: string | null;
  season_number: number;
}

export interface SpokenLanguagesEntity {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface TVCredits {
  cast?: TVCast[] | null;
  crew?: TVCrew[] | null;
}

export interface TVCast {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path?: string | null;
  character: string;
  credit_id: string;
  order: number;
}

export interface TVCrew {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path?: string | null;
  credit_id: string;
  department: string;
  job: string;
}

/**
 * MovieDB Results for TV based on ID
 */
export interface MDbMovie {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection?: null;
  budget: number;
  genres?: MovieGenres[] | null;
  homepage: string;
  id: number;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies?: MovieProductionCompanies[] | null;
  production_countries?: MovieProductionCountries[] | null;
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages?: MovieSpokenLanguages[] | null;
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  credits: MovieCredits;
  ["watch/providers"]: MovieWatchproviders;
  videos: MovieVideos;
}

export interface MovieGenres {
  id: number;
  name: string;
}

export interface MovieProductionCompanies {
  id: number;
  logo_path?: null;
  name: string;
  origin_country: string;
}

export interface MovieProductionCountries {
  iso_3166_1: string;
  name: string;
}

export interface MovieSpokenLanguages {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface MovieCredits {
  cast?: MovieCastEntity[] | null;
  crew?: MovieCrewEntity[] | null;
}

export interface MovieCastEntity {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path?: string | null;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
}

export interface MovieCrewEntity {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path?: string | null;
  credit_id: string;
  department: string;
  job: string;
}

export interface MovieWatchproviders {
  results: MovieWatchCountries;
}

export interface MovieWatchCountries {
  [key: string]: MovieWatchItem;
}

export interface MovieWatchItem {
  link: string;
  flatrate?: MovieWatchPurchase[] | null;
  rent?: MovieWatchPurchase[] | null;
  buy?: MovieWatchPurchase[] | null;
}

export interface MovieWatchPurchase {
  display_priority: number;
  logo_path: string;
  provider_id: number;
  provider_name: string;
}

export interface MovieVideos {
  results?: MovieVideosResults[] | null;
}

export interface MovieVideosResults {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
}
