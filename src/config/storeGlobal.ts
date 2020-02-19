import { Action, action, Thunk, thunk } from "easy-peasy";
import * as firebase from "firebase/app";
import "firebase/auth";
import { fb, db } from "./db";
import { StoreModel } from "./store";

export type UserTheme = "light" | "dark";
export type User = firebase.User | null;
export type UserPreferences = {
  theme: UserTheme;
  year: string | null;
  years: string[];
};

export interface Global {
  user: User;
  preferences: UserPreferences;
  userGet: Thunk<Global>;
  userSet: Action<Global, User>;
  userSetPreferences: Action<Global, UserPreferences>;
  userSetConfig: Action<Global, { user: User; preferences: UserPreferences }>;
  userGetPreferences: Thunk<Global, firebase.User | null>;
  userPutPreferences: Thunk<Global, UserPreferences>;
  userLogout: Thunk<Global, void, void, StoreModel>;
}

export const global: Global = {
  user: null,
  preferences: {
    theme: "light",
    year: null,
    years: []
  },
  userGet: thunk(async actions => {
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await fb.auth().signInWithPopup(provider);
    try {
      actions.userGetPreferences(result.user);
    } catch {
      return console.log("handle no user");
    }
  }),
  userSet: action((state, payload) => {
    state.user = payload;
  }),
  userSetPreferences: action((state, payload) => {
    state.preferences = payload;
  }),
  userSetConfig: action((state, payload) => {
    state.user = payload.user;
    state.preferences = payload.preferences;
  }),
  userGetPreferences: thunk(async (actions, payload) => {
    const userRef = db.collection("user").doc("preferences");
    const doc = await userRef.get();
    if (doc.exists) {
      const data = typeof doc.data() !== "undefined" && doc.data();
      if (data) {
        actions.userSetConfig({
          user: payload,
          preferences: {
            theme: data.theme,
            year: data.year,
            years: data.years
          }
        });
      }
    } else {
      // We have a user, but we need the user to choose their own year and then
      // save into the preference
      actions.userSetConfig({
        user: payload,
        preferences: {
          theme: "light",
          year: null,
          years: []
        }
      });
    }
  }),
  userPutPreferences: thunk(async (actions, payload) => {
    const dbPreference = db.collection("user").doc("preferences");
    return db
      .runTransaction(transaction => {
        return transaction.get(dbPreference).then(userPreference => {
          if (!userPreference.exists) {
            transaction.set(dbPreference, payload);
          }
          transaction.update(dbPreference, payload);
        });
      })
      .then(() => {
        actions.userSetPreferences(payload);
      });
  }),
  userLogout: thunk(async (actions, payload, { getStoreActions }) => {
    fb.auth()
      .signOut()
      .then(function() {
        actions.userSet(null);
        actions.userSetPreferences({
          theme: "light",
          year: null,
          years: []
        });
        getStoreActions().data.dataSet({ byID: {}, byDate: {} });
        sessionStorage.clear();
      })
      .catch(function(error) {});
  })
};
