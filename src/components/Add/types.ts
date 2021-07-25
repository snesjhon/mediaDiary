// This is the root of our search Types. This can be extended for future search queries.
// We always want to keep a strict returnArr to ensure that we follow the userPref
export type SearchTypes = [MDbSearch | false, SpotifySearch | false];

/**
 * THE MOVIE DB SEARCH API
 */
export interface MDbSearch {
  page: number;
  results: MDbSearchResult[];
  total_results: number;
  total_pages: number;
}

export interface MDbSearchResult {
  id: number;
  poster_path?: string;
  popularity: number;
  overview?: string;
  backdrop_path?: string;
  vote_average?: number;
  media_type: string;
  first_air_date?: string;
  origin_country?: string[];
  genre_ids?: number[];
  original_language?: string;
  vote_count?: number;
  name?: string;
  original_name?: string;
  adult?: boolean;
  release_date?: string;
  original_title?: string;
  title?: string;
  video?: boolean;
  profile_path?: string;
  known_for?: MDbSearchKnownFor[];
}

export interface MDbSearchKnownFor {
  poster_path: string;
  adult?: boolean;
  overview: string;
  release_date?: string;
  original_title?: string;
  genre_ids: number[];
  id: number;
  media_type: string;
  original_language: string;
  title?: string;
  backdrop_path: string;
  popularity: number;
  vote_count: number;
  video?: boolean;
  vote_average: number;
  first_air_date?: string;
  origin_country?: string[];
  name?: string;
  original_name?: string;
}

/**
 * SPOTIFY SEARCH API
 */
export interface SpotifySearch {
  albums: SpotifySearchAlbums;
}

export interface SpotifySearchAlbums {
  href: string;
  items: SpotifySearchResult[];
  limit: number;
  next: string;
  offset: number;
  previous: any;
  total: number;
}

export interface SpotifySearchResult {
  album_type: string;
  artists: SpotifySearchArtist[];
  available_markets: string[];
  external_urls: SpotifySearchExternalUrls2;
  href: string;
  id: string;
  images: SpotifySearchImage[];
  name: string;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  type: string;
  uri: string;
}

export interface SpotifySearchArtist {
  external_urls: SpotifySearchExternalUrls;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

export interface SpotifySearchExternalUrls {
  spotify: string;
}

export interface SpotifySearchExternalUrls2 {
  spotify: string;
}

export interface SpotifySearchImage {
  height: number;
  url: string;
  width: number;
}
