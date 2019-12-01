import { Action, action, Thunk, thunk } from "easy-peasy";
import * as firebase from "firebase/app";
import "firebase/auth";
import { fb } from "./db";
import { StoreModel } from "./store";

export interface Global {
  theme: "light" | "dark";
  user: firebase.User | null;
  userAdd: Action<Global, firebase.User | null>;
  userVerify: Thunk<Global, void, void, StoreModel>;
  userLogout: Thunk<Global>;
}

const provider = new firebase.auth.GoogleAuthProvider();

export const global: Global = {
  theme: "light",
  user: null,
  userAdd: action((state, payload) => {
    state.user = payload;
  }),
  userLogout: thunk(async actions => {
    fb.auth()
      .signOut()
      .then(function() {
        actions.userAdd(null);
      })
      .catch(function(error) {});
  }),
  userVerify: thunk(async (actions, payload, { getStoreActions }) => {
    const result = await firebase.auth().signInWithPopup(provider);
    actions.userAdd(result.user);
    getStoreActions().data.dataGet();
  })
};
