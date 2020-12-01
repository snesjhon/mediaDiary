/**
 * LOGIN
 * --
 * TODO:
 * - Looks like there's a condition where the login isSending is a false positive,
 *   because there's multiple cookies.
 */

import { Button, Heading, Spinner } from "@chakra-ui/react";
import firebase from "firebase/app";
import "firebase/auth";
import nookies from "nookies";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { setUserCookie } from "../utils/getUserFromCookie";

interface Props {
  isSending: boolean;
}

Login.getInitialProps = async (ctx: GetServerSidePropsContext) => {
  const cookies = nookies.get(ctx);
  return {
    isSending: cookies.authPending,
  };
};

function Login({ isSending }: Props): JSX.Element {
  const router = useRouter();

  useEffect(() => {
    if (isSending) {
      firebase
        .auth()
        .getRedirectResult()
        .then(({ user }) => {
          if (user !== null) {
            setUserCookie(user);
            router.push("/");
          }
        });
    }
  }, []);

  return isSending ? (
    <Spinner
      thickness="4px"
      speed="0.65s"
      emptyColor="gray.200"
      color="blue.500"
      size="xl"
    />
  ) : (
    <>
      <Heading>Login</Heading>
      <Button onClick={loginWithGoogle}>loginWithGoogle</Button>
    </>
  );

  function loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => {
        nookies.set({}, "authPending", "true", {});
        firebase.auth().signInWithRedirect(provider);
      });
  }
}

export default Login;
