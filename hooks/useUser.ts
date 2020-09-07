import { useState, useEffect, useContext } from "react";
import * as firebase from "firebase/app";
import "firebase/auth";
import { useRouter } from "next/router";
import {
  getUserFromCookie,
  setUserCookie,
  removeUserCookie,
} from "../utils/getUserFromCookie";
import { ContextState, ContextDispatch } from "../utils/store";

function useUser() {
  const { user } = useContext(ContextState);
  const dispatch = useContext(ContextDispatch);
  const router = useRouter();

  useEffect(() => {
    const cancelAuthListener = firebase.auth().onIdTokenChanged((user) => {
      if (user) {
        setUserCookie(user);
        dispatch({
          type: "state",
          payload: {
            key: "user",
            value: user,
          },
        });
      } else {
        removeUserCookie();
        dispatch({
          type: "state",
          payload: {
            key: "user",
            value: null,
          },
        });
      }
    });

    const userFromCookie = getUserFromCookie();
    if (!userFromCookie) {
      router.push("/");
      return;
    }
    dispatch({
      type: "state",
      payload: {
        key: "user",
        value: userFromCookie,
      },
    });

    return () => {
      cancelAuthListener();
    };
  }, []);

  return { user, logout };

  async function logout() {
    return firebase
      .auth()
      .signOut()
      .then(() => {
        router.push("/");
      })
      .catch((e) => {
        console.log(e);
      });
  }
}

export default useUser;
