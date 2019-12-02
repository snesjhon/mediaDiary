import { Action, action, Thunk, thunk } from "easy-peasy";
import * as firebase from "firebase/app";
import "firebase/auth";
import { fb, db } from "./db";
import { StoreModel } from "./store";

export interface Global {
  preferences:
    | {
        theme: "light" | "dark";
        year: number | null;
      }
    | {};
  // hasPreferences: boolean;
  user: firebase.User | null;
  userAdd: Action<Global, firebase.User | null>;
  userAddPreference: Action<Global, {}>;
  // userAddPreference: Thunk<Global, void, void, StoreModel>;
  userGetPreference: Thunk<Global, void, void, StoreModel>;
  userSetPreference: Thunk<Global, Global["preferences"]>;
  userVerify: Thunk<Global, void, void, StoreModel>;
  userLogout: Thunk<Global>;
}

const provider = new firebase.auth.GoogleAuthProvider();

export const global: Global = {
  user: null,
  preferences: {},
  // hasPreferences: false,
  userAdd: action((state, payload) => {
    state.user = payload;
  }),
  userAddPreference: action((state, payload) => {
    state.preferences = payload;
  }),
  userSetPreference: thunk(async (actions, payload) => {
    const userRef = db.collection("user").doc("preferences");
    userRef
      .set(payload)
      .then(function() {
        actions.userAddPreference(payload);
      })
      .catch(function(error) {
        console.error("Error writing document: ", error);
      });
  }),
  userGetPreference: thunk(async actions => {
    const userRef = db.collection("user").doc("preferences");
    userRef
      .get()
      .then(function(doc) {
        if (doc.exists) {
          const data = typeof doc.data() !== "undefined" && doc.data();
          if (data) {
            actions.userAddPreference({
              theme: data.theme,
              year: data.year
            });
          }
        }
      })
      .catch(function(error) {
        console.log("Error getting document:", error);
      });
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
    actions.userGetPreference();
    // getStoreActions().data.dataGet();
  })
};

//  userAddPreference: thunk(async (actions, payload) => {
//   const dbPreference = db.collection("user").doc("preferences");

//   db.runTransaction(transaction => {
//     return transaction.get(dbPreference).then(userPreference => {
//       if (!userPreference.exists) {
//         transaction.set(dbPreference, {
//           theme: "light",
//           year: null
//         });
//       }
//       return transaction.update(dbPreference, {
//         theme: "light",
//         year: null
//       });
//     });
//   });
// }),
