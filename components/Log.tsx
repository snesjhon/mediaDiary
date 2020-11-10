import { Button, Center, DrawerFooter, Spinner } from "@chakra-ui/core";
import { set } from "@nandorojo/swr-firestore";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useReducer } from "react";
import useSWR from "swr";
import { LogProps, LogReducer, LogState } from "../config/logStore";
import { DiaryAdd } from "../config/mediaTypes";
import { ContextState } from "../config/store";
import { useAuth } from "../utils/auth";
import { fetcher } from "../utils/helpers";
import Info from "./Info";
import LogFields from "./LogFields";

function Log(): JSX.Element {
  const { selected } = useContext(ContextState);
  const { user } = useAuth();
  const router = useRouter();

  let dataUrl = null;
  if (typeof selected !== "undefined") {
    if (selected.type === "tv") {
      dataUrl = `https://api.themoviedb.org/3/tv/${selected.mediaId}?api_key=${process.env.NEXT_PUBLIC_MDBKEY}`;
    } else if (selected.type === "movie") {
      dataUrl = `https://api.themoviedb.org/3/movie/${encodeURIComponent(
        selected.mediaId
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
        mediaId: `${selected.mediaId}_${externalSeason.id}`,
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
    <>
      {isLoading ? (
        <Center minH="40vh">
          <Spinner />
        </Center>
      ) : (
        <>
          {typeof mediaInfo !== "undefined" && <Info item={mediaInfo} />}
          <LogFields
            dispatch={dispatch}
            type={mediaInfo?.type}
            item={logFields}
          />
          <DrawerFooter px={0} pt={2} pb={1} mt={2}>
            <Button
              onClick={addData}
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

  function addData() {
    if (user !== null && user && user.email !== null) {
      const currentDate = new Date();
      const addDiary = createDiary(currentDate);
      if (addDiary) {
        dispatch({
          type: "state",
          payload: {
            key: "isSaving",
            value: true,
          },
        });
        const updatePromise = set(
          `${user.email}/${currentDate.getTime()}`,
          addDiary
        );
        if (updatePromise !== null) {
          updatePromise
            .then(() => {
              dispatch({
                type: "state",
                payload: {
                  key: "isSaving",
                  value: false,
                },
              });
              return router.push("/home");
            })
            .catch(() => {
              return console.log("error");
            });
        }
      } else {
        console.log("diary fails");
      }
    }
  }

  function createDiary(currentDate: Date): DiaryAdd | false {
    if (typeof mediaInfo !== "undefined") {
      const { mediaId, type, releasedDate } = mediaInfo;
      return {
        mediaId,
        diaryDate: (diaryDate as unknown) as firebase.firestore.Timestamp,
        addedDate: (currentDate as unknown) as firebase.firestore.Timestamp,
        loggedBefore,
        rating,
        type,
        releasedDate,
        ...(typeof seenEpisodes !== "undefined" && {
          seenEpisodes: seenEpisodes,
        }),
        artist: mediaInfo.artist,
        title: mediaInfo.title,
        poster: mediaInfo.poster,
        genre: typeof mediaInfo?.genre !== "undefined" ? mediaInfo.genre : "",
        ...(typeof externalSeason !== "undefined" && {
          season: externalSeason.season_number,
          episodes: externalSeason.episode_count,
        }),
      };
    } else {
      return false;
    }
  }

  function parseData(externalData: any, mediaType: any) {
    if (mediaType === "tv") {
      const filteredSeasons = externalData.seasons.sort((_: any, b: any) =>
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
