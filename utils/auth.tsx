import { fuego } from "@nandorojo/swr-firestore";
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
