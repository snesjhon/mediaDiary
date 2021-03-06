import { useRouter } from "next/router";
import React from "react";
import { Bookmarks, Content } from "../src/components";
import MdLoader from "../src/components/md/MdLoader";
import useFuegoAuth from "../src/fuego/useFuegoAuth";

/**
 * Activity Route presents the user with the Charting interface for their
 * MediaDiary memories. In case there's no preferences, there's also a
 * NewUserFlow available.
 */
function BookmarksPage(): JSX.Element {
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
      <Content title="Bookmarks">
        <Bookmarks user={userValidHasPreference} />
      </Content>
    );
  }
  return <MdLoader />;
}

export default BookmarksPage;
