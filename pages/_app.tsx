// https://sergiodxa.com/articles/redirects-in-next-the-good-way

import { ChakraProvider } from "@chakra-ui/core";
import { Fuego, FuegoProvider } from "@nandorojo/swr-firestore";
import "firebase/auth";
import "firebase/firestore";
import { AuthProvider } from "../utils/auth";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useReducer } from "react";
import { ContextDispatch, ContextState, Reducer } from "../config/store";
import React from "react";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGE_ID,
};
const fuego = new Fuego(firebaseConfig);

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const [state, dispatch] = useReducer(Reducer, {
    page: 1,
    filterBy: ["album", "movie", "tv"],
  });

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
      </Head>
      <FuegoProvider fuego={fuego}>
        <AuthProvider>
          <ContextState.Provider value={state}>
            <ContextDispatch.Provider value={dispatch}>
              <ChakraProvider resetCSS>
                <Component {...pageProps} />
              </ChakraProvider>
            </ContextDispatch.Provider>
          </ContextState.Provider>
        </AuthProvider>
      </FuegoProvider>
    </>
  );
}

export default MyApp;
