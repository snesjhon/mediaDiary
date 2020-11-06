/**
 * LOGIN
 * --
 * TODO:
 * - Looks like there's a condition where the login isSending is a false positive,
 *   because there's multiple cookies.
 */

// https://vriad.com/essays/nextjs-firebase-authentication
import { Button, Heading, Spinner } from "@chakra-ui/core";
import * as firebase from "firebase/app";
import "firebase/auth";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { setUserCookie } from "../utils/getUserFromCookie";

interface Props {
  isSending: boolean;
}

Login.getInitialProps = async (ctx: any) => {
  const cookies = ctx?.req?.headers?.cookie;
  const isSending =
    typeof cookies !== "undefined" ? cookies.split("=")[1] : false;
  return {
    isSending,
  };
};

function Login({ isSending }: Props): JSX.Element {
  const router = useRouter();

  useEffect(() => {
    if (isSending) {
      Cookies.remove("authPending");
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
        Cookies.set("authPending", "true");
        firebase.auth().signInWithRedirect(provider);
      });
  }
}

export default Login;
