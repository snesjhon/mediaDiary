import type { MediaTypes } from "./types";

export const MEDIA_TYPES: MediaTypes[] = ["movie", "tv", "album"];

export const MEDIA_LOGGED_BEFORE: { [key in MediaTypes]: string } = {
  album: "I've heard this before?",
  movie: "I've watched this before?",
  tv: "I've watched this before?",
};
