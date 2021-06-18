import { Button, Center, DrawerBody, DrawerFooter } from "@chakra-ui/react";
import dayjs from "dayjs";
import React, { useReducer } from "react";
import { useMDDispatch, useMDState } from "../../config/store";
import type { LogState } from "../../config/storeLog";
import { LogReducer } from "../../config/storeLog";
import { fuegoDiaryAdd } from "../../fuego/fuegoMDActions";
import useFuegoUser from "../../fuego/useFuegoUser";
import type { MediaDiaryDate } from "../../types/typesMedia";
import MdSpinner from "../md/MdSpinner";
import { LogMovie, LogSpotify, LogTV } from "./components";

export interface LogTVSeason {
  season?: number;
  episodes?: number;
  poster: string;
}

export default function Log(): JSX.Element {
  const mdDispatch = useMDDispatch();
  const { user } = useFuegoUser();
  const MDState = useMDState();
  const { selected, selectedMovie, selectedSpotify, selectedTV, isSaving } =
    MDState;

  const initData: LogState = {
    diaryDate: dayjs().toISOString(),
    loggedBefore: false,
    rating: 0,
  };

  const [state, dispatch] = useReducer(LogReducer, initData);

  return (
    <>
      {isSaving ? (
        <Center minH="40vh">
          <MdSpinner />
        </Center>
      ) : (
        <>
          <DrawerBody px={{ base: 6, sm: 8 }}>
            {selectedMovie && (
              <LogMovie
                data={selectedMovie}
                fields={state}
                dispatch={dispatch}
              />
            )}
            {selectedTV && (
              <LogTV
                data={selectedTV}
                fields={state}
                dispatch={dispatch}
                handleSeasonSelected={handleSeasonSelected}
                season={selected?.season}
                episodes={selected?.episodes}
                poster={selected?.poster ?? selectedTV.poster_path}
              />
            )}
            {selectedSpotify && (
              <LogSpotify
                artist={selectedSpotify.artist}
                album={selectedSpotify.album}
                fields={state}
                dispatch={dispatch}
              />
            )}
          </DrawerBody>
          <DrawerFooter borderTopWidth="1px">
            <Button
              onClick={addData}
              isLoading={isSaving}
              colorScheme="purple"
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
      } else {
        console.error("diary fails");
      }
    }
  }

  function handleSeasonSelected({ episodes, poster, season }: LogTVSeason) {
    if (selected) {
      mdDispatch({
        type: "selectedReplace",
        payload: {
          ...selected,
          season,
          episodes,
          poster,
        },
      });
    }
  }

  function createDiary(): MediaDiaryDate | false {
    if (selected) {
      const {
        mediaId,
        type,
        releasedDate,
        artistId,
        artist,
        title,
        poster,
        season,
        episodes,
      } = selected;
      const { diaryDate, loggedBefore, rating, seenEpisodes } = state;
      const releasedYear = parseInt(dayjs(releasedDate).format("YYYY"));
      return {
        artist,
        title,
        poster,
        mediaId,
        diaryDate,
        // this is because regardless of whether this is true or not, an item is no longer
        // bookmarked whenever we add it as an diaryItem
        bookmark: false,
        diaryYear: parseInt(dayjs(diaryDate).format("YYYY")),
        addedDate: dayjs().toISOString(),
        loggedBefore,
        rating,
        type,
        releasedDate,
        releasedYear,
        releasedDecade: Math.floor(releasedYear / 10) * 10,
        genre:
          typeof selected?.genre !== "undefined"
            ? selected.genre.toLocaleLowerCase()
            : "",
        ...(typeof seenEpisodes !== "undefined" && {
          seenEpisodes: seenEpisodes,
        }),
        ...(typeof artistId !== "undefined" && {
          artistId: artistId,
        }),
        ...(typeof season !== "undefined" && {
          season,
          episodes,
        }),
      };
    } else {
      return false;
    }
  }
}
