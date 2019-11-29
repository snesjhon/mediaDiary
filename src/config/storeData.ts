import { Thunk, thunk, action, Action } from "easy-peasy";
import { db } from "./db";
import { MediaInfo, MediaTypes } from "./storeMedia";

interface DataSet {
  byID: firebase.firestore.DocumentData | undefined;
  byDate: firebase.firestore.DocumentData | undefined;
}

interface DataPut extends MediaInfo {
  seen: boolean;
  star: number;
  type: MediaTypes["type"];
}

export interface Data extends DataSet {
  dataSet: Action<Data, DataSet>;
  dataGet: Thunk<Data>;
  dataPut: Thunk<Data, DataPut>;
}

export const data: Data = {
  byID: [],
  byDate: [],
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
    actions.dataSet({ byID: byID.data(), byDate: byDate.data() });
  }),
  dataPut: thunk(async (actions, payload, { injections }) => {
    const {
      id,
      type,
      poster,
      title,
      published,
      overview,
      artist,
      star,
      seen
    } = payload;
    const dbByID = db.collection("media").doc("byID");
    const dbByDate = db.collection("media").doc("byDate");

    db.runTransaction(transaction => {
      const dataByID = {
        poster,
        title,
        published,
        overview,
        artist,
        star,
        seen
      };
      return transaction.get(dbByID).then(movieCollection => {
        if (!movieCollection.exists) {
          transaction.set(dbByID, {
            [`${type}_${id}`]: dataByID
          });
        }
        transaction.update(dbByID, {
          [`${type}_${id}`]: dataByID
        });
      });
    });

    db.runTransaction(transaction => {
      const dataByDate = {
        [new Date().getTime()]: {
          id: `${type}_${id}`,
          dateAdded: new Date(),
          published,
          type,
          seen,
          star
        }
      };
      return transaction.get(dbByDate).then(movieDates => {
        if (!movieDates.exists) {
          return transaction.set(dbByDate, dataByDate);
        }
        return transaction.update(dbByDate, dataByDate);
      });
    });

    actions.dataGet();

    console.log("something happens");
  })
};
