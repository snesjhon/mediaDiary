import { Action, action, Thunk, thunk } from "easy-peasy";
import * as firebase from "firebase/app";
import "firebase/auth";

export interface Global {
  theme: "light" | "dark";
  user: firebase.auth.UserCredential["user"];
  addUser: Action<Global, firebase.auth.UserCredential["user"]>;
  verifyUser: Thunk<Global>;
}

export const global: Global = {
  theme: "light",
  user: null,
  addUser: action((state, payload) => {
    state.user = payload;
  }),
  verifyUser: thunk(async actions => {
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await firebase.auth().signInWithPopup(provider);
    actions.addUser(result.user);
  })
};

// await todosService.save(payload); // imagine calling an HTTP service
// actions.addTodo(payload);
// console.log(result);
// firebase
//   .auth()
//   .signInWithPopup(provider)
//   .then(function(result) {
// 		// const results = await result;
//     // console.log(result);
//     // This gives you a Google Access Token. You can use it to access the Google API.
//     // var token = result.credential !== null ? result.credential.accessToken : "";
//     // The signed-in user info.
//     // var user = result.user;
//     // console.log(result);
//     // actions.addUser(result.user);
//   })
//   .catch(function(error) {
//     // Handle Errors here.
//     // var errorCode = error.code;
//     // var errorMessage = error.message;
//     // // The email of the user's account used.
//     // var email = error.email;
//     // // The firebase.auth.AuthCredential type that was used.
//     // var credential = error.credential;
//     // // ...
//     console.log(error);
//   });

// verifyUser: action((state, payload) => {

// 		firebase.auth().onAuthStateChanged(user => {
// 			if (user) {
// 				dispatch({
// 					type: AUTH_GET,
// 					payload: user
// 				})
// 			} else {
// 				console.log("user not log");
// 			}
// 		});
//   state.user = payload;
// })
