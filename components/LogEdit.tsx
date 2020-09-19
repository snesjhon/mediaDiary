/**
 * We don't need to save `season` since we have the updated information when provides
 */

import { Button, ModalFooter, Spinner } from "@chakra-ui/core";
import { fuego, useDocument } from "@nandorojo/swr-firestore";
import { firestore } from "firebase/app";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useReducer } from "react";
import { LogReducer } from "../config/logStore";
import {
  MediaDiaryAdd,
  MediaInfoAdd,
  MediaInfoState,
} from "../config/mediaTypes";
import { ContextState } from "../config/store";
import useUser from "../utils/useUser";
import LogFields from "./LogFields";
import Info from "./Info";
import LayoutModal from "./LayoutModal";
import useSWR from "swr";
import { fetcher } from "../utils/helpers";

function Edit() {
  const { edit } = useContext(ContextState);
  const { user } = useUser();
  const router = useRouter();
  const { data: mediaData } = useDocument<MediaInfoState>(
    `${user.email}/media`
  );

  const { data, error } = useSWR(
    edit?.item?.type === "tv"
      ? `https://api.themoviedb.org/3/tv/${
          edit?.item?.id.split("_")[1]
        }?api_key=${process.env.NEXT_PUBLIC_MDBKEY}`
      : null,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  let initData = {
    diaryDate: new Date(),
    loggedBefore: false,
    rating: 0,
    isLoading:
      typeof edit !== "undefined" && edit?.item?.type !== "album"
        ? !data && !error
        : false,
    isSaving: false,
    artist: "",
    genre: "",
    poster: "",
    season: {},
    episodes: [] as number[],
    seasons: [],
  };
  if (typeof edit !== "undefined") {
    initData = {
      ...initData,
      ...edit.item,
      diaryDate: edit.item.diaryDate.toDate(),
      artist: edit.info.artist,
      genre: edit.info.genre,
      poster: edit.info.poster,
    };
    if (typeof edit.info.season !== "undefined") {
      initData = {
        ...initData,
        season: edit.info.season,
      };
    }
  }

  const [
    {
      diaryDate,
      loggedBefore,
      rating,
      season,
      episodes,
      seasons,
      poster,
      isLoading,
    },
    dispatch,
  ] = useReducer(LogReducer, initData);

  useEffect(() => {
    if (typeof data !== "undefined" && typeof edit !== "undefined") {
      if (edit.item.type === "tv") {
        const filteredSeasons = data.seasons.sort((a: any, b: any) =>
          b.season_number === 0 ? -1 : 1
        );
        dispatch({
          type: "editSeasons",
          payload: filteredSeasons,
        });
      }
    }
  }, [data, edit]);

  let itemInfo = edit?.info;
  if (typeof edit?.info !== "undefined" && edit.info.type !== "album") {
    itemInfo = {
      ...edit.info,
      poster,
    };
    if (typeof seasons !== "undefined") {
      itemInfo = {
        ...itemInfo,
        id: `${edit.itemId}_${season.id}`,
        releasedDate: season.air_date,
        overview: season.overview,
      };
    }
  }

  return (
    <LayoutModal>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          {typeof itemInfo !== "undefined" && <Info item={itemInfo} />}
          <LogFields
            dispatch={dispatch}
            item={{
              diaryDate,
              loggedBefore,
              poster,
              rating,
              episodes,
              season,
              seasons,
            }}
          />
          <ModalFooter px={0} pt={2} pb={1} mt={2}>
            <Button
              onClick={deleteData}
              isLoading={isLoading}
              colorScheme="red"
              size="sm"
            >
              Delete
            </Button>
            <Button
              onClick={editData}
              isLoading={isLoading}
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

    const diaryEdit = createEdit();
    if (diaryEdit) {
      const [diaryAdd, infoAdd] = diaryEdit;

      const batch = fuego.db.batch();
      batch.update(fuego.db.collection(user.email).doc("diary"), diaryAdd);

      // We only edit media when we change posters for seasons
      if (typeof edit !== "undefined" && edit.info.type === "tv") {
        batch.update(fuego.db.collection(user.email).doc("media"), infoAdd);
      }
      return batch.commit().then(() => {
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

  function createEdit():
    | [{ [key: string]: MediaDiaryAdd }, { [key: string]: MediaInfoAdd }]
    | false {
    if (typeof edit !== "undefined") {
      const { id, type, releasedDate, addedDate, loggedBefore } = edit.item;
      return [
        {
          [edit.itemId]: {
            id,
            diaryDate: (diaryDate as unknown) as firebase.firestore.Timestamp,
            addedDate,
            loggedBefore,
            rating,
            type,
            releasedDate,
            ...(typeof episodes !== "undefined" && { episodes: episodes }),
            // overview: 'blue',
            // ...(typeof itemInfo?.overview !== "undefined" && {
            //   overview: itemInfo.overview,
            // }),
            // ...(typeof season !== "undefined" && { season: season }),
          },
        },
        {
          [id]: {
            ...edit.info,
            poster,
            ...(typeof itemInfo?.overview !== "undefined" && {
              overview: itemInfo.overview,
            }),
            ...(typeof season !== "undefined" && { season: season }),
          },
        },
      ];
    } else {
      return false;
    }
  }

  function deleteData() {
    if (typeof edit !== "undefined") {
      dispatch({
        type: "state",
        payload: {
          key: "isLoading",
          value: true,
        },
      });

      const batch = fuego.db.batch();
      if (
        typeof mediaData !== "undefined" &&
        mediaData !== null &&
        typeof mediaData?.[edit.item.id] !== "undefined"
      ) {
        if (mediaData?.[edit.item.id].count === 1) {
          batch.update(fuego.db.collection(user.email).doc("media"), {
            [edit.item.id]: firestore.FieldValue.delete(),
          });
        } else {
          batch.update(fuego.db.collection(user.email).doc("media"), {
            [`${edit.item.id}.count`]: mediaData?.[edit.item.id].count - 1,
          });
        }
      }

      batch.update(fuego.db.collection(user.email).doc("diary"), {
        [edit.itemId]: firestore.FieldValue.delete(),
      });

      return batch.commit().then(() => {
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
      console.log("error with delete");
    }
  }
}

export default Edit;
