import { Divider, DrawerBody } from "@chakra-ui/react";
import React from "react";
import useSWR from "swr";
import { useMDState } from "../../config/store";
import { fuegoDiaryEntry } from "../../fuego/fuegoMDActions";
import useFuegoUser from "../../fuego/useFuegoUser";
import type { MediaDiary } from "../../types/typesMedia";
import InfoBody from "../info/InfoBody";
import InfoHeader from "../info/InfoHeader";
import MdLoader from "../md/MdLoader";
import Edit from "./ContentEdit";

function ContentDay(): JSX.Element | null {
  const { user } = useFuegoUser();
  const { view, edit } = useMDState();

  const { data } = useSWR<MediaDiary | false>(
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
            <InfoBody selected={data} />
          </DrawerBody>
        )}
      </>
    );
  }
  return <MdLoader />;
}

export default ContentDay;
