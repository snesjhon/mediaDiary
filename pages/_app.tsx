import { ChakraProvider, Container } from "@chakra-ui/core";
import initFirebase from "../utils/initFirebase";
import type { AppProps } from "next/app";
import { createContext, useReducer } from "react";
import { ContextState, ContextDispatch, Reducer } from "../utils/store";

initFirebase();

function MyApp({ Component, pageProps }: AppProps) {
  const [state, dispatch] = useReducer(Reducer, {
    user: null,
  });
  return (
    <ContextState.Provider value={state}>
      <ContextDispatch.Provider value={dispatch}>
        <ChakraProvider resetCSS>
          <Component {...pageProps} />
        </ChakraProvider>
      </ContextDispatch.Provider>
    </ContextState.Provider>
  );
}

export default MyApp;
