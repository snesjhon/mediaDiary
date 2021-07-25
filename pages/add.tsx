import { useRouter } from "next/router";
import React from "react";
import { Memories, Content, Add } from "../src/components";
import MdLoader from "../src/components/md/MdLoader";
import useFuegoAuth from "../src/fuego/useFuegoAuth";

/**
 * We want a full route because adding media is whoely complicated
 */
export default function AddPage(): JSX.Element {
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
      <Content title="Add Media">
        <Add />
      </Content>
    );
  }
  return <MdLoader />;
}
