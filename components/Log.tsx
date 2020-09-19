import { Button, ModalFooter, Spinner } from "@chakra-ui/core";
import { fuego, useDocument } from "@nandorojo/swr-firestore";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useReducer } from "react";
import useSWR from "swr";
import { LogInit, LogReducer } from "../config/logStore";
import {
  MediaDiaryAdd,
  MediaInfoAdd,
  MediaInfoState,
} from "../config/mediaTypes";
import { ContextState } from "../config/store";
import { fetcher } from "../utils/helpers";
import useUser from "../utils/useUser";
import LogFields from "./LogFields";
import Info from "./Info";
import LayoutModal from "./LayoutModal";

function Log() {
  const { selected } = useContext(ContextState);
  const { user } = useUser();
  const router = useRouter();
  const { data: mediaData } = useDocument<MediaInfoState>(
    `${user.email}/media`
  );

  const { data, error } = useSWR(
    selected?.type === "tv"
      ? `https://api.themoviedb.org/3/tv/${selected.id}?api_key=${process.env.NEXT_PUBLIC_MDBKEY}`
      : selected?.type === "movie"
      ? `https://api.themoviedb.org/3/movie/${encodeURIComponent(
          selected.id
        )}?api_key=${process.env.NEXT_PUBLIC_MDBKEY}&append_to_response=credits`
      : null,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  const [
    {
      diaryDate,
      loggedBefore,
      rating,
      season,
      episodes,
      artist,
      poster,
      genre,
      seasons,
      isSaving,
      isLoading,
    },
    dispatch,
  ] = useReducer(
    LogReducer,
    LogInit(
      selected,
      typeof selected !== "undefined" && selected.type !== "album"
        ? !data && !error
        : false
    )
  );

  useEffect(() => {
    if (typeof data !== "undefined" && typeof selected !== "undefined") {
      if (selected.type === "tv") {
        const filteredSeasons = data.seasons.sort((a: any, b: any) =>
          b.season_number === 0 ? -1 : 1
        );
        dispatch({
          type: "seasons",
          payload: {
            artist:
              data.created_by.length > 0 &&
              data.created_by.map((e: any) => e.name).join(", "),
            season: filteredSeasons[0],
            seasons: filteredSeasons,
            poster:
              filteredSeasons[0].poster_path !== null
                ? `https://image.tmdb.org/t/p/w500${filteredSeasons[0].poster_path}`
                : poster,
            genre: data.genres[0].name,
          },
        });
      } else if (selected.type === "movie") {
        dispatch({
          type: "credits",
          payload: {
            artist: data.credits.crew.find((e: any) => e.job === "Director")
              .name,
            genre: data.genres[0].name,
          },
        });
      }
    }
  }, [data, selected]);

  let itemInfo = selected;
  if (typeof selected !== "undefined" && selected.type !== "album") {
    itemInfo = {
      ...selected,
      poster,
      artist,
      genre,
    };
    if (typeof seasons !== "undefined") {
      itemInfo = {
        ...itemInfo,
        id: `${selected.id}_${season.id}`,
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
              rating,
              loggedBefore,
              seasons,
              poster,
              season,
              episodes,
            }}
          />
          <ModalFooter px={0} pt={2} pb={1} mt={2}>
            <Button
              onClick={addData}
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

  function addData() {
    dispatch({
      type: "state",
      payload: {
        key: "isSaving",
        value: true,
      },
    });
    const batch = fuego.db.batch();
    const addDiary = createDiary();
    const addInfo = createInfo();
    if (addDiary) {
      batch.update(fuego.db.collection(user.email).doc("diary"), addDiary);
    }
    if (addInfo) {
      batch.update(fuego.db.collection(user.email).doc("media"), addInfo);
    }
    batch.commit().then(() => {
      dispatch({
        type: "state",
        payload: {
          key: "isSaving",
          value: false,
        },
      });
      return router.push("/");
    });
  }

  function createDiary(): { [key: string]: MediaDiaryAdd } | false {
    if (typeof itemInfo !== "undefined") {
      const dateAdded = new Date();
      const { id, type, releasedDate } = itemInfo;
      return {
        [dateAdded.getTime()]: {
          id: `${type}_${id}`,
          diaryDate: (diaryDate as unknown) as firebase.firestore.Timestamp,
          addedDate: (dateAdded as unknown) as firebase.firestore.Timestamp,
          loggedBefore,
          rating,
          type,
          releasedDate,
          ...(typeof episodes !== "undefined" && { episodes: episodes }),
        },
      };
    } else {
      return false;
    }
  }

  function createInfo(): { [key: string]: MediaInfoAdd } | false {
    if (typeof itemInfo !== "undefined") {
      // if we have a season, we also want to ad that as an id
      const itemId = `${itemInfo.type}_${itemInfo.id}`;
      if (
        typeof mediaData !== "undefined" &&
        mediaData !== null &&
        typeof mediaData?.[itemId] !== "undefined"
      ) {
        return {
          [itemId]: {
            ...mediaData[itemId],
            count: mediaData[itemId].count + 1,
          },
        };
      } else {
        return {
          [itemId]: {
            type: itemInfo.type,
            artist: itemInfo.artist,
            title: itemInfo.title,
            poster: itemInfo.poster,
            genre: typeof itemInfo?.genre !== "undefined" ? itemInfo.genre : "",
            releasedDate: itemInfo.releasedDate,
            count: 1,
            ...(typeof itemInfo.overview !== "undefined" && {
              overview: itemInfo.overview,
            }),
            ...(typeof season !== "undefined" && { season: season }),
          },
        };
      }
    } else {
      return false;
    }
  }
}

export default Log;
