import type { Session, User } from "@supabase/supabase-js";
import Router from "next/router";
import React, { createContext, useContext, useEffect, useState } from "react";
import supa from "./supa";

interface SupaAuth {
  user: any;
  signIn: any;
  userLoaded: any;
  signOut: any;
  session: any;
}

export const SupaContext = createContext<SupaAuth>({
  user: null,
  signIn: null,
  signOut: null,
  userLoaded: false,
  session: null,
});

export function useSupaAuth(): SupaAuth {
  return useContext(SupaContext);
}

function SupaProvider({ children }: { children: JSX.Element }): JSX.Element {
  const [userLoaded, setUserLoaded] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const session = supa.auth.session();
    setSession(session);
    setUser(session?.user ?? null);

    const { data: authListener } = supa.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user;
        setUser(currentUser ?? null);
        setUserLoaded(!!currentUser);
        if (currentUser) {
          console.log("happens?");
          Router.push("/home");
        }
      }
    );
    return () => {
      authListener?.unsubscribe();
    };
  }, [user]);

  return (
    <SupaContext.Provider
      value={{ userLoaded, user, signIn, signOut, session }}
    >
      {children}
    </SupaContext.Provider>
  );

  async function signIn() {
    return supa.auth.signIn(
      {
        provider: "google",
      },
      {
        redirectTo: "http://localhost:3000/signin",
      }
    );
  }

  async function signOut() {
    await supa.auth.signOut();
    Router.push("/");
  }
}

export default SupaProvider;

// import type { UserFuego } from "../types/typesUser";
// import fuego from "./fuego";

// export const FuegoContext = createContext<{
//   user: UserFuego;
//   isValidating: boolean;
// }>({
//   user: null,
//   isValidating: true,
// });

// export function FuegoProvider({
//   children,
// }: {
//   children: JSX.Element;
// }): JSX.Element {
//   const [user, setUser] = useState<UserFuego>(null);
//   const isValidating = useRef(true);

//   useEffect(() => {
//     return fuego.auth().onIdTokenChanged(async (user) => {
//       isValidating.current = false;
//       if (!user) {
//         setUser(false);
//         return;
//       }

//       setUser(user);
//     });
//   }, []);
//   return (
//     <FuegoContext.Provider value={{ user, isValidating: isValidating.current }}>
//       {children}
//     </FuegoContext.Provider>
//   );
// }
