import type { MediaTypesArr, MediaTypes, MediaType } from "../config/types";

export function getTVUrl(id: string, seasonId?: number): string {
  if (seasonId) {
    return `https://api.themoviedb.org/3/tv/${id}/season/${seasonId}?api_key=${process.env.NEXT_PUBLIC_MDBKEY}&append_to_response=credits,videos`;
  }
  return `https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.NEXT_PUBLIC_MDBKEY}&append_to_response=credits,videos`;
}

export function getMovieUrl(id: string): string {
  return `https://api.themoviedb.org/3/movie/${encodeURIComponent(
    id
  )}?api_key=${
    process.env.NEXT_PUBLIC_MDBKEY
  }&append_to_response=credits,videos`;
}

export function getArtistUrl(id: string): string {
  return `https://api.spotify.com/v1/artists/${id}`;
}

export function getAlbumUrl(id: string): string {
  return `https://api.spotify.com/v1/albums/${id}`;
}

export function capFormat(
  item: string,
  options?: {
    allCaps?: boolean;
    isPlural?: boolean;
  }
): string {
  const addS = `${options?.isPlural ? "s" : ""}`;
  if (options?.allCaps) {
    return item.toUpperCase() + addS;
  } else {
    const firstItem = item.charAt(0).toUpperCase();
    return `${firstItem}${item.slice(1)}${addS}`;
  }
}

export function createMediaTypesArr(mediaObj: MediaTypes): MediaType[] {
  return Object.keys(mediaObj).reduce<MediaType[]>((a, c) => {
    if (mediaObj[c as MediaType]) {
      a.push(c as MediaType);
    }
    return a;
  }, []);
}

export function createMediaTypes(mediaTypesArr: MediaTypesArr): MediaTypes {
  return {
    movie: mediaTypesArr.includes("movie") ? true : false,
    tv: mediaTypesArr.includes("tv") ? true : false,
    album: mediaTypesArr.includes("album") ? true : false,
  };
}
