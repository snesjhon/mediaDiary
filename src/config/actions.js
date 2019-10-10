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

export const addMedia = (media, type) => {
  const moviesByID = db.collection("media").doc("byID");
  const moviesByDate = db.collection("media").doc("byDate");

  db.runTransaction(transaction => {
    return transaction.get(moviesByID).then(movieCollection => {
      if (!movieCollection.exists) {
        transaction.set(moviesByID, {
          [`${type}_${media.id.toString()}`]: media
        });
      }
      transaction.update(moviesByID, {
        [`${type}_${media.id.toString()}`]: media
      });
    });
  });

  db.runTransaction(transaction => {
    return transaction.get(moviesByDate).then(movieDates => {
      if (!movieDates.exists) {
        return transaction.set(moviesByDate, {
          [new Date().toLocaleDateString().replace(/\//g, "-")]: {
            [`${type}_${media.id.toString()}`]: {
              id: `${type}_${media.id.toString()}`,
              rewatched: false,
              dateAdded: firebase.firestore.FieldValue.serverTimestamp(),
              type: type
            }
          }
        });
      }
      let currentDate;
      const currentData = movieDates.data();
      if (currentData) {
        currentDate =
          currentData[new Date().toLocaleDateString().replace(/\//g, "-")];
      }

      transaction.update(moviesByDate, {
        [new Date().toLocaleDateString().replace(/\//g, "-")]: {
          ...currentDate,
          [`${type}_${media.id.toString()}`]: {
            id: `${type}_${media.id.toString()}`,
            rewatched: false,
            dateAdded: firebase.firestore.FieldValue.serverTimestamp(),
            type: type
          }
        }
      });
    });
  });
};
