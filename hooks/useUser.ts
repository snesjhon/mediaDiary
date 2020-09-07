import { useState, useEffect } from "react";
import * as firebase from "firebase/app";
import "firebase/auth";
import { useRouter } from "next/router";
import {
  getUserFromCookie,
  setUserCookie,
  removeUserCookie,
} from "../utils/getUserFromCookie";

function useUser() {
  const [user, setUser] = useState<firebase.User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const cancelAuthListener = firebase.auth().onIdTokenChanged((user) => {
      if (user) {
        setUserCookie(user);
        setUser(user);
      } else {
        removeUserCookie();
        setUser(null);
      }
    });

    const userFromCookie = getUserFromCookie();
    if (!userFromCookie) {
      router.push("/");
      return;
    }
    setUser(userFromCookie);

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
