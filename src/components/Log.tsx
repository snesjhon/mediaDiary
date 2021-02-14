import { Button, Center, DrawerBody, DrawerFooter } from "@chakra-ui/react";
import dayjs from "dayjs";
import React, { useEffect, useReducer, useRef } from "react";
import type { LogState } from "../config/logStore";
import { LogReducer } from "../config/logStore";
import { useMDDispatch, useMDState } from "../config/store";
import type { DiaryAdd } from "../config/types";
import { fuegoDiaryAdd } from "../interfaces/fuegoMDActions";
import useFuegoUser from "../interfaces/useFuegoUser";
import InfoHeader from "./info/InfoHeader";
import InfoFields from "./info/InfoFields";
import MdSpinner from "./md/MdSpinner";

function Log(): JSX.Element {
  const mdDispatch = useMDDispatch();
  const { user } = useFuegoUser();
  const MDState = useMDState();
  const { selected, isSaving } = MDState;

  const initData: LogState = {
    diaryDate: dayjs().toISOString(),
    loggedBefore: false,
    rating: 0,
  };

  const [state, dispatch] = useReducer(LogReducer, initData);

  const initSeason = useRef(true);

  // This is temporary because I think we should maybe let the user select IF they want to add a season
  // They could also not want to select a season and just add the show.
  useEffect(() => {
    if (initSeason.current) {
      if (
        selected &&
        selected.seasons &&
        selected.seasons[0].poster_path !== null
      ) {
        mdDispatch({
          type: "selected",
          payload: {
            ...selected,
            poster: `https://image.tmdb.org/t/p/w500${selected.seasons[0].poster_path}`,
          },
        });
        initSeason.current = false;
      }
    }
  }, [mdDispatch, initSeason, selected]);

  return (
    <>
      {isSaving ? (
        <Center minH="40vh">
          <MdSpinner />
        </Center>
      ) : (
        <>
          <DrawerBody px={{ base: 6, sm: 8 }}>
            {selected && (
              <>
                <InfoHeader {...selected} />
                <InfoFields
                  dispatch={dispatch}
                  type={selected.type}
                  fields={state}
                  item={selected}
                />
              </>
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

  function createDiary(): DiaryAdd | false {
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

export default Log;
