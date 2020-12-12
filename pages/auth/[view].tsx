import firebase from "firebase/app";
import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import nookies from "nookies";
import React, { useEffect } from "react";
import MdLoader from "../../src/components/md/MdLoader";
import { setUserCookie } from "../../src/utils/getUserFromCookie";

interface Props {
  isSending: boolean;
}

AuthView.getInitialProps = async (ctx: GetServerSidePropsContext) => {
  const cookies = nookies.get(ctx);
  return {
    isSending: cookies.authPending,
  };
};

function AuthView({ isSending }: Props): JSX.Element {
  const router = useRouter();

  useEffect(() => {
    if (isSending) {
      nookies.destroy({}, "authPending");
      firebase
        .auth()
        .getRedirectResult()
        .then(({ user }) => {
          if (user !== null) {
            setUserCookie(user);
            router.push("/home");
          }
        });
    }
  }, [isSending, router]);

  return <MdLoader />;
}

export default AuthView;
