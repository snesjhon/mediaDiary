import { Button, Center, ModalFooter, Spinner } from "@chakra-ui/core";
import { deleteDocument, update } from "@nandorojo/swr-firestore";
import firebase from "firebase";
import { useRouter } from "next/router";
import React, { useContext, useReducer } from "react";
import { LogReducer } from "../config/logStore";
import { DiaryAdd } from "../config/mediaTypes";
import { ContextState } from "../config/store";
import useUser from "../utils/useUser";
import Info from "./Info";
import LayoutModal from "./LayoutModal";
import LogFields from "./LogFields";

function Edit() {
  const { edit } = useContext(ContextState);
  const { user } = useUser();
  const router = useRouter();

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
          <ModalFooter
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
          </ModalFooter>
        </>
      )}
    </LayoutModal>
  );
  function editData() {
    if (
      user !== null &&
      user &&
      user.email !== null &&
      typeof edit !== "undefined"
    ) {
      dispatch({
        type: "state",
        payload: {
          key: "isLoading",
          value: true,
        },
      });
      const diaryEdit = createEdit();
      if (diaryEdit) {
        const updatePromise = update(
          `${user.email}/${edit.diaryId}`,
          diaryEdit
        );
        if (updatePromise) {
          updatePromise.then(() => {
            dispatch({
              type: "state",
              payload: {
                key: "isLoading",
                value: false,
              },
            });
            return router.push("/home");
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
      const {
        diaryDate: localDiaryDate,
        loggedBefore: localLoggedBefore,
        rating: localRating,
        hasPendingWrites,
        exists,
        __snapshot,
        ...rest
      } = edit.diary;
      return {
        diaryDate: firebase.firestore.Timestamp.fromDate(diaryDate),
        loggedBefore,
        rating,
        ...(typeof seenEpisodes !== "undefined" && {
          seenEpisodes: seenEpisodes,
        }),
        ...rest,
      };
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
      dispatch({
        type: "state",
        payload: {
          key: "isSaving",
          value: true,
        },
      });
      const deletedPromise = deleteDocument(`${user.email}/${edit.diaryId}`);
      if (deletedPromise) {
        deletedPromise.then(() => {
          dispatch({
            type: "state",
            payload: {
              key: "isSaving",
              value: false,
            },
          });
          return router.push("/home");
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
