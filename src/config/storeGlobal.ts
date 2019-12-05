import { Action, action, Thunk, thunk } from "easy-peasy";
import * as firebase from "firebase/app";
import "firebase/auth";
import { fb, db } from "./db";
import { StoreModel } from "./store";

export type UserTheme = "light" | "dark";

export interface UserPreferences {
  user: firebase.User | null;
  preferences: {
    theme: UserTheme;
    year: string | null;
  };
}

export interface Global extends UserPreferences {
  userGet: Thunk<Global>;
  userSet: Action<Global, UserPreferences["user"]>;
  userSetPreferences: Action<Global, UserPreferences["preferences"]>;
  userGetPreferences: Thunk<Global, firebase.User | null>;
  userPutPreferences: Thunk<Global, UserPreferences["preferences"]>;
  userLogout: Thunk<Global, void, void, StoreModel>;
}

export const global: Global = {
  user: null,
  preferences: {
    theme: "light",
    year: null
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
  userGetPreferences: thunk(async (actions, payload) => {
    const userRef = db.collection("user").doc("preferences");
    const doc = await userRef.get();
    if (doc.exists) {
      const data = typeof doc.data() !== "undefined" && doc.data();
      if (data) {
        actions.userSet(payload);
        actions.userSetPreferences({
          theme: data.theme,
          year: data.year
        });
      }
    } else {
      // We have a user, but we need the user to choose their own year and then
      // save into the preference
      actions.userSet(payload);
      actions.userSetPreferences({
        theme: "light",
        year: null
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
          year: null
        });
        getStoreActions().data.dataSet({ byID: {}, byDate: {} });
        sessionStorage.clear();
      })
      .catch(function(error) {});
  })
};
