import { CircularProgress } from "@chakra-ui/core";
import firebase from "firebase/app";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useEffect } from "react";
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

function AuthView({ isSending }: Props) {
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

  return <CircularProgress />;
}

export default AuthView;
