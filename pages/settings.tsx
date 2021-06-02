import { useRouter } from "next/router";
import React from "react";
import Content from "../src/components/content/Content";
import MdLoader from "../src/components/md/MdLoader";
import Preferences from "../src/components/Settings";
import useFuegoAuth from "../src/fuego/useFuegoAuth";

/**
 * Settings Route provides a way of see your User Information along with
 * Deleting your account and changing your overall Preferences
 */
function SettingsPage(): JSX.Element {
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
      <Content title="Settings">
        <Preferences user={userValidHasPreference} />
      </Content>
    );
  }
  return <MdLoader />;
}

export default SettingsPage;
