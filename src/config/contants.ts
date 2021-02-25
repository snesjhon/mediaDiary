import type { MediaType, MediaTypesArr } from "../types/typesMedia";

export const MEDIA_TYPES: MediaTypesArr = ["movie", "tv", "album"];

export const MEDIA_LOGGED_BEFORE: { [key in MediaType]: string } = {
  album: "I've heard this before?",
  movie: "I've watched this before?",
  tv: "I've watched this before?",
};

export const MDB_IMGURL = "https://image.tmdb.org/t/p/";

export const SPOTIFY_IMGURL = "https://i.scdn.co/image/";
