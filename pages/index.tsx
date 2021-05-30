import "firebase/auth";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { destroyCookie, parseCookies } from "nookies";
import React from "react";
import MdLoader from "../src/components/md/MdLoader";
import UserNew from "../src/components/user/UserNew";
import Welcome from "../src/components/Welcome";
import useFuegoUser from "../src/fuego/useFuegoUser";

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
  const router = useRouter();
  const { user, isValidating } = useFuegoUser();

  if ((fuegoPending && user === null) || isValidating) {
    return <MdLoader />;
  } else if ((fuegoPending || fuegoNewUser) && user) {
    destroyCookie(null, "fuegoNewUser");
    return <UserNew user={user} />;
  } else if (user) {
    router.push("/home");
    return <MdLoader />;
  } else {
    return <Welcome />;
  }
}

export default App;
