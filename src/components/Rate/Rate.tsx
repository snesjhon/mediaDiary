import { useDataFetch, useMDDispatch } from "@/config";
import { useFuegoUser } from "@/fuego";
import { BookmarkIcon, StarEmptyIcon } from "@/icons";
import { MdLogo } from "@/md";
import type { MDbMovie, MediaDiaryWithId } from "@/types";
import { createMediaSelected } from "@/utils";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import {
  Button,
  DrawerBody,
  DrawerCloseButton,
  DrawerHeader,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import React, { useReducer, useState } from "react";
import useSWR from "swr";
import { LogRating } from "..";
import type { MoviePopularResult } from "../Add/hooks/useMediaTopFetch/types";
import { ContentFooter } from "../Content";
import { LogRatingReducer, LogRatingState } from "../Log/config";
import { MediaMovie } from "../Media";
import { fuegoDiaryById } from "../Selected/config";

interface Props {
  onNext: () => void;
  movieResult: MoviePopularResult;
}

export default function Rate({ movieResult, onNext }: Props): JSX.Element {
  const mdDispatch = useMDDispatch();
  const { user } = useFuegoUser();

  const initData: LogRatingState = {
    rating: 0,
  };
  const [state, dispatch] = useReducer(LogRatingReducer, initData);

  const [isEditing, setIsEditing] = useState("");
  const { data, isValidating, error, mutate } = useSWR<
    MediaDiaryWithId | false
  >(
    user && movieResult
      ? ["/fuego/rateById", user.uid, "movie", movieResult.id.toString()]
      : null,
    fuegoDiaryById,
    {
      revalidateOnFocus: false,
    }
  );
  const { data: movieData, isLoading } = useDataFetch(
    movieResult
      ? { firstId: movieResult.id.toString(), type: "movie" }
      : { firstId: false, type: "movie" }
  );

  const mediaSelected = createMediaSelected("movie", movieData);

  return (
    <>
      <DrawerHeader>
        <Flex justifyContent="space-between">
          <MdLogo title="mediaDiary" />
          <Flex alignItems="center">
            <IconButton
              id="selectedBookmark"
              aria-label="Search database"
              icon={<BookmarkIcon fill="none" boxSize="5" />}
              variant="ghost"
              colorScheme="orange"
              mr="2"
              size="md"
              onClick={() => {}}
            />
            <DrawerCloseButton pos="relative" top="0" right="0" />
          </Flex>
        </Flex>
      </DrawerHeader>
      <DrawerBody px={{ base: 6, sm: 8 }}>
        {movieData && (
          <MediaMovie
            data={movieData as MDbMovie}
            logRating={isEditing ? { dispatch, fields: state } : undefined}
          />
        )}
      </DrawerBody>
      <ContentFooter>
        <IconButton
          aria-label="next"
          icon={<ChevronLeftIcon />}
          variant="outline"
          onClick={onNext}
        />
        <Button
          // onClick={() => {}}
          onClick={() => {
            if (mediaSelected) {
              setIsEditing("rating");
              mdDispatch({
                type: "addRating",
                payload: {
                  selected: mediaSelected,
                  selectedMovie: movieData as MDbMovie,
                  selectedSpotify: undefined,
                  selectedTV: undefined,
                  // selectedTV: item.type === "tv" ? (data as MDbTV) : undefined,
                  // selectedSpotify:
                  //   item.type === "album"
                  //     ? {
                  //         artist: (data as DataFetchSpotify)[1],
                  //         album: (data as DataFetchSpotify)[0],
                  //       }
                  //     : undefined,
                },
              });
            }
          }}
          colorScheme="purple"
          variant="outline"
          leftIcon={<StarEmptyIcon />}
        >
          Rate
        </Button>
        <Button
          onClick={() => {}}
          // onClick={() =>
          //   dispatch({
          //     type: "log",
          //     payload: {
          //       selected: mediaSelected,
          //       selectedMovie:
          //         item.type === "movie" ? (data as MDbMovie) : undefined,
          //       selectedTV: item.type === "tv" ? (data as MDbTV) : undefined,
          //       selectedSpotify:
          //         item.type === "album"
          //           ? {
          //               artist: (data as DataFetchSpotify)[1],
          //               album: (data as DataFetchSpotify)[0],
          //             }
          //           : undefined,
          //     },
          //   })
          // }
          colorScheme="blue"
          variant="outline"
          leftIcon={<CalendarIcon />}
        >
          Add Diary
        </Button>
        <IconButton
          aria-label="next"
          icon={<ChevronRightIcon />}
          onClick={onNext}
          variant="outline"
        />
      </ContentFooter>
    </>
  );
}
