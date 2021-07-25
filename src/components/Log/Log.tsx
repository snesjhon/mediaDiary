import { useMDDispatch, useMDState, LogReducer } from "@/config";
import type { LogState } from "@/config";
import { useFuegoUser } from "@/fuego";
import type { MediaDiaryDate } from "@/types";
import { createSearchTitles, parsePosterUrl } from "@/utils";
import dayjs from "dayjs";
import React, { useReducer, useRef, useEffect } from "react";
import { fuegoDiaryAdd } from "./config";
import { MdSpinner } from "@/md";
import { Center, DrawerBody, DrawerFooter, Button } from "@chakra-ui/react";
import { MediaMovie, MediaTV, MediaSpotify } from "../Media";
import { useRouter } from "next/router";

export interface LogTVSeason {
  season?: number;
  episodes?: number;
  poster: string;
}

export default function Log(): JSX.Element {
  const mdDispatch = useMDDispatch();
  const { user } = useFuegoUser();
  const MDState = useMDState();
  const router = useRouter();
  const {
    selected,
    selectedMovie,
    selectedSpotify,
    selectedTV,
    isSaving,
    isLoggedBefore,
  } = MDState;

  const initData: LogState = {
    diaryDate: dayjs().toISOString(),
    loggedBefore: isLoggedBefore ?? false,
    rating: 0,
  };

  const [state, dispatch] = useReducer(LogReducer, initData);
  const initSeason = useRef(true);

  // // This is temporary because I think we should maybe let the user select IF they want to add a season
  // // They could also not want to select a season and just add the show.
  useEffect(() => {
    if (initSeason.current) {
      if (
        selected?.seasons &&
        selected?.seasons[0].poster_path &&
        selected?.seasons[0].poster_path !== null
      ) {
        mdDispatch({
          type: "selectedReplace",
          payload: {
            ...selected,
            season: selected?.seasons[0].season_number,
            episodes: selected?.seasons[0].episode_count,
            poster: parsePosterUrl(selected?.seasons[0].poster_path, "tv"),
          },
        });
        initSeason.current = false;
      }
    }
  }, [selected, mdDispatch]);

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
              <MediaMovie
                data={selectedMovie}
                edit={{
                  fields: state,
                  dispatch,
                }}
              />
            )}
            {selectedTV && (
              <MediaTV
                data={selectedTV}
                poster={selected?.poster ?? selectedTV.poster_path}
                edit={{
                  fields: state,
                  dispatch,
                }}
                seasonInfo={{
                  season: selected?.season,
                  episodes: selected?.episodes,
                }}
                handleSeasonSelected={handleSeasonSelected}
              />
            )}
            {selectedSpotify && (
              <MediaSpotify
                artistInfo={selectedSpotify.artist}
                albumInfo={selectedSpotify.album}
                edit={{
                  fields: state,
                  dispatch,
                }}
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
        mdDispatch({ type: "close" });
        if (router.pathname === "/add") {
          router.push("/home");
        }
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
      const searchTitles = createSearchTitles(title, artist);
      if (diaryDate) {
        return {
          artist,
          title,
          poster,
          mediaId,
          diaryDate,
          // this is because regardless of whether this is true or not, an item is no longer
          // bookmarked whenever we add it as an diaryItem
          bookmark: false,
          diary: true,
          memory: rating > 0 ? true : false,
          diaryYear: parseInt(dayjs(diaryDate).format("YYYY")),
          addedDate: dayjs().toISOString(),
          loggedBefore,
          rating,
          type,
          releasedDate,
          releasedYear,
          releasedDecade: Math.floor(releasedYear / 10) * 10,
          search_title: searchTitles,
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
      }
      return false;
    } else {
      return false;
    }
  }
}
