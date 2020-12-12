import { Button, Center, DrawerFooter, Spinner } from "@chakra-ui/react";
import { deleteDocument, update } from "@nandorojo/swr-firestore";
import firebase from "firebase/app";
import React, { useReducer } from "react";
import { LogReducer } from "../config/logStore";
import { DiaryAdd } from "../config/mediaTypes";
import { useMDDispatch, useMDState } from "../config/store";
import { useAuth } from "../config/auth";
import Info from "./Info";
import LogFields from "./LogFields";

function Edit(): JSX.Element {
  const { edit, isSaving } = useMDState();
  const mdDispatch = useMDDispatch();
  const { user } = useAuth();

  let initData = {
    diaryDate: new Date(),
    loggedBefore: false,
    rating: 0,
    artist: "",
    genre: "",
    poster: "",
  };
  if (typeof edit !== "undefined") {
    const item = edit.diary;
    initData = {
      diaryDate: item.diaryDate.toDate(),
      loggedBefore: item.loggedBefore,
      rating: item.rating,
      artist: item.artist,
      genre: item.genre,
      poster: item.poster,
    };
  }

  const [
    { diaryDate, loggedBefore, rating, episodes, poster, seenEpisodes, season },
    dispatch,
  ] = useReducer(LogReducer, initData);

  return (
    <>
      {isSaving ? (
        <Center minH="40vh">
          <Spinner />
        </Center>
      ) : (
        <>
          {typeof edit?.diary !== "undefined" && <Info item={edit.diary} />}
          <LogFields
            dispatch={dispatch}
            type={edit?.diary.type}
            item={{
              diaryDate,
              loggedBefore,
              poster,
              rating,
              episodes,
              season,
              seenEpisodes,
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
  function editData() {
    if (
      user !== null &&
      user &&
      user.email !== null &&
      typeof edit !== "undefined"
    ) {
      mdDispatch({ type: "saving" });
      const diaryEdit = createEdit();
      if (diaryEdit) {
        const updatePromise = update(
          `${user.email}/${edit.diaryId}`,
          diaryEdit
        );
        if (updatePromise) {
          updatePromise.then(() => {
            mdDispatch({ type: "savedEdit" });
          });
        }
      } else {
        console.log("error with diaryEdit");
      }
    } else {
      console.log("user missing");
    }
  }

  function createEdit(): DiaryAdd | false {
    if (typeof edit !== "undefined") {
      const item = edit.diary;
      const editItem = {
        addedDate: item.addedDate,
        artist: item.artist,
        genre: item.genre,
        mediaId: item.mediaId,
        releasedDate: item.releasedDate,
        title: item.title,
        type: item.type,
        diaryDate: firebase.firestore.Timestamp.fromDate(diaryDate),
        loggedBefore,
        rating,
        poster,
      };
      if (typeof episodes !== "undefined") {
        Object.assign(editItem, { episodes });
      }
      if (typeof season !== "undefined") {
        Object.assign(editItem, { season });
      }
      if (typeof seenEpisodes !== "undefined") {
        Object.assign(editItem, { seenEpisodes });
      }
      return editItem;
    } else {
      return false;
    }
  }

  function deleteData() {
    if (
      typeof edit !== "undefined" &&
      user !== null &&
      user &&
      user.email !== null
    ) {
      mdDispatch({ type: "saving" });
      const deletedPromise = deleteDocument(`${user.email}/${edit.diaryId}`);
      if (deletedPromise) {
        mdDispatch({ type: "view", payload: "md" });
        deletedPromise.then(() => {
          mdDispatch({ type: "saved" });
        });
      } else {
        console.error("delete promise failed");
      }
    } else {
      console.log("error with delete");
    }
  }
}

export default Edit;
