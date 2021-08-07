import { useMDDispatch, useDataFetch } from "@/config";
import type { DataFetchSpotify } from "@/config";
import { useFuegoUser, fuegoBookmarkAdd } from "@/fuego";
import type { MediaSelected, MDbMovie, MDbTV } from "@/types";
import { createMediaSelected, createSearchTitles } from "@/utils";
import dayjs from "dayjs";
import React from "react";
import { BookmarkIcon, StarEmptyIcon } from "@/icons";
import { MdLoader, MdLogo } from "@/md";
import { MediaSpotify, MediaMovie, MediaTV } from "@/src/components/Media";
import { CalendarIcon } from "@chakra-ui/icons";
import {
  DrawerBody,
  DrawerFooter,
  Button,
  DrawerCloseButton,
  DrawerHeader,
  Flex,
  IconButton,
} from "@chakra-ui/react";

export default function SelectedContent({
  item,
  mutate,
}: {
  item: MediaSelected;
  mutate: () => void;
}): JSX.Element {
  const dispatch = useMDDispatch();
  const { user } = useFuegoUser();
  const { data, error, isLoading } = useDataFetch({
    type: item.type,
    firstId: item.mediaId,
    secondId: item.artistId,
    isSuspense: true,
    season: item.season,
  });

  const mediaSelected = createMediaSelected(item.type, data);

  if (error) {
    return <div>{error}</div>;
  }

  return isLoading || !mediaSelected ? (
    <MdLoader />
  ) : (
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
              onClick={addBookmark}
            />
            <DrawerCloseButton pos="relative" top="0" right="0" />
          </Flex>
        </Flex>
      </DrawerHeader>
      <DrawerBody px={{ base: 6, sm: 8 }}>
        {item.type === "album" && (
          <MediaSpotify
            artistInfo={(data as DataFetchSpotify)[1]}
            albumInfo={(data as DataFetchSpotify)[0]}
          />
        )}
        {item.type === "movie" && <MediaMovie data={data as MDbMovie} />}
        {item.type === "tv" && <MediaTV data={data as MDbTV} />}
      </DrawerBody>
      <DrawerFooter borderTopWidth="1px" justifyContent="space-between">
        <Button
          onClick={() =>
            dispatch({
              type: "logRating",
              payload: {
                selected: mediaSelected,
                selectedMovie:
                  item.type === "movie" ? (data as MDbMovie) : undefined,
                selectedTV: item.type === "tv" ? (data as MDbTV) : undefined,
                selectedSpotify:
                  item.type === "album"
                    ? {
                        artist: (data as DataFetchSpotify)[1],
                        album: (data as DataFetchSpotify)[0],
                      }
                    : undefined,
              },
            })
          }
          colorScheme="purple"
          variant="outline"
          leftIcon={<StarEmptyIcon />}
        >
          Rate
        </Button>
        <Button
          onClick={() =>
            dispatch({
              type: "log",
              payload: {
                selected: mediaSelected,
                selectedMovie:
                  item.type === "movie" ? (data as MDbMovie) : undefined,
                selectedTV: item.type === "tv" ? (data as MDbTV) : undefined,
                selectedSpotify:
                  item.type === "album"
                    ? {
                        artist: (data as DataFetchSpotify)[1],
                        album: (data as DataFetchSpotify)[0],
                      }
                    : undefined,
              },
            })
          }
          colorScheme="blue"
          variant="outline"
          leftIcon={<CalendarIcon />}
        >
          Add Diary
        </Button>
      </DrawerFooter>
    </>
  );

  async function addBookmark() {
    if (user && mediaSelected) {
      const {
        releasedDate,
        genre,
        mediaId,
        poster,
        artist,
        artistId,
        season,
        type,
        title,
      } = mediaSelected;

      const releasedYear = parseInt(dayjs(releasedDate).format("YYYY"));
      const searchTitle = createSearchTitles(title, artist);
      await fuegoBookmarkAdd(user.uid, {
        releasedYear,
        releasedDecade: Math.floor(releasedYear / 10) * 10,
        addedDate: dayjs().toISOString(),
        type,
        genre: genre !== "" ? genre.toLocaleLowerCase() : "",
        mediaId,
        poster,
        artist,
        title,
        releasedDate,
        bookmark: true,
        diary: false,
        memory: false,
        rating: 0,
        diaryDate: false,
        diaryYear: false,
        loggedBefore: false,
        search_title: searchTitle,
        ...(typeof artistId !== "undefined" && { artistId }),
        ...(typeof season !== "undefined" && { season }),
      });
      dispatch({ type: "saving" });
      dispatch({ type: "saved" });
      mutate();
    } else {
      console.error("[SELECTED]: No user");
    }
  }
}
