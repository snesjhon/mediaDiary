import { useRouter } from "next/router";
import React from "react";
import MdLoader from "../src/components/md/MdLoader";
import useFuegoAuth from "../src/fuego/useFuegoAuth";
import { Content, Diary } from "../src/components";

/**
 * Home Route is our initial entrance portal to MD which will also redirect if not
 * validated, and show NewUserFlow depending on Preference validity
 */
function HomePage(): JSX.Element {
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
    router.push("/new");
    return <MdLoader />;
  } else if (userValidHasPreference) {
    return (
      <Content title="Home">
        <Diary user={userValidHasPreference} />
      </Content>
    );
  }
  return <MdLoader />;
}

export default HomePage;
