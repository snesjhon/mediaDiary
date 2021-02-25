// https://sergiodxa.com/articles/redirects-in-next-the-good-way

import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import React, { useReducer } from "react";
import type { MDState } from "../src/config/store";
import { ContextDispatch, ContextState, Reducer } from "../src/config/store";
import { FuegoProvider } from "../src/fuego/fuegoProvider";

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const [state, dispatch] = useReducer(Reducer, {
    preference: null,
    view: "md",
    mediaType: null,
    genre: null,
    loggedBefore: null,
    rating: null,
    diaryYear: null,
    releasedDecade: null,
  } as MDState);
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#90cdf4" />
        <meta name="apple-mobile-web-app-status-bar" content="#90cdf4" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <title>MediaDiary</title>
      </Head>
      <FuegoProvider>
        <ContextState.Provider value={state}>
          <ContextDispatch.Provider value={dispatch}>
            <ChakraProvider resetCSS>
              <Component {...pageProps} />
            </ChakraProvider>
          </ContextDispatch.Provider>
        </ContextState.Provider>
      </FuegoProvider>
    </>
  );
}

export default MyApp;
