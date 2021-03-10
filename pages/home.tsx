import { useRouter } from "next/router";
import React from "react";
import Content from "../src/components/content/Content";
import MdLoader from "../src/components/md/MdLoader";
import Home from "../src/components/Home";
import UserNew from "../src/components/user/UserNew";
import useFuegoAuth from "../src/fuego/useFuegoAuth";

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
    return <UserNew user={userValid} />;
  } else if (userValidHasPreference) {
    return (
      <Content title="Home">
        <Home user={userValidHasPreference} />
      </Content>
    );
  }
  return <MdLoader />;
}

export default HomePage;
