import { useColorMode } from "@chakra-ui/react";
import React from "react";
import { useSWRInfinite } from "swr";
import { useMDDispatch, useMDState } from "../config/store";
import { fuegoBookmarkGet } from "../fuego/fuegoBookmarks";
import type { MediaBookmarkWithId } from "../types/typesMedia";
import type { UserFuegoValidated } from "../types/typesUser";

function Bookmarks({ user }: { user: UserFuegoValidated }): JSX.Element {
  const state = useMDState();
  const dispatch = useMDDispatch();
  const { colorMode } = useColorMode();

  const { data, error, size, setSize, mutate } = useSWRInfinite<
    MediaBookmarkWithId[]
  >(
    (_, prev) => {
      // We've reached the end of the list since we got < 30, don't call again
      if (prev && prev.length < 30) return null;

      return [
        "/fuego/diary",
        user.uid,
        prev !== null ? prev[prev.length - 1].addedDate : null,
        state.mediaType,
        state.releasedDecade,
        state.diaryYear, // TODO: This is not right
        state.genre,
      ];
    },
    fuegoBookmarkGet,
    {
      revalidateOnFocus: false,
    }
  );
  return <div>something </div>;
}
export default Bookmarks;
