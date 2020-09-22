import { useState, useEffect, useContext } from "react";
import * as firebase from "firebase/app";
import "firebase/auth";
import { useRouter } from "next/router";
import {
  getUserFromCookie,
  setUserCookie,
  removeUserCookie,
} from "./getUserFromCookie";
import { ContextState, ContextDispatch } from "../config/store";

function useUser() {
  // const { user } = useContext(ContextState);
  // const dispatch = useContext(ContextDispatch);
  const [user, setUser] = useState<firebase.User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const cancelAuthListener = firebase.auth().onIdTokenChanged((user) => {
      if (user) {
        setUserCookie(user);
        setUser(user);
        // dispatch({
        //   type: "state",
        //   payload: {
        //     key: "user",
        //     value: user,
        //   },
        // });
      } else {
        removeUserCookie();
        setUser(null);
        // dispatch({
        //   type: "state",
        //   payload: {
        //     key: "user",
        //     value: null,
        //   },
        // });
      }
    });

    const userFromCookie = getUserFromCookie();
    if (!userFromCookie) {
      router.push("/");
      return;
    }
    setUser(userFromCookie);
    // dispatch({
    //   type: "state",
    //   payload: {
    //     key: "user",
    //     value: userFromCookie,
    //   },
    // });

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
