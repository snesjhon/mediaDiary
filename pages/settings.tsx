import { useRouter } from "next/router";
import React from "react";
import LayoutMain from "../src/components/layouts/LayoutMain";
import MdLoader from "../src/components/md/MdLoader";
import Preferences from "../src/components/Preferences";
import NewUser from "../src/components/welcome/NewUser";
import useFuegoAuth from "../src/interfaces/useFuegoAuth";

/**
 * Settings Route provides a way of see your User Information along with
 * Deleting your account and changing your overall Preferences
 */
function Settings(): JSX.Element {
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
      <LayoutMain title="Settings">
        <Preferences user={userValid} />
      </LayoutMain>
    );
  }
  return <MdLoader />;
}

export default Settings;
