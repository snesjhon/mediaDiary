import React, { createContext, useEffect, useRef, useState } from "react";
import supa from ".";

export const SupaContext = createContext<{
  user: any;
  // isValidating: boolean;
}>({
  user: null,
  // isValidating: true,
});

export function SupaProvider({
  children,
}: {
  children: JSX.Element;
}): JSX.Element {
  const [user, setUser] = useState<any>(null);
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
    <SupaContext.Provider value={{ user }}>
      {!isLoading && children}
    </SupaContext.Provider>
  );
}
