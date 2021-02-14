import useSWR from "swr";
import type { MediaType } from "../config/types";
import type { MDbMovie, MDbTV } from "../config/typesMDb";
import type { SpotifyAlbum, SpotifyArtist } from "../config/typesSpotify";
import { spotifyFetch } from "./fetchers";
import { getAlbumUrl, getArtistUrl, getMovieUrl, getTVUrl } from "./helpers";

export type DataFetchSpotify = [SpotifyAlbum, SpotifyArtist];
export type DataFetchMDb = MDbMovie | MDbTV;
export type DataFetch = DataFetchMDb | DataFetchSpotify | false;

interface Props {
  type: MediaType;
  firstId: string;
  secondId?: string;
  season?: number;
  token?: string;
  isSuspense?: boolean;
}
function useDataFetch({
  type,
  firstId,
  secondId,
  season,
  token,
  isSuspense,
}: Props): {
  isLoading: boolean;
  data: DataFetch;
  error: string;
} {
  let returnKey = null;
  if (firstId) {
    if (type === "tv") {
      // TODO: remove this after database migration
      const idArr = firstId.split("_");
      returnKey = getTVUrl(idArr[0], season);
    } else if (type === "movie") {
      returnKey = getMovieUrl(firstId);
    } else if (type === "album" && secondId) {
      returnKey = [getAlbumUrl(firstId), getArtistUrl(secondId), token];
    }
  }
  const { data, isValidating, error } = useSWR<DataFetch>(
    returnKey,
    type !== "album" ? fetcher : fetchAll,
    {
      revalidateOnFocus: false,
      suspense: isSuspense ?? undefined,
    }
  );

  return {
    isLoading: !data && isValidating,
    data: data && !isValidating ? data : false,
    error: !data && error,
  };

  function fetcher(key: string) {
    return fetch(key).then((r) => r.json());
  }

  function fetchAll(albumId: string, artistId: string, token: string) {
    const albumFetch = spotifyFetch<SpotifyAlbum>(albumId, token);
    const artistFetch = spotifyFetch<SpotifyArtist>(artistId, token);
    return Promise.all([albumFetch, artistFetch]).then((results) => results);
  }
}

export default useDataFetch;
