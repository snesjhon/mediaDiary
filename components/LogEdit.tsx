/**
 * We don't need to save `season` since we have the updated information when provides
 *
 *
 * Do i need to provide an edit to the SEASONS? or just the edit of the CURRENT season?
 */

import { Button, ModalFooter, Spinner } from "@chakra-ui/core";
import { fuego, useDocument } from "@nandorojo/swr-firestore";
import { firestore } from "firebase/app";
import { useRouter } from "next/router";
import React, { useContext, useReducer } from "react";
import { LogReducer } from "../config/logStore";
import { DiaryAdd, MediaState } from "../config/mediaTypes";
import { ContextState } from "../config/store";
import useUser from "../utils/useUser";
import Info from "./Info";
import LayoutModal from "./LayoutModal";
import LogFields from "./LogFields";

function Edit() {
  const { edit } = useContext(ContextState);
  const { user } = useUser();
  const router = useRouter();
  const { data: mediaData } = useDocument<MediaState>(`${user.email}/media`);

  let initData = {
    diaryDate: new Date(),
    loggedBefore: false,
    rating: 0,
    isLoading: false,
    isSaving: false,
    artist: "",
    genre: "",
    poster: "",
  };
  if (typeof edit !== "undefined") {
    initData = {
      ...initData,
      ...edit.diary,
      ...edit.media,
      diaryDate: edit.diary.diaryDate.toDate(),
    };
  }

  const [
    {
      diaryDate,
      loggedBefore,
      isSaving,
      rating,
      episodes,
      poster,
      isLoading,
      seenEpisodes,
      season,
    },
    dispatch,
  ] = useReducer(LogReducer, initData);

  return (
    <LayoutModal>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          {typeof edit?.media !== "undefined" && <Info item={edit.media} />}
          <LogFields
            dispatch={dispatch}
            type={edit?.media.type}
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
          <ModalFooter px={0} pt={2} pb={1} mt={2}>
            <Button
              onClick={deleteData}
              isLoading={isSaving}
              colorScheme="red"
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
          </ModalFooter>
        </>
      )}
    </LayoutModal>
  );
  function editData() {
    dispatch({
      type: "state",
      payload: {
        key: "isLoading",
        value: true,
      },
    });
    const diaryRef = fuego.db.collection(user.email).doc("diary");
    const diaryEdit = createEdit();
    if (diaryEdit) {
      return diaryRef.update(diaryEdit).then(() => {
        dispatch({
          type: "state",
          payload: {
            key: "isLoading",
            value: false,
          },
        });
        return router.push("/");
      });
    } else {
      console.log("error");
    }
  }

  function createEdit(): { [key: string]: DiaryAdd } | false {
    if (typeof edit !== "undefined") {
      const { id, type, releasedDate, addedDate } = edit.diary;
      return {
        [edit.diaryId]: {
          id,
          diaryDate: (diaryDate as unknown) as firebase.firestore.Timestamp,
          addedDate,
          loggedBefore,
          rating,
          type,
          releasedDate,
          seenEpisodes,
        },
      };
    } else {
      return false;
    }
  }

  function deleteData() {
    if (typeof edit !== "undefined") {
      dispatch({
        type: "state",
        payload: {
          key: "isSaving",
          value: true,
        },
      });

      const batch = fuego.db.batch();
      if (
        typeof mediaData !== "undefined" &&
        mediaData !== null &&
        typeof mediaData?.[edit.diary.id] !== "undefined"
      ) {
        if (mediaData?.[edit.diary.id].count === 1) {
          batch.update(fuego.db.collection(user.email).doc("media"), {
            [edit.diary.id]: firestore.FieldValue.delete(),
          });
        } else {
          batch.update(fuego.db.collection(user.email).doc("media"), {
            [`${edit.diary.id}.count`]: mediaData?.[edit.diary.id].count - 1,
          });
        }
      }

      batch.update(fuego.db.collection(user.email).doc("diary"), {
        [edit.diaryId]: firestore.FieldValue.delete(),
      });

      return batch.commit().then(() => {
        dispatch({
          type: "state",
          payload: {
            key: "isSaving",
            value: false,
          },
        });
        return router.push("/");
      });
    } else {
      console.log("error with delete");
    }
  }
}

export default Edit;
