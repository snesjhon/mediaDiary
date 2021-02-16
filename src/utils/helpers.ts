import type { MediaTypesArr, MediaTypes, MediaType } from "../config/types";

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
