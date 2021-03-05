import React, { useEffect } from "react";
import useSWR from "swr";
import { useMDState } from "../../config/store";
import { fuegoDiaryById, fuegoDiaryEntry } from "../../fuego/fuegoMDActions";
import useFuegoUser from "../../fuego/useFuegoUser";
import type { MediaDiaryWithId } from "../../types/typesMedia";
import MdLoader from "../md/MdLoader";
import ContentData from "./ContentData";
import ContentEdit from "./ContentEdit";
import ContentSelected from "./ContentSelected";

function ContentInfo(): JSX.Element {
  const { selected, edit, view, isSaving } = useMDState();
  const { user } = useFuegoUser();
  const key = createKey();

  const { data, isValidating, error, mutate } = useSWR<
    MediaDiaryWithId | false
  >(key, user && edit ? fuegoDiaryEntry : fuegoDiaryById, {
    revalidateOnFocus: false,
  });

  useEffect(() => {
    if (isSaving) {
      mutate();
    }
  }, [isSaving, mutate]);

  if (user) {
    if (data && view === "edit") {
      return <ContentEdit />;
    }

    if (view === "info" && key !== null) {
      if (data && !isValidating) {
        return <ContentData user={user} {...data} />;
      } else if (selected) {
        return <ContentSelected item={selected} user={user} />;
      }
    }
  }

  return <MdLoader />;

  function createKey(): string[] | null {
    if (user) {
      if (edit) {
        return ["/fuego/diaryDay", user.uid, edit.id];
      }
      if (selected) {
        return ["/fuego/diaryById", user.uid, selected.mediaId];
      }
    }
    return null;
  }
}

export default ContentInfo;
