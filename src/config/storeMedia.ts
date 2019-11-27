import { MBD_KEY, MDB_URL } from "./constants";
import { MediaById } from "./types";
import { Thunk, Action, action } from "easy-peasy";

export interface MediaSelected {
  id: number | undefined;
  poster: string;
  title: string;
  published: Date;
  overview: string;
  artist: string | undefined;
  watched: string | undefined;
  seasons?: Object | undefined;
}
// watched: boolean | undefined;

export interface MediaTypes {
  type: "film" | "tv" | "album" | "";
}

export interface MediaSet {
  media: MediaById;
  date: Date;
  star: number;
  seen: Boolean;
}

export interface MediaByDate {
  date: Date;
  dateAdded: Date;
  id: string;
  seen: boolean;
  star: number;
  type: string;
}

export interface MediaById {
  poster: string;
  title: string;
  date: Date;
  overview: string;
  artist: string;
  star: number;
  seen: boolean;
  info: object;
}

export interface Media {
  mediaSelected: MediaSelected;
  mediaSelect: Action<Media, MediaSelected | {}>;
}

export const media: Media = {
  mediaSelected:
    {
      id: undefined,
      poster: "",
      title: "",
      published: new Date(),
      overview: "",
      artist: "",
      watched: ""
    } || {},
  mediaSelect: action((state, payload) => {})
};

// mediaSelected:
// {
// 	poster: "",
// 	title: "",
// 	published: undefined,
// 	overview: "",
// 	artist: "",
// 	watched: false
// },

// filmSet: Thunk<
// Data,
// { media: MediaById; date: Date; star: number; seen: Boolean }
// >;
// filmSet: thunk(async (actions, { media, date, seen, star }) => {
// 	const r = await fetch(
// 		`${MDB_URL}/movie/${media.id}/credits?api_key=${MBD_KEY}`
// 	);
// 	const credits = await r.json();
// 	const filmMedia = {
// 		...media,
// 		director: credits.crew.find((e: any) => e.job === "Director").name
// 	};
// })
// // filmSet: thunk(async (actions, payload) => {
// //   // export const addFilm = async (
// //   //   media: any,
// //   //   date: Date,
// //   //   star: number,
// //   //   seen: Boolean
// //   // ) => {
// // const r = await fetch(
// //   `${MDB_URL}/movie/${media.id}/credits?api_key=${MBD_KEY}`
// // );
// //   //   const credits = await r.json();
// // const filmMedia = {
// //   ...media,
// //   director: credits.crew.find((e: any) => e.job === "Director").name
// // };
// //   //   return addMediaToFB(filmMedia, "film", date, star, seen);
// //   // };
// // })
