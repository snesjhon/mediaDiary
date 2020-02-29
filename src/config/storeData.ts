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

interface DataUpdate {
  dayID: string;
  modifiedDate?: firebase.firestore.Timestamp;
  modifiedSeen?: boolean;
  modifiedStar?: number;
  cb?: () => void;
}

export interface Data extends DataSet {
  dataSet: Action<Data, DataSet>;
  dataGet: Thunk<Data, void, void, StoreModel>;
  dataPut: Thunk<Data, DataPut, void, StoreModel>;
  dataDelete: Thunk<
    Data,
    { mediaID: string; cb: () => void },
    void,
    StoreModel
  >;
  dataUpdate: Thunk<Data, DataUpdate, void, StoreModel>;
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
        .collection(year.toString())
        .doc("byID")
        .get();
      const byDate = await db
        .collection(year.toString())
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
          transaction.update(dbByID, {
            [`${type}_${id}`]: {
              ...dataByID,
              count: typeof currentCount !== "undefined" ? currentCount + 1 : 1
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

      Promise.all([prByID, prByDate]).then(() => {
        return actions.dataGet();
      });
    } else {
      console.log("we have no year");
    }
  }),
  dataDelete: thunk(async (actions, payload, { getStoreState }) => {
    const year = getStoreState().global.preferences.year;
    const itemByDate = getStoreState().data.byDate[payload.mediaID];
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
              transaction.update(dbByID, {
                [itemByID]: firebase.firestore.FieldValue.delete()
              });
            } else {
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
        return transaction.get(dbByDate).then(() => {
          transaction.update(dbByDate, {
            [payload.mediaID]: firebase.firestore.FieldValue.delete()
          });
          return Promise.resolve();
        });
      });

      Promise.all([prByID, prByDate]).then(() => {
        actions.dataGet();
        return payload.cb();
      });
    } else {
      console.log("something went wrong with delete");
    }
  }),
  dataUpdate: thunk(async (actions, payload, { getStoreState }) => {
    const year = getStoreState().global.preferences.year;
    if (year !== null) {
      const dbByDate = db.collection(year).doc("byDate");
      db.runTransaction(transaction => {
        return transaction
          .get(dbByDate)
          .then(byDate => {
            // have to get the ID first.
            const currentDoc = byDate.data();
            debugger;
            if (
              typeof currentDoc !== "undefined" &&
              typeof currentDoc[payload.dayID] !== "undefined"
            ) {
              const currentItem = currentDoc[payload.dayID];

              transaction.update(dbByDate, {
                [payload.dayID]: {
                  ...currentItem,
                  date: payload.modifiedDate,
                  seen: payload.modifiedSeen,
                  star: payload.modifiedStar
                }
              });
            } else {
              console.log("update failed because no id found");
            }
          })
          .then(() => {
            console.log("properly edited");
            actions.dataGet();
            if (payload.cb) {
              payload.cb();
            }
          });
      });
    } else {
      console.log("update didnt work");
    }
  })
};
