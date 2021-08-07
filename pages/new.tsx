import { MdGradient } from "@/md";
import { useRouter } from "next/router";
import React from "react";
import { NewUser } from "src/components";
import MdLoader from "../src/components/md/MdLoader";
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
      <MdGradient>
        <NewUser user={userValid} />;
      </MdGradient>
    );
  } else if (userValidHasPreference) {
    router.push("/diary");
    return <MdLoader />;
  }
  return <MdLoader />;
}
