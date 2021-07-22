import dayjs from "dayjs";
import type { DataFetch } from "../config";
import type {
  MDbMovie,
  MDbTV,
  MediaSelected,
  MediaType,
  SpotifyAlbum,
  SpotifyArtist,
} from "../types";
import { parsePosterUrl } from "./helpers";

export default function createMediaSelected(
  type: MediaType,
  data: DataFetch,
  bookmark = false,
  memory = false,
  diary = false
): MediaSelected | false {
  if (data) {
    if (type === "movie") {
      const castItem = data as MDbMovie;
      let released;
      try {
        released = dayjs(castItem.release_date).toISOString();
      } catch {
        released = castItem.release_date;
      }

      let movieItem: MediaSelected = {
        releasedDate: released,
        mediaId: castItem.id.toString(),
        poster: parsePosterUrl(castItem.poster_path, "movie"),
        type: "movie",
        title: castItem.title,
        artist: "",
        genre: "",
        bookmark,
        memory,
        diary,
      };

      if (castItem.credits.crew) {
        movieItem = {
          ...movieItem,
          artist:
            castItem.credits.crew.find((e) => e.job === "Director")?.name ?? "",
        };
      }

      if (castItem.genres) {
        movieItem["genre"] = castItem.genres[0].name;
      }
      return movieItem;
    } else if (type === "tv") {
      const castItem = data as MDbTV;

      let released;
      try {
        released = dayjs(castItem.first_air_date).toISOString();
      } catch {
        released = castItem.first_air_date;
      }
      let tvItem: MediaSelected = {
        releasedDate: released,
        mediaId: castItem.id.toString(),
        poster: parsePosterUrl(castItem.poster_path, "tv"),
        type: "tv",
        title: castItem.name,
        artist: "",
        genre: "",
        bookmark,
        memory,
        seasons: castItem.seasons,
        diary,
      };

      if (castItem.seasons && castItem.seasons !== null) {
        tvItem = {
          ...tvItem,
          poster:
            castItem.poster_path !== null
              ? parsePosterUrl(castItem.poster_path, "tv")
              : "",
          season: -1,
        };
      }

      if (castItem.genres) {
        tvItem = {
          ...tvItem,
          genre: castItem.genres[0].name,
        };
      }

      if (castItem.created_by && castItem.created_by.length > 0) {
        tvItem = {
          ...tvItem,
          artist: castItem.created_by.map((e) => e.name).join(", "),
        };
      }
      return tvItem;
    } else if (type === "album") {
      const [albumData, artistData] = data as [SpotifyAlbum, SpotifyArtist];
      const albumItem: MediaSelected = {
        type,
        mediaId: albumData.id,
        poster:
          typeof albumData.images !== "undefined" && albumData.images !== null
            ? parsePosterUrl(albumData.images[0].url, "album")
            : "",
        title: albumData.name,
        releasedDate: dayjs(albumData.release_date).toISOString(),
        artist:
          albumData.artists && albumData.artists !== null
            ? albumData.artists[0].name
            : "",
        artistId:
          albumData.artists && albumData.artists !== null
            ? albumData.artists[0].id
            : "",
        genre: (artistData.genres && artistData.genres[0]) ?? "none",
        bookmark,
        memory,
        diary,
      };
      return albumItem;
    }
  }
  return false;
}
