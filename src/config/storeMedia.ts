import {
  Action,
  action,
  ActionOn,
  actionOn,
  ThunkOn,
  thunkOn
} from "easy-peasy";
import { Data } from "./storeData";

export interface MediaInfo {
  id: string;
  poster: string;
  title: string;
  published: Date;
  overview: string;
  artist: string;
}

export interface MediaSelected extends MediaInfo {
  watched: string | undefined;
  seasons?: Object | "";
}

export interface MediaTypes {
  type: "film" | "tv" | "album" | "";
}

export interface Media {
  mediaSelected: MediaSelected;
  mediaSelect: Action<Media, MediaSelected | void>;
  onDataPut: ThunkOn<Media, null, Data>;
}

const mediaInit = {
  id: "",
  poster: "",
  title: "",
  published: new Date(),
  overview: "",
  artist: "",
  watched: undefined,
  seasons: ""
};

export const media: Media = {
  mediaSelected: mediaInit,
  mediaSelect: action((state, payload) => {
    state.mediaSelected = payload ? payload : mediaInit;
  }),
  onDataPut: thunkOn(
    (actions, e) => {
      return e.dataPut;
    },
    (state, target) => {
      console.log("happening");
      state.mediaSelected = mediaInit;
    }
  )
};
// onDataPut: actionOn(
//   (actions, dataActions) => {
//     console.log("actions");
//     return dataActions.dataPut;
//   },
//   (state, target) => {
//     console.log("target fired");

//     state.mediaSelected = mediaInit;
//   }
// )

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

// export interface MediaSet {
//   media: MediaById;
//   date: Date;
//   star: number;
//   seen: Boolean;
// watched: boolean | undefined;
// }

// export interface MediaByDate {
//   date: Date;
//   dateAdded: Date;
//   id: string;
//   seen: boolean;
//   star: number;
//   type: string;
// }

// export interface MediaById {
//   poster: string;
//   title: string;
//   date: Date;
//   overview: string;
//   artist: string;
//   star: number;
//   seen: boolean;
//   info: object;
// }
