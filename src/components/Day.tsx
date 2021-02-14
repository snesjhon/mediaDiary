import { Divider, DrawerBody } from "@chakra-ui/react";
import React from "react";
import useSWR from "swr";
import { useMDState } from "../config/store";
import type { DiaryAdd } from "../config/types";
import { fuegoDiaryEntry } from "../interfaces/fuegoMDActions";
import useFuegoUser from "../interfaces/useFuegoUser";
import Edit from "./Edit";
import InfoBody from "./info/InfoBody";
import InfoHeader from "./info/InfoHeader";
import MdLoader from "./md/MdLoader";

function Day(): JSX.Element | null {
  const { user } = useFuegoUser();
  const { view, edit, spotifyToken } = useMDState();

  const { data } = useSWR<DiaryAdd | false>(
    user !== null && user && edit
      ? ["/fuego/diaryDay", user.uid, edit.id]
      : null,
    fuegoDiaryEntry,
    {
      revalidateOnFocus: false,
    }
  );

  if (data) {
    return (
      <>
        {view === "edit" ? (
          <Edit />
        ) : (
          <DrawerBody px={{ base: 6, sm: 8 }}>
            <InfoHeader {...data} />
            <Divider mt={3} mb={2} />
            <InfoBody selected={data} token={spotifyToken} />
          </DrawerBody>
        )}
      </>
    );
  }
  return <MdLoader />;
}

export default Day;
