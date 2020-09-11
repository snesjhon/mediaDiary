import { ChakraProvider } from "@chakra-ui/core";
import "firebase/firestore";
import "firebase/auth";
import { Fuego, FuegoProvider } from "@nandorojo/swr-firestore";
import type { AppProps } from "next/app";
import { useReducer } from "react";
import { ContextDispatch, ContextState, Reducer } from "../config/store";
import Head from "next/head";

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

function MyApp({ Component, pageProps }: AppProps) {
  const [state, dispatch] = useReducer(Reducer, {
    user: null,
    view: "main",
  });
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0"
        />
      </Head>
      <FuegoProvider fuego={fuego}>
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
