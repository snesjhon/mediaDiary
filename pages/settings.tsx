import { useRouter } from "next/router";
import React from "react";
import LayoutMain from "../src/components/layouts/LayoutMain";
import MdLoader from "../src/components/md/MdLoader";
import Preferences from "../src/components/Preferences";
import NewUser from "../src/components/user/UserNew";
import useFuegoAuth from "../src/interfaces/useFuegoAuth";

/**
 * Settings Route provides a way of see your User Information along with
 * Deleting your account and changing your overall Preferences
 */
function Settings(): JSX.Element {
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
    return <NewUser user={userValid} />;
  } else if (userValidHasPreference) {
    return (
      <LayoutMain title="Settings">
        <Preferences user={userValidHasPreference} />
      </LayoutMain>
    );
  }
  return <MdLoader />;
}

export default Settings;
