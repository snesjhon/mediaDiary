import { Thunk, thunk, action, Action } from "easy-peasy";
import { db } from "./db";
import { MediaInfo, MediaTypes } from "./storeMedia";

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
  date: firebase.firestore.Timestamp;
  dateAdded: firebase.firestore.Timestamp;
  id: string;
  seen: boolean;
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
  dataGet: Thunk<Data>;
  dataPut: Thunk<Data, DataPut>;
}

export const data: Data = {
  byID: {},
  byDate: {},
  dataSet: action((state, payload) => {
    state.byID = payload.byID;
    state.byDate = payload.byDate;
  }),
  dataGet: thunk(async actions => {
    const byID = await db
      .collection("media")
      .doc("byID")
      .get();
    const byDate = await db
      .collection("media")
      .doc("byDate")
      .get();
    actions.dataSet({
      byID: byID.data() || {},
      byDate: byDate.data() || {}
    });
  }),
  dataPut: thunk(async (actions, payload, { getStoreActions }) => {
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
    const dbByID = db.collection("media").doc("byID");
    const dbByDate = db.collection("media").doc("byDate");

    const prByID = db.runTransaction(transaction => {
      let dataByID = {
        poster,
        title,
        published,
        overview,
        artist,
        star,
        seen
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
            [`${type}_${id}`]: dataByID
          });
        }
        transaction.update(dbByID, {
          [`${type}_${id}`]: dataByID
        });
        return Promise.resolve();
      });
    });

    const prByDate = db.runTransaction(transaction => {
      const dataByDate = {
        [new Date().getTime()]: {
          id: `${type}_${id}`,
          dateAdded: new Date(),
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
  })
};

// getStoreActions().media.mediaSelect();
