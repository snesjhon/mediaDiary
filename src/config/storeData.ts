import { Thunk, thunk, action, Action } from "easy-peasy";
import { db } from "./db";

export interface Data {
  list: [];
  diary: [];
  dataSet: Action<Data, any>;
  dataGet: Thunk<Data, any>;
}

export const data: Data = {
  list: [],
  diary: [],
  dataSet: action((state, payload) => {
    state.list = payload.list;
    state.diary = payload.diary;
  }),
  dataGet: thunk(async actions => {
    // db.collection("media")
    // .doc("byID")
    const list = await db
      .collection("media")
      .doc("byID")
      .get();
    const diary = await db
      .collection("media")
      .doc("byDate")
      .get();

    actions.dataSet({ list: list.data(), diary: diary.data() });
  })
};
