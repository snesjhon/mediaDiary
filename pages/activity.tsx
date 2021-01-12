import { useRouter } from "next/router";
import React from "react";
import Charts from "../src/components/Charts";
import LayoutMain from "../src/components/layouts/LayoutMain";
import MdLoader from "../src/components/md/MdLoader";
import UserNew from "../src/components/user/UserNew";
import useFuegoAuth from "../src/interfaces/useFuegoAuth";

/**
 * Activity Route presents the user with the Charting interface for their
 * MediaDiary memories. In case there's no preferences, there's also a
 * NewUserFlow available.
 */
function Activity(): JSX.Element {
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
      <LayoutMain title="Activity">
        <Charts user={userValidHasPreference} />
      </LayoutMain>
    );
  }
  return <MdLoader />;
}

export default Activity;
