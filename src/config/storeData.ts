import { Thunk, thunk, action, Action } from "easy-peasy";
import { db } from "./db";

interface DataSet {
  byID: firebase.firestore.DocumentData | undefined;
  byDate: firebase.firestore.DocumentData | undefined;
}

export interface Data extends DataSet {
  dataSet: Action<Data, DataSet>;
  dataGet: Thunk<Data>;
  dataPut: Thunk<Data>;
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
  dataPut: thunk(async (actions, payload) => {})
};
