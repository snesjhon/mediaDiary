import React, { Suspense } from "react";
import useSWR from "swr";
import { useMDState } from "../../config/store";
import { fuegoDiaryEntry } from "../../fuego/fuegoMDActions";
import useFuegoUser from "../../fuego/useFuegoUser";
import type { MediaDiaryWithId } from "../../types/typesMedia";
import MdLoader from "../md/MdLoader";
import { DayContent } from "./components";

export default function Day(): JSX.Element {
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
        <DayContent mdData={data} mutate={mutate} />
      </Suspense>
    );
  }
  return <MdLoader />;
}
