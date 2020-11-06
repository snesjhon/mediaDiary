import { Flex, Grid, Spinner } from "@chakra-ui/core";
import firebase from "firebase/app";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import LogoIcon from "../../components/Icons/LogoIcon";
import { setUserCookie } from "../../utils/getUserFromCookie";

interface Props {
  isSending: boolean;
}

AuthView.getInitialProps = async (ctx: any) => {
  const cookies = ctx?.req?.headers?.cookie;
  const isSending =
    typeof cookies !== "undefined" ? cookies.split("=")[1] : false;
  return {
    isSending,
  };
};

function AuthView({ isSending }: Props): JSX.Element {
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
