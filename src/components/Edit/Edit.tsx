import { Button, Center, DrawerBody, DrawerFooter } from "@chakra-ui/react";
import dayjs from "dayjs";
import React, { useReducer } from "react";
import { cache, mutate } from "swr";
import { useMDDispatch, useMDState } from "../../config/store";
import type { LogState } from "../../config/storeLog";
import { LogReducer } from "../../config/storeLog";
import { fuegoDelete } from "../../fuego/fuegoMDActions";
import useFuegoUser from "../../fuego/useFuegoUser";
import type { MediaDiaryDate, MediaDiaryWithId } from "../../types/typesMedia";
import MdSpinner from "../md/MdSpinner";
import { MediaMovie, MediaSpotify, MediaTV } from "../Media";
import { fuegoEdit } from "./config";

export default function Edit(): JSX.Element {
  const MDState = useMDState();
  const { edit, editMovie, editSpotify, editTV, isSaving } = MDState;
  const mdDispatch = useMDDispatch();
  const { user } = useFuegoUser();

  let initData: LogState = {
    diaryDate: dayjs().toISOString(),
    loggedBefore: false,
    rating: 0,
  };
  if (typeof edit !== "undefined") {
    if (edit.diaryDate) {
      initData = {
        ...edit,
        diaryDate: edit.diaryDate,
      };
    }
  }

  const [state, dispatch] = useReducer(LogReducer, initData);

  return (
    <>
      {isSaving ? (
        <Center minH="40vh">
          <MdSpinner />
        </Center>
      ) : (
        <>
          <DrawerBody px={{ base: 6, sm: 8 }}>
            {editMovie && (
              <MediaMovie data={editMovie} edit={{ fields: state, dispatch }} />
            )}
            {editTV && (
              <MediaTV
                data={editTV}
                poster={edit?.poster ?? editTV.poster_path}
                edit={{
                  fields: state,
                  dispatch,
                }}
                seasonInfo={{
                  season: edit?.season,
                  episodes: edit?.episodes,
                }}
              />
            )}
            {editSpotify && (
              <MediaSpotify
                artistInfo={editSpotify.artist}
                albumInfo={editSpotify.album}
                edit={{
                  fields: state,
                  dispatch,
                }}
              />
            )}
          </DrawerBody>
          <DrawerFooter
            justifyContent="space-between"
            borderTopWidth="1px"
            pb={{ base: 8, sm: 4 }}
          >
            <Button
              onClick={deleteData}
              isLoading={isSaving}
              colorScheme="red"
              variant="outline"
            >
              Delete
            </Button>
            <Button
              onClick={editData}
              isLoading={isSaving}
              colorScheme="purple"
              variant="outline"
            >
              Save
            </Button>
          </DrawerFooter>
        </>
      )}
    </>
  );

  async function editData() {
    if (
      user !== null &&
      user &&
      user.email !== null &&
      typeof edit !== "undefined"
    ) {
      mdDispatch({ type: "saving" });
      const diaryEdit = createEdit();
      if (diaryEdit) {
        await fuegoEdit(user.uid, edit.id, diaryEdit, edit as MediaDiaryDate);
        mdDispatch({
          type: "savedEdit",
          payload: diaryEdit as MediaDiaryWithId,
        });
        mutate(["/fuego/diaryDay", user.uid, edit.id]);
      } else {
        console.error("[EDIT] error with diaryEdit");
      }
    } else {
      console.error("user missing");
    }
  }

  function createEdit(): MediaDiaryDate | false {
    const { diaryDate, loggedBefore, rating, seenEpisodes } = state;
    if (typeof edit !== "undefined" && diaryDate) {
      const editItem = {
        ...edit,
        diaryDate: diaryDate,
        diaryYear: parseInt(dayjs(diaryDate).format("YYYY")),
        loggedBefore: loggedBefore,
        rating,
        memory: rating > 0 ? true : false,
      };
      if (typeof seenEpisodes !== "undefined") {
        Object.assign(editItem, { seenEpisodes });
      }
      return editItem;
    } else {
      return false;
    }
  }

  async function deleteData() {
    if (
      typeof edit !== "undefined" &&
      user !== null &&
      user &&
      user.email !== null
    ) {
      mdDispatch({ type: "saving" });
      // In the case where we're deleting the item completely, we need to assure that our PREVIOUS
      // fetch case is refetched, the easiest way to assure this is to clear the cache.
      cache.delete([
        "/fuego/diaryById",
        user.uid,
        edit.type,
        edit.mediaId,
        edit.season ? edit.season : -1,
      ]);
      // TODO: we have to assure to breakup the "edit" types, to assure we're editing the types correctly
      await fuegoDelete(user.uid, edit.id, edit as MediaDiaryDate);
      mdDispatch({ type: "view", payload: "md" });
      mdDispatch({ type: "close" });
    } else {
      console.error("[EDIT]: Missing delete params");
    }
  }
}
