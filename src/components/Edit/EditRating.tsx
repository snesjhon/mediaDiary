import { useMDState, useMDDispatch } from "@/config";
import { useFuegoUser } from "@/fuego";
import type { MediaMemory, MediaDiaryWithId } from "@/types";
import React, { useReducer } from "react";
import { mutate, cache } from "swr";
import { LogRatingReducer } from "../Log/config";
import type { LogRatingState } from "../Log/config";
import { fuegoEditRating, fuegoDeleteRating } from "./config";
import { MdSpinner } from "@/md";
import { Center } from "@chakra-ui/layout";
import { DrawerBody, DrawerFooter, Button } from "@chakra-ui/react";
import { MediaMovie, MediaTV, MediaSpotify } from "../Media";

export default function EditRating(): JSX.Element {
  const MDState = useMDState();
  const { edit, editMovie, editSpotify, editTV, isSaving } = MDState;
  const mdDispatch = useMDDispatch();
  const { user } = useFuegoUser();

  let initData: LogRatingState = {
    rating: 0,
  };
  if (typeof edit !== "undefined") {
    initData = { ...edit };
    if (edit.diaryDate) {
      initData = {
        ...edit,
        rating: edit.rating,
      };
    }
  }

  const [state, dispatch] = useReducer(LogRatingReducer, initData);

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
              <MediaMovie
                data={editMovie}
                logRating={{ fields: state, dispatch }}
              />
            )}
            {editTV && (
              <MediaTV
                data={editTV}
                poster={edit?.poster ?? editTV.poster_path}
                logRating={{
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
                logRating={{
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
        await fuegoEditRating(
          user.uid,
          edit.id,
          diaryEdit,
          edit as MediaMemory
        );
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

  function createEdit(): MediaMemory | false {
    const { rating, seenEpisodes } = state;
    if (typeof edit !== "undefined" && rating > 0) {
      const editItem = {
        ...edit,
        diaryDate: false as const,
        diaryYear: false as const,
        bookmark: false as const,
        rating,
        memory: true as const,
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
      await fuegoDeleteRating(user.uid, edit.id, edit as MediaMemory);
      mdDispatch({ type: "view", payload: "md" });
      mdDispatch({ type: "close" });
    } else {
      console.error("[EDIT]: Missing delete params");
    }
  }
}
