import { Action, action, Thunk, thunk } from "easy-peasy";
import { MDB_URL, MBD_KEY, FM_KEY } from "./constants";
import { StoreModel } from "./store";

export interface MediaInfo {
  id: string;
  poster: string;
  title: string;
  published: Date | "";
  overview: string;
  artist: string;
  mbid?: number | undefined;
  season?: Object | undefined;
}

export interface MediaAdd extends MediaInfo, MediaTypes {
  seen: boolean;
  star: number;
}

export interface MediaSelected extends MediaInfo {
  watched: string | undefined;
}

export interface MediaTypes {
  type: "film" | "tv" | "album" | "";
}

export interface Media {
  mediaSelected: MediaSelected;
  mediaSelect: Action<Media, MediaSelected | void>;
  mediaPutFilm: Thunk<Media, MediaAdd, void, StoreModel>;
  mediaPutTV: Thunk<Media, MediaAdd, void, StoreModel>;
  mediaPutAlbum: Thunk<Media, MediaAdd, void, StoreModel>;
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
  mediaPutFilm: thunk(async (actions, payload, { getStoreActions }) => {
    const mbdResult = await fetch(
      `${MDB_URL}/movie/${payload.id}/credits?api_key=${MBD_KEY}`
    );
    const credits = await mbdResult.json();
    const filmMedia = {
      ...payload,
      artist: credits.crew.find((e: any) => e.job === "Director").name
    };
    actions.mediaSelect();
    getStoreActions().data.dataPut(filmMedia);
  }),
  mediaPutTV: thunk(async (actions, payload, { getStoreActions }) => {
    actions.mediaSelect();
    getStoreActions().data.dataPut(payload);
  }),
  mediaPutAlbum: thunk(async (actions, payload, { getStoreActions }) => {
    const fmResult = await fetch(
      `http://ws.audioscrobbler.com/2.0/?method=album.getinfo&${
        typeof payload.mbid !== "undefined"
          ? `&mbid=${payload.mbid}`
          : `&artist=${payload.artist}&album=${payload.title}`
      }&format=json&api_key=${FM_KEY}`
    );
    const info = await fmResult.json();
    const albumObj = {
      ...payload,
      poster: info.album.image[3]["#text"],
      title: info.album.name,
      artist: info.album.artist,
      overview:
        typeof info.album.wiki !== "undefined"
          ? info.album.wiki.summary.split("<a href")[0]
          : undefined
    };
    actions.mediaSelect();
    getStoreActions().data.dataPut(albumObj);
  })
};
// export const addFilm = async (
//   media: any,
//   date: Date,
//   star: number,
//   seen: Boolean
// ) => {
// return addMediaToFB(filmMedia, "film", date, star, seen);
// };
// onDataPut: thunkOn(
//   (actions, e) => {
//     console.log("whathappened");
//     return e.dataPut;
//   },
//   (state, target) => {
//     console.log("happening");
//     state.mediaSelected = mediaInit;
//   }
// )
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
