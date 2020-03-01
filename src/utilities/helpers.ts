import { MBDIMGURL } from "../config/constants";

export function createPosterURL({
  type,
  poster,
  size = 500
}: {
  type: string;
  poster: string;
  size?: number;
}) {
  let localPoster = poster;
  if (type === "tv" || type === "film") {
    localPoster = `${MBDIMGURL}w${size}${localPoster}`;
  } else if (type === "album") {
    localPoster = localPoster.replace("100x100", `${size}x${size}`);
  }

  return localPoster;
}
