import type { MediaType } from "@/types";
import { fetcher, spotifyFetch } from "@/utils";
import useSWR from "swr";
import type { DataPopularFetch } from "./types";

interface Props {
  type: MediaType | false;
  searchType: "popular" | "";
}

const apiURL = "https://api.themoviedb.org/3";
const apiKey = `?api_key=${process.env.NEXT_PUBLIC_MDBKEY}&region=US`;

export default function useMediaTopFetch({ type, searchType }: Props): {
  isLoading: boolean;
  data: DataPopularFetch;
  error: string;
} {
  let returnKey = null;
  if (searchType !== "") {
    if (type === "tv") {
      returnKey = getTVUrl();
    } else if (type === "movie") {
      returnKey = getMovieUrl();
    } else if (type === "album") {
      returnKey = getAlbumUrl();
    }
  }
  const { data, isValidating, error } = useSWR<DataPopularFetch>(
    returnKey,
    type !== "album" ? fetcher : spotifyFetch,
    {
      revalidateOnFocus: false,
      suspense: true,
    }
  );
  return {
    isLoading: !data && isValidating,
    data: data && !isValidating ? data : false,
    error: !data && error,
  };

  function getTVUrl(): string {
    return `${apiURL}/tv/top_rated/${apiKey}`;
  }

  function getMovieUrl(): string {
    return `${apiURL}/movie/popular/${apiKey}`;
  }

  function getAlbumUrl(): string {
    return `https://api.spotify.com/v1/albums/`;
  }
}
