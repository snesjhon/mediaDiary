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
    return `${apiURL}/discover/movie${apiKey}?certification_country=US&ott_region=US&page=1&primary_release_date.gte=&primary_release_date.lte=&region=&release_date.gte=&release_date.lte=2022-04-14&show_me=0&sort_by=popularity.desc&vote_average.gte=0&vote_average.lte=10&vote_count.gte=100&with_genres=&with_keywords=&with_networks=&with_origin_country=&with_original_language=&with_ott_monetization_types=&with_ott_providers=&with_release_type=&with_runtime.gte=0&with_runtime.lte=400`;
  }

  function getAlbumUrl(): string {
    return `https://api.spotify.com/v1/albums/`;
  }
}
