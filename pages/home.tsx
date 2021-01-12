import { useRouter } from "next/router";
import React from "react";
import LayoutMain from "../src/components/layouts/LayoutMain";
import MdLoader from "../src/components/md/MdLoader";
import MediaDiary from "../src/components/MediaDiary";
import UserNew from "../src/components/user/UserNew";
import useFuegoAuth from "../src/interfaces/useFuegoAuth";

/**
 * Home Route is our initial entrance portal to MD which will also redirect if not
 * validated, and show NewUserFlow depending on Preference validity
 */
function Home(): JSX.Element {
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
    console.log("hap");
    return <UserNew user={userValid} />;
  } else if (userValidHasPreference) {
    return (
      <LayoutMain title="Home">
        <MediaDiary user={userValidHasPreference} />
      </LayoutMain>
    );
  }
  return <MdLoader />;
}

export default Home;
