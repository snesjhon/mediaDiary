import { Flex, Grid, Spinner } from "@chakra-ui/react";
import firebase from "firebase/app";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import LogoIcon from "../../src/components/icons/LogoIcon";
import { setUserCookie } from "../../src/utils/getUserFromCookie";
import nookies from "nookies";

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
  }, []);

  return (
    <Flex height="90vh" justifyContent="center" alignItems="center">
      <Grid alignItems="center" justifyItems="center">
        <LogoIcon boxSize={8} sx={{ gridRow: 1, gridColumn: 1 }} />
        <Spinner
          size="xl"
          color="purple.500"
          thickness="3px"
          sx={{ gridRow: 1, gridColumn: 1 }}
        />
      </Grid>
    </Flex>
  );
}

export default AuthView;
