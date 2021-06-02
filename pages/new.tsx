import { useRouter } from "next/router";
import React from "react";
import LayoutGradient from "../src/components/layouts/LayoutGradient";
import MdLoader from "../src/components/md/MdLoader";
import UserNew from "../src/components/user/UserNew";
import useFuegoAuth from "../src/fuego/useFuegoAuth";

export default function NewUserPage(): JSX.Element {
  const {
    userValid,
    userValidHasPreference,
    userNoPreference,
    userNotValid,
    userValidating,
  } = useFuegoAuth();
  const router = useRouter();

  if (userNotValid) {
    if (typeof window !== "undefined") {
      router.push("/");
    }
    return <MdLoader />;
  } else if (!userValidating && userValid && userNoPreference) {
    return (
      <LayoutGradient>
        <UserNew user={userValid} />;
      </LayoutGradient>
    );
  } else if (userValidHasPreference) {
    router.push("/home");
    return <MdLoader />;
  }
  return <MdLoader />;
}
