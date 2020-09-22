import { Button, ModalFooter, Spinner } from "@chakra-ui/core";
import { fuego, useDocument } from "@nandorojo/swr-firestore";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useReducer } from "react";
import useSWR from "swr";
import { LogProps, LogReducer, LogState } from "../config/logStore";
import { DiaryAdd, MediaAdd, MediaState } from "../config/mediaTypes";
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
  const { data: mediaData } = useDocument<MediaState>(
    user !== null ? `${user.email}/media` : null
  );

  let dataUrl = null;
  if (typeof selected !== "undefined") {
    if (selected.type === "tv") {
      dataUrl = `https://api.themoviedb.org/3/tv/${selected.id}?api_key=${process.env.NEXT_PUBLIC_MDBKEY}`;
    } else if (selected.type === "movie") {
      dataUrl = `https://api.themoviedb.org/3/movie/${encodeURIComponent(
        selected.id
      )}?api_key=${process.env.NEXT_PUBLIC_MDBKEY}&append_to_response=credits`;
    } else if (selected.type === "album") {
      dataUrl = `https://ws.audioscrobbler.com/2.0/?method=album.getinfo&artist=${encodeURIComponent(
        selected.artist
      )}&album=${encodeURIComponent(selected.title)}&format=json&api_key=${
        process.env.NEXT_PUBLIC_LASTFMKEY
      }`;
    }
  }

  const { data, error } = useSWR(dataUrl, fetcher, {
    revalidateOnFocus: false,
  });

  let initData: LogState = {
    diaryDate: new Date(),
    loggedBefore: false,
    rating: 0,
    isSaving: false,
    isLoading: typeof selected !== "undefined" ? !data && !error : false,
    artist: "",
    poster: "",
    genre: "",
  };
  if (typeof selected !== "undefined") {
    initData = {
      ...initData,
      artist: selected.artist,
      poster: selected.poster,
      genre: selected.genre,
      overview: selected.overview,
    };
    // Data can be cached by swr, if so, load initData from cache
    if (typeof data !== "undefined") {
      const cachedData = parseData(data, selected.type);
      initData = {
        ...initData,
        ...cachedData,
      };
    }
  }

  const [
    {
      diaryDate,
      loggedBefore,
      rating,
      seenEpisodes,
      artist,
      poster,
      genre,
      overview,
      externalSeason,
      externalSeasons,
      isSaving,
      isLoading,
    },
    dispatch,
  ] = useReducer(LogReducer, initData);

  useEffect(() => {
    if (typeof data !== "undefined" && typeof selected !== "undefined") {
      const apiData = parseData(data, selected.type);
      if (selected.type === "tv") {
        dispatch({
          type: "seasons",
          payload: apiData as any,
        });
      } else if (selected.type === "movie") {
        dispatch({
          type: "credits",
          payload: apiData as any,
        });
      } else if (selected.type === "album") {
        dispatch({
          type: "overview",
          payload: apiData as any,
        });
      }
    }
  }, [data, selected]);

  // When we select from Search, we have our original values, however if we change season
  // then we have potentially different information that we need to load to <Info />
  let mediaInfo = selected;
  if (typeof selected !== "undefined") {
    mediaInfo = {
      ...selected,
      poster,
      artist,
      genre,
      overview,
    };
    if (typeof externalSeasons !== "undefined" && selected.type !== "album") {
      mediaInfo = {
        ...mediaInfo,
        id: `${selected.id}_${externalSeason.id}`,
        releasedDate: externalSeason.air_date,
        overview: externalSeason.overview,
      };
    }
  }

  let logFields: LogProps = {
    diaryDate,
    rating,
    loggedBefore,
    poster,
  };
  if (mediaInfo?.type === "tv" && typeof externalSeason !== "undefined") {
    logFields = {
      ...logFields,
      seenEpisodes,
      externalSeasons,
      season: externalSeason.season_number,
      episodes: externalSeason.episode_count,
    };
  }

  return (
    <LayoutModal>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          {typeof mediaInfo !== "undefined" && <Info item={mediaInfo} />}
          <LogFields
            dispatch={dispatch}
            type={mediaInfo?.type}
            item={logFields}
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
    if (user !== null && user.email !== null) {
      dispatch({
        type: "state",
        payload: {
          key: "isSaving",
          value: true,
        },
      });
      const batch = fuego.db.batch();
      const addDiary = createDiary();
      const addMedia = createMedia();
      if (addDiary) {
        batch.update(fuego.db.collection(user.email).doc("diary"), addDiary);
      }
      if (addMedia) {
        batch.update(fuego.db.collection(user.email).doc("media"), addMedia);
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
    } else {
      console.log("user missing");
    }
  }

  function createDiary(): { [key: string]: DiaryAdd } | false {
    if (typeof mediaInfo !== "undefined") {
      const dateAdded = new Date();
      const { id, type, releasedDate } = mediaInfo;
      return {
        [dateAdded.getTime()]: {
          id: `${type}_${id}`,
          diaryDate: (diaryDate as unknown) as firebase.firestore.Timestamp,
          addedDate: (dateAdded as unknown) as firebase.firestore.Timestamp,
          loggedBefore,
          rating,
          type,
          releasedDate,
          ...(typeof seenEpisodes !== "undefined" && {
            seenEpisodes: seenEpisodes,
          }),
        },
      };
    } else {
      return false;
    }
  }

  function createMedia(): { [key: string]: MediaAdd } | false {
    if (typeof mediaInfo !== "undefined") {
      // This id is what's going to be saved and referenced in firestore
      const itemId = `${mediaInfo.type}_${mediaInfo.id}`;
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
            type: mediaInfo.type,
            artist: mediaInfo.artist,
            title: mediaInfo.title,
            poster: mediaInfo.poster,
            genre:
              typeof mediaInfo?.genre !== "undefined" ? mediaInfo.genre : "",
            releasedDate: mediaInfo.releasedDate,
            count: 1,
            ...(typeof mediaInfo.overview !== "undefined" && {
              overview: mediaInfo.overview,
            }),
            ...(typeof externalSeason !== "undefined" && {
              season: externalSeason.season_number,
              episodes: externalSeason.episode_count,
            }),
          },
        };
      }
    } else {
      return false;
    }
  }

  function parseData(externalData: any, mediaType: any) {
    if (mediaType === "tv") {
      const filteredSeasons = externalData.seasons.sort((a: any, b: any) =>
        b.season_number === 0 ? -1 : 1
      );
      return {
        artist:
          externalData.created_by.length > 0 &&
          externalData.created_by.map((e: any) => e.name).join(", "),
        externalSeason: filteredSeasons[0],
        externalSeasons: filteredSeasons,
        poster:
          filteredSeasons[0].poster_path !== null
            ? `https://image.tmdb.org/t/p/w500${filteredSeasons[0].poster_path}`
            : poster,
        genre: externalData.genres[0].name,
      };
    } else if (mediaType === "movie") {
      return {
        artist: externalData.credits.crew.find((e: any) => e.job === "Director")
          .name,
        genre: externalData.genres[0].name,
      };
    } else if (mediaType === "album") {
      return typeof externalData?.album?.wiki !== "undefined"
        ? externalData.album.wiki.summary.split("<a href")[0]
        : "";
    }
  }
}

export default Log;
