import { fuego } from "@nandorojo/swr-firestore";
import { useRouter } from "next/router";
import React, { createContext, useContext, useEffect, useState } from "react";
import { removeUserCookie, setUserCookie } from "./getUserFromCookie";

type AuthUser = firebase.User | null | false;

const AuthContext = createContext<{ user: AuthUser }>({
  user: null,
});

export function useAuth(): {
  user: AuthUser;
} {
  return useContext(AuthContext);
}

export function useLogout(): () => void {
  const router = useRouter();

  function logout() {
    fuego
      .auth()
      .signOut()
      .then(() => {
        return router.push("/");
      })
      .catch(() => {
        return console.error("logout failed");
      });
  }
  return logout;
}

interface Props {
  children: JSX.Element;
}

export function AuthProvider({ children }: Props): JSX.Element {
  const [user, setUser] = useState<AuthUser>(null);

  useEffect(() => {
    return fuego.auth().onIdTokenChanged(async (user) => {
      if (!user) {
        setUser(false);
        removeUserCookie();
        return;
      }

      setUser(user);
      setUserCookie(user);
    });
  }, []);
  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}
