import { MDB_IMGURL, SPOTIFY_IMGURL } from "../config/contants";
import type {
  MediaTypesArr,
  MediaTypes,
  MediaType,
  MediaDiary,
} from "../types/typesMedia";

export async function fetcher<T>(key: string): Promise<T> {
  const result = await fetch(key);
  return await result.json();
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

/** We only save the ID for poster Urls and thus we need to create the full Url */
export function createPosterURL(
  url: string,
  type: MediaType,
  width?: number
): string {
  if (type === "album") {
    return `${SPOTIFY_IMGURL}${url}`;
  } else {
    if (width) {
      return `${MDB_IMGURL}w${width}/${url}.jpg`;
    }
    return `${MDB_IMGURL}w500/${url}.jpg`;
  }
}

/** We don't want to save the full URL to Fuego, rather just save the ID  */
export function parsePosterUrl(url: string, type: MediaType): string {
  if (type === "album") {
    const item = url.split("/");
    return item[item.length - 1];
  } else {
    const item = url.replace(".jpg", "").split("/");
    return item[item.length - 1];
  }
}

export function createSearchTitles(
  title: MediaDiary["title"],
  artist: MediaDiary["artist"]
): string[] {
  const searchTitles: string[] = [];
  if (title !== "") {
    const titleReplaced = title.replace(/[\W_]+/g, " ");
    const titleLowered = titleReplaced.toLocaleLowerCase();
    searchTitles.push(titleLowered);
    const splitTitle = titleLowered.split("");
    splitTitle.forEach((e: string, i: number) => {
      searchTitles.push(
        splitTitle
          .slice(0, i + 1)
          .join("")
          .toLocaleLowerCase()
      );
    });
  }
  if (artist && artist !== "") {
    const allArtists = artist.split(", ");
    allArtists.forEach((name: string) => {
      const singleArtist = name.toLocaleLowerCase().split("");
      singleArtist.forEach((e: string, i: number) => {
        searchTitles.push(singleArtist.slice(0, i + 1).join(""));
      });
    });
  }
  return searchTitles;
}
