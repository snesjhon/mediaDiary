import { useRouter } from "next/router";
import React from "react";
import LayoutMain from "../src/components/layouts/LayoutMain";
import MdLoader from "../src/components/md/MdLoader";
import MediaDiary from "../src/components/MediaDiary";
import NewUser from "../src/components/welcome/NewUser";
import useFuegoAuth from "../src/interfaces/useFuegoAuth";

/**
 * Home Route is our initial entrance portal to MD which will also redirect if not
 * validated, and show NewUserFlow depending on Preference validity
 */
function Home(): JSX.Element {
  const {
    userValid,
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
  } else if (!userValidating && userNoPreference) {
    return <NewUser />;
  } else if (userValid) {
    return (
      <LayoutMain title="Home">
        <MediaDiary user={userValid} />
      </LayoutMain>
    );
  }
  return <MdLoader />;
}

export default Home;
