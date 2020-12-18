import { Button, Center, DrawerFooter } from "@chakra-ui/react";
import dayjs from "dayjs";
import React, { useCallback, useEffect, useReducer } from "react";
import useSWR, { mutate } from "swr";
import type { LogProps, LogState } from "../config/logStore";
import { LogReducer } from "../config/logStore";
import type { DiaryAdd, MediaSelected } from "../config/mediaTypes";
import { useMDDispatch, useMDState } from "../config/store";
import useFuegoUser from "../hooks/useFuegoUser";
import { fuegoDiaryAdd } from "../interfaces/fuegoActions";
import { fetcher, spotifyFetch } from "../utils/fetchers";
import Info from "./Info";
import LogFields from "./LogFields";
import MdSpinner from "./md/MdSpinner";

function Log(): JSX.Element {
  const mdDispatch = useMDDispatch();
  const { user } = useFuegoUser();
  const { selected, isSaving, spotifyToken } = useMDState();

  const dataUrl = getDataUrl();

  const { data, error } = useSWR(
    dataUrl,
    selected?.type === "album" && typeof spotifyToken !== "undefined"
      ? (url) => spotifyFetch(url, spotifyToken)
      : fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  let initData: LogState = {
    diaryDate: new Date().toDateString(),
    loggedBefore: false,
    rating: 0,
    isLoading:
      typeof selected !== "undefined" && selected.type !== "album"
        ? !data && !error
        : false,
    artist: "",
    poster: "",
    genre: "",
  };

  if (typeof selected !== "undefined") {
    initData.artist = selected.artist;
    initData.poster = selected.poster;
    initData.genre = selected.genre;

    if (selected.type === "album") {
      initData.artistId = selected.artistId;
    }

    // Data can be cached by swr, if so, load initData from cache
    if (typeof data !== "undefined") {
      const cachedData = parseData(data, selected);
      initData = {
        ...initData,
        ...cachedData,
      };
    }
  }

  const [state, dispatch] = useReducer(LogReducer, initData);

  const {
    diaryDate,
    loggedBefore,
    rating,
    seenEpisodes,
    artist,
    poster,
    genre,
    artistId,
    externalSeason,
    externalSeasons,
    isLoading,
  } = state;
  const parsedCb = useCallback(parseData, []);

  useEffect(() => {
    if (typeof data !== "undefined" && typeof selected !== "undefined") {
      const apiData = parsedCb(data, selected);

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
      } else if (selected.type === "album" && apiData) {
        dispatch({
          type: "genre",
          payload: apiData as any,
        });
      }
    }
  }, [data, selected, parsedCb]);

  // When we select from Search, we have our original values, however if we change season
  // then we have potentially different information that we need to load to <Info />
  let mediaInfo = selected;
  if (typeof selected !== "undefined") {
    mediaInfo = {
      ...selected,
      poster,
      artist,
      genre,
    };
    if (typeof externalSeasons !== "undefined" && selected.type !== "album") {
      mediaInfo = {
        ...mediaInfo,
        mediaId: `${selected.mediaId}_${externalSeason.id}`,
        releasedDate: dayjs(externalSeason.air_date).toISOString(),
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
      {isLoading || isSaving ? (
        <Center minH="40vh">
          <MdSpinner />
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

  async function addData() {
    if (user !== null && user && user.email !== null) {
      const addDiary = createDiary();
      if (addDiary) {
        mdDispatch({ type: "saving" });
        await fuegoDiaryAdd(user.uid, addDiary);
        mdDispatch({ type: "view", payload: "md" });
        mdDispatch({ type: "saved" });
        mutate(["/fuego/diary", user.uid, 1]);
      } else {
        console.log("diary fails");
      }
    }
  }

  function createDiary(): DiaryAdd | false {
    if (typeof mediaInfo !== "undefined") {
      const { mediaId, type, releasedDate } = mediaInfo;
      return {
        mediaId,
        diaryDate,
        addedDate: dayjs().toISOString(),
        loggedBefore,
        rating,
        type,
        releasedDate,
        ...(typeof seenEpisodes !== "undefined" && {
          seenEpisodes: seenEpisodes,
        }),
        ...(typeof artistId !== "undefined" && {
          artistId: artistId,
        }),
        artist: mediaInfo.artist,
        title: mediaInfo.title,
        poster: mediaInfo.poster,
        genre:
          typeof mediaInfo?.genre !== "undefined"
            ? mediaInfo.genre.toLocaleLowerCase()
            : "",
        ...(typeof externalSeason !== "undefined" && {
          season: externalSeason.season_number,
          episodes: externalSeason.episode_count,
        }),
      };
    } else {
      return false;
    }
  }

  function parseData(externalData: any, selected: MediaSelected) {
    const mediaType = selected.type;
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
            : selected.poster,
        genre: externalData.genres[0].name,
      };
    } else if (mediaType === "movie") {
      return {
        artist: externalData.credits.crew.find((e: any) => e.job === "Director")
          .name,
        genre: externalData.genres[0].name,
      };
    } else if (mediaType === "album") {
      if (
        typeof externalData.genres !== "undefined" &&
        externalData.genres.length > 0
      ) {
        return externalData.genres[0];
      }
    }
  }

  function getDataUrl() {
    let returnUrl = null;
    if (typeof selected !== "undefined") {
      if (selected.type === "tv") {
        returnUrl = `https://api.themoviedb.org/3/tv/${selected.mediaId}?api_key=${process.env.NEXT_PUBLIC_MDBKEY}`;
      } else if (selected.type === "movie") {
        returnUrl = `https://api.themoviedb.org/3/movie/${encodeURIComponent(
          selected.mediaId
        )}?api_key=${
          process.env.NEXT_PUBLIC_MDBKEY
        }&append_to_response=credits`;
      } else if (selected.type === "album") {
        returnUrl = `https://api.spotify.com/v1/artists/${selected.artistId}`;
      }
    }
    return returnUrl;
  }
}

export default Log;
