import type { User } from "@supabase/gotrue-js";
import React, { createContext, useEffect, useRef, useState } from "react";
import supa from ".";

export interface SupaUser {
  user: User | null;
  isValidating: boolean;
}

export const SupaContext = createContext<SupaUser>({
  user: null,
  isValidating: true,
});

export function SupaProvider({
  children,
}: {
  children: JSX.Element;
}): JSX.Element {
  const [user, setUser] = useState<SupaUser["user"]>(null);
  const [isLoading, setIsLoading] = useState(true);
  // const isValidating = useRef(true);

  useEffect(() => {
    const session = supa.auth.session();
    setUser(session?.user ?? null);
    setIsLoading(false);

    const { data: listener } = supa.auth.onAuthStateChange((event, session) => {
      if (!session?.user) {
        return;
      }
      setUser(session?.user);
      setIsLoading(false);
    });
    return () => {
      listener?.unsubscribe();
    };
  }, []);

  return (
    <SupaContext.Provider value={{ user, isValidating: isLoading }}>
      {!isLoading && children}
    </SupaContext.Provider>
  );
}
