import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  Input,
  ModalFooter,
  Text,
  Select,
  Spinner,
} from "@chakra-ui/core";
import { StarIcon } from "@chakra-ui/icons";
import { fuego, useDocument } from "@nandorojo/swr-firestore";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useReducer } from "react";
import Rating from "react-rating";
import useSWR from "swr";
import {
  MediaDiaryAdd,
  MediaInfoAdd,
  MediaInfoState,
} from "../config/mediaTypes";
import { ContextState } from "../config/store";
import { fetcher } from "../utils/helpers";
import useUser from "../utils/useUser";
import StarEmptyIcon from "./Icons/StartEmptyIcon";
import Info from "./Info";
import LayoutModal from "./LayoutModal";

interface State {
  isSaving: boolean;
  isLoading: boolean;
  diaryDate: Date;
  loggedBefore: boolean;
  rating: number;
  localArtist: string;
  localPoster: string;
  episode?: number;
  season?: any;
  seasons?: any;
}

type Actions =
  | {
      type: "state";
      payload: {
        key: keyof State;
        value: any;
      };
    }
  | {
      type: "seasons";
      payload: {
        localArtist: string;
        localPoster?: string;
        season: any;
        seasons: any;
      };
    }
  | {
      type: "season";
      payload: {
        localPoster: string;
        season: any;
      };
    };

function Reducer(state: State, actions: Actions): State {
  switch (actions.type) {
    case "state":
      return {
        ...state,
        [actions.payload.key]: actions.payload.value,
      };
    case "seasons": {
      return {
        ...state,
        localArtist: actions.payload.localArtist,
        season: actions.payload.season,
        seasons: actions.payload.seasons,
        ...(typeof actions.payload.localPoster !== "undefined" && {
          localPoster: actions.payload.localPoster,
        }),
        isLoading: false,
      };
    }
    case "season": {
      return {
        ...state,
        season: actions.payload.season,
        episode: 1,
        localPoster: actions.payload.localPoster,
      };
    }
    default:
      return state;
  }
}

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
        )}/credits?api_key=${process.env.NEXT_PUBLIC_MDBKEY}`
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
      episode,
      localArtist,
      localPoster,
      seasons,
      isSaving,
      isLoading,
    },
    dispatch,
  ] = useReducer(Reducer, {
    diaryDate: new Date(),
    loggedBefore: false,
    rating: 0,
    isSaving: false,
    isLoading: !data && !error,
    localArtist: typeof selected !== "undefined" ? selected.artist : "",
    localPoster: typeof selected !== "undefined" ? selected.poster : "",
  });

  useEffect(() => {
    if (typeof data !== "undefined") {
      dispatch({
        type: "seasons",
        payload: {
          localArtist:
            data.created_by.length > 0 &&
            data.created_by.map((e: any) => e.name).join(", "),
          season: data.seasons[0],
          seasons: data.seasons,
          localPoster:
            data.seasons[0].poster_path !== null
              ? `https://image.tmdb.org/t/p/w500/${data.seasons[0].poster_path}`
              : localPoster,
        },
      });
    }
  }, [data]);

  console.log(season);

  return (
    <LayoutModal>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          {typeof selected !== "undefined" && (
            <Info
              item={{ ...selected, poster: localPoster, artist: localArtist }}
            />
          )}
          <Divider mt={4} mb={2} />
          <Flex alignItems="center" justifyContent="space-between">
            <Text>Date</Text>
            <Box>
              <Input
                type="date"
                required
                value={dayjs(diaryDate).format("YYYY-MM-DD")}
                max={dayjs().format("YYYY-MM-DD")}
                onChange={(e) =>
                  dispatch({
                    type: "state",
                    payload: {
                      key: "diaryDate",
                      value: dayjs(e.target.value).toDate(),
                    },
                  })
                }
              />
            </Box>
          </Flex>
          <Divider my={2} />
          <Flex alignItems="center" justifyContent="space-between">
            <Text>Rate</Text>
            <Box mt="-4px">
              <Rating
                fractions={2}
                initialRating={rating}
                fullSymbol={<StarIcon h="20px" w="20px" color="purple.500" />}
                emptySymbol={
                  <StarEmptyIcon h="20px" w="20px" stroke="purple.500" />
                }
                onChange={(value) =>
                  dispatch({
                    type: "state",
                    payload: {
                      key: "rating",
                      value,
                    },
                  })
                }
              />
            </Box>
          </Flex>
          {typeof seasons !== "undefined" && seasons.length > 0 && (
            <>
              <Divider my={2} />
              <Flex alignItems="center" justifyContent="space-between">
                <Text>Season</Text>
                <Select
                  placeholder="Select option"
                  value={season.season_number}
                  onChange={(e) =>
                    dispatch({
                      type: "season",
                      payload: {
                        season: seasons[e.target.value],
                        localPoster:
                          seasons[e.target.value].poster_path !== null
                            ? `https://image.tmdb.org/t/p/w500/${
                                seasons[e.target.value].poster_path
                              }`
                            : localPoster,
                      },
                    })
                  }
                >
                  {seasons.map((e: any) => (
                    <option value={e.season_number}>{e.season_number}</option>
                  ))}
                </Select>
              </Flex>
            </>
          )}
          <Divider my={2} />
          <Flex alignItems="center" justifyContent="space-between">
            <Text>Heard Before?</Text>
            <Checkbox
              colorScheme="purple"
              isChecked={loggedBefore}
              onChange={() =>
                dispatch({
                  type: "state",
                  payload: { key: "loggedBefore", value: !loggedBefore },
                })
              }
            />
          </Flex>
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
    if (typeof selected !== "undefined") {
      const dateAdded = new Date();
      const { id, type, releasedDate } = selected;
      return {
        [dateAdded.getTime()]: {
          id: `${type}_${id}`,
          diaryDate: (diaryDate as unknown) as firebase.firestore.Timestamp,
          addedDate: (dateAdded as unknown) as firebase.firestore.Timestamp,
          loggedBefore,
          rating,
          type,
          releasedDate,
        },
      };
    } else {
      return false;
    }
  }

  function createInfo(): { [key: string]: MediaInfoAdd } | false {
    if (typeof selected !== "undefined") {
      const itemId = `${selected.type}_${selected.id}`;
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
            type: selected.type,
            artist: selected.artist,
            title: selected.title,
            poster: selected.poster,
            genre: typeof selected?.genre !== "undefined" ? selected.genre : "",
            releasedDate: selected.releasedDate,
            count: 1,
            ...(selected.overview && { overview: selected.overview }),
          },
        };
      }
    } else {
      return false;
    }
  }
}

export default Log;
