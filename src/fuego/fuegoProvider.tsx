import React, { createContext, useEffect, useRef, useState } from "react";
import type { UserFuego } from "../types/typesUser";
import fuego from "./fuego";

export const FuegoContext = createContext<{
  user: UserFuego;
  isValidating: boolean;
}>({
  user: null,
  isValidating: true,
});

export function FuegoProvider({
  children,
}: {
  children: JSX.Element;
}): JSX.Element {
  const [user, setUser] = useState<UserFuego>(null);
  const isValidating = useRef(true);

  useEffect(() => {
    return fuego.auth().onIdTokenChanged(async (user) => {
      isValidating.current = false;
      if (!user) {
        setUser(false);
        return;
      }

      setUser(user);
    });
  }, []);
  return (
    <FuegoContext.Provider value={{ user, isValidating: isValidating.current }}>
      {children}
    </FuegoContext.Provider>
  );
}
