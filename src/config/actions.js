/**
 * ACTIONS
 * ---
 * We have a central way of dispatching actions throughout the app without having to start multiple
 * states. But also, we have the store be plugged into the context. That way anytime that we dispatch
 * something within the state it not only updates the current value, but also updates the "connected"
 * components. Saving us the need of having redux as a dependency.
 */
import { db } from "./db";

export const ADD_MEDIA = "ADD_MEDIA";

export const addMedia = (media, type, date, star, seen) => {
  if (type === "film") {
    return fetch(
      `https://api.themoviedb.org/3/movie/${media.id}/credits?api_key=${process.env.REACT_APP_MDB}`
    )
      .then(r => r.json())
      .then(info => {
        console.log("film", info, media);
        return addMediaToFB(media, type, date, star, seen);
      });
  } else if (type === "tv") {
    return fetch(
      `https://api.themoviedb.org/3/tv/${media.id}?api_key=${process.env.REACT_APP_MDB}&language=en-US`
    )
      .then(r => r.json())
      .then(info => {
        console.log("tv", info, media);
        return addMediaToFB(media, type, date, star, seen);
      });
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
          [new Date().getTime()]: {
            id: `${type}_${movieID}`,
            dateAdded: new Date(),
            date: date,
            type,
            seen,
            star
          }
        });
      }

      transaction.update(moviesByDate, {
        [new Date().getTime()]: {
          id: `${type}_${movieID}`,
          dateAdded: new Date(),
          date: date,
          type,
          seen,
          star
        }
      });
    });
  });
};
