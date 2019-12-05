import { Thunk, thunk, action, Action } from "easy-peasy";
import { db } from "./db";
import { MediaInfo, MediaTypes } from "./storeMedia";
import { StoreModel } from "./store";
import * as firebase from "firebase/app";

interface DataPut extends MediaInfo, MediaTypes {
  date: Date | "";
  seen: boolean;
  star: number;
}

export interface DataByID extends MediaTypes {
  artist: string;
  overview: string;
  poster: string;
  published: Date | "";
  title: string;
  season?: number | undefined;
  seen: boolean;
  star: number;
}

export interface DataByDate extends MediaTypes {
  // Date the user chose to add their media
  date: firebase.firestore.Timestamp;

  // Internal date to determine order based on how it was added.
  // dateAdded.getTime() is added so we have a quick way of sorting inititally
  dateAdded: firebase.firestore.Timestamp;

  // Media ID to be referenced in fb store byID
  id: string;

  // Whether user has "seen/listened" to this media before
  seen: boolean;

  // User's rating
  star: number;
}

interface DataSet {
  byID: {
    [name: string]: DataByID;
  };
  byDate: {
    [name: string]: DataByDate;
  };
}

export interface Data extends DataSet {
  dataSet: Action<Data, DataSet>;
  dataGet: Thunk<Data, void, void, StoreModel>;
  dataPut: Thunk<Data, DataPut, void, StoreModel>;
  dataDelete: Thunk<Data, string, void, StoreModel>;
}

export const data: Data = {
  byID: {},
  byDate: {},
  dataSet: action((state, payload) => {
    state.byID = payload.byID;
    state.byDate = payload.byDate;
  }),
  dataGet: thunk(async (actions, payload, { getStoreState }) => {
    const year = getStoreState().global.preferences.year;
    if (year !== null) {
      const byID = await db
        .collection(year)
        .doc("byID")
        .get();
      const byDate = await db
        .collection(year)
        .doc("byDate")
        .get();
      actions.dataSet({
        byID: byID.data() || {},
        byDate: byDate.data() || {}
      });
    } else {
      console.log("we have no year");
    }
  }),
  dataPut: thunk(async (actions, payload, { getStoreState }) => {
    const {
      id,
      type,
      poster,
      title,
      published,
      overview,
      artist,
      star,
      seen,
      date,
      season
    } = payload;
    const year = getStoreState().global.preferences.year;
    if (year !== null) {
      const dbByID = db.collection(year).doc("byID");
      const dbByDate = db.collection(year).doc("byDate");

      const prByID = db.runTransaction(transaction => {
        let dataByID = {
          poster,
          title,
          published,
          overview,
          artist,
          star,
          seen,
          type
        };
        if (season) {
          dataByID = {
            ...dataByID,
            ...(season && { season: season })
          };
        }
        return transaction.get(dbByID).then(movieCollection => {
          if (!movieCollection.exists) {
            transaction.set(dbByID, {
              [`${type}_${id}`]: {
                ...dataByID,
                count: 1
              }
            });
          }

          // Instead of keeping a reference of how many times a certain movie is in a list,
          // let's just keep a counter of how often a movie has been added.
          let currentCount;
          const currentDoc = movieCollection.data();
          if (
            typeof currentDoc !== "undefined" &&
            typeof currentDoc[`${type}_${id}`] !== "undefined"
          ) {
            const currentItem = currentDoc[`${type}_${id}`];
            currentCount = currentItem.count;
          }
          // console.log(currentItem);
          transaction.update(dbByID, {
            [`${type}_${id}`]: {
              ...dataByID,
              count: currentCount + 1
            }
          });
          return Promise.resolve();
        });
      });

      const prByDate = db.runTransaction(transaction => {
        const dateAdded = new Date();
        const dataByDate = {
          [dateAdded.getTime()]: {
            id: `${type}_${id}`,
            dateAdded,
            date,
            published,
            type,
            seen,
            star
          }
        };
        return transaction.get(dbByDate).then(movieDates => {
          if (!movieDates.exists) {
            transaction.set(dbByDate, dataByDate);
          }
          transaction.update(dbByDate, dataByDate);
          return Promise.resolve();
        });
      });

      Promise.all([prByID, prByDate]).then(res => {
        return actions.dataGet();
      });
    } else {
      console.log("we have no year");
    }
  }),
  dataDelete: thunk(async (actions, payload, { getStoreState }) => {
    const year = getStoreState().global.preferences.year;
    const itemByDate = getStoreState().data.byDate[payload];
    const itemByID = itemByDate.id;
    if (year !== null) {
      const dbByID = db.collection(year).doc("byID");
      const dbByDate = db.collection(year).doc("byDate");

      const prByID = db.runTransaction(transaction => {
        return transaction.get(dbByID).then(movieCollection => {
          const currentDoc = movieCollection.data();

          if (
            typeof currentDoc !== "undefined" &&
            typeof currentDoc[itemByID] !== "undefined"
          ) {
            const currentItem = currentDoc[itemByID];
            if (currentItem.count === 1) {
              console.log("delete");
              transaction.update(dbByID, {
                [itemByID]: firebase.firestore.FieldValue.delete()
              });
            } else {
              console.log("decrement");
              transaction.update(dbByID, {
                [itemByID]: {
                  ...currentItem,
                  count: currentItem.count - 1
                }
              });
            }
          }
          return Promise.resolve();
        });
      });

      const prByDate = db.runTransaction(transaction => {
        return transaction.get(dbByDate).then(movieDates => {
          transaction.update(dbByDate, {
            [payload]: firebase.firestore.FieldValue.delete()
          });
          return Promise.resolve();
        });
      });

      Promise.all([prByID, prByDate]).then(res => {
        console.log("properly deleted?");
        return actions.dataGet();
      });
    } else {
      console.log("something went wrong with delete");
    }

    //       var cityRef = db.collection('cities').doc('BJ');

    // // Remove the 'capital' field from the document
    // var removeCapital = cityRef.update({
    //     capital: firebase.firestore.FieldValue.delete()
    // });
  })
};
