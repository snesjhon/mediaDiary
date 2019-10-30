/**
 * ACTIONS
 * ---
 * We have a central way of dispatching actions throughout the app without having to start multiple
 * states. But also, we have the store be plugged into the context. That way anytime that we dispatch
 * something within the state it not only updates the current value, but also updates the "connected"
 * components. Saving us the need of having redux as a dependency.
 */
import { db } from "./db";
import * as firebase from "firebase/app";

export const ADD_MEDIA = "ADD_MEDIA";

// export async function getFilm(search, dispatch) {
//   const result = await fetch(
//     `https://api.themoviedb.org/3/search/movie?api_key=${MBD_KEY}&language=en-US&query=${encodeURIComponent(
//       search
//     )}&page=1&include_adult=false`
//   );
//   const json = await result.json();
//   return dispatch({ type: ADD_MEDIA, payload: json.results });
// }

export const addMediaLog = (media, type) => {
  console.log(media, type);
};

// async function handleAlbumInfo(artist, name, mbid) {
//   const r = await fetch(
//     `http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${
//       process.env.REACT_APP_LASTFM
//     }${
//       mbid !== "" ? `&mbid=${mbid}` : `&artist=${artist}&album=${name}`
//     }&format=json`
//   );
//   const albumInfo = await r.json();
//   // after handling the information we can then get the info into the viewer.
//   console.log(albumInfo);
//   return {
//     tvMedia: albumInfo
//   };
// }

export const addMedia = (media, type, date, star, seen) => {
  if (type === "tv" || type === "film") {
    return addMediaToFB(media, type, date, star, seen);
  } else {
    return fetch(
      `http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${
        process.env.REACT_APP_LASTFM
      }${
        media.mbid !== ""
          ? `&mbid=${media.mbid}`
          : `&artist=${media.artist}&album=${media.name}`
      }&format=json`
    )
      .then(r => r.json())
      .then(info => {
        return addMediaToFB(info.album, type, date, star, seen);
      });
  }
};

const addMediaToFB = (media, type, date, star, seen) => {
  console.log(date, star, seen);
  let movieID;
  if (type === "tv" || type === "film") {
    movieID = media.id.toString();
  } else {
    movieID = media.mbid
      ? media.mbid
      : encodeURIComponent(media.artist + media.name);
  }
  const moviesByID = db.collection("media").doc("byID");
  const moviesByDate = db.collection("media").doc("byDate");

  db.runTransaction(transaction => {
    return transaction.get(moviesByID).then(movieCollection => {
      if (!movieCollection.exists) {
        transaction.set(moviesByID, {
          [`${type}_${movieID}`]: media
        });
      }
      transaction.update(moviesByID, {
        [`${type}_${movieID}`]: media
      });
    });
  });

  db.runTransaction(transaction => {
    return transaction.get(moviesByDate).then(movieDates => {
      if (!movieDates.exists) {
        return transaction.set(moviesByDate, {
          [new Date(date).toLocaleDateString().replace(/\//g, "-")]: {
            [`${type}_${movieID}`]: {
              id: `${type}_${movieID}`,
              dateAdded: firebase.firestore.FieldValue.serverTimestamp(),
              type,
              seen,
              star
            }
          }
        });
      }
      let currentDate;
      const currentData = movieDates.data();
      if (currentData) {
        currentDate =
          currentData[new Date(date).toLocaleDateString().replace(/\//g, "-")];
      }

      transaction.update(moviesByDate, {
        [new Date(date).toLocaleDateString().replace(/\//g, "-")]: {
          ...currentDate,
          [`${type}_${movieID}`]: {
            id: `${type}_${movieID}`,
            dateAdded: firebase.firestore.FieldValue.serverTimestamp(),
            type,
            seen,
            star
          }
        }
      });
    });
  });
};
