import type {
  SpotifyAlbum,
  SpotifyArtist,
  MDbMovie,
  MDbTV,
  MDbTVSeason,
  MediaType,
} from "@/types";
import {
  getTVUrl,
  getMovieUrl,
  getAlbumUrl,
  getArtistUrl,
  fetcher,
  spotifyFetchAll,
} from "@/utils";
import useSWR from "swr";

export type DataFetchSpotify = [SpotifyAlbum, SpotifyArtist];
export type DataFetchMDb = MDbMovie | MDbTV | MDbTVSeason;
export type DataFetch = DataFetchMDb | DataFetchSpotify | false;

interface Props {
  type: MediaType | false;
  firstId: string | false;
  secondId?: string | false;
  season?: number;
  isSuspense?: boolean;
}
function useDataFetch({ type, firstId, secondId, season, isSuspense }: Props): {
  isLoading: boolean;
  data: DataFetch;
  error: string;
} {
  let returnKey = null;
  if (firstId) {
    if (type === "tv") {
      returnKey = getTVUrl(firstId, season);
    } else if (type === "movie") {
      returnKey = getMovieUrl(firstId);
    } else if (type === "album" && secondId) {
      returnKey = [getAlbumUrl(firstId), getArtistUrl(secondId)];
    }
  }
  const { data, isValidating, error } = useSWR<DataFetch>(
    returnKey,
    type !== "album" ? fetcher : spotifyFetchAll,
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
}

export default useDataFetch;
