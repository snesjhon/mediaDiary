import { Button, Center, DrawerFooter } from "@chakra-ui/react";
import dayjs from "dayjs";
import React, { useReducer } from "react";
import { mutate } from "swr";
import { LogReducer } from "../config/logStore";
import type { DiaryAdd } from "../config/mediaTypes";
import { useMDDispatch, useMDState } from "../config/store";
import useFuegoUser from "../hooks/useFuegoUser";
import { fuegoDelete, fuegoEdit } from "../interfaces/fuegoActions";
import Info from "./Info";
import LogFields from "./LogFields";
import MdSpinner from "./md/MdSpinner";

function Edit(): JSX.Element {
  const { edit, isSaving } = useMDState();
  const mdDispatch = useMDDispatch();
  const { user } = useFuegoUser();

  let initData = {
    diaryDate: dayjs().toISOString(),
    loggedBefore: false,
    rating: 0,
    artist: "",
    genre: "",
    poster: "",
  };
  if (typeof edit !== "undefined") {
    initData = edit.diary;
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
          {typeof edit?.diary !== "undefined" && <Info item={edit.diary} />}
          <LogFields
            dispatch={dispatch}
            type={edit?.diary.type}
            item={{
              diaryDate: state.diaryDate,
              loggedBefore: state.loggedBefore,
              poster: state.poster,
              rating: state.rating,
              episodes: state.episodes,
              season: state.season,
              seenEpisodes: state.seenEpisodes,
            }}
            isEdit
          />
          <DrawerFooter
            px={0}
            pt={2}
            pb={1}
            mt={2}
            justifyContent="space-between"
          >
            <Button
              onClick={deleteData}
              isLoading={isSaving}
              colorScheme="red"
              variant="outline"
              size="sm"
            >
              Delete
            </Button>
            <Button
              onClick={editData}
              isLoading={isSaving}
              colorScheme="blue"
              size="sm"
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
        await fuegoEdit(
          user.uid,
          edit.diaryId,
          diaryEdit,
          edit.diary.diaryDate
        );
        mdDispatch({
          type: "savedEdit",
          payload: { diaryId: edit.diaryId, diary: diaryEdit },
        });
        mutate(["/api/diary/", user.uid]);
        mutate(["/api/diary/", user.uid, edit.diaryId]);
        // fetch(`/api/diary/edit`, {
        //   method: "POST",
        //   body: JSON.stringify({
        //     uid: user.uid,
        //     diaryId: edit.diaryId,
        //     data: diaryEdit,
        //     prevDate: edit.diary.diaryDate,
        //   }),
        // })
        //   .then(() => {
        // })
        // .catch(() => {
        //   console.error("[EDIT]: Failed editData");
        // });
      } else {
        console.error("[EDIT] error with diaryEdit");
      }
    } else {
      console.log("user missing");
    }
  }

  function createEdit(): DiaryAdd | false {
    if (typeof edit !== "undefined") {
      const editItem = {
        ...edit.diary,
        diaryDate: state.diaryDate,
        loggedBefore: state.loggedBefore,
        rating: state.rating,
        poster: state.poster,
      };
      if (typeof state.episodes !== "undefined") {
        Object.assign(editItem, { episodes: state.episodes });
      }
      if (typeof state.season !== "undefined") {
        Object.assign(editItem, { season: state.season });
      }
      if (typeof state.seenEpisodes !== "undefined") {
        Object.assign(editItem, { seenEpisodes: state.seenEpisodes });
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
      await fuegoDelete(user.uid, edit.diaryId, edit.diary);
      mdDispatch({ type: "view", payload: "md" });
      mdDispatch({ type: "saved" });
      mutate(["/api/diary/", user.uid]);
    } else {
      console.error("[EDIT]: Missing delete params");
    }
  }
}

export default Edit;
