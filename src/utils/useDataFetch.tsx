import useSWR from "swr";
import type { MediaType } from "../config/types";
import type { MDbMovie, MDbTV } from "../config/typesMDb";
import type { SpotifyAlbum, SpotifyArtist } from "../config/typesSpotify";
import { getAlbumUrl, getArtistUrl, spotifyFetchAll } from "./helperSpotify";
import { fetcher } from "./helpers";
import { getMovieUrl, getTVUrl } from "./helperMDb";

export type DataFetchSpotify = [SpotifyAlbum, SpotifyArtist];
export type DataFetchMDb = MDbMovie | MDbTV;
export type DataFetch = DataFetchMDb | DataFetchSpotify | false;

interface Props {
  type: MediaType;
  firstId: string;
  secondId?: string;
  season?: number;
  isSuspense?: boolean;
}
function useDataFetch({
  type,
  firstId,
  secondId,
  season,
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
