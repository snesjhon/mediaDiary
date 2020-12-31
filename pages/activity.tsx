import { useRouter } from "next/router";
import React from "react";
import Charts from "../src/components/Charts";
import LayoutMain from "../src/components/layouts/LayoutMain";
import MdLoader from "../src/components/md/MdLoader";
import NewUser from "../src/components/welcome/NewUser";
import useFuegoAuth from "../src/interfaces/useFuegoAuth";

/**
 * Activity Route presents the user with the Charting interface for their
 * MediaDiary memories. In case there's no preferences, there's also a
 * NewUserFlow available.
 */
function Activity(): JSX.Element {
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
      <LayoutMain title="Activity">
        <Charts user={userValid} />
      </LayoutMain>
    );
  }
  return <MdLoader />;
}

export default Activity;
