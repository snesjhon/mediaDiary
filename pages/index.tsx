import "firebase/auth";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import React, { useEffect, useState } from "react";
import MdLoader from "../src/components/md/MdLoader";
import NewUser from "../src/components/welcome/NewUser";
import Welcome from "../src/components/welcome/Welcome";
import useFuegoUser from "../src/interfaces/useFuegoUser";
import fuego from "../src/interfaces/fuego";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = parseCookies(context);
  return {
    props: {
      fuegoPending:
        typeof cookies.fuegoPending !== "undefined"
          ? cookies.fuegoPending
          : false,
      fuegoNewUser: typeof cookies.fuegoNewUser !== "undefined" ? true : false,
    },
  };
};

function App({
  fuegoPending,
  fuegoNewUser,
}: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element {
  const [isNewUser, setIsNewUser] = useState(fuegoNewUser);
  const router = useRouter();
  const { user, isValidating } = useFuegoUser();

  useEffect(() => {
    if (fuegoPending) {
      destroyCookie(undefined, "fuegoPending");
      fuego
        .auth()
        .getRedirectResult()
        .then(async ({ additionalUserInfo, user }) => {
          if (user !== null) {
            if (additionalUserInfo?.isNewUser) {
              setCookie(null, "fuegoNewUser", "true", {
                maxAge: 60 * 60,
                path: "/",
              });
              setIsNewUser(true);
            } else {
              router.push("/home");
            }
          }
        });
    }
  }, [fuegoPending, router]);

  if ((fuegoPending && user === null) || isValidating) {
    return <MdLoader />;
  } else if ((fuegoPending || fuegoNewUser) && isNewUser) {
    return <NewUser />;
  } else if (user) {
    router.push("/home");
    return <MdLoader />;
  } else {
    return <Welcome />;
  }
}

export default App;
