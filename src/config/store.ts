// https://easy-peasy.now.sh/docs/quick-start.html#create-the-store
import { createStore, createTypedHooks, persist } from "easy-peasy";
import { global, Global } from "./storeGlobal";
import { data, Data } from "./storeData";
import { media, Media } from "./storeMedia";

interface StoreModel {
  global: Global;
  data: Data;
  media: Media;
}

const storeModel = persist({
  global,
  data,
  media
});

const typedHooks = createTypedHooks<StoreModel>();

export const store = createStore(storeModel);
export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;

// // ADD MEDIA
// export const addTv = (
//   media: any,
//   date: Date,
//   star: number,
//   seen: Boolean,
//   info: any,
//   season: any
// ) => {
//   const tvMedia = {
//     ...media,
//     creator: info.created_by.map((e: any) => e.name).join(", "),
//     season
//   };
//   return addMediaToFB(tvMedia, "tv", date, star, seen);
// };

// export const addFilm = async (
//   media: any,
//   date: Date,
//   star: number,
//   seen: Boolean
// ) => {
//   const r = await fetch(
//     `${MDB_URL}/movie/${media.id}/credits?api_key=${MBD_KEY}`
//   );
//   const credits = await r.json();
//   const filmMedia = {
//     ...media,
//     director: credits.crew.find((e: any) => e.job === "Director").name
//   };
//   return addMediaToFB(filmMedia, "film", date, star, seen);
// };

// export const addAlbum = async (
//   media: any,
//   date: Date,
//   star: number,
//   seen: Boolean
// ) => {
//   const r = await fetch(
//     `http://ws.audioscrobbler.com/2.0/?method=album.getinfo&${
//       media.mbid !== ""
//         ? `&mbid=${media.mbid}`
//         : `&artist=${media.artist}&album=${media.name}`
//     }&format=json&api_key=${FM_KEY}`
//   );
//   const info = await r.json();
//   return addMediaToFB(info.album, "album", date, star, seen);
// };

// const addMediaToFB = (
//   media: any,
//   type: MediaTypes["type"],
//   date: Date,
//   star: number,
//   seen: Boolean
// ) => {
//   let movieID: string;
//   if (type === "tv" || type === "film") {
//     movieID = media.id.toString();
//   } else {
//     movieID = media.mbid
//       ? media.mbid
//       : encodeURIComponent(media.artist + media.name);
//   }
//   const moviesByID = db.collection("media").doc("byID");
//   const moviesByDate = db.collection("media").doc("byDate");

//   db.runTransaction(transaction => {
//     return transaction.get(moviesByID).then(movieCollection => {
//       if (!movieCollection.exists) {
//         transaction.set(moviesByID, {
//           [`${type}_${movieID}`]: media
//         });
//       }
//       transaction.update(moviesByID, {
//         [`${type}_${movieID}`]: media
//       });
//     });
//   });

//   db.runTransaction(transaction => {
//     return transaction.get(moviesByDate).then(movieDates => {
//       if (!movieDates.exists) {
//         return transaction.set(moviesByDate, {
//           [new Date().getTime()]: {
//             id: `${type}_${movieID}`,
//             dateAdded: new Date(),
//             date: date,
//             type,
//             seen,
//             star
//           }
//         });
//       }

//       return transaction.update(moviesByDate, {
//         [new Date().getTime()]: {
//           id: `${type}_${movieID}`,
//           dateAdded: new Date(),
//           date: date,
//           type,
//           seen,
//           star
//         }
//       });
//     });
//   });
// };
