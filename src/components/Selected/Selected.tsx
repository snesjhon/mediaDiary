import React, { Suspense } from "react";
import useSWR from "swr";
import { useMDDispatch, useMDState } from "../../config/store";
import { fuegoDiaryById } from "../../fuego/fuegoMDActions";
import useFuegoUser from "../../fuego/useFuegoUser";
import type { MediaDiaryWithId } from "../../types/typesMedia";
import MdLoader from "../md/MdLoader";
import { SelectedContent } from "./components";

export default function Selected(): JSX.Element {
  const { user } = useFuegoUser();
  const { selected } = useMDState();
  const dispatch = useMDDispatch();

  const { data, isValidating, error, mutate } = useSWR<
    MediaDiaryWithId | false
  >(
    user && selected
      ? [
          "/fuego/diaryById",
          user.uid,
          selected.type,
          selected.mediaId,
          selected.season ? selected.season : -1,
        ]
      : null,
    fuegoDiaryById,
    {
      revalidateOnFocus: false,
    }
  );

  if (!isValidating) {
    // if its TV then we have a problem, because if there IS a previous Item, then we have to realize
    // that we NEED to go search for a further season information.
    if (data) {
      // If we find this search has given us a result, then push to "SelectedWithId"
      dispatch({ type: "selectedWithId", payload: data });
      return <MdLoader />;
    } else if (selected) {
      return (
        <Suspense fallback={<MdLoader />}>
          <SelectedContent item={selected} mutate={mutate} />;
        </Suspense>
      );
    }
  }

  return <MdLoader />;
}
