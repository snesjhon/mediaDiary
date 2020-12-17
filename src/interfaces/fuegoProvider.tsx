import { destroyCookie } from "nookies";
import React, { createContext, useEffect, useState } from "react";
import fuego from "./fuego";

export type FuegoUser = firebase.User | null | false;

export const FuegoContext = createContext<{ user: FuegoUser }>({
  user: null,
});

export function FuegoProvider({
  children,
}: {
  children: JSX.Element;
}): JSX.Element {
  const [user, setUser] = useState<FuegoUser>(null);

  useEffect(() => {
    return fuego.auth().onIdTokenChanged(async (user) => {
      if (!user) {
        setUser(false);
        destroyCookie(null, "fuegoToken");
        return;
      }

      setUser(user);
    });
  }, []);
  return (
    <FuegoContext.Provider value={{ user }}>{children}</FuegoContext.Provider>
  );
}
