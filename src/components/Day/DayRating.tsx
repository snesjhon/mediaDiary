import React, { Suspense } from "react";
import useSWR from "swr";
import { useMDState } from "../../config/store";
import useFuegoUser from "../../fuego/useFuegoUser";
import type { MediaDiaryWithId } from "../../types/typesMedia";
import MdLoader from "../md/MdLoader";
import { DayRatingContent } from "./components";
import { fuegoDiaryEntry } from "./config";

export default function DayRating(): JSX.Element {
  const { edit } = useMDState();
  const { user } = useFuegoUser();

  const { data, isValidating, error, mutate } = useSWR<
    MediaDiaryWithId | false
  >(
    user && edit ? ["/fuego/diaryDay", user.uid, edit.id] : null,
    fuegoDiaryEntry,
    {
      revalidateOnFocus: false,
    }
  );
  if (error) {
    console.error(error);
    return <div>{error}</div>;
  }

  if (data && !isValidating) {
    return (
      <Suspense fallback={<MdLoader />}>
        <DayRatingContent mdData={data} mutate={mutate} />
      </Suspense>
    );
  }
  return <MdLoader />;
}
