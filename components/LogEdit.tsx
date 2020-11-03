import { Button, Center, Flex, ModalFooter, Spinner } from "@chakra-ui/core";
import { fuego, useDocument } from "@nandorojo/swr-firestore";
import { firestore } from "firebase/app";
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
  // const { data: mediaData } = useDocument<MediaState>(
  //   user !== null && user ? `${user.email}/media` : null
  // );

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
          {/* {typeof edit?.media !== "undefined" && <Info item={edit.media} />} */}
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
    if (user !== null && user && user.email !== null) {
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
          return router.push("/home");
        });
      } else {
        console.log("error with diaryEdit");
      }
    } else {
      console.log("user missing");
    }
  }

  function createEdit(): { [key: string]: DiaryAdd } | false {
    if (typeof edit !== "undefined") {
      const {
        id,
        type,
        releasedDate,
        addedDate,
        diaryDate: localDiaryDate,
        loggedBefore: localLoggedBefore,
        rating: localRating,
        ...rest
      } = edit.diary;
      return {
        [edit.diaryId]: {
          id,
          diaryDate: (diaryDate as unknown) as firebase.firestore.Timestamp,
          addedDate,
          loggedBefore,
          rating,
          type,
          releasedDate,
          ...(typeof seenEpisodes !== "undefined" && {
            seenEpisodes: seenEpisodes,
          }),
          ...rest,
        },
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

      const batch = fuego.db.batch();

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
        return router.push("/home");
      });
    } else {
      console.log("error with delete");
    }
  }
}

export default Edit;
