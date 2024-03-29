import { MdGradient, MdLoader } from "@/md";
import "firebase/auth";
import { useRouter } from "next/router";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import React, { useEffect, useState } from "react";
import { Register } from "src/components";
import fuego from "../src/fuego/fuego";
import useFuegoUser from "../src/fuego/useFuegoUser";

export default function RegisterPage(): JSX.Element {
  const cookies = parseCookies();
  const [isNewUser, setIsNewUser] = useState(!!cookies?.fuegoNewUser);
  const router = useRouter();
  const { type } = router.query;
  const { user, isValidating } = useFuegoUser();

  useEffect(() => {
    if (cookies?.fuegoPending) {
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
              setIsNewUser(!!user);
            } else {
              router.push("/diary");
            }
          }
        });
    }
  }, [cookies, router]);

  if ((cookies?.fuegoPending && user === null) || isValidating) {
    return <MdLoader />;
  } else if (
    (cookies?.fuegoPending || cookies?.fuegoNewUser) &&
    user &&
    isNewUser
  ) {
    router.push("/new");
    return <MdLoader />;
  } else if (user) {
    router.push("/diary");
    return <MdLoader />;
  } else {
    return (
      <MdGradient>
        <Register type={type === "login" ? "login" : "signup"} />
      </MdGradient>
    );
  }
}
