import type { MediaType, MediaTypesArr } from "./types";

export const MEDIA_TYPES: MediaTypesArr = ["movie", "tv", "album"];

export const MEDIA_LOGGED_BEFORE: { [key in MediaType]: string } = {
  album: "I've heard this before?",
  movie: "I've watched this before?",
  tv: "I've watched this before?",
};
