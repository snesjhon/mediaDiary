import { useMDDispatch, useMDState } from "@/config";
import { useFuegoUser } from "@/fuego";
import type { MediaMemory } from "@/types";
import { parsePosterUrl } from "@/utils";
import dayjs from "dayjs";
import React, { useReducer, useRef, useEffect } from "react";
import { LogRatingReducer, fuegoLogRatingAdd } from "./config";
import type { LogRatingState } from "./config";
import { MdSpinner } from "@/md";
import { Center } from "@chakra-ui/layout";
import { DrawerBody, DrawerFooter, Button } from "@chakra-ui/react";
import { MediaMovie, MediaTV, MediaSpotify } from "../Media";

export interface LogTVSeason {
  season?: number;
  episodes?: number;
  poster: string;
}

export default function LogRating(): JSX.Element {
  const mdDispatch = useMDDispatch();
  const { user } = useFuegoUser();
  const MDState = useMDState();
  const { selected, selectedMovie, selectedSpotify, selectedTV, isSaving } =
    MDState;

  const initData: LogRatingState = {
    rating: 0,
  };

  const [state, dispatch] = useReducer(LogRatingReducer, initData);
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
                logRating={{
                  fields: state,
                  dispatch,
                }}
              />
            )}
            {selectedTV && (
              <MediaTV
                data={selectedTV}
                poster={selected?.poster ?? selectedTV.poster_path}
                logRating={{
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
                logRating={{
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
        await fuegoLogRatingAdd(user.uid, addDiary);
        mdDispatch({ type: "view", payload: "md" });
        mdDispatch({ type: "close" });
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

  function createDiary(): MediaMemory | false {
    // We can only have a memory if the rating is higher than 0
    if (selected && state.rating > 0) {
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
      const { rating, seenEpisodes } = state;
      const releasedYear = parseInt(dayjs(releasedDate).format("YYYY"));
      return {
        artist,
        title,
        poster,
        mediaId,
        diaryDate: false,
        // this is because regardless of whether this is true or not, an item is no longer
        // bookmarked whenever we add it as an diaryItem
        bookmark: false,
        memory: true,
        diary: false,
        diaryYear: false,
        addedDate: dayjs().toISOString(),
        // For memories, I'm thinking this is always false because although the person
        // has seen/heard it before. Is that really a "rewatch"
        loggedBefore: false,
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
