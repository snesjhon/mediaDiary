import { useMDState, useMDDispatch } from "@/config";
import { useFuegoUser } from "@/fuego";
import { MdLoader } from "@/md";
import type { MediaDiaryWithId } from "@/types";
import React, { Suspense } from "react";
import useSWR from "swr";
import { SelectedContent } from "./components";
import { fuegoDiaryById } from "./config";

export default function Selected(): JSX.Element {
  const { user } = useFuegoUser();
  const { selected } = useMDState();
  const dispatch = useMDDispatch();

  const { data, isValidating, error, mutate } = useSWR<
    MediaDiaryWithId | false
  >(
    user && selected
      ? ["/fuego/diaryById", user.uid, selected.type, selected.mediaId]
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
      // If we find this search has given us a result, then push to the "Day" component so the
      // user is able to re-log their component
      dispatch({ type: "day", payload: data });
      return <MdLoader />;
    } else if (selected) {
      return (
        <Suspense fallback={<MdLoader />}>
          <SelectedContent item={selected} mutate={mutate} />
        </Suspense>
      );
    }
  }

  return <MdLoader />;
}
